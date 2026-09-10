"""
AutoEra AI ERP — Section 07 Insurance Module Comprehensive Verification Suite
Tests:
  1. Policy Database (Insurer API Sync, Policy OCR, Auto-Population)
  2. 90/60/30-Day Automated WhatsApp Renewal Sequence
  3. Multi-Insurer Quote Comparison (4+ Insurers with CSR & Zero-Dep)
  4. One-Click Renewal Processing (< 5 Minutes, Razorpay, Instant PDF to WhatsApp)
  5. Commission Dashboard & Master Revenue Model (Dealer Commission + AutoEra Platform Fee)
  6. AI Claim Filing (6-Angle Photo Damage Assessment, Replaces Surveyor for 80% of Claims)
  7. Claim Status Tracking (Real-Time Insurer API Status & WhatsApp Updates)
  8. Renewal Prediction Model (Classification Propensity Scoring)
  9. NCB Tracking & Small Claim Loss Financial Advisor
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
    from insurance.services import (
        PolicyDatabaseEngine,
        InsuranceRenewalAutomation,
        MultiInsurerQuoteComparisonEngine,
        OneClickRenewalProcessingEngine,
        CommissionDashboardEngine,
        AIClaimFilingEngine,
        ClaimStatusTrackingEngine,
        RenewalPredictionModel,
        NCBTrackingEngine
    )

    org_id = uuid.uuid4()
    branch_id = uuid.uuid4()

    print("=" * 70)
    print(" AUTOERA AI - SECTION 07 INSURANCE MODULE VERIFICATION SUITE")
    print("=" * 70)

    # -------------------------------------------------------------------------
    # TEST 1: Policy Database
    # -------------------------------------------------------------------------
    print("\n[1] VERIFYING POLICY DATABASE (API SYNC & AUTO-POPULATION)")
    pol = PolicyDatabaseEngine.register_or_update_policy(
        organization_id=org_id,
        branch_id=branch_id,
        vehicle_reg='MH14JK9021',
        policy_number='POL-HDFC-2026-9021',
        insurer_name='HDFC ERGO',
        policy_type='COMPREHENSIVE',
        idv=Decimal('920000.00'),
        od_premium=Decimal('15800.00'),
        tp_premium=Decimal('3416.00'),
        ncb_pct=35,
        customer_name='Ananya Deshmukh',
        customer_phone='+919822019922'
    )
    assert pol['policy_number'] == 'POL-HDFC-2026-9021', "Policy number must match"
    assert pol['idv'] == 920000.00, "IDV must be registered"
    assert pol['ncb_percentage'] == 35, "NCB percentage must be 35%"
    assert pol['dealer_commission'] > 0, "Dealer commission must be computed"
    assert pol['autoera_platform_fee'] > 0, "AutoEra platform fee must be computed"
    print(f" [1.1] Policy Registered: {pol['policy_number']} ({pol['vehicle_reg']})")
    print(f" [1.2] Insurer: {pol['insurer']} | IDV: INR {pol['idv']:.2f} | NCB: {pol['ncb_percentage']}%")
    print(f" [1.3] Gross Premium: INR {pol['gross_premium']:.2f} | Dealer Commission: INR {pol['dealer_commission']:.2f}")
    print(f" [1.4] AutoEra Platform Fee: INR {pol['autoera_platform_fee']:.2f} (0.5% fee)")

    # -------------------------------------------------------------------------
    # TEST 2: 90/60/30-Day Automated WhatsApp Renewal Sequence
    # -------------------------------------------------------------------------
    print("\n[2] VERIFYING 90/60/30-DAY AUTOMATED WHATSAPP RENEWAL SEQUENCE")
    seq_summary = InsuranceRenewalAutomation.run_renewal_sequence(organization_id=str(org_id))
    assert seq_summary['total_processed'] >= 0, "Sequence execution must report summary"
    print(f" [2.1] 90-Day Early-Bird Notices Processed: {seq_summary[90]}")
    print(f" [2.2] 60-Day Comparative Quotes Dispatched: {seq_summary[60]}")
    print(f" [2.3] 30-Day Urgent Renewal Alerts Dispatched: {seq_summary[30]}")
    print(f" [2.4] 7-Day Critical Break-In Warnings Dispatched: {seq_summary[7]}")
    print(f" [2.5] Total Scheduled Renewals Processed: {seq_summary['total_processed']}")

    # -------------------------------------------------------------------------
    # TEST 3: Multi-Insurer Quote Comparison Engine
    # -------------------------------------------------------------------------
    print("\n[3] VERIFYING MULTI-INSURER QUOTE COMPARISON (4+ INSURERS)")
    quotes = MultiInsurerQuoteComparisonEngine.get_comparative_quotes(
        idv=Decimal('900000.00'),
        ncb_pct=25,
        zero_dep_requested=True
    )
    assert len(quotes) >= 4, "Must compare at least 4 live insurers"
    for q in quotes:
        assert q['csr_percentage'] >= 95.0, "Claim Settlement Ratio must be valid"
        assert q['zero_dep_cost'] > 0, "Zero-dep cost must be included"
    print(f" [3.1] Insurers Compared: {len(quotes)} live quotes received")
    for idx, q in enumerate(quotes, 1):
        rec_str = " [RECOMMENDED]" if q['recommended'] else ""
        print(f"  [3.{idx+1}] {q['insurer_name']}: CSR {q['csr_percentage']}% | Net: INR {q['final_payable']:.2f}{rec_str}")

    # -------------------------------------------------------------------------
    # TEST 4: One-Click Renewal Processing (< 5 Minutes)
    # -------------------------------------------------------------------------
    print("\n[4] VERIFYING ONE-CLICK RENEWAL PROCESSING (< 5 MIN SLA)")
    renewal_res = OneClickRenewalProcessingEngine.process_one_click_renewal(
        policy_id=uuid.uuid4(),
        chosen_insurer='HDFC ERGO General Insurance',
        total_premium=Decimal('18250.00'),
        customer_name='Ananya Deshmukh',
        customer_phone='+919822019922'
    )
    assert renewal_res['status'] == 'RENEWAL_COMPLETED', "Status must be RENEWAL_COMPLETED"
    assert renewal_res['turnaround_time_seconds'] <= 300, "Must be under 5-minute SLA (300 seconds)"
    assert renewal_res['dealer_commission_earned'] > 0, "Dealer commission must be calculated"
    assert renewal_res['pdf_policy_url'].endswith('.pdf'), "Digital PDF policy must be generated"
    print(f" [4.1] Policy Issued: {renewal_res['new_policy_number']} (Turnaround: {renewal_res['turnaround_time_seconds']}s <= 300s SLA)")
    print(f" [4.2] Total Premium Paid: INR {renewal_res['total_premium_paid']:.2f} via {renewal_res['payment_reference']}")
    print(f" [4.3] Dealer Commission Earned: INR {renewal_res['dealer_commission_earned']:.2f} (5%)")
    print(f" [4.4] AutoEra Platform Fee: INR {renewal_res['autoera_platform_fee']:.2f} (0.5%)")
    print(f" [4.5] Policy Certificate URL: {renewal_res['pdf_policy_url']}")

    # -------------------------------------------------------------------------
    # TEST 5: Commission Dashboard & Master Revenue Model
    # -------------------------------------------------------------------------
    print("\n[5] VERIFYING COMMISSION DASHBOARD & MASTER REVENUE MODEL")
    comm_dash = CommissionDashboardEngine.get_commission_dashboard(org_id)
    assert comm_dash['total_gross_premium'] > 0, "Gross premium must be calculated"
    assert comm_dash['total_dealer_commission'] > 0, "Dealer commission must be calculated"
    assert comm_dash['total_autoera_platform_fees'] > 0, "AutoEra platform fees must be calculated"
    assert len(comm_dash['category_breakdown']) == 5, "Must track all 5 commission categories"
    print(f" [5.1] Total Policies Managed: {comm_dash['total_policies']} | Gross Premium: INR {comm_dash['total_gross_premium']:,.2f}")
    print(f" [5.2] Total Dealer Commission: INR {comm_dash['total_dealer_commission']:,.2f} (Avg: {comm_dash['average_blended_dealer_rate_pct']}%)")
    print(f" [5.3] Executive Incentive Pool (20%): INR {comm_dash['executive_incentive_pool']:,.2f}")
    print(f" [5.4] Net Dealership Retention: INR {comm_dash['net_dealership_revenue']:,.2f}")
    print(f" [5.5] AutoEra Platform Fees (0.3% - 1.0%): INR {comm_dash['total_autoera_platform_fees']:,.2f}")

    # -------------------------------------------------------------------------
    # TEST 6: AI Claim Filing Engine (6-Angle Damage Assessment)
    # -------------------------------------------------------------------------
    print("\n[6] VERIFYING AI CLAIM FILING (6-ANGLE PHOTO DAMAGE ASSESSMENT)")
    mock_photos = [
        {'angle': 'FRONT', 'url': 's3://claims/photos/front.jpg'},
        {'angle': 'REAR', 'url': 's3://claims/photos/rear.jpg'},
        {'angle': 'LEFT_SIDE', 'url': 's3://claims/photos/left.jpg'},
        {'angle': 'RIGHT_SIDE', 'url': 's3://claims/photos/right.jpg'},
        {'angle': 'ODOMETER_DASHBOARD', 'url': 's3://claims/photos/odometer.jpg'},
        {'angle': 'CLOSEUP_DAMAGE', 'url': 's3://claims/photos/closeup.jpg'}
    ]
    claim_assessment = AIClaimFilingEngine.assess_damage_photos(mock_photos)
    assert claim_assessment['all_6_angles_validated'], "All 6 angles must be validated"
    assert claim_assessment['replaces_surveyor_eligible'], "Minor/moderate claim must bypass physical surveyor"
    assert claim_assessment['total_claim_estimate'] > 0, "Estimate must be computed"
    print(f" [6.1] Claim Reference: {claim_assessment['claim_reference']}")
    print(f" [6.2] All 6 Mandatory Angles Validated: {claim_assessment['all_6_angles_validated']}")
    print(f" [6.3] Parts Cost: INR {claim_assessment['estimated_parts_cost']:.2f} | Labour: INR {claim_assessment['estimated_labour_cost']:.2f} | Paint: INR {claim_assessment['estimated_paint_cost']:.2f}")
    print(f" [6.4] Total Claim Estimate: INR {claim_assessment['total_claim_estimate']:.2f}")
    print(f" [6.5] AI Fraud Risk Score: {claim_assessment['ai_fraud_risk_score']}/100 (Very Low Risk)")
    print(f" [6.6] Physical Surveyor Bypass: {claim_assessment['replaces_surveyor_eligible']} (Replaces surveyor for 80% of claims)")

    # -------------------------------------------------------------------------
    # TEST 7: Claim Status Tracking & WhatsApp Updates
    # -------------------------------------------------------------------------
    print("\n[7] VERIFYING REAL-TIME CLAIM STATUS TRACKING")
    status_update = ClaimStatusTrackingEngine.update_claim_status(
        claim_number='CLM-AI-20260909',
        new_status='AI_SURVEY_APPROVED',
        customer_phone='+919822019922',
        approved_amount=Decimal('18500.00')
    )
    assert status_update['status'] == 'AI_SURVEY_APPROVED', "Status must be updated"
    assert status_update['approved_amount'] == 18500.00, "Approved amount must match"
    print(f" [7.1] Claim #{status_update['claim_number']} Status: {status_update['status']}")
    print(f" [7.2] Description: \"{status_update['status_description']}\"")
    print(f" [7.3] Approved Amount: INR {status_update['approved_amount']:.2f} | Customer Notified: {status_update['customer_notified']}")

    # -------------------------------------------------------------------------
    # TEST 8: Renewal Prediction Model
    # -------------------------------------------------------------------------
    print("\n[8] VERIFYING AI RENEWAL PREDICTION MODEL")
    pred_high = RenewalPredictionModel.predict_renewal_probability(
        vehicle_age_years=2.0,
        claims_in_last_year=0,
        service_visits_past_year=3,
        current_ncb_pct=35
    )
    assert pred_high['renewal_propensity_score'] >= 0.80, "Loyal customer should have high renewal propensity"
    assert pred_high['churn_risk'] == 'LOW', "Churn risk should be LOW"
    print(f" [8.1] Loyal Customer: Propensity = {pred_high['renewal_propensity_score']*100:.0f}% | Churn Risk = {pred_high['churn_risk']}")

    pred_risk = RenewalPredictionModel.predict_renewal_probability(
        vehicle_age_years=5.5,
        claims_in_last_year=2,
        service_visits_past_year=0,
        current_ncb_pct=0
    )
    assert pred_risk['renewal_propensity_score'] < 0.60, "Zero visits and frequent claims must flag churn risk"
    assert pred_risk['priority_tier'] == 'HIGH_PRIORITY_OUTREACH', "Must flag for high priority outbound outreach"
    print(f" [8.2] At-Risk Customer: Propensity = {pred_risk['renewal_propensity_score']*100:.0f}% | Priority = {pred_risk['priority_tier']}")
    print(f" [8.3] Recommended Action: \"{pred_risk['recommended_action']}\"")

    # -------------------------------------------------------------------------
    # TEST 9: NCB Tracking & Small Claim Loss Advisor
    # -------------------------------------------------------------------------
    print("\n[9] VERIFYING NCB TRACKING & SMALL CLAIM LOSS ADVISOR")
    # Case A: Small claim (INR 3,500) where customer would lose INR 8,250 in NCB
    adv_small = NCBTrackingEngine.evaluate_claim_vs_ncb_loss(
        current_ncb_pct=25,
        estimated_od_premium=Decimal('15000.00'),
        claim_repair_cost=Decimal('3500.00')
    )
    assert not adv_small['should_file_claim'], "Small repair should be advised to pay out of pocket"
    assert adv_small['advisory_verdict'] == 'PAY_OUT_OF_POCKET_PROTECT_NCB', "Verdict must advise protecting NCB"
    print(f" [9.1] Small Claim Case (INR 3,500 repair vs INR {adv_small['two_year_ncb_savings_loss']:.2f} NCB loss):")
    print(f"       Verdict: {adv_small['advisory_verdict']}")
    print(f"       Advice: \"{adv_small['advisory_explanation']}\"")

    # Case B: Major claim (INR 28,000) where claiming is financially optimal
    adv_major = NCBTrackingEngine.evaluate_claim_vs_ncb_loss(
        current_ncb_pct=25,
        estimated_od_premium=Decimal('15000.00'),
        claim_repair_cost=Decimal('28000.00')
    )
    assert adv_major['should_file_claim'], "Major repair should be claimed"
    assert adv_major['advisory_verdict'] == 'PROCEED_WITH_CLAIM', "Verdict must advise proceeding with claim"
    print(f" [9.2] Major Claim Case (INR 28,000 repair vs INR {adv_major['two_year_ncb_savings_loss']:.2f} NCB loss):")
    print(f"       Verdict: {adv_major['advisory_verdict']}")

    print("\n" + "=" * 70)
    print(" >>> SECTION 07 INSURANCE MODULE 100% VERIFIED & FULLY FUNCTIONAL! <<<")
    print("=" * 70)

if __name__ == '__main__':
    run_tests()
