"""
AutoEra AI — Fleet Management Models (Section 09 — Master Architecture)

Core data layer for:
  - Fleet vehicle tracking (GPS, OBD-II device, health scoring)
  - OBD-II telemetry data (designed for TimescaleDB hypertable in production)
  - Driver behaviour scoring (harsh braking, speeding, idle time)
  - Geofence zones and violations

Production note: OBDTelemetry is designed to work as a TimescaleDB hypertable.
Run `SELECT create_hypertable('fleet_obdtelemetry', 'recorded_at');` in PostgreSQL.
"""
import uuid
from django.db import models
from core.models import TenantScopedModel


class FleetVehicle(TenantScopedModel):
    """
    Fleet-enrolled vehicle with OBD-II device pairing, GPS location, and
    real-time health scoring. Links to vehicles.Vehicle for base data.
    """
    STATUS_CHOICES = [
        ('ACTIVE', 'Active — On Road'),
        ('IDLE', 'Idle — Parked'),
        ('IN_SERVICE', 'In Workshop'),
        ('DECOMMISSIONED', 'Decommissioned'),
    ]

    vehicle = models.OneToOneField(
        'vehicles.Vehicle', on_delete=models.CASCADE, related_name='fleet_profile'
    )
    fleet_tag = models.CharField(max_length=50, db_index=True, blank=True,
                                 help_text='Internal fleet identifier (e.g. FL-001)')
    obd_device_id = models.CharField(max_length=100, blank=True, db_index=True,
                                     help_text='OBD-II / IoT device serial number')
    driver = models.ForeignKey(
        'identity.User', on_delete=models.SET_NULL, null=True, blank=True,
        related_name='fleet_vehicles', limit_choices_to={'role': 'FLEET_MANAGER'}
    )
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='ACTIVE')

    # Real-time GPS
    last_latitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    last_longitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    last_location_update = models.DateTimeField(null=True, blank=True)

    # Health metrics
    health_score = models.IntegerField(default=100, help_text='0–100 composite health score')
    fuel_level_pct = models.IntegerField(default=100, help_text='0–100 fuel level %')
    total_distance_km = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    engine_hours = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    # Maintenance scheduling
    next_service_km = models.IntegerField(default=10000)
    next_service_date = models.DateField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['organization_id', 'status']),
            models.Index(fields=['organization_id', 'obd_device_id']),
            models.Index(fields=['organization_id', 'fleet_tag']),
        ]

    def __str__(self):
        return f"{self.fleet_tag or 'FL'} — {self.vehicle} ({self.get_status_display()})"


class OBDTelemetry(TenantScopedModel):
    """
    OBD-II telemetry data point — one row per vehicle per 30-second interval.
    Designed for TimescaleDB hypertable (2,880 rows/vehicle/day).

    Production setup: Convert to hypertable after initial migration:
        SELECT create_hypertable('fleet_obdtelemetry', 'recorded_at');
    """
    fleet_vehicle = models.ForeignKey(FleetVehicle, on_delete=models.CASCADE, related_name='telemetry')
    recorded_at = models.DateTimeField(db_index=True)

    # GPS
    latitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    speed_kmh = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    heading = models.IntegerField(default=0, help_text='Compass heading 0–360°')

    # Engine data
    rpm = models.IntegerField(default=0)
    engine_temp_c = models.IntegerField(default=90)
    fuel_level_pct = models.IntegerField(default=100)
    battery_voltage = models.DecimalField(max_digits=5, decimal_places=2, default=12.60)

    # Diagnostic trouble codes (DTC)
    dtc_codes = models.JSONField(default=list, blank=True,
                                 help_text='Active OBD-II diagnostic trouble codes')

    # Driving behaviour
    harsh_braking = models.BooleanField(default=False)
    harsh_acceleration = models.BooleanField(default=False)
    excessive_idle = models.BooleanField(default=False)

    class Meta:
        indexes = [
            models.Index(fields=['organization_id', 'fleet_vehicle_id', 'recorded_at']),
            models.Index(fields=['organization_id', 'recorded_at']),
        ]
        ordering = ['-recorded_at']

    def __str__(self):
        return f"Telemetry {self.fleet_vehicle.fleet_tag} @ {self.recorded_at}"


class DriverScore(TenantScopedModel):
    """
    Daily driver behaviour scoring — computed from aggregated OBD telemetry.
    Tracks harsh events, speed violations, idle time, and overall safety score.
    """
    fleet_vehicle = models.ForeignKey(FleetVehicle, on_delete=models.CASCADE, related_name='driver_scores')
    driver = models.ForeignKey('identity.User', on_delete=models.SET_NULL, null=True, blank=True,
                               related_name='driver_scores')
    score_date = models.DateField(db_index=True)

    # Behaviour metrics
    overall_score = models.IntegerField(default=100, help_text='0–100 composite safety score')
    harsh_braking_count = models.IntegerField(default=0)
    harsh_acceleration_count = models.IntegerField(default=0)
    speeding_events = models.IntegerField(default=0)
    idle_minutes = models.IntegerField(default=0)
    total_distance_km = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_trips = models.IntegerField(default=0)
    avg_speed_kmh = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    max_speed_kmh = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    fuel_consumed_litres = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    fuel_efficiency_kmpl = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)

    class Meta:
        unique_together = ('organization_id', 'fleet_vehicle', 'score_date')
        indexes = [
            models.Index(fields=['organization_id', 'score_date']),
        ]

    def __str__(self):
        return f"Driver Score {self.fleet_vehicle.fleet_tag} — {self.score_date}: {self.overall_score}"


class Geofence(TenantScopedModel):
    """
    Geographic boundary zones for fleet monitoring and alerting.
    """
    ZONE_TYPES = [
        ('YARD', 'Dealership Yard'),
        ('ROUTE', 'Approved Route Corridor'),
        ('RESTRICTED', 'Restricted Zone'),
        ('CUSTOMER', 'Customer Delivery Zone'),
    ]

    name = models.CharField(max_length=150)
    zone_type = models.CharField(max_length=50, choices=ZONE_TYPES, default='YARD')
    center_latitude = models.DecimalField(max_digits=10, decimal_places=7)
    center_longitude = models.DecimalField(max_digits=10, decimal_places=7)
    radius_meters = models.IntegerField(default=500)
    polygon_coordinates = models.JSONField(default=list, blank=True,
                                           help_text='GeoJSON polygon coordinates for complex zones')
    is_active = models.BooleanField(default=True)

    class Meta:
        indexes = [
            models.Index(fields=['organization_id', 'is_active']),
        ]

    def __str__(self):
        return f"{self.name} ({self.get_zone_type_display()}) — {self.radius_meters}m"


class FleetTrip(TenantScopedModel):
    """
    Fleet vehicle trip history with route deviation detection and metrics.
    """
    STATUS_CHOICES = [
        ('IN_TRANSIT', 'In Transit'),
        ('COMPLETED', 'Completed'),
        ('ABORTED', 'Aborted'),
    ]

    fleet_vehicle = models.ForeignKey(FleetVehicle, on_delete=models.CASCADE, related_name='trips')
    driver = models.ForeignKey('identity.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='fleet_trips')
    start_time = models.DateTimeField(db_index=True)
    end_time = models.DateTimeField(null=True, blank=True)
    start_location = models.CharField(max_length=200, default='Depot')
    end_location = models.CharField(max_length=200, blank=True)
    distance_km = models.DecimalField(max_digits=8, decimal_places=2, default=0.0)
    avg_speed_kmh = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    max_speed_kmh = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    fuel_consumed_litres = models.DecimalField(max_digits=6, decimal_places=2, default=0.0)
    route_deviation_flag = models.BooleanField(default=False, help_text="Flagged if vehicle deviated > 500m from approved corridor")
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='IN_TRANSIT')

    class Meta:
        indexes = [
            models.Index(fields=['organization_id', 'status']),
            models.Index(fields=['organization_id', 'start_time']),
        ]

    def __str__(self):
        return f"Trip {self.fleet_vehicle.fleet_tag}: {self.start_location} -> {self.end_location or 'En Route'}"


class FuelTheftIncident(TenantScopedModel):
    """
    Fuel Intelligence — detected stationary fuel drops and siphoning events.
    """
    fleet_vehicle = models.ForeignKey(FleetVehicle, on_delete=models.CASCADE, related_name='fuel_theft_incidents')
    detected_at = models.DateTimeField(db_index=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    fuel_drop_litres = models.DecimalField(max_digits=6, decimal_places=2, default=0.0)
    fuel_drop_pct = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    vehicle_stationary = models.BooleanField(default=True)
    severity = models.CharField(max_length=30, choices=[('CRITICAL', 'Critical Theft Suspected'), ('WARNING', 'Unusual Consumption')], default='CRITICAL')
    resolved = models.BooleanField(default=False)

    class Meta:
        indexes = [
            models.Index(fields=['organization_id', 'resolved']),
            models.Index(fields=['organization_id', 'detected_at']),
        ]

    def __str__(self):
        return f"Fuel Drop {self.fuel_drop_litres}L on {self.fleet_vehicle.fleet_tag} @ {self.detected_at}"


class FleetMaintenanceCalendar(TenantScopedModel):
    """
    AI-optimised fleet maintenance scheduling to minimise vehicle off-road time (VOR).
    """
    STATUS_CHOICES = [
        ('SCHEDULED', 'Scheduled'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]

    fleet_vehicle = models.ForeignKey(FleetVehicle, on_delete=models.CASCADE, related_name='scheduled_maintenance')
    scheduled_date = models.DateField(db_index=True)
    scheduled_slot = models.CharField(max_length=50, default='OFF_PEAK_WEEKEND')
    subsystem = models.CharField(max_length=100, default='GENERAL_PERIODIC')
    estimated_vor_hours = models.IntegerField(default=4, help_text="Estimated Vehicle Off-Road hours")
    preordered_parts = models.JSONField(default=list, blank=True, help_text="Parts pre-ordered from inventory 7 days prior")
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='SCHEDULED')

    class Meta:
        indexes = [
            models.Index(fields=['organization_id', 'scheduled_date']),
            models.Index(fields=['organization_id', 'status']),
        ]

    def __str__(self):
        return f"Maint {self.fleet_vehicle.fleet_tag} on {self.scheduled_date} ({self.subsystem})"
