import uuid
from django.db import models
from core.models import TenantScopedModel

class SaaSPlan(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100) # Starter, Professional, Enterprise
    slug = models.SlugField(unique=True)
    price_monthly = models.DecimalField(max_digits=12, decimal_places=2)
    max_branches = models.IntegerField(default=1)
    max_users = models.IntegerField(default=5)
    max_ai_credits = models.IntegerField(default=1000)

    def __str__(self):
        return f"{self.name} (₹{self.price_monthly}/mo)"

class Subscription(TenantScopedModel):
    plan = models.ForeignKey(SaaSPlan, on_delete=models.PROTECT, related_name='subscriptions')
    status = models.CharField(max_length=50, choices=[('ACTIVE', 'Active'), ('PAST_DUE', 'Past Due'), ('CANCELLED', 'Cancelled')], default='ACTIVE')
    current_period_start = models.DateTimeField()
    current_period_end = models.DateTimeField()
    razorpay_subscription_id = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"Subscription: {self.plan.name} ({self.get_status_display()})"
