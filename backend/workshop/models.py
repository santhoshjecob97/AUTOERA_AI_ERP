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


class TechnicianTimeLog(TenantScopedModel):
    """
    Clocked time tracking per job card and idle period.
    Powers Dealership Productivity, Efficiency, and Utilization calculations.
    """
    ACTIVITY_TYPES = [
        ('REPAIR', 'Mechanical Repair'),
        ('DIAGNOSIS', 'Diagnostic / Scanning'),
        ('MAINTENANCE', 'Periodic Maintenance (PMS)'),
        ('INSPECTION', 'PDI / Final Quality Inspection'),
        ('IDLE_PARTS', 'Idle — Waiting for Spare Parts'),
        ('IDLE_APPROVAL', 'Idle — Waiting for Customer Approval'),
        ('IDLE_BAY', 'Idle — Bay Obstruction / Delay'),
        ('TRAINING', 'OEM Certified Training'),
        ('MEETING', 'Morning Huddle / Meeting'),
    ]

    AI_FLAGS = [
        ('OPTIMAL', 'Optimal Performance'),
        ('SLOW', 'Exceeding Flat Rate Standard'),
        ('IDLE_SPIKE', 'Excessive Idle Time Spike'),
        ('COMEBACK_RISK', 'Rework Pattern Detected'),
    ]

    technician = models.ForeignKey(Technician, on_delete=models.CASCADE, related_name='time_logs')
    job_card = models.ForeignKey('service.JobCard', on_delete=models.SET_NULL, null=True, blank=True, related_name='technician_time_logs')
    date = models.DateField(db_index=True)
    clock_in = models.DateTimeField()
    clock_out = models.DateTimeField(null=True, blank=True)
    activity_type = models.CharField(max_length=30, choices=ACTIVITY_TYPES, default='MAINTENANCE')
    flat_rate_hours = models.DecimalField(max_digits=6, decimal_places=2, default=0.00, help_text="Sold/Standard Flat-rate Hours")
    actual_hours = models.DecimalField(max_digits=6, decimal_places=2, default=0.00, help_text="Actual Clocked Hours")
    idle_reason = models.CharField(max_length=150, blank=True)
    is_comeback = models.BooleanField(default=False, help_text="Repeat repair / Customer comeback rework")
    comeback_notes = models.TextField(blank=True)
    ai_efficiency_flag = models.CharField(max_length=30, choices=AI_FLAGS, default='OPTIMAL')

    class Meta:
        indexes = [
            models.Index(fields=['organization_id', 'date']),
            models.Index(fields=['organization_id', 'technician', 'date']),
            models.Index(fields=['organization_id', 'activity_type']),
            models.Index(fields=['organization_id', 'is_comeback']),
        ]

    def save(self, *args, **kwargs):
        from decimal import Decimal
        if self.clock_in and self.clock_out:
            duration_seconds = (self.clock_out - self.clock_in).total_seconds()
            calculated_hours = round(Decimal(str(duration_seconds / 3600.0)), 2)
            if calculated_hours > 0:
                self.actual_hours = calculated_hours

        # AI Flag detection
        if self.is_comeback:
            self.ai_efficiency_flag = 'COMEBACK_RISK'
        elif self.activity_type.startswith('IDLE_') and self.actual_hours > Decimal('1.00'):
            self.ai_efficiency_flag = 'IDLE_SPIKE'
        elif self.flat_rate_hours > 0 and self.actual_hours > (self.flat_rate_hours * Decimal('1.30')):
            self.ai_efficiency_flag = 'SLOW'
        else:
            self.ai_efficiency_flag = 'OPTIMAL'

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.technician.name} - {self.get_activity_type_display()} ({self.actual_hours}h)"


class DailyTechnicianMetrics(TenantScopedModel):
    """
    Standard Dealership Productivity Formulas:
    - Productivity = Productive Hours / Available Hours * 100
    - Efficiency = Sold (Flat Rate) Hours / Clocked Hours * 100
    - Utilization = Clocked Hours / Available Hours * 100
    """
    technician = models.ForeignKey(Technician, on_delete=models.CASCADE, related_name='daily_metrics')
    date = models.DateField(db_index=True)
    available_hours = models.DecimalField(max_digits=5, decimal_places=2, default=8.00)
    clocked_hours = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    productive_hours = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    sold_hours = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    productivity_pct = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    efficiency_pct = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    utilization_pct = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    comeback_count = models.IntegerField(default=0)
    idle_hours = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    ai_assessment = models.TextField(blank=True)
    ai_evidence = models.JSONField(default=dict, blank=True)

    class Meta:
        unique_together = ('organization_id', 'technician', 'date')
        indexes = [
            models.Index(fields=['organization_id', 'date']),
            models.Index(fields=['organization_id', 'productivity_pct']),
            models.Index(fields=['organization_id', 'efficiency_pct']),
        ]

    def recalculate(self):
        from decimal import Decimal
        avail = self.available_hours or Decimal('8.00')
        clocked = self.clocked_hours or Decimal('0.00')
        prod = self.productive_hours or Decimal('0.00')
        sold = self.sold_hours or Decimal('0.00')

        # Dealership Standard SOP Formulas
        self.productivity_pct = round((prod / avail) * Decimal('100.00'), 2) if avail > 0 else Decimal('0.00')
        self.efficiency_pct = round((sold / clocked) * Decimal('100.00'), 2) if clocked > 0 else Decimal('0.00')
        self.utilization_pct = round((clocked / avail) * Decimal('100.00'), 2) if avail > 0 else Decimal('0.00')

    def save(self, *args, **kwargs):
        self.recalculate()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.technician.name} ({self.date}): Prod {self.productivity_pct}% | Eff {self.efficiency_pct}%"


