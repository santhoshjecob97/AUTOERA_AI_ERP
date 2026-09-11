import uuid
from django.db import models


class DepartmentType:
    SALES = 'SALES'
    SERVICE = 'SERVICE'
    PARTS = 'PARTS'
    FINANCE = 'FINANCE'
    INSURANCE = 'INSURANCE'
    USED_CARS = 'USED_CARS'
    EV = 'EV'
    CRM = 'CRM'
    HR = 'HR'
    HQ = 'HQ'


class TenantScopedModel(models.Model):
    """
    Abstract base model that enforces multi-tenancy across all AutoEra apps.
    Every tenant-scoped entity belongs to an Organization (Tenant) and optionally a Branch.

    Provides standardized multi-tenant accessors:
    - tenant_id (synonymous with organization_id)
    - group_id
    - branch_id
    - department_id
    - user_id
    - created_at / updated_at
    - source_system
    - audit_information
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization_id = models.UUIDField(db_index=True)
    branch_id = models.UUIDField(null=True, blank=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    @property
    def tenant_id(self):
        return self.organization_id

    @tenant_id.setter
    def tenant_id(self, value):
        self.organization_id = value

    @property
    def group_id(self):
        return getattr(self, '_group_id', None)

    @group_id.setter
    def group_id(self, value):
        self._group_id = value

    @property
    def department_id(self):
        return getattr(self, '_department_id', None)

    @department_id.setter
    def department_id(self, value):
        self._department_id = value

    @property
    def user_id(self):
        return getattr(self, '_user_id', None)

    @user_id.setter
    def user_id(self, value):
        self._user_id = value

    @property
    def source_system(self):
        return getattr(self, '_source_system', 'AUTOERA_CLOUD')

    @source_system.setter
    def source_system(self, value):
        self._source_system = value

    @property
    def audit_information(self):
        return getattr(self, '_audit_information', {
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'source_system': self.source_system,
        })

    class Meta:
        abstract = True


