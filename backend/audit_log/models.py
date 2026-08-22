import uuid
from django.db import models
from core.models import TenantScopedModel

class AuditLog(TenantScopedModel):
    user_email = models.EmailField()
    action = models.CharField(max_length=100) # CREATE, UPDATE, DELETE, LOGIN
    resource_type = models.CharField(max_length=100) # JobCard, Customer, Invoice
    resource_id = models.CharField(max_length=100, blank=True)
    details = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    def __str__(self):
        return f"[{self.action}] {self.user_email} on {self.resource_type} ({self.created_at})"
