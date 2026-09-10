import os
import sys
import json
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from ai_platform.agents import supervisor, IntentRouter
from ai_platform.gateway import gateway
from ai_platform.rag import HybridRetriever, PineconeVectorStore
from core.views import RealtimeEventStreamView
from django.test import RequestFactory
from django.contrib.auth import get_user_model
from organization.models import Organization

User = get_user_model()

def run_tests():
    print("==================================================")
    print("      AUTOERA AI - PHASE 3 VERIFICATION SUITE     ")
    print("==================================================")

    # 1. Verify 10 Specialist Agents Intent Classification
    print("\n[1/4] Testing 10 Specialist Agents Classification...")
    router = IntentRouter()
    
    test_prompts = [
        ("Show me the gross profit pacing and overall branch EBITDA for this quarter.", "Executive Management Agent"),
        ("Check the SOH, cell degradation, and thermal runaway risk for our EV battery packs.", "EV Battery Intelligence Agent"),
        ("Track OBD-II DTC codes and geofence alerts for vehicle AP-09.", "Fleet IoT Telemetry Agent"),
        ("What is the damage estimate and settlement amount for claim CL-9812?", "Insurance Claim & Renewal Agent"),
        ("Compare HDFC vs SBI car loan interest rates and customer CIBIL credit score.", "Finance & Credit Agent"),
        ("We have a hot lead for Creta SX. Check minimum floor price against margin guard.", "Sales Specialist Agent"),
        ("Assign an L3 technician to Bay 4 for an engine overhaul.", "Workshop Dispatch Agent"),
        ("Check brake pad stock levels and reorder threshold for supplier Bosch.", "Inventory & Parts Agent"),
        ("Review speech sentiment analysis and transcript from inbound sales call.", "CRM & Voice Agent"),
        ("Customer reports squeaking brake noise at 40 km/h. Recommend repair operations.", "Service Advisor Agent"),
    ]

    classified_correctly = 0
    for prompt, expected_agent in test_prompts:
        matched_agent, intent, confidence = router.classify(prompt)
        is_match = matched_agent == expected_agent
        if is_match:
            classified_correctly += 1
            print(f"  [OK] '{expected_agent}' (Confidence: {confidence:.2f})")
        else:
            print(f"  [WARN] Expected '{expected_agent}', got '{matched_agent}' (Confidence: {confidence:.2f})")

    print(f"Agent Classification: {classified_correctly}/{len(test_prompts)} matched.")
    assert classified_correctly >= 8, f"Classification accuracy below threshold: {classified_correctly}"

    # 2. Verify Model Gateway (Multi-model routing)
    print("\n[2/4] Testing Multi-Model Routing Gateway...")
    fast_resp = gateway.generate_response("Quick health check", tier="FAST")
    print(f"  FAST Tier Routed -> Model: {fast_resp.get('model')}, Provider: {fast_resp.get('provider')}, Status: {fast_resp.get('status')}")
    assert fast_resp.get('status') == 'SUCCESS'

    reasoning_resp = gateway.generate_response("Complex multi-factor diagnostics", tier="REASONING")
    print(f"  REASONING Tier Routed -> Model: {reasoning_resp.get('model')}, Provider: {reasoning_resp.get('provider')}, Status: {reasoning_resp.get('status')}")
    assert reasoning_resp.get('status') == 'SUCCESS'

    # 3. Verify Vector DB / Hybrid Retrieval Engine
    print("\n[3/4] Testing Pinecone / PostgreSQL Hybrid Retrieval...")
    retriever = HybridRetriever()
    results = retriever.search("brake pad inspection and replacement", organization_id="00000000-0000-0000-0000-000000000001", top_k=3)
    print(f"  Hybrid Retriever executed cleanly. Retrieved {len(results)} chunks.")

    # 4. Verify SSE Real-time Event Stream
    print("\n[4/4] Testing Realtime Event Stream (SSE)...")
    factory = RequestFactory()
    req = factory.get('/api/v1/events/stream/')
    view = RealtimeEventStreamView.as_view()
    response = view(req)
    print(f"  SSE Response Status: {response.status_code}")
    print(f"  Content-Type: {response.get('Content-Type')}")
    assert response.status_code == 200
    assert 'text/event-stream' in response.get('Content-Type', '')

    # 5. Full Agent Execution End-to-End
    print("\n[5/5] Testing Supervisor Route & Execute End-to-End...")
    exec_result = supervisor.route_and_execute(
        "Diagnose transmission shudder during gear change from 2nd to 3rd.",
        user_context={'user_name': 'Santhosh Jecob', 'role': 'SERVICE_ADVISOR', 'organization_id': '00000000-0000-0000-0000-000000000001'}
    )
    print(f"  Assigned Agent: {exec_result.get('agent')}")
    print(f"  Model Used: {exec_result.get('model')}")
    print(f"  Latency: {exec_result.get('latency_ms')}ms")
    print(f"  Requires Human Approval: {exec_result.get('requires_human_approval')}")
    print(f"  Status: {exec_result.get('status')}")
    assert exec_result.get('status') == 'SUCCESS'
    assert len(exec_result.get('response', '')) > 0

    print("\n==================================================")
    print("   [PASS] ALL PHASE 3 VERIFICATION TESTS PASSED   ")
    print("==================================================")

if __name__ == '__main__':
    run_tests()
