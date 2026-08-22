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
    name = models.CharField(max_length=150)
    specialization = models.CharField(max_length=100, blank=True)
    efficiency_rating = models.DecimalField(max_digits=5, decimal_places=2, default=95.00) # Efficiency %
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} - {self.specialization}"
