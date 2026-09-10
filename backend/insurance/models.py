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
    od_premium = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, help_text="Own Damage premium component")
    tp_premium = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, help_text="Third Party statutory premium component")
    ncb_percentage = models.IntegerField(default=20, help_text="No-Claim Bonus percentage (0 to 50)")
    
    # Dealer Commission Engine (Section 07 Master Architecture)
    dealer_commission_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    dealer_commission_rate = models.DecimalField(max_digits=5, decimal_places=2, default=15.00, help_text="Gross commission % on OD premium")
    
    # 90/60/30-Day Sequence Tracking
    renewal_stage_notified = models.IntegerField(default=0, help_text="Last sequence day notified (90, 60, 30, or 7)")
    last_reminder_sent_at = models.DateTimeField(null=True, blank=True)

    start_date = models.DateField(null=True, blank=True)
    expiry_date = models.DateField(null=True, blank=True, db_index=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='ACTIVE')
    add_on_covers = models.JSONField(default=list, blank=True, help_text="['ZERO_DEP', 'ENGINE_PROTECT', 'RSA', 'KEY_PROTECT', 'TYRE_SECURE']")
    claim_history_count = models.IntegerField(default=0)
    renewal_prediction_score = models.FloatField(default=0.85, help_text="AI Renewal Propensity Score 0.0 to 1.0")
    autoera_platform_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    pdf_policy_url = models.CharField(max_length=500, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['organization_id', 'expiry_date']),
            models.Index(fields=['organization_id', 'status']),
            models.Index(fields=['organization_id', 'renewal_stage_notified']),
        ]

    def calculate_commission(self):
        """Calculates dealer commission: 15% on OD + 2.5% on TP."""
        from decimal import Decimal
        od = Decimal(str(self.od_premium or 0))
        tp = Decimal(str(self.tp_premium or 0))
        rate_od = Decimal(str(self.dealer_commission_rate or 15.00)) / Decimal('100.00')
        rate_tp = Decimal('0.025')
        self.dealer_commission_amount = round((od * rate_od) + (tp * rate_tp), 2)
        return self.dealer_commission_amount

    def save(self, *args, **kwargs):
        if self.od_premium > 0 and self.dealer_commission_amount == 0:
            self.calculate_commission()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.insurer_name} - {self.policy_number} ({self.vehicle.registration_number})"


class InsuranceRenewal(TenantScopedModel):
    """Annual insurance policy renewal workflow and customer reminders."""
    policy = models.ForeignKey(InsurancePolicy, on_delete=models.CASCADE, related_name='renewals')
    renewal_due_date = models.DateField(null=True, blank=True)
    quoted_premium = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    projected_ncb = models.IntegerField(default=25)
    sequence_stage = models.IntegerField(default=90, help_text="90, 60, 30, or 7 days prior")
    payment_link_url = models.URLField(blank=True)
    customer_contacted = models.BooleanField(default=False)
    status = models.CharField(max_length=50, choices=[('PENDING', 'Pending Outreach'), ('QUOTED', 'Quote Sent'), ('RENEWED', 'Renewed Successfully'), ('LOST_TO_COMPETITOR', 'Lost to Competitor')], default='PENDING')
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Renewal for {self.policy.policy_number} due {self.renewal_due_date} [Stage: {self.sequence_stage}d]"



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
    damage_photos_urls = models.JSONField(default=list, blank=True, help_text="6-angle damage inspection photos")
    ai_damage_assessment = models.JSONField(default=dict, blank=True, help_text="{parts_to_replace: [], repair_cost: 0, severity: 'MODERATE'}")
    replaces_surveyor = models.BooleanField(default=True, help_text="Replaces surveyor for 80% of claims")
    ncb_loss_impact = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, help_text="Projected NCB financial loss if claim processed")
    status = models.CharField(max_length=50, choices=CLAIM_STATUSES, default='FILED')

    def __str__(self):
        return f"Claim #{self.claim_number} ({self.policy.vehicle.registration_number})"
