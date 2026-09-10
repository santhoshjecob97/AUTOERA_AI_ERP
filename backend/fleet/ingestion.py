"""
AutoEra AI — Fleet IoT Telemetry Ingestion Pipeline (Section 09)

Provides high-throughput batch and single-packet ingestion for OBD-II telematics devices.
Features:
- Telemetry bounds validation and sanity checks
- DTC (Diagnostic Trouble Code) parsing and severity classification
- Real-time GPS location and vehicle health scoring updates
- Geofence perimeter checking (Haversine formula)
- Driver behavior event aggregation (harsh acceleration/braking/idle)
"""
import math
import logging
from datetime import datetime
from decimal import Decimal
from typing import Dict, Any, List, Optional, Tuple
from django.utils import timezone
from django.db import transaction

from .models import FleetVehicle, OBDTelemetry, DriverScore, Geofence
from vehicles.models import VehicleHealth

logger = logging.getLogger('autoera.fleet.ingestion')


# Common OBD-II Diagnostic Trouble Code Reference Dictionary
DTC_REFERENCE = {
    'P0300': {'desc': 'Random/Multiple Cylinder Misfire Detected', 'severity': 'CRITICAL', 'subsystem': 'ENGINE', 'score_penalty': 25},
    'P0301': {'desc': 'Cylinder 1 Misfire Detected', 'severity': 'CRITICAL', 'subsystem': 'ENGINE', 'score_penalty': 20},
    'P0217': {'desc': 'Engine Coolant Over-Temperature Condition', 'severity': 'CRITICAL', 'subsystem': 'COOLING', 'score_penalty': 30},
    'P0115': {'desc': 'Engine Coolant Temperature Circuit Malfunction', 'severity': 'WARNING', 'subsystem': 'COOLING', 'score_penalty': 15},
    'P0420': {'desc': 'Catalyst System Efficiency Below Threshold (Bank 1)', 'severity': 'WARNING', 'subsystem': 'EMISSIONS', 'score_penalty': 10},
    'P0700': {'desc': 'Transmission Control System Malfunction', 'severity': 'CRITICAL', 'subsystem': 'TRANSMISSION', 'score_penalty': 25},
    'P0130': {'desc': 'O2 Sensor Circuit Malfunction (Bank 1 Sensor 1)', 'severity': 'INFO', 'subsystem': 'ELECTRICAL', 'score_penalty': 5},
    'P0562': {'desc': 'System Voltage Low', 'severity': 'WARNING', 'subsystem': 'ELECTRICAL', 'score_penalty': 15},
    'C0035': {'desc': 'Left Front Wheel Speed Sensor Malfunction', 'severity': 'CRITICAL', 'subsystem': 'BRAKE', 'score_penalty': 20},
    'U0100': {'desc': 'Lost Communication With ECM/PCM "A"', 'severity': 'CRITICAL', 'subsystem': 'CAN_BUS', 'score_penalty': 35},
}


def haversine_distance_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates great-circle distance between two GPS points in meters."""
    R = 6371000  # Radius of Earth in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2.0) ** 2 + \
        math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


class TelemetryIngestionPipeline:
    """
    High-throughput ingestion engine for Fleet OBD-II / CAN-bus streaming.
    """

    @classmethod
    def ingest_packet(cls, packet: Dict[str, Any], organization_id: Any) -> Dict[str, Any]:
        """
        Validates, ingests, and processes a single OBD telemetry packet.
        """
        device_id = packet.get('obd_device_id')
        vehicle_id = packet.get('fleet_vehicle_id')

        # 1. Resolve FleetVehicle with tenant isolation
        fleet_vehicle = None
        try:
            if device_id:
                fleet_vehicle = FleetVehicle.objects.filter(
                    organization_id=organization_id, obd_device_id=device_id
                ).select_related('vehicle').first()

            if not fleet_vehicle and vehicle_id:
                fleet_vehicle = FleetVehicle.objects.filter(
                    organization_id=organization_id, id=vehicle_id
                ).select_related('vehicle').first()
        except Exception as e:
            logger.warning(f"Database unavailable during fleet vehicle lookup: {e}")
            return {
                'status': 'REJECTED',
                'reason': f"Database offline or device '{device_id}' unenrolled."
            }

        if not fleet_vehicle:
            return {
                'status': 'REJECTED',
                'reason': f"No fleet vehicle found matching device '{device_id}' or ID '{vehicle_id}'."
            }

        # 2. Parse recorded_at timestamp
        recorded_at_raw = packet.get('recorded_at')
        if recorded_at_raw:
            if isinstance(recorded_at_raw, str):
                try:
                    recorded_at = datetime.fromisoformat(recorded_at_raw.replace('Z', '+00:00'))
                except Exception:
                    recorded_at = timezone.now()
            else:
                recorded_at = recorded_at_raw
        else:
            recorded_at = timezone.now()

        # 3. Extract & sanitize metrics
        lat = packet.get('latitude')
        lon = packet.get('longitude')
        speed = max(0.0, float(packet.get('speed_kmh', 0.0)))
        rpm = max(0, int(packet.get('rpm', 0)))
        engine_temp = int(packet.get('engine_temp_c', 90))
        fuel_level = min(100, max(0, int(packet.get('fuel_level_pct', 100))))
        voltage = float(packet.get('battery_voltage', 12.60))
        heading = int(packet.get('heading', 0)) % 360

        harsh_braking = bool(packet.get('harsh_braking', False))
        harsh_acceleration = bool(packet.get('harsh_acceleration', False))
        excessive_idle = bool(packet.get('excessive_idle', False))

        raw_dtcs = packet.get('dtc_codes', [])
        dtc_codes = [str(c).upper().strip() for c in raw_dtcs if str(c).strip()]

        # 4. Analyze DTC Severity and Deduct Health Score
        dtc_analysis = []
        health_penalty = 0
        critical_alerts = []

        for code in dtc_codes:
            ref = DTC_REFERENCE.get(code, {
                'desc': 'Unknown Diagnostic Trouble Code',
                'severity': 'WARNING',
                'subsystem': 'GENERAL',
                'score_penalty': 10
            })
            dtc_analysis.append({'code': code, **ref})
            health_penalty += ref['score_penalty']

            if ref['severity'] == 'CRITICAL':
                critical_alerts.append(f"CRITICAL DTC {code}: {ref['desc']}")

        # Over-temperature / Voltage warnings
        if engine_temp > 105:
            health_penalty += 15
            critical_alerts.append(f"High Coolant Temperature: {engine_temp}°C (Safe limit: 105°C)")
        if voltage < 11.8:
            health_penalty += 10
            critical_alerts.append(f"Low 12V Battery Voltage: {voltage:.2f}V (Safe limit: 11.8V)")

        # Compute updated composite health score (0-100)
        computed_health = max(10, min(100, 100 - health_penalty))

        # 5. Geofence checks
        geofence_violations = []
        if lat is not None and lon is not None:
            active_fences = Geofence.objects.filter(organization_id=organization_id, is_active=True)
            for fence in active_fences:
                dist = haversine_distance_meters(float(lat), float(lon), float(fence.center_latitude), float(fence.center_longitude))
                if fence.zone_type == 'RESTRICTED' and dist <= fence.radius_meters:
                    geofence_violations.append({
                        'geofence_id': str(fence.id),
                        'name': fence.name,
                        'violation': 'ENTRY_RESTRICTED_ZONE',
                        'distance_meters': round(dist, 1)
                    })

        # 6. Database Persistence
        with transaction.atomic():
            telemetry_record = OBDTelemetry.objects.create(
                organization_id=organization_id,
                fleet_vehicle=fleet_vehicle,
                recorded_at=recorded_at,
                latitude=Decimal(str(lat)) if lat is not None else None,
                longitude=Decimal(str(lon)) if lon is not None else None,
                speed_kmh=Decimal(str(round(speed, 2))),
                heading=heading,
                rpm=rpm,
                engine_temp_c=engine_temp,
                fuel_level_pct=fuel_level,
                battery_voltage=Decimal(str(round(voltage, 2))),
                dtc_codes=dtc_codes,
                harsh_braking=harsh_braking,
                harsh_acceleration=harsh_acceleration,
                excessive_idle=excessive_idle
            )

            # Update FleetVehicle real-time state
            fleet_vehicle.health_score = computed_health
            fleet_vehicle.fuel_level_pct = fuel_level
            if lat is not None and lon is not None:
                fleet_vehicle.last_latitude = Decimal(str(lat))
                fleet_vehicle.last_longitude = Decimal(str(lon))
                fleet_vehicle.last_location_update = recorded_at

            # Odometer calculation
            distance_delta = (speed / 3600.0) * 30.0  # assume ~30s interval
            fleet_vehicle.total_distance_km = Decimal(str(round(float(fleet_vehicle.total_distance_km) + distance_delta, 2)))
            fleet_vehicle.save()

            # Update VehicleHealth if linked
            try:
                vh, _ = VehicleHealth.objects.get_or_create(
                    vehicle=fleet_vehicle.vehicle,
                    defaults={'organization_id': organization_id}
                )
                vh.overall_score = computed_health
                vh.active_dtc_codes = dtc_codes
                vh.engine_score = max(0, 100 - (30 if any(d['subsystem'] == 'ENGINE' for d in dtc_analysis) else 0))
                vh.brake_score = max(0, 100 - (30 if any(d['subsystem'] == 'BRAKE' for d in dtc_analysis) else 0))
                vh.battery_score = max(0, 100 - (30 if any(d['subsystem'] == 'ELECTRICAL' for d in dtc_analysis) else 0))
                vh.cooling_score = max(0, 100 - (30 if engine_temp > 105 else 0))
                vh.save()
            except Exception as e:
                logger.warning(f"Could not update VehicleHealth: {e}")

            # 7. Update Daily DriverScore
            today = recorded_at.date()
            driver_score, _ = DriverScore.objects.get_or_create(
                organization_id=organization_id,
                fleet_vehicle=fleet_vehicle,
                score_date=today,
                defaults={'driver': fleet_vehicle.driver}
            )
            if harsh_braking:
                driver_score.harsh_braking_count += 1
            if harsh_acceleration:
                driver_score.harsh_acceleration_count += 1
            if speed > 100:
                driver_score.speeding_events += 1
            if excessive_idle:
                driver_score.idle_minutes += 1

            # Recalculate daily driver safety score
            violations = (driver_score.harsh_braking_count * 2) + (driver_score.harsh_acceleration_count * 2) + (driver_score.speeding_events * 5)
            driver_score.overall_score = max(20, 100 - violations)
            driver_score.total_distance_km = Decimal(str(round(float(driver_score.total_distance_km) + distance_delta, 2)))
            driver_score.save()

        return {
            'status': 'INGESTED',
            'telemetry_id': str(telemetry_record.id),
            'vehicle': fleet_vehicle.fleet_tag or str(fleet_vehicle.id),
            'health_score': computed_health,
            'dtc_analysis': dtc_analysis,
            'critical_alerts': critical_alerts,
            'geofence_violations': geofence_violations,
            'recorded_at': recorded_at.isoformat()
        }

    @classmethod
    def ingest_batch(cls, packets: List[Dict[str, Any]], organization_id: Any) -> Dict[str, Any]:
        """
        Batch-ingests multiple OBD telemetry packets in sequence.
        """
        results = []
        ingested_count = 0
        rejected_count = 0

        for packet in packets:
            try:
                res = cls.ingest_packet(packet, organization_id=organization_id)
                results.append(res)
                if res.get('status') == 'INGESTED':
                    ingested_count += 1
                else:
                    rejected_count += 1
            except Exception as e:
                logger.error(f"Error ingesting packet {packet}: {e}")
                results.append({'status': 'ERROR', 'error': str(e)})
                rejected_count += 1

        return {
            'total_packets': len(packets),
            'ingested_count': ingested_count,
            'rejected_count': rejected_count,
            'results': results
        }


pipeline = TelemetryIngestionPipeline()
