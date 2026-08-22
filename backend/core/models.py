import uuid
from django.db import models

class TenantScopedModel(models.Model):
    """
    Abstract base model that enforces multi-tenancy.
    Every tenant-scoped entity belongs to an Organization and optionally a Branch.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization_id = models.UUIDField(db_index=True)
    branch_id = models.UUIDField(null=True, blank=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        abstract = True
