import uuid
from django.db import models
from core.models import TenantScopedModel
from customers.models import Customer
from vehicles.models import Vehicle


class InsurancePolicy(TenantScopedModel):
    POLICY_TYPES = [
        ('COMPREHENSIVE', 'Comprehensive Package'),
        ('THIRD_PARTY', 'Third Party Liability Only'),
        ('ZERO_DEP', 'Bumper-to-Bumper Zero Depreciation'),
    ]

    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('EXPIRING_SOON', 'Expiring in < 30 Days'),
        ('EXPIRED', 'Expired'),
        ('RENEWED', 'Renewed'),
    ]

    policy_number = models.CharField(max_length=100, default='', blank=True, db_index=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='insurance_policies')
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='insurance_policies')
    insurer_name = models.CharField(max_length=100, default='HDFC ERGO')
    policy_type = models.CharField(max_length=50, choices=POLICY_TYPES, default='COMPREHENSIVE')
    insured_declared_value = models.DecimalField(max_digits=12, decimal_places=2, default=0.00) # IDV
    premium_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    start_date = models.DateField(null=True, blank=True)
    expiry_date = models.DateField(null=True, blank=True, db_index=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='ACTIVE')

    class Meta:
        indexes = [
            models.Index(fields=['organization_id', 'expiry_date']),
            models.Index(fields=['organization_id', 'status']),
        ]

    def __str__(self):
        return f"{self.insurer_name} - {self.policy_number} ({self.vehicle.registration_number})"


class InsuranceRenewal(TenantScopedModel):
    """Annual insurance policy renewal workflow and customer reminders."""
    policy = models.ForeignKey(InsurancePolicy, on_delete=models.CASCADE, related_name='renewals')
    renewal_due_date = models.DateField(null=True, blank=True)
    quoted_premium = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    customer_contacted = models.BooleanField(default=False)
    status = models.CharField(max_length=50, choices=[('PENDING', 'Pending Outreach'), ('QUOTED', 'Quote Sent'), ('RENEWED', 'Renewed Successfully'), ('LOST_TO_COMPETITOR', 'Lost to Competitor')], default='PENDING')
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Renewal for {self.policy.policy_number} due {self.renewal_due_date}"


class InsuranceClaim(TenantScopedModel):
    """Accidental insurance claim filing and surveyor assessment."""
    CLAIM_STATUSES = [
        ('FILED', 'Claim Filed / Intimated'),
        ('SURVEY_SCHEDULED', 'Surveyor Inspection Scheduled'),
        ('ESTIMATE_SUBMITTED', 'Repair Estimate Submitted'),
        ('APPROVED', 'Claim Approved by Insurer'),
        ('REJECTED', 'Claim Rejected'),
        ('SETTLED', 'Payment Settled'),
    ]

    policy = models.ForeignKey(InsurancePolicy, on_delete=models.CASCADE, related_name='claims')
    claim_number = models.CharField(max_length=100, default='', blank=True, db_index=True)
    incident_date = models.DateField(null=True, blank=True)
    surveyor_name = models.CharField(max_length=150, blank=True)
    surveyor_phone = models.CharField(max_length=20, blank=True)
    claim_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    approved_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    ai_fraud_risk_score = models.IntegerField(default=10) # 0 to 100 Risk Score
    status = models.CharField(max_length=50, choices=CLAIM_STATUSES, default='FILED')

    def __str__(self):
        return f"Claim #{self.claim_number} ({self.policy.vehicle.registration_number})"
