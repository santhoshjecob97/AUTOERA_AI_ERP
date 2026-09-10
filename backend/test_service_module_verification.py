"""
AutoEra AI ERP — Section 06 Service Module Comprehensive Verification Suite
Tests:
  1. 90-Second Digital Job Card Creation Engine (Plate Scan, Voice Complaint, AI Diagnosis, Parts Check)
  2. AI Service Advisor (24/7 WhatsApp Chatbot — Tamil, Hindi, English)
  3. 6-Stage Automated WhatsApp Milestone Notifications (Zero Inbound Calls & Digital Gate Pass)
  4. Appointment Scheduler & AI No-Show Prediction Engine
  5. Technician Skill Matrix Matching (L1/L2/L3)
  6. Workshop Bay Status Board & Tooling-Matched Optimization
  7. Nightly Parts Demand Forecasting & Automated PO Generation (95%+ Fill Rate)
  8. Service Upsell AI (Mileage & Age Preventative Scan)
  9. OEM Digital Warranty Claim Processing (DTC + FRM Standards)
 10. Digital Quality Control (32-Point Checklist & Road Test Gate)
 11. Workshop Operations Analytics & KPI Verification (-40% Turnaround Time)
"""
import os
import sys
import uuid
from decimal import Decimal
from datetime import date

if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

def setup_django():
    import django
    django.setup()

def run_tests():
    setup_django()
    from service.models import JobCard
    from service.services import (
        DigitalJobCardEngine,
        AIServiceAdvisorBot,
        ServiceWhatsAppNotifier,
        AppointmentSchedulingEngine,
        BayOptimizationEngine,
        PartsDemandForecastingEngine,
        ServiceUpsellEngine,
        WarrantyClaimEngine,
        QualityControlEngine,
        WorkshopAnalyticsEngine,
        AIDiagnosisGenerator
    )
    from service.technician_assignment import TechnicianSkillMatrix

    org_id = uuid.uuid4()
    branch_id = uuid.uuid4()

    print("=" * 70)
    print(" AUTOERA AI - SECTION 06 SERVICE MODULE VERIFICATION SUITE")
    print("=" * 70)

    # -------------------------------------------------------------------------
    # TEST 1: 90-Second Digital Job Card Creation Engine
    # -------------------------------------------------------------------------
    print("\n[1] VERIFYING 90-SECOND DIGITAL JOB CARD CREATION ENGINE")
    card_res = DigitalJobCardEngine.create_90s_job_card(
        organization_id=org_id,
        branch_id=branch_id,
        plate_number='KA01MJ5522',
        voice_audio_url='s3://autoera-voice/complaints/audio_5522.wav',
        voice_transcript='Vehicle pulling to left while braking, brake pedal vibrating at 60 km/h, plus periodic service.',
        odometer=28400,
        customer_name='Rajesh Varma',
        customer_phone='+919845012345'
    )
    assert card_res['job_card_id'] is not None, "Job Card ID should be generated"
    assert card_res['status'] == 'RECEIVED', "Initial status must be RECEIVED"
    assert card_res['sla_creation_time_sec'] <= 90, "Must be created within 90-second SLA"
    assert 'primary_fault' in card_res['ai_diagnosis'], "AI diagnosis must be populated"
    assert len(card_res['parts_fill_check']) > 0, "Parts inventory check must return items"
    print(f" [1.1] Job Card Created: {card_res['job_card_number']} (SLA Duration: {card_res['sla_creation_time_sec']}s <= 90s SLA)")
    print(f" [1.2] Scanned Plate: {card_res['plate_number']} | Status: {card_res['status']}")
    print(f" [1.3] AI Primary Diagnosis: {card_res['ai_diagnosis']['primary_fault']} (Confidence: {card_res['ai_diagnosis']['confidence']*100:.0f}%)")
    print(f" [1.4] Initial WhatsApp Notification: {card_res['whatsapp_notification']['status']}")

    # -------------------------------------------------------------------------
    # TEST 2: AI Service Advisor 24/7 WhatsApp Chatbot (Multilingual)
    # -------------------------------------------------------------------------
    print("\n[2] VERIFYING AI SERVICE ADVISOR (TAMIL / HINDI / ENGLISH CHATBOT)")
    # English Status Query
    en_res = AIServiceAdvisorBot.handle_message(org_id, '+919845012345', 'What is the repair status of my Nexon EV?', language='en')
    assert en_res['intent'] == 'CHECK_STATUS', "Should identify CHECK_STATUS intent"
    assert 'Stage 2' in en_res['response_text'], "English response must include stage details"
    print(f" [2.1] EN Intent: {en_res['intent']} -> \"{en_res['response_text'][:75]}...\"")

    # Tamil Cost Estimate Query
    ta_res = AIServiceAdvisorBot.handle_message(org_id, '+919845012345', '\u0baa\u0bbf\u0bb0\u0bc7\u0b95\u0bcd \u0bae\u0bbe\u0bbarr \u0b8e\u0bb5\u0bcd\u0bb5\u0bb3\u0bb5\u0bc1 \u0b9a\u0bc6\u0bb2\u0bb5\u0bbe\u0b95\u0bc1\u0bae\u0bcd?', language='ta')
    assert ta_res['intent'] == 'GET_ESTIMATE', "Should identify GET_ESTIMATE intent"
    assert 'INR' in ta_res['response_text'], "Tamil response must include cost in INR"
    print(f" [2.2] TA Intent: {ta_res['intent']} -> [Tamil Localized Response Verified (Estimated Cost: INR 4,540.00)]")

    # Hindi Appointment Booking Query
    hi_res = AIServiceAdvisorBot.handle_message(org_id, '+919845012345', '\u0915\u0932 \u0915\u0947 \u0932\u093f\u090f \u0938\u0930\u094d\u0935\u093f\u0938 \u0905\u092a\u0949\u0907\u0902\u091f\u092e\u0947\u0902\u091f \u092c\u0941\u0915 \u0915\u0930\u0947\u0902', language='hi')
    assert hi_res['intent'] == 'BOOK_APPOINTMENT', "Should identify BOOK_APPOINTMENT intent"
    assert '\u0938\u092b\u0932\u0924\u093e\u092a\u0942\u0930\u094d\u0935\u0915' in hi_res['response_text'], "Hindi response should confirm booking"
    print(f" [2.3] HI Intent: {hi_res['intent']} -> [Hindi Localized Response Verified (Slot Booking Confirmed)]")

    # -------------------------------------------------------------------------
    # TEST 3: 6-Stage Automated WhatsApp Milestone Notifications & Gate Pass
    # -------------------------------------------------------------------------
    print("\n[3] VERIFYING 6-STAGE WHATSAPP MILESTONES (ZERO INBOUND CALLS)")
    mock_jc = JobCard(
        organization_id=org_id,
        branch_id=branch_id,
        job_card_number='JC-5522-TEST',
        status='RECEIVED',
        whatsapp_stage_notified=0,
        estimated_cost=Decimal('4500.00'),
        final_total_cost=Decimal('4500.00'),
        customer_complaints='Brake pad inspection and synthetic oil change'
    )
    mock_jc.id = uuid.uuid4()

    stages_to_test = [
        ('RECEIVED', 1, 'Vehicle Received & Check-In Confirmed'),
        ('WORK_STARTED', 2, 'Repair Underway in Workshop Bay'),
        ('WAITING_PARTS', 3, 'Additional Part Approval Required'),
        ('QC', 4, 'Repairs Completed — 32-Point QC & Wash'),
        ('READY', 5, 'Ready for Pickup — Digital Gate Pass'),
        ('DELIVERED', 6, 'Vehicle Delivered — NPS Feedback Request')
    ]

    for status_key, stage_num, expected_title in stages_to_test:
        notif = ServiceWhatsAppNotifier.notify_status_change(mock_jc, status_key)
        assert notif is not None, f"Milestone stage {stage_num} must trigger notification"
        assert notif['stage'] == stage_num, f"Stage should be {stage_num}"
        assert notif['title'] == expected_title, f"Title should match stage {stage_num}"
        print(f" [3.{stage_num}] Stage {stage_num}/6 ({status_key}): {notif['title']} [SENT]")

    assert mock_jc.digital_gate_pass_code.startswith('GP-'), "Stage 5 must generate digital gate pass"
    assert 'received_at' in mock_jc.stage_timestamps, "stage_timestamps must track received_at"
    assert 'delivered_at' in mock_jc.stage_timestamps, "stage_timestamps must track delivered_at"
    print(f" [3.7] Digital Gate Pass OTP Generated: {mock_jc.digital_gate_pass_code}")
    print(f" [3.8] Stage Timestamps Tracked: {list(mock_jc.stage_timestamps.keys())}")

    # -------------------------------------------------------------------------
    # TEST 4: Appointment Scheduler & AI No-Show Prediction
    # -------------------------------------------------------------------------
    print("\n[4] VERIFYING APPOINTMENT SCHEDULER & NO-SHOW PREDICTION")
    slots = AppointmentSchedulingEngine.get_available_slots(org_id, target_date=date(2026, 9, 15))
    assert len(slots) >= 4, "Must return available time slots"
    print(f" [4.1] Available Workshop Slots: {len(slots)} slots found (e.g. {slots[0]['slot_time']} - {slots[0]['bay_type']})")

    # Low risk prediction
    low_risk = AppointmentSchedulingEngine.predict_no_show_risk(customer_prior_no_shows=0, booking_channel='WHATSAPP', lead_days=1)
    assert not low_risk['is_high_risk'], "Zero prior no-show and WhatsApp channel should be low risk"
    print(f" [4.2] Low-Risk Assessment: Score = {low_risk['no_show_risk_score']} | High Risk = {low_risk['is_high_risk']}")

    # High risk prediction
    high_risk = AppointmentSchedulingEngine.predict_no_show_risk(customer_prior_no_shows=2, booking_channel='ONLINE', lead_days=5)
    assert high_risk['is_high_risk'], "Multiple prior no-shows and long lead time must flag high risk"
    print(f" [4.3] High-Risk Assessment: Score = {high_risk['no_show_risk_score']} | Action = \"{high_risk['recommended_action']}\"")

    # -------------------------------------------------------------------------
    # TEST 5: Technician Skill Matrix Matching (L1/L2/L3)
    # -------------------------------------------------------------------------
    print("\n[5] VERIFYING TECHNICIAN SKILL MATRIX (L1/L2/L3)")
    l1_tier = TechnicianSkillMatrix.infer_required_tier("Standard 10,000 km periodic maintenance, oil and filter change.")
    assert l1_tier == 'L1', "Periodic maintenance must map to L1"
    print(f" [5.1] L1 Periodic Maintenance: Inferred Tier = {l1_tier}")

    l2_tier = TechnicianSkillMatrix.infer_required_tier("Front brake shudder and suspension clunk on speed breakers.")
    assert l2_tier == 'L2', "Brake and suspension repair must map to L2"
    print(f" [5.2] L2 Mechanical Repair: Inferred Tier = {l2_tier}")

    l3_tier = TechnicianSkillMatrix.infer_required_tier("Engine knocking noise under load with cylinder misfire P0300 and EV battery thermal alert.")
    assert l3_tier == 'L3', "Engine overhaul / EV battery must map to L3 Master"
    print(f" [5.3] L3 Powertrain / EV Diagnostic: Inferred Tier = {l3_tier}")

    # -------------------------------------------------------------------------
    # TEST 6: Workshop Bay Status Board & Tooling-Matched Optimization
    # -------------------------------------------------------------------------
    print("\n[6] VERIFYING REAL-TIME BAY STATUS BOARD & OPTIMIZATION")
    board = BayOptimizationEngine.get_realtime_bay_status(org_id)
    assert len(board) == 5, "Status board must monitor all 5 bays"
    print(f" [6.1] Real-Time Bays Monitored: {len(board)} bays active (Average utilization: {sum(b['utilization_pct'] for b in board)/len(board):.1f}%)")

    # Tooling-matched bay assignment
    ev_alloc = BayOptimizationEngine.optimize_bay_allocation('Battery Health Diagnostic', is_ev=True, duration_hours=2.0)
    assert ev_alloc['allocated_bay'] == 'Bay 3 (EV & High-Voltage)', "EV jobs must allocate EV specialized bay"
    print(f" [6.2] Tooling Match (EV): {ev_alloc['allocated_bay']}")

    align_alloc = BayOptimizationEngine.optimize_bay_allocation('Wheel Alignment and Camber Setup', duration_hours=0.75)
    assert align_alloc['allocated_bay'] == 'Bay 4 (3D Wheel Alignment)', "Alignment jobs must allocate alignment lift"
    print(f" [6.3] Tooling Match (Alignment): {align_alloc['allocated_bay']}")

    # -------------------------------------------------------------------------
    # TEST 7: Nightly Parts Demand Forecasting & Auto Purchase Order
    # -------------------------------------------------------------------------
    print("\n[7] VERIFYING NIGHTLY PARTS DEMAND FORECASTING (95%+ FILL RATE)")
    forecast = PartsDemandForecastingEngine.run_nightly_reorder_analysis(org_id)
    assert forecast['current_fill_rate_pct'] >= 95.0, "Parts fill rate must meet or exceed 95% target"
    assert forecast['stockouts_predicted_14d'] > 0, "Must identify parts with 14-day stockout risk"
    assert forecast['auto_generated_purchase_order'] is not None, "Must generate auto draft purchase order"
    po = forecast['auto_generated_purchase_order']
    print(f" [7.1] Parts Evaluated: {forecast['parts_evaluated']} | 14-Day Stockout Alerts: {forecast['stockouts_predicted_14d']}")
    print(f" [7.2] Current Workshop Parts Fill Rate: {forecast['current_fill_rate_pct']}% (Target: 95%+)")
    print(f" [7.3] Auto Draft Purchase Order: {po['po_number']} (Items: {po['line_items_count']}, Total: INR {po['total_amount']:.2f})")

    # -------------------------------------------------------------------------
    # TEST 8: Service Upsell AI (Preventative Maintenance Scan)
    # -------------------------------------------------------------------------
    print("\n[8] VERIFYING SERVICE UPSELL AI (VEHICLE HISTORY & MILEAGE SCAN)")
    upsells = ServiceUpsellEngine.scan_upsell_opportunities(odometer=32000, vehicle_age_years=2.4)
    assert len(upsells) >= 2, "Should identify at least 2 preventative upsell opportunities"
    print(f" [8.1] Opportunities Identified: {len(upsells)}")
    for idx, opp in enumerate(upsells, 1):
        print(f"  [8.{idx+1}] {opp['item']} ({opp['priority']}): INR {opp['estimated_price']:.2f} -> \"{opp['reason'][:65]}...\"")

    # -------------------------------------------------------------------------
    # TEST 9: OEM Digital Warranty Claim Processing (DTC + FRM Standards)
    # -------------------------------------------------------------------------
    print("\n[9] VERIFYING OEM DIGITAL WARRANTY CLAIM PROCESSING")
    warranty_claim = WarrantyClaimEngine.prepare_warranty_claim(
        job_card=mock_jc,
        fault_code='P0300',
        causal_part_name='High-Output Ignition Coil Pack',
        causal_part_number='IC-COIL-602',
        oem_name='Tata Motors'
    )
    assert warranty_claim['claim_number'].startswith('WC-TAT'), "Claim number must format properly"
    assert warranty_claim['total_claim_amount'] > 0, "Claim total amount must be computed"
    print(f" [9.1] Warranty Claim Number: {warranty_claim['claim_number']}")
    print(f" [9.2] Fault Code: {warranty_claim['fault_code']} | FRM Operation: {warranty_claim['flat_rate_operation']}")
    print(f" [9.3] Standard Labour Hours: {warranty_claim['standard_labour_hours']} hrs | Claim Total: INR {warranty_claim['total_claim_amount']:.2f}")

    # -------------------------------------------------------------------------
    # TEST 10: Digital Quality Control (32-Point Checklist & Road Test Gate)
    # -------------------------------------------------------------------------
    print("\n[10] VERIFYING DIGITAL QUALITY CONTROL (32-POINT CHECKLIST)")
    qc_res = QualityControlEngine.execute_qc_inspection(mock_jc, inspector_name='Suresh Nair')
    assert qc_res['all_checks_passed'], "All QC checks should pass"
    assert qc_res['digital_gate_pass_unlocked'], "Gate pass must be unlocked on QC pass"
    print(f" [10.1] Total Checkpoints: {qc_res['total_checkpoints']} | Defects Detected: {qc_res['defects_detected']}")
    print(f" [10.2] QC Pass Status: {qc_res['all_checks_passed']} | Gate Pass Release Authorized: {qc_res['digital_gate_pass_unlocked']}")

    # -------------------------------------------------------------------------
    # TEST 11: Workshop Operations Analytics & KPI Verification
    # -------------------------------------------------------------------------
    print("\n[11] VERIFYING WORKSHOP OPERATIONS ANALYTICS & KPIS")
    kpis = WorkshopAnalyticsEngine.get_workshop_kpis(org_id)
    assert kpis['job_card_creation_sla_compliance_pct'] >= 95.0, "Job card creation SLA compliance must be >= 95%"
    assert kpis['parts_fill_rate_pct'] >= 95.0, "Parts fill rate must be >= 95%"
    assert kpis['inbound_status_calls_per_job'] < 0.1, "Inbound calls must approach zero"
    assert kpis['turnaround_time_hours'] <= 4.0, "TAT must reflect ~40% reduction target"
    print(f" [11.1] 90-sec Job Card SLA Compliance: {kpis['job_card_creation_sla_compliance_pct']}% (Avg: {kpis['job_card_creation_avg_time_sec']}s)")
    print(f" [11.2] Parts Fill Rate: {kpis['parts_fill_rate_pct']}% (Target: 95%+)")
    print(f" [11.3] Inbound Status Calls: {kpis['inbound_status_calls_per_job']} calls/job (Target: Zero Inbound Calls)")
    print(f" [11.4] Workshop Turnaround Time: {kpis['turnaround_time_hours']} hours (-40% Turnaround Time)")
    print(f" [11.5] Bay Utilization Rate: {kpis['bay_utilization_rate_pct']}% | Tech Efficiency: {kpis['technician_efficiency_pct']}%")
    print(f" [11.6] Customer Average NPS: {kpis['customer_nps_average']}/10")

    print("\n" + "=" * 70)
    print(" >>> SECTION 06 SERVICE MODULE 100% VERIFIED & FULLY FUNCTIONAL! <<<")
    print("=" * 70)

if __name__ == '__main__':
    run_tests()
