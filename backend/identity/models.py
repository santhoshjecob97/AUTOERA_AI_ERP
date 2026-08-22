import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from organization.models import Organization, Branch


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.SET_NULL, null=True, blank=True, related_name='users')
    branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True, blank=True, related_name='users')
    phone = models.CharField(max_length=20, blank=True)
    avatar_url = models.URLField(blank=True, null=True)

    ROLE_CHOICES = [
        ('SUPER_ADMIN', 'Super Admin'),
        ('ENTERPRISE_ADMIN', 'Enterprise Admin'),
        ('DEALER_PRINCIPAL', 'Dealer Principal'),
        ('GENERAL_MANAGER', 'General Manager'),
        ('SALES_MANAGER', 'Sales Manager'),
        ('SALES_EXECUTIVE', 'Sales Executive'),
        ('SERVICE_MANAGER', 'Service Manager'),
        ('SERVICE_ADVISOR', 'Service Advisor'),
        ('TECHNICIAN', 'Technician'),
        ('FINANCE_OFFICER', 'Finance Officer'),
        ('INSURANCE_OFFICER', 'Insurance Officer'),
    ]
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='SERVICE_ADVISOR')

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
