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


class CustomerConsent(TenantScopedModel):
    """
    India DPDP Act 2023 & GDPR Compliance Consent Record (Section 08 / Master Architecture)
    Itemized, purpose-specific verifiable consent trail.
    """
    PURPOSE_CHOICES = [
        ('MARKETING_COMMUNICATION', 'Promotional & Marketing Campaigns'),
        ('SERVICE_REMINDERS', 'Periodic Service & Maintenance Alerts'),
        ('TELEMETRY_TRACKING', 'OBD-II & Connected Vehicle Telemetry'),
        ('WHATSAPP_UPDATES', 'Transactional WhatsApp Notification Flow'),
        ('CREDIT_ASSESSMENT', 'Loan / EMI Credit Score Assessment'),
        ('INSURANCE_RENEWAL', 'Insurance Policy Renewals & Quotations'),
    ]

    CHANNEL_CHOICES = [
        ('WEB_PORTAL', 'Customer Web Portal / OTP'),
        ('WHATSAPP_OPTIN', 'WhatsApp Verified Opt-In'),
        ('IN_PERSON_SIGNATURE', 'Digital Signature at Dealership'),
        ('SMS_OTP', 'SMS OTP Verification'),
        ('MOBILE_APP', 'Customer Mobile App'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='consents')
    purpose = models.CharField(max_length=60, choices=PURPOSE_CHOICES)
    is_consented = models.BooleanField(default=True)
    consent_channel = models.CharField(max_length=50, choices=CHANNEL_CHOICES, default='WHATSAPP_OPTIN')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    consent_version = models.CharField(max_length=20, default='v1.0')
    consented_at = models.DateTimeField(auto_now_add=True)
    withdrawn_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['organization_id', 'customer', 'purpose']),
            models.Index(fields=['organization_id', 'is_consented']),
        ]
        unique_together = ('organization_id', 'customer', 'purpose')

    def __str__(self):
        status = "Active" if self.is_consented else "Withdrawn"
        return f"{self.customer.first_name} - {self.get_purpose_display()} [{status}]"


class CustomerComplaint(TenantScopedModel):
    """
    Area 22 — Customer Complaint & Grievance Escalation Engine.
    Enforces end-to-end dealership dispute resolution lifecycle:
    Received -> Investigation -> Corrective Action -> Manager Review -> Resolution -> Customer Confirmation -> Closed.
    """
    DEPARTMENT_CHOICES = [
        ('SALES', 'Sales & Vehicle Delivery'),
        ('SERVICE', 'Workshop & Repairs'),
        ('PARTS', 'Spare Parts & Accessories'),
        ('FINANCE', 'Finance & Loan Processing'),
        ('INSURANCE', 'Insurance Claim / Renewal'),
        ('MANAGEMENT', 'Dealership Management & Facility'),
    ]

    SEVERITY_CHOICES = [
        ('P1_CRITICAL', 'P1 — Critical (Executive Escalation, 4h SLA)'),
        ('P2_MAJOR', 'P2 — Major (Department Manager, 24h SLA)'),
        ('P3_MINOR', 'P3 — Minor (Team Lead, 48h SLA)'),
    ]

    STATUS_CHOICES = [
        ('RECEIVED', 'Complaint Received'),
        ('UNDER_INVESTIGATION', 'Under Investigation'),
        ('ACTION_REQUIRED', 'Corrective Action Required'),
        ('MANAGER_REVIEW', 'Pending Manager Review'),
        ('RESOLVED', 'Resolution Offered to Customer'),
        ('CLOSED', 'Customer Confirmed & Closed'),
    ]

    complaint_number = models.CharField(max_length=50, unique=True, db_index=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='complaints')
    vehicle_registration = models.CharField(max_length=50, blank=True)
    department = models.CharField(max_length=30, choices=DEPARTMENT_CHOICES, default='SERVICE')
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='P2_MAJOR')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='RECEIVED')
    
    category = models.CharField(max_length=100, default='SERVICE_QUALITY')
    subject = models.CharField(max_length=255)
    description = models.TextField()
    
    assigned_manager = models.CharField(max_length=150, blank=True)
    sla_deadline = models.DateTimeField(null=True, blank=True)
    sla_breached = models.BooleanField(default=False)
    
    root_cause_analysis = models.TextField(blank=True)
    corrective_action = models.TextField(blank=True)
    
    csi_recovery_score = models.IntegerField(null=True, blank=True, help_text="Customer rating 1-5 after resolution")
    customer_feedback = models.TextField(blank=True)
    
    resolved_at = models.DateTimeField(null=True, blank=True)
    closed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['organization_id', 'status']),
            models.Index(fields=['organization_id', 'severity']),
            models.Index(fields=['organization_id', 'department']),
            models.Index(fields=['organization_id', 'sla_breached']),
        ]
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        from django.utils import timezone
        from datetime import timedelta
        if not self.complaint_number:
            import random
            self.complaint_number = f"CMP-{timezone.now().strftime('%Y%m')}-{random.randint(1000, 9999)}"
        if not self.sla_deadline and self.status == 'RECEIVED':
            now = timezone.now()
            if self.severity == 'P1_CRITICAL':
                self.sla_deadline = now + timedelta(hours=4)
            elif self.severity == 'P2_MAJOR':
                self.sla_deadline = now + timedelta(hours=24)
            else:
                self.sla_deadline = now + timedelta(hours=48)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.complaint_number} - {self.customer.first_name} [{self.get_severity_display()}] ({self.status})"


