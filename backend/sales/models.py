import uuid
from decimal import Decimal
from django.db import models
from core.models import TenantScopedModel
from customers.models import Customer
from vehicles.models import Vehicle, VehicleStock


class Lead(TenantScopedModel):
    STATUS_CHOICES = [
        ('NEW', 'New'),
        ('AI_SCORED', 'AI Scored'),
        ('CONTACTED', 'Contacted'),
        ('QUALIFIED', 'Qualified'),
        ('TEST_DRIVE', 'Test Drive Scheduled'),
        ('TEST_DRIVE_DONE', 'Test Drive Done'),
        ('QUOTATION', 'Quotation Issued'),
        ('NEGOTIATION', 'Negotiation'),
        ('BOOKED', 'Vehicle Booked'),
        ('DELIVERED', 'Delivered'),
        ('CLOSED_WON', 'Closed Won'),
        ('CLOSED_LOST', 'Closed Lost'),
        # Warm Nurture sequence
        ('NURTURE_D3', 'Nurture Day 3'),
        ('NURTURE_D7', 'Nurture Day 7'),
        ('NURTURE_D14', 'Nurture Day 14'),
        ('WARM_ARCHIVE', 'Warm Archive'),
        # Cold Weekly sequence
        ('SEQ_W1', 'Cold Sequence Week 1'),
        ('SEQ_W2', 'Cold Sequence Week 2'),
        ('SEQ_W3', 'Cold Sequence Week 3'),
        ('SEQ_W4', 'Cold Sequence Week 4'),
        ('COLD_ARCHIVE', 'Cold Archive'),
        # Re-engagement
        ('RE_ENGAGEMENT_D30', 'Re-engagement 30-Day'),
        ('RE_ENGAGEMENT_D60', 'Re-engagement 60-Day'),
    ]

    LOST_REASON_CHOICES = [
        ('Price', 'Price / Budget Concern'),
        ('Competitor', 'Lost to Competitor Model'),
        ('Timing', 'Delayed Purchasing Timeline'),
        ('FeatureGap', 'Specific Feature or Spec Missing'),
        ('NoResponse', 'Unresponsive / Drop-off'),
    ]

    PRIORITY_CHOICES = [
        ('HOT', 'Hot (30m SLA)'),
        ('WARM', 'Warm (4h SLA)'),
        ('COLD', 'Cold (24h SLA)'),
    ]

    SOURCE_CHOICES = [
        ('WEBSITE', 'Website'),
        ('WALK_IN', 'Walk In'),
        ('REFERRAL', 'Referral'),
        ('PHONE', 'Phone Inquiry'),
        ('CAMPAIGN', 'Marketing Campaign'),
        ('DIGITAL_AD', 'Digital Ad'),
        ('WHATSAPP_BOT', 'WhatsApp Inbound Bot'),
        ('INSTAGRAM_DM', 'Instagram DM'),
        ('OEM_PORTAL', 'OEM Referral Portal'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='leads')
    interested_vehicle_model = models.CharField(max_length=150, default='SUV')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='NEW')
    source = models.CharField(max_length=50, choices=SOURCE_CHOICES, default='WEBSITE')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='WARM')
    ai_score = models.IntegerField(default=50) # 0 to 100 AI Lead Quality Score
    notes = models.TextField(blank=True)
    assigned_sales_rep = models.CharField(max_length=150, blank=True)
    
    # SLA Enforcement & Auto-Escalation (Section 05 — Master Architecture)
    sla_deadline = models.DateTimeField(null=True, blank=True)
    sla_breached = models.BooleanField(default=False)
    escalation_level = models.IntegerField(default=0, help_text="0=Rep, 1=Team Lead, 2=Sales Mgr, 3=GM/Dealer Principal")
    last_escalated_at = models.DateTimeField(null=True, blank=True)
    first_contact_at = models.DateTimeField(null=True, blank=True)
    lost_reason = models.CharField(max_length=255, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['organization_id', 'status']),
            models.Index(fields=['organization_id', 'ai_score']),
            models.Index(fields=['organization_id', 'priority']),
            models.Index(fields=['organization_id', 'sla_deadline']),
            models.Index(fields=['organization_id', 'sla_breached']),
        ]

    def save(self, *args, **kwargs):
        # Auto-compute SLA deadline on initial lead creation if unset
        from django.utils import timezone
        from datetime import timedelta
        if not self.sla_deadline and self.status == 'NEW':
            now = timezone.now()
            if self.priority == 'HOT':
                self.sla_deadline = now + timedelta(minutes=30)
            elif self.priority == 'WARM':
                self.sla_deadline = now + timedelta(hours=4)
            else:
                self.sla_deadline = now + timedelta(hours=24)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Lead: {self.customer.first_name} {self.customer.last_name} - {self.interested_vehicle_model} [{self.priority}]"



class LeadFollowUp(TenantScopedModel):
    """Salesperson follow-up tasks and interaction schedule."""
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='follow_ups')
    scheduled_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    follow_up_type = models.CharField(max_length=50, choices=[('CALL', 'Phone Call'), ('WHATSAPP', 'WhatsApp Message'), ('MEETING', 'Showroom Visit'), ('EMAIL', 'Email')], default='CALL')
    status = models.CharField(max_length=50, choices=[('PENDING', 'Pending'), ('COMPLETED', 'Completed'), ('MISSED', 'Missed')], default='PENDING')
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Follow-up for {self.lead.customer.first_name} at {self.scheduled_at}"


class TestDrive(TenantScopedModel):
    """Test drive booking and customer feedback tracking."""
    STATUS_CHOICES = [
        ('SCHEDULED', 'Scheduled'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
        ('NO_SHOW', 'No Show'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='test_drives')
    lead = models.ForeignKey(Lead, on_delete=models.SET_NULL, null=True, blank=True, related_name='test_drives')
    vehicle_model = models.CharField(max_length=150, default='SUV')
    vehicle_stock = models.ForeignKey(VehicleStock, on_delete=models.SET_NULL, null=True, blank=True, related_name='test_drives')
    sales_rep = models.CharField(max_length=150, default='Sales Executive')
    scheduled_time = models.DateTimeField(null=True, blank=True)
    duration_minutes = models.IntegerField(default=30)
    license_number = models.CharField(max_length=50, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='SCHEDULED')
    feedback_rating = models.IntegerField(null=True, blank=True) # 1 to 5
    feedback_notes = models.TextField(blank=True)

    def __str__(self):
        return f"Test Drive: {self.vehicle_model} - {self.customer.first_name} ({self.status})"


class Quotation(TenantScopedModel):
    """Vehicle sales quotation with automated pricing calculations."""
    quotation_number = models.CharField(max_length=50, default='', blank=True, db_index=True)
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='quotations')
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, related_name='quotations')
    vehicle_model = models.CharField(max_length=150, default='SUV')
    base_ex_showroom_price = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    accessories_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    insurance_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    registration_charges = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    extended_warranty_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    discount_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    total_on_road_price = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    valid_until = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=50, choices=[('DRAFT', 'Draft'), ('APPROVAL_REQUIRED', 'Approval Required'), ('SENT', 'Sent to Customer'), ('ACCEPTED', 'Accepted'), ('EXPIRED', 'Expired'), ('REJECTED', 'Rejected')], default='DRAFT')

    # Margin Guard — Section 05 Real-time Price Floor Enforcement
    APPROVAL_CHOICES = [
        ('NOT_REQUIRED', 'Within Rep Limits (<= 3%)'),
        ('PENDING_APPROVAL', 'Pending Manager Approval (> 3%)'),
        ('APPROVED', 'Manager / GM Approved'),
        ('REJECTED', 'Discount Overruled'),
    ]
    minimum_floor_price = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'), help_text="Dealer absolute bottom floor on-road price")
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('0.00'))
    approval_status = models.CharField(max_length=30, choices=APPROVAL_CHOICES, default='NOT_REQUIRED')
    approved_by_user = models.CharField(max_length=150, blank=True)
    approval_notes = models.TextField(blank=True)

    def save(self, *args, **kwargs):
        base = Decimal(str(self.base_ex_showroom_price or 0))
        acc = Decimal(str(self.accessories_amount or 0))
        ins = Decimal(str(self.insurance_amount or 0))
        reg = Decimal(str(self.registration_charges or 0))
        warr = Decimal(str(self.extended_warranty_amount or 0))
        disc = Decimal(str(self.discount_amount or 0))
        
        gross_total = base + acc + ins + reg + warr
        self.total_on_road_price = gross_total - disc

        # Margin Guard calculations
        if gross_total > 0:
            self.discount_percentage = round((disc / gross_total) * Decimal('100.00'), 2)

        # Rep authorized limit is 3.0%. Above 3.0% requires manager approval.
        if self.discount_percentage > Decimal('3.00') and self.approval_status == 'NOT_REQUIRED':
            self.approval_status = 'PENDING_APPROVAL'
            if self.status == 'DRAFT':
                self.status = 'APPROVAL_REQUIRED'
        elif self.discount_percentage <= Decimal('3.00') and self.approval_status == 'PENDING_APPROVAL':
            self.approval_status = 'NOT_REQUIRED'
            if self.status == 'APPROVAL_REQUIRED':
                self.status = 'DRAFT'

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Quotation #{self.quotation_number} - {self.vehicle_model} (₹{self.total_on_road_price}) [{self.approval_status}]"



class Booking(TenantScopedModel):
    """Customer vehicle booking / order confirmation."""
    booking_number = models.CharField(max_length=50, default='', blank=True, db_index=True)
    quotation = models.ForeignKey(Quotation, on_delete=models.PROTECT, related_name='bookings')
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, related_name='bookings')
    allocated_stock = models.ForeignKey(VehicleStock, on_delete=models.SET_NULL, null=True, blank=True, related_name='bookings')
    booking_amount_paid = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    payment_method = models.CharField(max_length=50, default='UPI')
    booking_date = models.DateField(auto_now_add=True)
    promised_delivery_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=50, choices=[('CONFIRMED', 'Confirmed'), ('ALLOCATED', 'Stock Allocated'), ('CANCELLED', 'Cancelled'), ('DELIVERED', 'Delivered')], default='CONFIRMED')

    def __str__(self):
        return f"Booking #{self.booking_number} - {self.customer.first_name} ({self.status})"


class Appointment(TenantScopedModel):
    TYPE_CHOICES = [
        ('SALES_TEST_DRIVE', 'Sales Test Drive'),
        ('SERVICE_CHECKUP', 'Service Checkup'),
        ('FINANCE_CONSULT', 'Finance Consultation'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='appointments')
    vehicle = models.ForeignKey(Vehicle, on_delete=models.SET_NULL, null=True, blank=True, related_name='appointments')
    appointment_type = models.CharField(max_length=50, choices=TYPE_CHOICES, default='SERVICE_CHECKUP')
    scheduled_time = models.DateTimeField()
    status = models.CharField(max_length=50, choices=[('CONFIRMED', 'Confirmed'), ('COMPLETED', 'Completed'), ('CANCELLED', 'Cancelled')], default='CONFIRMED')
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.get_appointment_type_display()} - {self.customer.first_name} at {self.scheduled_time}"
