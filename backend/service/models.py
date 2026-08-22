import uuid
from django.db import models
from core.models import TenantScopedModel
from customers.models import Customer
from vehicles.models import Vehicle


class JobCard(TenantScopedModel):
    STATUS_CHOICES = [
        ('SCHEDULED', 'Scheduled'),
        ('CHECKED_IN', 'Checked In'),
        ('INSPECTION', 'Inspection In Progress'),
        ('ESTIMATE_PENDING', 'Estimate Pending Approval'),
        ('APPROVED', 'Customer Approved'),
        ('IN_PROGRESS', 'Work In Progress'),
        ('WAITING_PARTS', 'Waiting for Spare Parts'),
        ('QUALITY_CHECK', 'Quality Check'),
        ('READY_FOR_DELIVERY', 'Ready for Delivery'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
    ]

    VALID_TRANSITIONS = {
        'SCHEDULED': {'CHECKED_IN', 'CANCELLED'},
        'CHECKED_IN': {'INSPECTION', 'ESTIMATE_PENDING', 'CANCELLED'},
        'INSPECTION': {'ESTIMATE_PENDING', 'IN_PROGRESS', 'CANCELLED'},
        'ESTIMATE_PENDING': {'APPROVED', 'CANCELLED'},
        'APPROVED': {'IN_PROGRESS', 'CANCELLED'},
        'IN_PROGRESS': {'WAITING_PARTS', 'QUALITY_CHECK', 'CANCELLED'},
        'WAITING_PARTS': {'IN_PROGRESS', 'CANCELLED'},
        'QUALITY_CHECK': {'READY_FOR_DELIVERY', 'IN_PROGRESS'},
        'READY_FOR_DELIVERY': {'DELIVERED'},
        'DELIVERED': set(),
        'CANCELLED': set(),
    }

    job_card_number = models.CharField(max_length=50, default='', blank=True, db_index=True)
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, related_name='job_cards')
    vehicle = models.ForeignKey(Vehicle, on_delete=models.PROTECT, related_name='job_cards')
    allocated_bay = models.ForeignKey('workshop.WorkshopBay', on_delete=models.SET_NULL, null=True, blank=True, related_name='job_cards')
    assigned_technician = models.ForeignKey('workshop.Technician', on_delete=models.SET_NULL, null=True, blank=True, related_name='job_cards')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='CHECKED_IN')
    promised_delivery = models.DateTimeField(null=True, blank=True)
    actual_delivery = models.DateTimeField(null=True, blank=True)
    customer_complaints = models.TextField(blank=True)
    diagnosis_notes = models.TextField(blank=True)
    estimated_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    actual_parts_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    actual_labour_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    final_total_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    class Meta:
        indexes = [
            models.Index(fields=['organization_id', 'status']),
            models.Index(fields=['organization_id', 'job_card_number']),
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
