import uuid
from decimal import Decimal
from django.db import models
from core.models import TenantScopedModel
from customers.models import Customer
from vehicles.models import Vehicle, VehicleStock


class Lead(TenantScopedModel):
    STATUS_CHOICES = [
        ('NEW', 'New'),
        ('CONTACTED', 'Contacted'),
        ('QUALIFIED', 'Qualified'),
        ('TEST_DRIVE', 'Test Drive Scheduled'),
        ('QUOTATION', 'Quotation Issued'),
        ('NEGOTIATION', 'Negotiation'),
        ('BOOKED', 'Vehicle Booked'),
        ('CLOSED_WON', 'Closed Won'),
        ('CLOSED_LOST', 'Closed Lost'),
    ]

    SOURCE_CHOICES = [
        ('WEBSITE', 'Website'),
        ('WALK_IN', 'Walk In'),
        ('REFERRAL', 'Referral'),
        ('PHONE', 'Phone Inquiry'),
        ('CAMPAIGN', 'Marketing Campaign'),
        ('DIGITAL_AD', 'Digital Ad'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='leads')
    interested_vehicle_model = models.CharField(max_length=150, default='SUV')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='NEW')
    source = models.CharField(max_length=50, choices=SOURCE_CHOICES, default='WEBSITE')
    ai_score = models.IntegerField(default=50) # 0 to 100 AI Lead Quality Score
    notes = models.TextField(blank=True)
    assigned_sales_rep = models.CharField(max_length=150, blank=True)
    lost_reason = models.CharField(max_length=255, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['organization_id', 'status']),
            models.Index(fields=['organization_id', 'ai_score']),
        ]

    def __str__(self):
        return f"Lead: {self.customer.first_name} {self.customer.last_name} - {self.interested_vehicle_model}"


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
    status = models.CharField(max_length=50, choices=[('DRAFT', 'Draft'), ('SENT', 'Sent to Customer'), ('ACCEPTED', 'Accepted'), ('EXPIRED', 'Expired'), ('REJECTED', 'Rejected')], default='DRAFT')

    def save(self, *args, **kwargs):
        base = Decimal(str(self.base_ex_showroom_price or 0))
        acc = Decimal(str(self.accessories_amount or 0))
        ins = Decimal(str(self.insurance_amount or 0))
        reg = Decimal(str(self.registration_charges or 0))
        warr = Decimal(str(self.extended_warranty_amount or 0))
        disc = Decimal(str(self.discount_amount or 0))
        self.total_on_road_price = base + acc + ins + reg + warr - disc
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Quotation #{self.quotation_number} - {self.vehicle_model} (₹{self.total_on_road_price})"


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
