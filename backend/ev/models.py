"""
AutoEra AI — EV Intelligence Platform Models (Section 10 — Master Architecture)

Core data layer for:
  - Battery health monitoring (SoC, SoH, cell voltages, temperature)
  - Charging session analytics (cost, efficiency, duration)
  - Daily battery health scoring (composite score computed at 2am)
  - Degradation forecasting support data

Production note: EVBatteryData is designed for TimescaleDB hypertable.
Run `SELECT create_hypertable('ev_evbatterydata', 'recorded_at');` in PostgreSQL.
"""
import uuid
from django.db import models
from core.models import TenantScopedModel


class EVBatteryData(TenantScopedModel):
    """
    Battery telemetry data point — one row per vehicle per minute during drive/charge.
    Designed for TimescaleDB hypertable with continuous aggregates for daily summaries.

    Production: `SELECT create_hypertable('ev_evbatterydata', 'recorded_at');`
    """
    vehicle = models.ForeignKey(
        'vehicles.Vehicle', on_delete=models.CASCADE, related_name='battery_data'
    )
    recorded_at = models.DateTimeField(db_index=True)

    # State of Charge / State of Health
    soc_pct = models.DecimalField(max_digits=5, decimal_places=2, default=100.00,
                                  help_text='State of Charge 0–100%')
    soh_pct = models.DecimalField(max_digits=5, decimal_places=2, default=100.00,
                                  help_text='State of Health 0–100%')

    # Cell-level data (stored as JSON array of voltages)
    cell_voltages = models.JSONField(default=list, blank=True,
                                     help_text='Array of individual cell voltages (V)')
    cell_temp_min_c = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
    cell_temp_max_c = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
    cell_temp_avg_c = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)

    # Pack-level data
    pack_voltage = models.DecimalField(max_digits=8, decimal_places=2, default=0.00,
                                       help_text='Total pack voltage (V)')
    pack_current = models.DecimalField(max_digits=8, decimal_places=2, default=0.00,
                                       help_text='Current draw/regen (A)')
    pack_power_kw = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)

    # Driving context
    odometer_km = models.IntegerField(default=0)
    ambient_temp_c = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
    is_charging = models.BooleanField(default=False)
    is_driving = models.BooleanField(default=False)

    class Meta:
        indexes = [
            models.Index(fields=['organization_id', 'vehicle_id', 'recorded_at']),
            models.Index(fields=['organization_id', 'recorded_at']),
        ]
        ordering = ['-recorded_at']

    def __str__(self):
        return f"EV Battery {self.vehicle} @ {self.recorded_at} — SoC:{self.soc_pct}% SoH:{self.soh_pct}%"


class ChargingSession(TenantScopedModel):
    """
    Individual charging session — from plug-in to plug-out.
    Tracks energy consumed, cost, efficiency, and charger type.
    """
    CHARGER_TYPES = [
        ('AC_SLOW', 'AC Slow (3.3 kW)'),
        ('AC_NORMAL', 'AC Normal (7.4 kW)'),
        ('AC_FAST', 'AC Fast (22 kW)'),
        ('DC_FAST', 'DC Fast (50 kW)'),
        ('DC_ULTRA', 'DC Ultra-Fast (150+ kW)'),
        ('HOME', 'Home Charger'),
    ]

    STATUS_CHOICES = [
        ('CHARGING', 'Currently Charging'),
        ('COMPLETED', 'Completed'),
        ('INTERRUPTED', 'Interrupted / Error'),
        ('SCHEDULED', 'Scheduled'),
    ]

    vehicle = models.ForeignKey(
        'vehicles.Vehicle', on_delete=models.CASCADE, related_name='charging_sessions'
    )
    session_id = models.UUIDField(default=uuid.uuid4, unique=True, db_index=True)
    charger_type = models.CharField(max_length=50, choices=CHARGER_TYPES, default='AC_NORMAL')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='CHARGING')

    # Timing
    started_at = models.DateTimeField(null=True, blank=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    duration_minutes = models.IntegerField(default=0)

    # Energy
    soc_start_pct = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    soc_end_pct = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    energy_added_kwh = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    energy_cost_inr = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    cost_per_kwh = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    charge_efficiency_pct = models.DecimalField(max_digits=5, decimal_places=2, default=95.00)

    # Location
    charger_location = models.CharField(max_length=255, blank=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['organization_id', 'vehicle_id', 'started_at']),
            models.Index(fields=['organization_id', 'status']),
        ]
        ordering = ['-started_at']

    def __str__(self):
        return f"Charge {self.session_id} — {self.vehicle} ({self.get_charger_type_display()})"


class BatteryHealthScore(TenantScopedModel):
    """
    Daily composite battery health score — computed at 2am from aggregated telemetry.
    Used for degradation trend analysis and replacement prediction.

    Score = weighted(SoH × 0.40 + CellBalance × 0.25 + TempRange × 0.20 + ChargePattern × 0.15)
    """
    vehicle = models.ForeignKey(
        'vehicles.Vehicle', on_delete=models.CASCADE, related_name='battery_health_scores'
    )
    score_date = models.DateField(db_index=True)

    # Composite score
    overall_score = models.IntegerField(default=100, help_text='0–100 composite battery health')

    # Component scores
    soh_score = models.IntegerField(default=100, help_text='State of Health component (40% weight)')
    cell_balance_score = models.IntegerField(default=100, help_text='Cell balance delta score (25% weight)')
    thermal_score = models.IntegerField(default=100, help_text='Temperature management score (20% weight)')
    charge_pattern_score = models.IntegerField(default=100, help_text='Charge behaviour score (15% weight)')

    # Raw metrics
    avg_soh_pct = models.DecimalField(max_digits=5, decimal_places=2, default=100.00)
    max_cell_delta_mv = models.IntegerField(default=0, help_text='Max cell voltage imbalance (mV)')
    avg_temp_c = models.DecimalField(max_digits=5, decimal_places=1, default=25.0)
    charge_cycles_total = models.IntegerField(default=0)

    # Prediction
    estimated_remaining_cycles = models.IntegerField(default=2000)
    estimated_replacement_date = models.DateField(null=True, blank=True)

    class Meta:
        unique_together = ('organization_id', 'vehicle', 'score_date')
        indexes = [
            models.Index(fields=['organization_id', 'score_date']),
        ]

    def __str__(self):
        return f"Battery Health {self.vehicle} — {self.score_date}: {self.overall_score}/100"


class EVRangeAlert(TenantScopedModel):
    """
    Range Anxiety Intervention (Section 10 P0 MVP).
    Tracks proactive alerts triggered when SOH < 80% or on-road SOC drops dangerously low.
    """
    STATUS_CHOICES = [
        ('ALERT_SENT', 'Alert Dispatched via WhatsApp'),
        ('STATION_REACHED', 'Vehicle Reached Charging Station'),
        ('DISMISSED', 'Dismissed by Driver'),
    ]

    vehicle = models.ForeignKey(
        'vehicles.Vehicle', on_delete=models.CASCADE, related_name='range_alerts'
    )
    triggered_at = models.DateTimeField(db_index=True)
    current_soc_pct = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    current_soh_pct = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    estimated_remaining_range_km = models.DecimalField(max_digits=6, decimal_places=2, default=0.0)
    nearest_charging_stations = models.JSONField(default=list, blank=True, help_text="Nearby fast chargers with live status & distances")
    whatsapp_alert_sent = models.BooleanField(default=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='ALERT_SENT')

    class Meta:
        indexes = [
            models.Index(fields=['organization_id', 'triggered_at']),
            models.Index(fields=['organization_id', 'status']),
        ]

    def __str__(self):
        return f"Range Alert {self.vehicle.registration_number}: SoC {self.current_soc_pct}% -> {self.estimated_remaining_range_km} km left"


class BatteryReplacementPlan(TenantScopedModel):
    """
    Battery Replacement Planning & Booking Integration (Section 10 P1).
    Triggered when SOH reaches 70% warranty threshold with 4 replacement options.
    """
    STATUS_CHOICES = [
        ('OPTIONS_PRESENTED', 'Options Presented to Customer'),
        ('BOOKED', 'Workshop Job Card Booked'),
        ('IN_PROGRESS', 'Battery Replacement in Progress'),
        ('COMPLETED', 'Battery Replaced / Upgraded'),
    ]

    vehicle = models.ForeignKey(
        'vehicles.Vehicle', on_delete=models.CASCADE, related_name='battery_replacement_plans'
    )
    current_soh_pct = models.DecimalField(max_digits=5, decimal_places=2, default=70.0)
    trigger_reason = models.CharField(max_length=150, default='SOH_DROPPED_BELOW_70_PCT')
    options = models.JSONField(default=list, blank=True, help_text="4 options: OEM New, Refurb, Recondition, Trade-in")
    selected_option = models.CharField(max_length=50, blank=True)
    estimated_cost_inr = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    booking_status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='OPTIONS_PRESENTED')
    job_card_reference = models.CharField(max_length=100, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['organization_id', 'booking_status']),
        ]

    def __str__(self):
        return f"Replacement Plan {self.vehicle.registration_number} ({self.booking_status})"
