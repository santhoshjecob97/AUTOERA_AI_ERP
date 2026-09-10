import uuid
from django.db import models
from core.models import TenantScopedModel


class WorkshopBay(TenantScopedModel):
    name = models.CharField(max_length=100) # e.g. Bay 1, Express Bay
    bay_type = models.CharField(max_length=50, choices=[('GENERAL', 'General Repair'), ('EXPRESS', 'Express Service'), ('WASH', 'Washing'), ('ALIGMENT', 'Wheel Alignment')], default='GENERAL')
    is_occupied = models.BooleanField(default=False)
    current_job_card = models.ForeignKey('service.JobCard', on_delete=models.SET_NULL, null=True, blank=True, related_name='active_bay_allocation')

    def __str__(self):
        return f"{self.name} ({'Occupied' if self.is_occupied else 'Available'})"


class Technician(TenantScopedModel):
    SKILL_TIERS = [
        ('L1', 'Level 1 — Periodic Service, Lubes, Filters & Inspection'),
        ('L2', 'Level 2 — Brakes, Suspension, Steering, Electrical & AC'),
        ('L3', 'Level 3 — Engine Overhaul, Transmission & EV High-Voltage Powertrain'),
    ]

    name = models.CharField(max_length=150)
    phone = models.CharField(max_length=20, blank=True)
    skill_tier = models.CharField(max_length=10, choices=SKILL_TIERS, default='L1')
    specialization = models.CharField(max_length=100, blank=True)
    efficiency_rating = models.DecimalField(max_digits=5, decimal_places=2, default=95.00) # Efficiency %
    active_jobs_count = models.IntegerField(default=0)
    max_concurrent_jobs = models.IntegerField(default=2)
    certifications = models.JSONField(default=list, blank=True)
    is_available = models.BooleanField(default=True)

    class Meta:
        indexes = [
            models.Index(fields=['organization_id', 'skill_tier']),
            models.Index(fields=['organization_id', 'is_available']),
        ]

    def __str__(self):
        return f"{self.name} [{self.get_skill_tier_display()}] (Active: {self.active_jobs_count}/{self.max_concurrent_jobs})"

