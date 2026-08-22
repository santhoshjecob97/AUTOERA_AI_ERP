import uuid
from django.db import models
from core.models import TenantScopedModel


class Customer(TenantScopedModel):
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, db_index=True)
    alternate_phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    pincode = models.CharField(max_length=20, blank=True)
    gstin = models.CharField(max_length=20, blank=True)
    customer_type = models.CharField(max_length=20, choices=[('INDIVIDUAL', 'Individual'), ('CORPORATE', 'Corporate')], default='INDIVIDUAL')
    notes = models.TextField(blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['organization_id', 'phone']),
            models.Index(fields=['organization_id', 'email']),
        ]

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.phone})"


class CustomerTimeline(TenantScopedModel):
    """
    Unified activity timeline for Customer 360.
    Captures all CRM, sales, service, payment, and communication touchpoints.
    """
    EVENT_TYPES = [
        ('LEAD', 'Lead Created / Status Changed'),
        ('CALL', 'Voice / Phone Call'),
        ('MESSAGE', 'SMS / WhatsApp Sent'),
        ('APPOINTMENT', 'Appointment Scheduled'),
        ('TEST_DRIVE', 'Test Drive Completed'),
        ('QUOTATION', 'Quotation Issued'),
        ('BOOKING', 'Vehicle Booked'),
        ('SERVICE_CHECKIN', 'Service Check-In'),
        ('INSPECTION', 'Vehicle Inspection Done'),
        ('ESTIMATE', 'Service Estimate Generated'),
        ('JOB_CARD', 'Job Card Updated'),
        ('INVOICE', 'Invoice Generated'),
        ('PAYMENT', 'Payment Received'),
        ('DELIVERY', 'Vehicle Delivered'),
        ('FEEDBACK', 'Customer Feedback / NPS'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='timeline_events')
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.event_type}] {self.customer.first_name} - {self.title}"
