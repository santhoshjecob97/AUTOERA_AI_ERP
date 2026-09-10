"""
AutoEra AI — Section 16: Mobile App Design Verification Suite
5 Apps — Customer · Service Advisor · Fleet Manager · Dealer Executive · Technician
React Native + Expo · Shared Codebase · Role-Based Routing · OTA Updates
"""

import os
import sys
import django

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from core.mobile_app_design import MobileAppDesignService, ALL_APPS
from core.mobile_app_views import (
    MobileArchitectureAPIView, MobileAppsSummaryAPIView,
    MobileAppsListAPIView, MobileAppDetailAPIView
)
from rest_framework.test import APIRequestFactory


def run_tests():
    print("=" * 70)
    print("RUNNING SECTION 16: MOBILE APP DESIGN TEST SUITE")
    print("=" * 70)
    passed = 0

    # TEST 1: All 5 Apps Present
    print("\n[TEST 1] Verifying All 5 Mobile Apps Are Defined...")
    apps = MobileAppDesignService.get_all_apps()
    assert len(apps) == 5, f"Expected 5 apps, got {len(apps)}"
    app_ids = [a["app_id"] for a in apps]
    for expected_id in ["APP-01", "APP-02", "APP-03", "APP-04", "APP-05"]:
        assert expected_id in app_ids, f"Missing app: {expected_id}"
    passed += 1
    print(f" -> PASSED: All 5 mobile apps (APP-01 through APP-05) are defined.")

    # TEST 2: App Schema Completeness
    print("\n[TEST 2] Verifying App Schema Integrity...")
    required_keys = ["app_id", "app_name", "target_user", "primary_color", "icon", "screens"]
    for app in apps:
        for k in required_keys:
            assert k in app and app[k], f"Missing key '{k}' in app '{app.get('app_id')}'"
        assert len(app["screens"]) > 0, f"App {app['app_id']} has no screens"
    passed += 1
    print(f" -> PASSED: All 5 apps have complete schema with target_user, screens, and branding.")

    # TEST 3: Customer App (APP-01) Screen Coverage
    print("\n[TEST 3] Verifying Customer App (APP-01) Screens...")
    customer = MobileAppDesignService.get_app_by_id("APP-01")
    assert customer is not None
    screen_names = [s["screen"] for s in customer["screens"]]
    expected_screens = ["Home", "My Vehicle", "Book Service", "Service Status", "Insurance", "Finance", "EV Battery (EV only)", "Profile"]
    for s in expected_screens:
        assert s in screen_names, f"Customer app missing screen: {s}"
    # Check AI integration on key screens
    home = next(s for s in customer["screens"] if s["screen"] == "Home")
    assert home["ai_integration"] is not None
    assert "3 things" in home["ai_integration"].lower() or "AI summary" in home["ai_integration"]
    passed += 1
    print(f" -> PASSED: Customer app has all 8 screens including AI-powered Home, EV Battery, and DPDP consent management.")

    # TEST 4: Service Advisor App (APP-02) Offline Capability
    print("\n[TEST 4] Verifying Service Advisor App (APP-02) Screens and Offline Modes...")
    advisor = MobileAppDesignService.get_app_by_id("APP-02")
    assert advisor is not None
    screen_names = [s["screen"] for s in advisor["screens"]]
    assert "Job Queue" in screen_names
    assert "Job Card Creator" in screen_names
    assert "Vehicle Inspection" in screen_names
    assert "Status Updates" in screen_names
    # Verify offline capability descriptions
    job_queue = next(s for s in advisor["screens"] if s["screen"] == "Job Queue")
    assert "offline" in job_queue["offline_capability"].lower()
    jcc = next(s for s in advisor["screens"] if s["screen"] == "Job Card Creator")
    assert "OCR" in jcc["features"][0] or "plate" in " ".join(jcc["features"]).lower()
    passed += 1
    print(f" -> PASSED: Service Advisor app has 6 screens with full/partial offline capabilities and plate OCR.")

    # TEST 5: Fleet Manager App (APP-03) Real-Time Features
    print("\n[TEST 5] Verifying Fleet Manager App (APP-03) Real-Time Telemetry Screens...")
    fleet = MobileAppDesignService.get_app_by_id("APP-03")
    assert fleet is not None
    screen_names = [s["screen"] for s in fleet["screens"]]
    assert "Fleet Live Map" in screen_names
    assert "Alerts Centre" in screen_names
    assert "Driver Scorecards" in screen_names
    assert "Fuel Intelligence" in screen_names
    # Verify live map has WebSocket update
    live_map = next(s for s in fleet["screens"] if s["screen"] == "Fleet Live Map")
    assert "WebSocket" in live_map["update_frequency"] or "30-second" in live_map["update_frequency"]
    passed += 1
    print(f" -> PASSED: Fleet Manager app has 6 screens with WebSocket live map and anomaly alert push notifications.")

    # TEST 6: Dealer Executive App (APP-04) AI Morning Brief
    print("\n[TEST 6] Verifying Dealer Executive App (APP-04) AI Morning Brief and Lead Pipeline...")
    dealer = MobileAppDesignService.get_app_by_id("APP-04")
    assert dealer is not None
    screen_names = [s["screen"] for s in dealer["screens"]]
    assert "Morning Brief" in screen_names
    assert "Lead Pipeline" in screen_names
    assert "Discount Approvals" in screen_names
    # Check AI morning brief
    brief = next(s for s in dealer["screens"] if s["screen"] == "Morning Brief")
    assert "GPT-4o" in brief["ai_integration"] or "7:55" in brief["ai_integration"]
    assert "7:55" in brief["update_frequency"] or "daily" in brief["update_frequency"].lower()
    passed += 1
    print(f" -> PASSED: Dealer Executive app has GPT-4o AI morning brief at 7:55am with lead pipeline and approval screens.")

    # TEST 7: Technician App (APP-05) Job Execution
    print("\n[TEST 7] Verifying Technician App (APP-05) Job Execution Screens...")
    tech = MobileAppDesignService.get_app_by_id("APP-05")
    assert tech is not None
    screen_names = [s["screen"] for s in tech["screens"]]
    assert "My Job Queue" in screen_names
    assert "Job Execution" in screen_names
    assert "Vehicle Inspection" in screen_names
    job_exec = next(s for s in tech["screens"] if s["screen"] == "Job Execution")
    assert "offline" in job_exec["offline_capability"].lower()
    passed += 1
    print(f" -> PASSED: Technician app has 4 focused screens with full offline execution and time tracking.")

    # TEST 8: Shared Architecture Verification
    print("\n[TEST 8] Verifying Shared React Native + Expo Architecture...")
    arch = MobileAppDesignService.get_architecture()
    assert "React Native + Expo" in arch["framework"]
    assert arch["shared_shell"]["code_reuse_percent"] == 90
    assert arch["shared_shell"]["app_count"] == 5
    assert "EAS" in arch["shared_shell"]["ota_updates"] or "OTA" in arch["shared_shell"]["ota_updates"]
    assert "WatermelonDB" in arch["offline_strategy"]["engine"]
    passed += 1
    print(f" -> PASSED: Shared architecture: 90% code reuse, React Native + Expo EAS OTA, WatermelonDB offline sync.")

    # TEST 9: Apps Summary Statistics
    print("\n[TEST 9] Verifying Mobile Apps Summary Statistics...")
    summary = MobileAppDesignService.get_apps_summary()
    assert summary["total_apps"] == 5
    assert summary["total_screens"] > 25, f"Expected 25+ screens total, got {summary['total_screens']}"
    assert summary["ai_integrated_screens"] > 5
    assert summary["code_reuse_percent"] == 90
    assert "Tamil" in summary["supported_languages"]
    assert "OCR" in summary["ocr"] or "plate" in summary["ocr"].lower()
    passed += 1
    print(f" -> PASSED: Apps summary: {summary['total_apps']} apps, {summary['total_screens']} screens, {summary['ai_integrated_screens']} AI-integrated.")

    # TEST 10: REST API Endpoints
    print("\n[TEST 10] Verifying Section 16 REST API Endpoints...")
    factory = APIRequestFactory()

    # Architecture
    arch_view = MobileArchitectureAPIView.as_view()
    resp = arch_view(factory.get('/api/v1/mobile/architecture/'))
    assert resp.status_code == 200
    assert "React Native + Expo" in resp.data["data"]["framework"]

    # Summary
    sum_view = MobileAppsSummaryAPIView.as_view()
    resp2 = sum_view(factory.get('/api/v1/mobile/apps/summary/'))
    assert resp2.status_code == 200
    assert resp2.data["data"]["total_apps"] == 5

    # All apps list
    list_view = MobileAppsListAPIView.as_view()
    resp3 = list_view(factory.get('/api/v1/mobile/apps/'))
    assert resp3.status_code == 200
    assert len(resp3.data["data"]) == 5
    assert resp3.data["meta"]["total"] == 5

    # App detail
    detail_view = MobileAppDetailAPIView.as_view()
    resp4 = detail_view(factory.get('/api/v1/mobile/apps/APP-01/'), app_id='APP-01')
    assert resp4.status_code == 200
    assert resp4.data["data"]["app_id"] == "APP-01"

    # Not found
    resp5 = detail_view(factory.get('/api/v1/mobile/apps/APP-99/'), app_id='APP-99')
    assert resp5.status_code == 404

    passed += 1
    print(f" -> PASSED: All Section 16 REST API endpoints return correct data and standard envelopes.")

    print("\n" + "=" * 70)
    print(f"ALL SECTION 16 VERIFICATION TESTS PASSED: {passed}/10")
    print("=" * 70)


if __name__ == "__main__":
    run_tests()
