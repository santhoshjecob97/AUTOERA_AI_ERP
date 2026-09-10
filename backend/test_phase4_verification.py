import os
import sys
import uuid
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.utils import timezone
from django.test import RequestFactory
from rest_framework.test import APIRequestFactory, force_authenticate
from django.contrib.auth import get_user_model
from organization.models import Organization, Branch
from vehicles.models import Vehicle
from fleet.models import FleetVehicle, OBDTelemetry, Geofence
from fleet.ingestion import pipeline, haversine_distance_meters
from fleet.predictive_maintenance import predictive_engine
from ev.models import EVBatteryData, ChargingSession
from ev.services import ev_health_engine
from fleet.views import TelemetryIngestAPIView, PredictiveMaintenanceAPIView
from ev.views import EVBatteryHealthComputeAPIView

User = get_user_model()

def run_tests():
    print("==================================================")
    print("      AUTOERA AI - PHASE 4 VERIFICATION SUITE     ")
    print("==================================================")

    # 1. Setup Mock In-Memory Organization and Vehicles
    print("\n[1/5] Setting up test fixtures...")
    test_org_id = uuid.uuid4()
    test_branch_id = uuid.uuid4()

    # Create dummy user
    dummy_user = User(
        id=uuid.uuid4(),
        username='fleet_admin_test',
        email='fleet_admin@autoera.ai',
        role='FLEET_MANAGER'
    )

    # 2. Test Geofence Distance Calculation
    print("\n[2/5] Testing Geofence Haversine Distance Engine...")
    # Chennai Guindy to Chennai Airport (~6.5 km)
    dist = haversine_distance_meters(13.0067, 80.2030, 12.9941, 80.1709)
    print(f"  Calculated Distance: {dist:.1f} meters (~{dist/1000.0:.2f} km)")
    assert 3000 < dist < 10000, f"Unexpected distance calculation: {dist}"
    print("  [OK] Haversine Distance Engine passed.")

    # 3. Test Fleet Telemetry Ingestion Pipeline (DTC & Bounds Validation)
    print("\n[3/5] Testing Fleet OBD-II Ingestion Pipeline...")
    sample_packet = {
        'obd_device_id': 'OBD-TEST-999',
        'recorded_at': timezone.now().isoformat(),
        'latitude': 13.0067,
        'longitude': 80.2030,
        'speed_kmh': 65.5,
        'rpm': 2450,
        'engine_temp_c': 94,
        'fuel_level_pct': 78,
        'battery_voltage': 12.65,
        'heading': 180,
        'dtc_codes': ['P0420'],
        'harsh_braking': False,
        'harsh_acceleration': False,
        'excessive_idle': False
    }

    # Ingest without existing vehicle -> should gracefully report REJECTED
    reject_res = pipeline.ingest_packet(sample_packet, organization_id=test_org_id)
    print(f"  Unenrolled Device Rejection Check: {reject_res.get('status')} ({reject_res.get('reason')})")
    assert reject_res.get('status') == 'REJECTED'

    batch_packets = [sample_packet, sample_packet]
    batch_res = pipeline.ingest_batch(batch_packets, organization_id=test_org_id)
    print(f"  Batch Ingestion Result: Total={batch_res['total_packets']}, Rejected={batch_res['rejected_count']}")
    assert batch_res['total_packets'] == 2
    print("  [OK] Telemetry Ingestion Pipeline validation passed.")

    # 4. Test Predictive Maintenance Engine (Sequence Processing)
    print("\n[4/5] Testing Predictive Maintenance Sequence Engine...")
    dummy_vehicle = Vehicle(
        id=uuid.uuid4(),
        organization_id=test_org_id,
        vin='MAT621980P2K8819',
        registration_number='TN-09-CB-4491',
        make='Tata',
        model='Nexon EV'
    )
    dummy_fleet_vehicle = FleetVehicle(
        id=uuid.uuid4(),
        organization_id=test_org_id,
        vehicle=dummy_vehicle,
        fleet_tag='FL-NEXON-01',
        obd_device_id='OBD-NEXON-01',
        health_score=94
    )

    pred_res = predictive_engine.evaluate_vehicle(dummy_fleet_vehicle)
    print(f"  Model Version: {pred_res.get('model_version')}")
    print(f"  Composite Failure Probability: {pred_res.get('composite_failure_probability')}")
    print(f"  Remaining Useful Life: {pred_res.get('remaining_useful_life_km')} km ({pred_res.get('remaining_useful_life_days')} days)")
    print(f"  Health Grade: {pred_res.get('health_grade')} (Urgency: {pred_res.get('urgency')})")
    print(f"  Prescriptive Actions: {pred_res.get('prescriptive_actions')[:1]}")
    assert 0.0 <= pred_res.get('composite_failure_probability') <= 1.0
    assert pred_res.get('remaining_useful_life_km') > 0
    print("  [OK] Predictive Maintenance Engine passed.")

    # 5. Test EV Battery Health Scoring Algorithm (Section 10)
    print("\n[5/5] Testing Section 10 EV Battery Health Scoring Engine...")
    # Test baseline evaluation
    today = timezone.now().date()
    ev_res = ev_health_engine._generate_baseline_score(dummy_vehicle, today, test_org_id)
    print(f"  Composite Battery Score: {ev_res.get('overall_score')}/100")
    print(f"  Component Scores: {ev_res.get('components')}")
    print(f"  Projected Remaining Cycles: {ev_res.get('projections', {}).get('estimated_remaining_cycles')} cycles")
    print(f"  Replacement Date: {ev_res.get('projections', {}).get('estimated_replacement_date')}")
    print(f"  Recommendations: {ev_res.get('recommendations')}")
    assert ev_res.get('overall_score') >= 90
    assert ev_res.get('components', {}).get('cell_balance_score') > 0
    print("  [OK] EV Battery Health Scoring Algorithm passed.")

    # 6. Verify REST Endpoints
    print("\n[*] Verifying REST API Endpoint Routing...")
    api_factory = APIRequestFactory()

    # Telemetry Ingestion View
    ingest_req = api_factory.post('/api/v1/fleet/telemetry/ingest/', data=sample_packet, format='json')
    force_authenticate(ingest_req, user=dummy_user)
    ingest_req.organization_id = test_org_id
    ingest_view = TelemetryIngestAPIView.as_view()
    resp1 = ingest_view(ingest_req)
    print(f"  POST /api/v1/fleet/telemetry/ingest/ -> Status {resp1.status_code}")
    assert resp1.status_code in [200, 201]

    # EV Battery Health Compute View
    ev_req = api_factory.post('/api/v1/ev/health-scores/compute/', data={}, format='json')
    force_authenticate(ev_req, user=dummy_user)
    ev_req.organization_id = test_org_id
    ev_view = EVBatteryHealthComputeAPIView.as_view()
    resp2 = ev_view(ev_req)
    print(f"  POST /api/v1/ev/health-scores/compute/ -> Status {resp2.status_code}")
    assert resp2.status_code == 200

    print("\n==================================================")
    print("   [PASS] ALL PHASE 4 VERIFICATION TESTS PASSED   ")
    print("==================================================")

if __name__ == '__main__':
    run_tests()
