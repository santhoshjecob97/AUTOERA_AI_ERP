import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from organization.models import Organization, Branch


class User(AbstractUser):
    """
    AutoEra AI User model — 16 roles per Master Architecture L0–L7 hierarchy.
    Every user belongs to an Organization (tenant) and optionally a Branch.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.SET_NULL, null=True, blank=True, related_name='users')
    branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True, blank=True, related_name='users')
    phone = models.CharField(max_length=20, blank=True)
    avatar_url = models.URLField(blank=True, null=True)

    # ── 16 Roles per Master Architecture (Section 02) ──
    ROLE_CHOICES = [
        # L0 — Platform
        ('SUPER_ADMIN', 'Platform Super Admin'),
        # L1 — Enterprise
        ('ENTERPRISE_ADMIN', 'Enterprise Admin'),
        # L2 — Dealer
        ('DEALER_PRINCIPAL', 'Dealer Principal'),
        # L3 — General / OEM
        ('GENERAL_MANAGER', 'General Manager'),
        ('OEM_USER', 'OEM User'),
        # L4 — Department Managers
        ('SALES_MANAGER', 'Sales Manager'),
        ('SERVICE_MANAGER', 'Service Manager'),
        ('FLEET_MANAGER', 'Fleet Manager'),
        ('PARTS_MANAGER', 'Spare Parts Manager'),
        # L5 — Executives / Advisors
        ('SALES_EXECUTIVE', 'Sales Consultant'),
        ('CRM_EXECUTIVE', 'CRM Executive'),
        ('SERVICE_ADVISOR', 'Service Advisor'),
        ('INSURANCE_EXECUTIVE', 'Insurance Executive'),
        ('FINANCE_OFFICER', 'Finance Executive'),
        # L6 — Specialists
        ('TECHNICIAN', 'Technician'),
        # L7 — External
        ('VEHICLE_OWNER', 'Vehicle Owner'),
    ]
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='SERVICE_ADVISOR')

    # Hierarchy level for permission cascade (L0=highest, L7=lowest)
    LEVEL_MAP = {
        'SUPER_ADMIN': 0, 'ENTERPRISE_ADMIN': 1, 'DEALER_PRINCIPAL': 2,
        'GENERAL_MANAGER': 3, 'OEM_USER': 3,
        'SALES_MANAGER': 4, 'SERVICE_MANAGER': 4, 'FLEET_MANAGER': 4, 'PARTS_MANAGER': 4,
        'SALES_EXECUTIVE': 5, 'CRM_EXECUTIVE': 5, 'SERVICE_ADVISOR': 5,
        'INSURANCE_EXECUTIVE': 5, 'FINANCE_OFFICER': 5,
        'TECHNICIAN': 6, 'VEHICLE_OWNER': 7,
    }

    # Technician skill matrix level (Section 06 — L1/L2/L3 skill matching)
    SKILL_LEVEL_CHOICES = [
        ('L1', 'L1 — Junior / Trainee'),
        ('L2', 'L2 — Experienced / Certified'),
        ('L3', 'L3 — Master / Specialist'),
    ]
    skill_level = models.CharField(max_length=10, choices=SKILL_LEVEL_CHOICES, blank=True,
                                   help_text='Technician skill tier for job assignment matching')

    @property
    def hierarchy_level(self) -> int:
        """Returns the L0–L7 hierarchy level for this user's role."""
        return self.LEVEL_MAP.get(self.role, 7)

    @property
    def is_manager_or_above(self) -> bool:
        return self.hierarchy_level <= 4

    @property
    def is_executive_level(self) -> bool:
        return self.hierarchy_level <= 3

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
