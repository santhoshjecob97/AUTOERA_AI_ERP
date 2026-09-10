"""
Test Suite: Section 10 EV Intelligence Platform Verification
Tests all 10 feature engines, models, and business logic:
1. Daily Battery Health Scoring (Weighted Composite 40/30/20/10)
2. Personalised Range Prediction (Driving style, weather, terrain, payload)
3. Battery Degradation Forecasting (Weibull curve, 70% threshold, replacement horizon)
4. Charging Session Analytics (Efficiency %, cost/kWh, peak vs off-peak window)
5. Range Anxiety Intervention (SOH < 80% / low SOC, WhatsApp alert, nearest stations)
6. Cell Imbalance Detection (96-cell series, delta mV, weak cell anomaly)
7. Thermal Management Alerts (Thermal deviation, runaway risk, freeze protection)
8. EV TCO Calculator (EV vs Diesel INR/km, 3-year savings, CO2 averted)
9. Battery Replacement Planning (4 options: OEM, Refurb, Recondition, Trade-in)
10. OEM BMS API Integration (Tata Motors, Ather, OLA, Mahindra connectors)
"""

import sys
import os

# Ensure backend root is in sys.path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from ev.services import (
    EVBatteryHealthEngine,
    RangePredictionEngine,
    BatteryDegradationForecastingEngine,
    ChargingSessionAnalyticsEngine,
    RangeAnxietyInterventionEngine,
    CellImbalanceDetectionEngine,
    ThermalManagementAlertEngine,
    EVTCOCalculatorEngine,
    BatteryReplacementPlanningEngine,
    OEMBMSAPIEngine,
)


def run_tests():
    print("=" * 70)
    print("RUNNING SECTION 10: EV INTELLIGENCE PLATFORM TEST SUITE")
    print("=" * 70)
    passed_count = 0
    total_tests = 10

    # -------------------------------------------------------------
    # 1. Daily Battery Health Scoring
    # -------------------------------------------------------------
    print("\n[TEST 1] Daily Battery Health Scoring (Weighted Composite)...")
    res1 = EVBatteryHealthEngine.calculate_battery_health_score(
        soh_pct=92.0,
        capacity_fade_rate_90d=0.015,
        cell_voltage_balance_score=95.0,
        thermal_management_efficiency=90.0
    )
    # Expected: 92*0.40 (36.8) + (1-0.015)*100*0.30 (29.55) + 95*0.20 (19.0) + 90*0.10 (9.0) = 94.35 -> 94.4 (EXCELLENT)
    assert 'score' in res1, "Missing score in result"
    assert res1['status'] == 'EXCELLENT', f"Expected EXCELLENT status, got {res1['status']}"
    assert 'advisory' in res1, "Missing advisory"
    print(f" -> Score: {res1['score']}/100, Status: {res1['status']}")
    print(f" -> Advisory: {res1['advisory']}")
    passed_count += 1

    # -------------------------------------------------------------
    # 2. Personalized Range Prediction
    # -------------------------------------------------------------
    print("\n[TEST 2] Personalised Range Prediction Engine...")
    res2 = RangePredictionEngine.predict_personalized_range(
        battery_capacity_kwh=40.5,
        current_soc_pct=85.0,
        driver_profile='ECO',
        ambient_temp_c=26.0,
        terrain='FLAT',
        payload_kg=120.0,
        ac_active=False
    )
    assert 'estimated_range_km' in res2, "Missing estimated_range_km"
    assert res2['estimated_range_km'] > 200, f"Expected range > 200km for Eco, got {res2['estimated_range_km']}"
    assert res2['efficiency_km_per_kwh'] > 7.0, f"Expected efficiency > 7 km/kWh, got {res2['efficiency_km_per_kwh']}"
    print(f" -> Predicted Range: {res2['estimated_range_km']} km (Efficiency: {res2['efficiency_km_per_kwh']} km/kWh)")
    passed_count += 1

    # -------------------------------------------------------------
    # 3. Battery Degradation Forecasting (Weibull)
    # -------------------------------------------------------------
    print("\n[TEST 3] Battery Degradation Forecasting (Weibull 70% threshold)...")
    res3 = BatteryDegradationForecastingEngine.forecast_degradation(
        current_soh_pct=88.0,
        current_odometer_km=45000.0,
        annual_km=25000.0,
        pack_capacity_kwh=40.5
    )
    assert 'predicted_replacement_date' in res3, "Missing predicted replacement date"
    assert 'estimated_replacement_cost_inr' in res3, "Missing replacement cost"
    assert 'months_to_70pct_replacement' in res3, "Missing months_to_70pct_replacement"
    print(f" -> Replacement Horizon: {res3['months_to_70pct_replacement']} months (Target: {res3['predicted_replacement_date']})")
    print(f" -> Est Replacement Cost: INR {res3['estimated_replacement_cost_inr']}")
    passed_count += 1

    # -------------------------------------------------------------
    # 4. Charging Session Analytics
    # -------------------------------------------------------------
    print("\n[TEST 4] Charging Session Analytics & Optimal Window...")
    res4 = ChargingSessionAnalyticsEngine.analyze_session(
        energy_added_kwh=32.0,
        duration_minutes=48,
        charger_type='DC_FAST_CCS2',
        start_hour=23
    )
    assert 'charging_efficiency_pct' in res4, "Missing charging_efficiency_pct"
    assert 'rate_per_kwh_inr' in res4, "Missing rate_per_kwh_inr"
    assert res4['rate_per_kwh_inr'] == 5.20, f"Expected 5.20 INR/kWh off-peak, got {res4['rate_per_kwh_inr']}"
    print(f" -> Session Efficiency: {res4['charging_efficiency_pct']}%, Rate: INR {res4['rate_per_kwh_inr']}/kWh")
    print(f" -> Optimal Window: {res4['optimal_charging_window']}")
    passed_count += 1

    # -------------------------------------------------------------
    # 5. Range Anxiety Intervention
    # -------------------------------------------------------------
    print("\n[TEST 5] Range Anxiety Intervention (SOH < 80% / Low SOC)...")
    res5 = RangeAnxietyInterventionEngine.check_range_intervention(
        vehicle_reg='TN-09-EV-9999',
        soc_pct=17.5,
        soh_pct=78.0,
        current_lat=19.0760,
        current_lon=72.8777
    )
    assert res5['intervention_triggered'] is True, "Intervention should trigger for SOH < 80 and SOC < 20"
    assert len(res5['nearest_charging_stations']) == 3, f"Expected 3 nearest stations, got {len(res5['nearest_charging_stations'])}"
    assert 'whatsapp_message' in res5, "Missing WhatsApp preview"
    print(f" -> Intervention Triggered: {res5['intervention_triggered']}")
    print(f" -> Nearest Fast Charger: {res5['nearest_charging_stations'][0]['name']} ({res5['nearest_charging_stations'][0]['distance_km']} km away)")
    passed_count += 1

    # -------------------------------------------------------------
    # 6. Cell Imbalance Detection (96-Cell Series)
    # -------------------------------------------------------------
    print("\n[TEST 6] Cell Imbalance Anomaly Detection (96 Cells)...")
    test_voltages = [round(3.845 + (0.010 if i % 5 != 0 else -0.042), 3) for i in range(96)]
    res6 = CellImbalanceDetectionEngine.evaluate_cell_balance(test_voltages)
    assert res6['total_cells_monitored'] == 96, f"Expected 96 cells, got {res6['total_cells_monitored']}"
    assert 'cell_delta_mv' in res6, "Missing cell_delta_mv"
    assert res6['imbalance_severity'] in ['BALANCED', 'MILD_IMBALANCE', 'ELEVATED_WARNING', 'CRITICAL_WEAK_CELL'], "Invalid balance status"
    print(f" -> Cell Count: {res6['total_cells_monitored']}, Delta: {res6['cell_delta_mv']} mV (Min: {res6['min_cell_voltage_v']}V, Max: {res6['max_cell_voltage_v']}V)")
    print(f" -> Severity: {res6['imbalance_severity']}, Weakest Cell: #{res6['weakest_cell_number']}")
    passed_count += 1

    # -------------------------------------------------------------
    # 7. Thermal Management Alerts
    # -------------------------------------------------------------
    print("\n[TEST 7] Thermal Management Alerts & Prescriptive Advisories...")
    res7 = ThermalManagementAlertEngine.evaluate_thermal_safety(
        cell_temp_min_c=31.0,
        cell_temp_max_c=44.5,
        is_charging=True
    )
    assert res7['thermal_status'] == 'ELEVATED_TEMPERATURE', f"Expected ELEVATED_TEMPERATURE, got {res7['thermal_status']}"
    assert res7['alert_level'] == 'AMBER_WARNING', f"Expected AMBER_WARNING, got {res7['alert_level']}"
    print(f" -> Max Temp: {res7['cell_temp_max_c']} C, Status: {res7['thermal_status']}")
    print(f" -> Advisory: {res7['prescriptive_advisory']}")
    passed_count += 1


    # -------------------------------------------------------------
    # 8. EV TCO Calculator vs Diesel
    # -------------------------------------------------------------
    print("\n[TEST 8] EV Total Cost of Ownership (TCO) Calculator vs Diesel...")
    res8 = EVTCOCalculatorEngine.calculate_tco_comparison(
        annual_distance_km=30000.0,
        electricity_cost_per_kwh=8.0,
        diesel_cost_per_litre=94.0
    )
    assert 'ev_cost_per_km_inr' in res8, "Missing ev_cost_per_km_inr"
    assert 'diesel_cost_per_km_inr' in res8, "Missing diesel_cost_per_km_inr"
    assert res8['cost_savings_per_km_inr'] > 5.0, f"Expected savings > 5 INR/km, got {res8['cost_savings_per_km_inr']}"
    assert res8['three_year_fleet_roi_savings_inr'] > 500000.0, "Expected 3-yr savings > 5 Lakhs INR"
    print(f" -> EV Cost/km: INR {res8['ev_cost_per_km_inr']} vs Diesel: INR {res8['diesel_cost_per_km_inr']}")
    print(f" -> 3-Year Commercial Fleet Savings: INR {res8['three_year_fleet_roi_savings_inr']}, CO2 Averted: {res8['co2_emissions_averted_kg']} kg")
    passed_count += 1

    # -------------------------------------------------------------
    # 9. Battery Replacement Planning (4 Options)
    # -------------------------------------------------------------
    print("\n[TEST 9] Battery Replacement Planning & Workshop Options (70% SOH)...")
    res9 = BatteryReplacementPlanningEngine.get_replacement_options(
        vehicle_id='VEH-EV-TEST-10',
        soh_pct=69.0
    )
    assert res9['replacement_urgency'] == 'URGENT_ACTION_REQUIRED', "Expected URGENT_ACTION_REQUIRED for SOH < 70"
    assert len(res9['available_options']) == 4, f"Expected 4 options, got {len(res9['available_options'])}"
    option_ids = [opt['option_id'] for opt in res9['available_options']]
    assert 'OEM_NEW_PACK' in option_ids and 'CERTIFIED_REFURB' in option_ids and 'CELL_RECONDITION' in option_ids and 'TRADE_IN_UPGRADE' in option_ids
    print(f" -> Urgency: {res9['replacement_urgency']}")
    for opt in res9['available_options']:
        print(f"    - [{opt['option_id']}] {opt['title']} (INR {opt['cost_estimate_inr']})")
    passed_count += 1

    # -------------------------------------------------------------
    # 10. OEM BMS API Integration
    # -------------------------------------------------------------
    print("\n[TEST 10] OEM BMS API Integration (Tata / Ather / OLA / Mahindra)...")
    for oem in OEMBMSAPIEngine.SUPPORTED_OEMS:
        res10 = OEMBMSAPIEngine.query_oem_bms_telemetry(oem_name=oem, vin='VIN-EV-TEST-99')
        assert res10['api_connection_status'] == 'AUTHENTICATED_ONLINE'
        assert res10['bms_firmware_version'] is not None
        assert 'telemetry_stream' in res10
    print(f" -> Successfully verified connectors for all {len(OEMBMSAPIEngine.SUPPORTED_OEMS)} OEMs: {', '.join(OEMBMSAPIEngine.SUPPORTED_OEMS)}")
    passed_count += 1

    # -------------------------------------------------------------
    # Summary
    # -------------------------------------------------------------
    print("\n" + "=" * 70)
    print(f"SECTION 10 EV INTELLIGENCE PLATFORM TEST RESULT: {passed_count}/{total_tests} PASSED (100%)")
    print("=" * 70)
    return passed_count == total_tests


if __name__ == '__main__':
    success = run_tests()
    sys.exit(0 if success else 1)
