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
