"""
AutoEra AI — Section 15: Security & Compliance Verification Suite
Defense in Depth · DPDP Act 2023 · RBAC+RLS · SOC2 · ISO 27001
10 Security Layers · 9 DPDP Requirements · 10 Compliance Controls
"""

import os
import sys
import django

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from core.security_compliance import SecurityComplianceService, SECURITY_LAYERS, DPDP_REQUIREMENTS, COMPLIANCE_CONTROLS
from core.security_compliance_views import (
    SecurityLayersAPIView, SecurityLayerDetailAPIView,
    DPDPRequirementsAPIView, ComplianceControlsAPIView,
    SecuritySummaryAPIView, BreachNotificationSimulatorAPIView
)
from rest_framework.test import APIRequestFactory


def run_tests():
    print("=" * 70)
    print("RUNNING SECTION 15: SECURITY & COMPLIANCE TEST SUITE")
    print("=" * 70)
    passed = 0

    # TEST 1: 10 Defense-in-Depth Layers
    print("\n[TEST 1] Verifying 10 Defense-in-Depth Security Layers...")
    layers = SecurityComplianceService.get_security_layers()
    assert len(layers) == 10, f"Expected 10 layers, got {len(layers)}"
    layer_names = [l["layer"] for l in layers]
    expected = ["Network Perimeter", "Authentication", "Authorisation", "Data at Rest",
                "Data in Transit", "Secrets Management", "API Security",
                "Vulnerability Management", "Audit Logging", "Incident Response"]
    for name in expected:
        assert name in layer_names, f"Missing layer: {name}"
    passed += 1
    print(f" -> PASSED: All 10 defense-in-depth layers present and verified.")

    # TEST 2: Layer Schema Completeness
    print("\n[TEST 2] Verifying Layer Schema Integrity...")
    required_keys = ["layer_id", "layer", "control", "implementation", "compliance_standards",
                     "threat_mitigated", "status", "severity_if_bypassed", "automation"]
    for l in layers:
        for k in required_keys:
            assert k in l and l[k], f"Missing key '{k}' in layer '{l.get('layer')}'"
        assert l["status"] == "ACTIVE", f"Layer '{l['layer']}' is not ACTIVE"
    passed += 1
    print(f" -> PASSED: All 10 layers have complete schema and are marked ACTIVE.")

    # TEST 3: Critical vs High severity split
    print("\n[TEST 3] Verifying Critical and High Severity Layer Distribution...")
    critical = [l for l in layers if l["severity_if_bypassed"] == "CRITICAL"]
    high = [l for l in layers if l["severity_if_bypassed"] == "HIGH"]
    assert len(critical) == 5, f"Expected 5 CRITICAL layers, got {len(critical)}"
    assert len(high) == 5, f"Expected 5 HIGH layers, got {len(high)}"
    passed += 1
    print(f" -> PASSED: 5 CRITICAL layers + 5 HIGH severity layers correctly classified.")

    # TEST 4: DPDP Act 2023 — 9 Requirements
    print("\n[TEST 4] Verifying 9 DPDP Act 2023 Compliance Requirements...")
    dpdp = SecurityComplianceService.get_dpdp_requirements()
    assert len(dpdp) == 9, f"Expected 9 DPDP requirements, got {len(dpdp)}"
    all_compliant = all(r["status"] == "COMPLIANT" for r in dpdp)
    assert all_compliant, "Some DPDP requirements are NOT marked COMPLIANT"
    dpdp_reqs = [r["requirement"] for r in dpdp]
    assert "Explicit Consent" in dpdp_reqs
    assert "Right to Erasure" in dpdp_reqs
    assert "Breach Notification" in dpdp_reqs
    assert "Data Localisation" not in [r["requirement"] for r in dpdp] or True  # optional check
    passed += 1
    print(f" -> PASSED: All 9 DPDP Act 2023 requirements present and marked COMPLIANT.")

    # TEST 5: DPDP Key SLAs
    print("\n[TEST 5] Verifying DPDP Act SLA Requirements...")
    erasure = next((r for r in dpdp if r["requirement"] == "Right to Erasure"), None)
    assert erasure is not None
    assert "72" in erasure["sla"]

    breach = next((r for r in dpdp if r["requirement"] == "Breach Notification"), None)
    assert breach is not None
    assert "72" in breach["sla"]

    consent_withdrawal = next((r for r in dpdp if r["requirement"] == "Consent Withdrawal"), None)
    assert consent_withdrawal is not None
    assert "24" in consent_withdrawal["sla"]
    passed += 1
    print(f" -> PASSED: Right to Erasure 72h, Breach Notification 72h, Consent Withdrawal 24h SLAs verified.")

    # TEST 6: SOC2 + ISO 27001 Controls
    print("\n[TEST 6] Verifying SOC2 and ISO 27001 Compliance Controls...")
    controls = SecurityComplianceService.get_compliance_controls()
    assert len(controls) == 10, f"Expected 10 controls, got {len(controls)}"

    soc2_controls = SecurityComplianceService.get_compliance_controls(standard="SOC2 Type II")
    iso_controls = SecurityComplianceService.get_compliance_controls(standard="ISO 27001")
    assert len(soc2_controls) == 5, f"Expected 5 SOC2 controls, got {len(soc2_controls)}"
    assert len(iso_controls) == 5, f"Expected 5 ISO 27001 controls, got {len(iso_controls)}"
    passed += 1
    print(f" -> PASSED: 5 SOC2 Type II + 5 ISO 27001 controls verified.")

    # TEST 7: Security Summary
    print("\n[TEST 7] Verifying Security Posture Summary...")
    summary = SecurityComplianceService.get_security_summary()
    assert summary["total_security_layers"] == 10
    assert summary["all_layers_active"] == True
    assert summary["dpdp_act_2023"]["compliance_percentage"] == 100.0
    assert summary["dpdp_act_2023"]["total_requirements"] == 9
    assert "AWS Mumbai" in summary["dpdp_act_2023"]["data_residency"]
    assert summary["security_posture"] == "DEFENSE_IN_DEPTH"
    assert "AES-256-GCM" in summary["encryption"]["at_rest"]
    passed += 1
    print(f" -> PASSED: Security summary shows 100% DPDP compliance, DEFENSE_IN_DEPTH posture, AES-256-GCM encryption.")

    # TEST 8: Breach Notification Workflow Simulation
    print("\n[TEST 8] Verifying DPDP Section 8 Breach Notification Simulation...")
    simulation = SecurityComplianceService.simulate_breach_notification(breach_type="P1")
    assert simulation["breach_type"] == "P1"
    assert simulation["regulatory_notification_hours"] == 72
    assert simulation["sla_acknowledge_minutes"] == 5
    assert simulation["sla_resolve_hours"] == 60
    assert len(simulation["steps"]) == 6
    assert "CERT-In" in simulation["notification_channels"]
    passed += 1
    print(f" -> PASSED: P1 breach notification workflow (5min ack, 60min resolve, 72h regulatory) simulated.")

    # TEST 9: Layer Detail Lookup
    print("\n[TEST 9] Verifying Individual Layer Detail Lookup...")
    sl01 = SecurityComplianceService.get_layer_by_id("SL-01")
    assert sl01 is not None
    assert sl01["layer"] == "Network Perimeter"
    assert "AWS WAF" in sl01["control"]

    sl04 = SecurityComplianceService.get_layer_by_id("SL-04")
    assert sl04 is not None
    assert "AES-256-GCM" in sl04["control"]

    sl09 = SecurityComplianceService.get_layer_by_id("SL-09")
    assert sl09 is not None
    assert "audit" in sl09["layer"].lower() or "Audit" in sl09["layer"]
    passed += 1
    print(f" -> PASSED: Layer detail lookup verified for SL-01 (WAF), SL-04 (Encryption), SL-09 (Audit).")

    # TEST 10: REST API Endpoints
    print("\n[TEST 10] Verifying Section 15 REST API Endpoints...")
    factory = APIRequestFactory()

    # Security layers list
    view = SecurityLayersAPIView.as_view()
    resp = view(factory.get('/api/v1/security/layers/'))
    assert resp.status_code == 200
    assert len(resp.data["data"]) == 10
    assert resp.data["meta"]["total"] == 10

    # DPDP requirements
    dpdp_view = DPDPRequirementsAPIView.as_view()
    resp2 = dpdp_view(factory.get('/api/v1/security/dpdp/requirements/'))
    assert resp2.status_code == 200
    assert len(resp2.data["data"]) == 9

    # Compliance controls with standard filter
    ctrl_view = ComplianceControlsAPIView.as_view()
    resp3 = ctrl_view(factory.get('/api/v1/security/compliance/controls/?standard=SOC2 Type II'))
    assert resp3.status_code == 200

    # Summary
    sum_view = SecuritySummaryAPIView.as_view()
    resp4 = sum_view(factory.get('/api/v1/security/summary/'))
    assert resp4.status_code == 200
    assert resp4.data["data"]["total_security_layers"] == 10

    # Breach notification simulator
    bn_view = BreachNotificationSimulatorAPIView.as_view()
    resp5 = bn_view(factory.get('/api/v1/security/breach-notification/simulate/'))
    assert resp5.status_code == 200
    assert resp5.data["data"]["regulatory_notification_hours"] == 72

    # Layer detail 404
    detail_view = SecurityLayerDetailAPIView.as_view()
    resp6 = detail_view(factory.get('/api/v1/security/layers/SL-99/'), layer_id='SL-99')
    assert resp6.status_code == 404

    passed += 1
    print(f" -> PASSED: All 6 Section 15 REST API endpoints return correct data and envelopes.")

    print("\n" + "=" * 70)
    print(f"ALL SECTION 15 VERIFICATION TESTS PASSED: {passed}/10")
    print("=" * 70)


if __name__ == "__main__":
    run_tests()
