import uuid
from django.db import models
from core.models import TenantScopedModel
from customers.models import Customer
from vehicles.models import Vehicle


class JobCard(TenantScopedModel):
    STATUS_CHOICES = [
        ('SCHEDULED', 'Scheduled'),
        ('RECEIVED', 'Vehicle Received'),
        ('CHECKED_IN', 'Checked In'),
        ('INSPECTION', 'Inspection In Progress'),
        ('ESTIMATE_PENDING', 'Estimate Pending Approval'),
        ('APPROVED', 'Customer Approved'),
        ('WORK_STARTED', 'Work Started'),
        ('IN_PROGRESS', 'Work In Progress'),
        ('WAITING_PARTS', 'Waiting for Spare Parts'),
        ('QC', 'Quality Control'),
        ('QUALITY_CHECK', 'Quality Check'),
        ('READY', 'Ready for Delivery'),
        ('READY_FOR_DELIVERY', 'Ready for Delivery'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
    ]

    VALID_TRANSITIONS = {
        'SCHEDULED': {'CHECKED_IN', 'RECEIVED', 'CANCELLED'},
        'RECEIVED': {'WORK_STARTED', 'INSPECTION', 'IN_PROGRESS', 'CANCELLED'},
        'CHECKED_IN': {'INSPECTION', 'ESTIMATE_PENDING', 'WORK_STARTED', 'IN_PROGRESS', 'CANCELLED'},
        'INSPECTION': {'ESTIMATE_PENDING', 'WORK_STARTED', 'IN_PROGRESS', 'CANCELLED'},
        'ESTIMATE_PENDING': {'APPROVED', 'CANCELLED'},
        'APPROVED': {'WORK_STARTED', 'IN_PROGRESS', 'CANCELLED'},
        'WORK_STARTED': {'IN_PROGRESS', 'WAITING_PARTS', 'QC', 'QUALITY_CHECK', 'CANCELLED'},
        'IN_PROGRESS': {'WAITING_PARTS', 'QC', 'QUALITY_CHECK', 'CANCELLED'},
        'WAITING_PARTS': {'WORK_STARTED', 'IN_PROGRESS', 'CANCELLED'},
        'QC': {'READY', 'READY_FOR_DELIVERY', 'IN_PROGRESS', 'WORK_STARTED'},
        'QUALITY_CHECK': {'READY', 'READY_FOR_DELIVERY', 'IN_PROGRESS', 'WORK_STARTED'},
        'READY': {'DELIVERED'},
        'READY_FOR_DELIVERY': {'DELIVERED'},
        'DELIVERED': set(),
        'CANCELLED': set(),
    }

    job_card_number = models.CharField(max_length=50, default='', blank=True, db_index=True)
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, related_name='job_cards')
    vehicle = models.ForeignKey(Vehicle, on_delete=models.PROTECT, related_name='job_cards')
    service_advisor = models.ForeignKey('identity.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='advisor_job_cards')
    allocated_bay = models.ForeignKey('workshop.WorkshopBay', on_delete=models.SET_NULL, null=True, blank=True, related_name='job_cards')
    assigned_technician = models.ForeignKey('workshop.Technician', on_delete=models.SET_NULL, null=True, blank=True, related_name='job_cards')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='RECEIVED')
    promised_delivery = models.DateTimeField(null=True, blank=True)
    actual_delivery = models.DateTimeField(null=True, blank=True)
    customer_complaints = models.TextField(blank=True)
    complaint_text = models.TextField(blank=True, help_text="Direct customer/voice complaint text")
    complaint_voice_url = models.CharField(max_length=500, blank=True, null=True, help_text="S3 path to voice complaint recording")
    diagnosis_notes = models.TextField(blank=True)
    estimated_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    actual_parts_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    actual_labour_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    final_total_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    labour_hours = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    invoice_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    stage_timestamps = models.JSONField(default=dict, blank=True, help_text="{received_at, started_at, qc_at, ready_at, delivered_at}")
    parts_used = models.JSONField(default=list, blank=True, help_text="[{part_id, name, qty, unit_price, total}]")
    insurance_claim_id = models.UUIDField(null=True, blank=True)
    warranty_claim_id = models.UUIDField(null=True, blank=True)

    # Section 06: AI Diagnosis, Skill Matrix Dispatch & Milestone Notifications
    ai_diagnosis = models.JSONField(default=dict, blank=True, help_text="AI diagnosis payload {primary_fault, confidence, parts[], labour_hrs, root_cause}")
    required_skill_tier = models.CharField(max_length=10, choices=[('L1', 'Level 1'), ('L2', 'Level 2'), ('L3', 'Level 3')], default='L1')
    whatsapp_stage_notified = models.IntegerField(default=0, help_text="Last milestone stage 1 to 6 sent to customer WhatsApp")
    digital_gate_pass_code = models.CharField(max_length=50, blank=True, help_text="Secure OTP/QR string for vehicle exit gate")
    nps_score = models.IntegerField(null=True, blank=True, help_text="Net Promoter Score 1 to 10")
    nps_feedback = models.TextField(blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['organization_id', 'status']),
            models.Index(fields=['organization_id', 'job_card_number']),
            models.Index(fields=['organization_id', 'required_skill_tier']),
        ]


    def can_transition_to(self, new_status: str) -> bool:
        if self.status == new_status:
            return True
        allowed = self.VALID_TRANSITIONS.get(self.status, set())
        return new_status in allowed

    def recalculate_totals(self):
        """Recalculates parts, labour, and grand total from line items."""
        parts_sum = sum(item.total_price for item in self.parts_consumed.all())
        labour_sum = sum(item.total_labour_cost for item in self.labour_items.all())
        self.actual_parts_cost = parts_sum
        self.actual_labour_cost = labour_sum
        self.final_total_cost = parts_sum + labour_sum
        self.save(update_fields=['actual_parts_cost', 'actual_labour_cost', 'final_total_cost'])

    def __str__(self):
        return f"{self.job_card_number} - {self.vehicle.registration_number} ({self.get_status_display()})"


class ServiceCheckIn(TenantScopedModel):
    """Customer reception and initial vehicle walkaround check-in."""
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, related_name='service_checkins')
    vehicle = models.ForeignKey(Vehicle, on_delete=models.PROTECT, related_name='service_checkins')
    advisor_name = models.CharField(max_length=150, default='Service Advisor')
    odometer_in = models.IntegerField(default=0)
    fuel_level = models.CharField(max_length=20, default='50%') # 25%, 50%, 75%, 100%
    exterior_damage_notes = models.TextField(blank=True)
    belongings_left_in_vehicle = models.TextField(blank=True)
    customer_complaints = models.TextField(blank=True)
    is_job_card_created = models.BooleanField(default=False)

    def __str__(self):
        return f"Check-In: {self.vehicle.registration_number} by {self.advisor_name}"


class ServiceInspection(TenantScopedModel):
    """Multi-point vehicle technical health inspection."""
    job_card = models.ForeignKey(JobCard, on_delete=models.CASCADE, related_name='inspections')
    inspector_name = models.CharField(max_length=150, default='QC Inspector')
    inspection_date = models.DateField(auto_now_add=True)
    overall_health_score = models.IntegerField(default=100) # 0 to 100 %
    summary_recommendations = models.TextField(blank=True)

    def __str__(self):
        return f"Inspection for JC #{self.job_card.job_card_number}"


class InspectionItem(TenantScopedModel):
    """Specific component check within an inspection."""
    CATEGORY_CHOICES = [
        ('ENGINE', 'Engine & Oil System'),
        ('BRAKES', 'Brake Pads & Discs'),
        ('BATTERY', 'Battery Health & Voltage'),
        ('TYRES', 'Tyre Tread & Alignment'),
        ('ELECTRICAL', 'Lighting & Electronics'),
        ('SUSPENSION', 'Suspension & Steering'),
        ('AC', 'Air Conditioning & Cabin Filter'),
        ('BODY', 'Bodywork & Paint'),
        ('SAFETY', 'Seatbelts & Airbags'),
    ]

    STATUS_CHOICES = [
        ('PASS', 'Pass (Healthy)'),
        ('ATTENTION', 'Needs Attention Soon'),
        ('REPAIR_REQUIRED', 'Immediate Repair Required'),
        ('CRITICAL', 'Critical Safety Hazard'),
    ]

    inspection = models.ForeignKey(ServiceInspection, on_delete=models.CASCADE, related_name='items')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='ENGINE')
    item_name = models.CharField(max_length=150, default='Component Inspection') # e.g. Front Brake Pad Thickness
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='PASS')
    observation = models.CharField(max_length=255, blank=True)
    estimated_repair_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"[{self.category}] {self.item_name}: {self.status}"


class JobCardPart(TenantScopedModel):
    """Line item for spare parts consumed on a Job Card."""
    job_card = models.ForeignKey(JobCard, on_delete=models.CASCADE, related_name='parts_consumed')
    part = models.ForeignKey('inventory.Part', on_delete=models.PROTECT, related_name='job_card_usages')
    quantity_requested = models.IntegerField(default=1)
    quantity_issued = models.IntegerField(default=1)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    total_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    def save(self, *args, **kwargs):
        self.total_price = self.quantity_issued * self.unit_price
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.part.name} x {self.quantity_issued} for JC #{self.job_card.job_card_number}"


class JobCardLabour(TenantScopedModel):
    """Line item for technician labour operations on a Job Card."""
    job_card = models.ForeignKey(JobCard, on_delete=models.CASCADE, related_name='labour_items')
    technician = models.ForeignKey('workshop.Technician', on_delete=models.SET_NULL, null=True, blank=True, related_name='labour_tasks')
    operation_name = models.CharField(max_length=255, default='General Inspection & Repair')
    standard_hours = models.DecimalField(max_digits=5, decimal_places=2, default=1.00)
    actual_hours = models.DecimalField(max_digits=5, decimal_places=2, default=1.00)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, default=850.00)
    total_labour_cost = models.DecimalField(max_digits=12, decimal_places=2, default=850.00)

    def save(self, *args, **kwargs):
        self.total_labour_cost = self.actual_hours * self.hourly_rate
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.operation_name} ({self.actual_hours} hrs) - JC #{self.job_card.job_card_number}"


class ServiceAppointmentSchedule(TenantScopedModel):
    """
    Appointment Scheduler & Load-Balanced Slot Allocation (Section 06).
    Online + WhatsApp booking, bay slot balancing, reminder sequence & no-show prediction.
    """
    CHANNEL_CHOICES = [
        ('ONLINE', 'Online Customer Portal'),
        ('WHATSAPP', 'WhatsApp AI Bot'),
        ('PHONE', 'Phone / Inbound Call'),
        ('WALK_IN', 'Walk In Customer'),
    ]

    STATUS_CHOICES = [
        ('BOOKED', 'Booked'),
        ('CONFIRMED', 'Confirmed via WhatsApp'),
        ('REMINDED_24H', 'Reminded 24h Prior'),
        ('REMINDED_2H', 'Reminded 2h Prior'),
        ('CHECKED_IN', 'Checked In / Job Card Created'),
        ('NO_SHOW', 'No Show'),
        ('RESCHEDULED', 'Rescheduled'),
        ('CANCELLED', 'Cancelled'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, related_name='service_appointments')
    vehicle = models.ForeignKey(Vehicle, on_delete=models.SET_NULL, null=True, blank=True, related_name='service_appointments')
    scheduled_time = models.DateTimeField(db_index=True)
    estimated_duration_minutes = models.IntegerField(default=90)
    service_type = models.CharField(max_length=50, default='PERIODIC_SERVICE')
    customer_notes = models.TextField(blank=True)
    booking_channel = models.CharField(max_length=30, choices=CHANNEL_CHOICES, default='WHATSAPP')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='BOOKED')
    allocated_bay = models.ForeignKey('workshop.WorkshopBay', on_delete=models.SET_NULL, null=True, blank=True, related_name='scheduled_appointments')
    assigned_technician = models.ForeignKey('workshop.Technician', on_delete=models.SET_NULL, null=True, blank=True, related_name='scheduled_appointments')

    # AI No-Show Prediction
    no_show_risk_score = models.FloatField(default=0.12, help_text="AI Predicted probability of no-show 0.0 to 1.0")
    reminder_count = models.IntegerField(default=0)
    last_reminder_sent = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['organization_id', 'scheduled_time']),
            models.Index(fields=['organization_id', 'status']),
        ]

    def __str__(self):
        return f"Appt #{self.id} - {self.customer.first_name} ({self.scheduled_time.strftime('%Y-%m-%d %H:%M')})"


class WarrantyClaim(TenantScopedModel):
    """
    Digital OEM Warranty Submission & Processing Engine (Section 06).
    Maps fault codes, parts, and labour standards for OEM audit and settlement.
    """
    STATUS_CHOICES = [
        ('DRAFT', 'Draft Claim Prepared'),
        ('SUBMITTED', 'Submitted to OEM Portal'),
        ('APPROVED', 'OEM Approved'),
        ('REJECTED', 'OEM Rejected / Query Raised'),
        ('SETTLED', 'Credit Note Issued & Settled'),
    ]

    job_card = models.ForeignKey(JobCard, on_delete=models.CASCADE, related_name='warranty_claims')
    claim_number = models.CharField(max_length=60, unique=True, db_index=True)
    oem_name = models.CharField(max_length=80, default='OEM')
    fault_code = models.CharField(max_length=50, help_text="OBD/DTC Diagnostic Fault Code e.g. P0300")
    causal_part_name = models.CharField(max_length=200)
    causal_part_number = models.CharField(max_length=100)
    parts_claimed = models.JSONField(default=list, blank=True)
    standard_labour_hours = models.DecimalField(max_digits=5, decimal_places=2, default=1.5)
    flat_rate_operation_code = models.CharField(max_length=50, default='FRM-STD-01')
    claimed_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    approved_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='DRAFT')
    oem_rejection_reason = models.TextField(blank=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    settled_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Warranty #{self.claim_number} - JC #{self.job_card.job_card_number} ({self.status})"


class QualityChecklist(TenantScopedModel):
    """
    Digital Quality Control (QC) Checklist & CV Defect Tracking (Section 06).
    Enforces mechanical, electrical, cosmetic, and road-test signoff.
    """
    job_card = models.ForeignKey(JobCard, on_delete=models.CASCADE, related_name='quality_checklists')
    inspector_name = models.CharField(max_length=150, default='Quality Controller')
    checks = models.JSONField(default=list, help_text="List of QC check items with pass/fail and photo proof")
    defects_found = models.JSONField(default=list, blank=True)
    all_checks_passed = models.BooleanField(default=False)
    road_test_completed = models.BooleanField(default=False)
    road_test_km = models.IntegerField(default=5)
    customer_signoff_obtained = models.BooleanField(default=False)
    signoff_timestamp = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"QC for JC #{self.job_card.job_card_number} (Passed: {self.all_checks_passed})"
