import uuid
from django.db import models
from core.models import TenantScopedModel


class Organization(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    logo_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class DealerGroup(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='dealer_groups')
    name = models.CharField(max_length=255)
    brand = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.organization.name} - {self.name}"


class Branch(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    dealer_group = models.ForeignKey(DealerGroup, on_delete=models.CASCADE, related_name='branches')
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    address = models.TextField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    is_main_branch = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.code})"


class Department(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='departments')
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, null=True, blank=True, related_name='departments')
    name = models.CharField(max_length=100) # Sales, Service, Parts, Finance, Insurance
    code = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.organization.name})"


class BusinessSettings(TenantScopedModel):
    """
    Tenant-specific operational configuration: business hours, tax rules, labour rates.
    """
    dealership_name = models.CharField(max_length=255, blank=True)
    gstin = models.CharField(max_length=30, blank=True)
    pan = models.CharField(max_length=30, blank=True)
    currency = models.CharField(max_length=10, default='INR')
    tax_gst_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=18.00)
    default_labour_rate_per_hour = models.DecimalField(max_digits=10, decimal_places=2, default=850.00)
    business_hours_start = models.TimeField(default='09:00:00')
    business_hours_end = models.TimeField(default='18:30:00')
    low_stock_threshold = models.IntegerField(default=5)
    service_reminder_days = models.IntegerField(default=180) # 6 months
    insurance_renewal_reminder_days = models.IntegerField(default=30)

    def __str__(self):
        return f"Settings for Org {self.organization_id}"


class DailyBranchChecklist(TenantScopedModel):
    """
    Daily opening and closing operational checklists for dealership branches,
    implementing the Capital Honda Dealership SOP (Sales, Service, Parts, F&I, Facility).
    """
    CHECKLIST_TYPE_CHOICES = [
        ('OPENING', 'Morning Opening Huddle (8:30–10:00 AM)'),
        ('CLOSING', 'Evening Closing Reconciliation (6:00–7:30 PM)'),
        ('MIDDAY', 'Midday Operational Audit'),
    ]

    DEPARTMENT_CHOICES = [
        ('SALES', 'New & Used Car Sales'),
        ('SERVICE', 'After-Sales & Workshop'),
        ('PARTS', 'Spare Parts & Warehousing'),
        ('FINANCE_INSURANCE', 'Finance & Insurance'),
        ('FACILITY', 'Facility & Dealership Security'),
    ]

    STATUS_CHOICES = [
        ('PENDING', 'Pending Sign-Off'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Fully Completed'),
        ('FLAGGED', 'Critical Items Flagged'),
    ]

    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='daily_checklists', null=True, blank=True)
    date = models.DateField(db_index=True)
    checklist_type = models.CharField(max_length=20, choices=CHECKLIST_TYPE_CHOICES, default='OPENING')
    department = models.CharField(max_length=30, choices=DEPARTMENT_CHOICES, default='SALES')
    items = models.JSONField(default=list, help_text="List of checklist items with status, notes, verified_by")
    completion_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    signed_off_by = models.CharField(max_length=150, blank=True)
    signed_off_at = models.DateTimeField(null=True, blank=True)
    supervisor_notes = models.TextField(blank=True)
    critical_issues_count = models.IntegerField(default=0)

    class Meta:
        unique_together = ('organization_id', 'branch', 'date', 'checklist_type', 'department')
        indexes = [
            models.Index(fields=['organization_id', 'date']),
            models.Index(fields=['organization_id', 'status']),
            models.Index(fields=['organization_id', 'checklist_type', 'department']),
        ]

    def update_completion(self):
        if not self.items:
            self.completion_percentage = 0.00
            self.critical_issues_count = 0
            self.status = 'PENDING'
            return
        total = len(self.items)
        completed = sum(1 for item in self.items if item.get('completed', False))
        critical = sum(1 for item in self.items if item.get('is_critical', False) and not item.get('completed', False))
        self.completion_percentage = round((completed / total) * 100, 2)
        self.critical_issues_count = critical
        if self.completion_percentage == 100:
            self.status = 'COMPLETED'
        elif critical > 0:
            self.status = 'FLAGGED'
        elif completed > 0:
            self.status = 'IN_PROGRESS'
        else:
            self.status = 'PENDING'

    def save(self, *args, **kwargs):
        if not self.items:
            self.items = self.get_default_items(self.checklist_type, self.department)
        self.update_completion()
        super().save(*args, **kwargs)

    @staticmethod
    def get_default_items(checklist_type, department):
        """Standard Dealership SOP templates based on Capital Honda operating framework."""
        if checklist_type == 'OPENING':
            if department == 'SALES':
                return [
                    {'id': 's_open_1', 'label': 'Showroom floor readiness: Display cars dust-free, fully charged/fueled, tire dressing applied', 'is_critical': True, 'completed': False, 'notes': ''},
                    {'id': 's_open_2', 'label': 'Test drive demo fleet inspected: Fuel > 50%, clean, trade plates & dealer docs in car', 'is_critical': True, 'completed': False, 'notes': ''},
                    {'id': 's_open_3', 'label': 'Target vs Actual whiteboard/digital MIS updated for yesterday enquiries, bookings, retail', 'is_critical': False, 'completed': False, 'notes': ''},
                    {'id': 's_open_4', 'label': 'Morning sales huddle conducted (8:30 AM): Review walk-ins, assign today follow-ups', 'is_critical': True, 'completed': False, 'notes': ''},
                    {'id': 's_open_5', 'label': "Inspect today's planned deliveries: 10-point check (Car allocation, Reg, Insurance, Finance, Accessories, PDI, Plates, Invoice, Docs, Delivery time)", 'is_critical': True, 'completed': False, 'notes': ''},
                    {'id': 's_open_6', 'label': 'Fresh inbound leads (< 24h) from OEM portal & digital campaigns distributed to sales reps', 'is_critical': False, 'completed': False, 'notes': ''},
                ]
            elif department == 'SERVICE':
                return [
                    {'id': 'srv_open_1', 'label': "Today's appointment schedule reviewed (scheduled vs walk-ins vs high-value jobs)", 'is_critical': True, 'completed': False, 'notes': ''},
                    {'id': 'srv_open_2', 'label': 'Workshop bays inspection: Bays 1-N clean, hydraulic lifts operational, air compressors at pressure', 'is_critical': True, 'completed': False, 'notes': ''},
                    {'id': 'srv_open_3', 'label': 'Technician morning roll-call: Attendance recorded, bay & job allocations assigned', 'is_critical': True, 'completed': False, 'notes': ''},
                    {'id': 'srv_open_4', 'label': 'Diagnostic scanners, OEM special tools & EV high-voltage safety kits tested and online', 'is_critical': True, 'completed': False, 'notes': ''},
                    {'id': 'srv_open_5', 'label': 'Customer service reception area, tablet check-in devices & lounge amenities ready', 'is_critical': False, 'completed': False, 'notes': ''},
                ]
            elif department == 'PARTS':
                return [
                    {'id': 'prt_open_1', 'label': "OEM backorder & transit shipments checked for parts required for today's ROs", 'is_critical': True, 'completed': False, 'notes': ''},
                    {'id': 'prt_open_2', 'label': 'Retail and workshop parts issue counter open and staffed', 'is_critical': False, 'completed': False, 'notes': ''},
                    {'id': 'prt_open_3', 'label': 'Fast-moving maintenance parts (filters, brake pads, fluids) verified against safety stock', 'is_critical': True, 'completed': False, 'notes': ''},
                ]
            elif department == 'FINANCE_INSURANCE':
                return [
                    {'id': 'fi_open_1', 'label': 'Pending loan disbursements followed up with banks & Honda Finance India', 'is_critical': True, 'completed': False, 'notes': ''},
                    {'id': 'fi_open_2', 'label': 'Daily list of expiring vehicle insurance policies retrieved for renewal outreach', 'is_critical': False, 'completed': False, 'notes': ''},
                    {'id': 'fi_open_3', 'label': 'Pending trade-in and exchange vehicle settlement clearances reviewed', 'is_critical': False, 'completed': False, 'notes': ''},
                ]
            elif department == 'FACILITY':
                return [
                    {'id': 'fac_open_1', 'label': 'Dealership main perimeter unlocked, biometric gates active, security guard briefed', 'is_critical': True, 'completed': False, 'notes': ''},
                    {'id': 'fac_open_2', 'label': 'Customer parking clear, signages illuminated, backup DG set fuel checked', 'is_critical': False, 'completed': False, 'notes': ''},
                ]
        elif checklist_type == 'CLOSING':
            if department == 'SALES':
                return [
                    {'id': 's_close_1', 'label': "Today's retail bookings & advance token payments reconciled and entered into system", 'is_critical': True, 'completed': False, 'notes': ''},
                    {'id': 's_close_2', 'label': 'Test drive vehicle keys returned and logged in master key vault', 'is_critical': True, 'completed': False, 'notes': ''},
                    {'id': 's_close_3', 'label': 'Lost cases / customer drop-offs audited with reasons recorded in CRM', 'is_critical': False, 'completed': False, 'notes': ''},
                    {'id': 's_close_4', 'label': "Tomorrow's scheduled deliveries confirmed with customers and PDI team", 'is_critical': True, 'completed': False, 'notes': ''},
                    {'id': 's_close_5', 'label': 'EOD Sales MIS submitted to Branch Manager / General Manager', 'is_critical': True, 'completed': False, 'notes': ''},
                ]
            elif department == 'SERVICE':
                return [
                    {'id': 'srv_close_1', 'label': 'Active job cards status audit: All vehicles delivered or customers updated on next-day promise', 'is_critical': True, 'completed': False, 'notes': ''},
                    {'id': 'srv_close_2', 'label': 'Washing & detailing bays cleaned and effluent disposal verified', 'is_critical': False, 'completed': False, 'notes': ''},
                    {'id': 'srv_close_3', 'label': 'Completed repair orders invoiced, labor & parts revenue tallied with cashier', 'is_critical': True, 'completed': False, 'notes': ''},
                    {'id': 'srv_close_4', 'label': 'CSI follow-up calls completed and logged for customers delivered 24h-48h ago', 'is_critical': False, 'completed': False, 'notes': ''},
                    {'id': 'srv_close_5', 'label': 'Workshop bays locked, air compressor powered off, customer cars in secure holding yard', 'is_critical': True, 'completed': False, 'notes': ''},
                ]
            elif department == 'PARTS':
                return [
                    {'id': 'prt_close_1', 'label': 'Daily parts issue slips reconciled against open & closed job cards', 'is_critical': True, 'completed': False, 'notes': ''},
                    {'id': 'prt_close_2', 'label': 'Warranty replaced parts tagged and stored in quarantine vault for OEM inspection', 'is_critical': True, 'completed': False, 'notes': ''},
                    {'id': 'prt_close_3', 'label': 'Urgent replenishment purchase orders generated for critical items', 'is_critical': False, 'completed': False, 'notes': ''},
                ]
            elif department == 'FINANCE_INSURANCE':
                return [
                    {'id': 'fi_close_1', 'label': 'Showroom cash and POS/UPI collections reconciled against bank deposit slips', 'is_critical': True, 'completed': False, 'notes': ''},
                    {'id': 'fi_close_2', 'label': "All insurance cover notes/policies for today's deliveries issued and filed", 'is_critical': True, 'completed': False, 'notes': ''},
                    {'id': 'fi_close_3', 'label': "Finance penetration rate for today's retail calculated and logged", 'is_critical': False, 'completed': False, 'notes': ''},
                ]
            elif department == 'FACILITY':
                return [
                    {'id': 'fac_close_1', 'label': 'All showroom display and customer vehicle keys secured in lockbox', 'is_critical': True, 'completed': False, 'notes': ''},
                    {'id': 'fac_close_2', 'label': 'Perimeter CCTV operational, gates padlocked and night security guard on duty', 'is_critical': True, 'completed': False, 'notes': ''},
                    {'id': 'fac_close_3', 'label': 'High-power lighting and air conditioning turned off for energy conservation', 'is_critical': False, 'completed': False, 'notes': ''},
                ]
        return [
            {'id': 'gen_1', 'label': 'Operational tasks completed and verified', 'is_critical': False, 'completed': False, 'notes': ''}
        ]

    def __str__(self):
        return f"{self.get_checklist_type_display()} - {self.get_department_display()} ({self.date}) [{self.status}]"

