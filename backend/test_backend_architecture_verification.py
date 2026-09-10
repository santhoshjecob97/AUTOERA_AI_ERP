"""
Section 13: Backend Architecture Verification Test Suite
16 Microservices · Kafka Event Bus · REST + GraphQL · API Gateway
"""

import os
import sys
import django

# Setup Django Environment
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from core.microservices_mesh import MicroservicesMeshService, MICROSERVICES_CATALOGUE, RATE_LIMITING_TIERS
from core.kafka_bus import KafkaTopics, KafkaConsumerGroups, KafkaEventProducer
from rest_framework.test import APIRequestFactory
from core.microservices_views import (
    MicroservicesCatalogAPIView, KafkaMeshTopicsAPIView,
    KafkaPublishEventAPIView, APIGatewayStandardsAPIView,
    TestEnvelopeAPIView
)

def run_tests():
    print("=" * 70)
    print("RUNNING SECTION 13: BACKEND ARCHITECTURE TEST SUITE")
    print("=" * 70)
    passed_count = 0

    # -------------------------------------------------------------
    # TEST 1: Verify All 16 Microservices Specifications
    # -------------------------------------------------------------
    print("\n[TEST 1] Verifying 16 Microservices Catalog Completeness...")
    services = MicroservicesMeshService.get_services()
    assert len(services) == 16, f"Expected 16 microservices, found {len(services)}"

    expected_services = [
        "API Gateway", "Auth Service", "User Service", "CRM Service",
        "Sales Service", "Service Ops Service", "Fleet Service", "EV Service",
        "Insurance Service", "Finance Service", "Analytics Service",
        "Notification Service", "AI Service", "Billing Service",
        "Parts Service", "OEM Service"
    ]
    service_names = [s["service_name"] for s in services]
    for exp in expected_services:
        assert exp in service_names, f"Missing microservice: {exp}"

    # Verify scaling strategy distribution
    horizontal_count = sum(1 for s in services if "Horizontal" in s["scaling_strategy"])
    vertical_count = sum(1 for s in services if "Vertical" in s["scaling_strategy"])
    assert horizontal_count >= 13, f"Expected >= 13 horizontal services, got {horizontal_count}"
    assert vertical_count >= 2, f"Expected >= 2 vertical compute-heavy services (Analytics/AI), got {vertical_count}"

    print(f" -> Verified all 16 Microservices ({horizontal_count} Horizontal, {vertical_count} Vertical).")
    passed_count += 1

    # -------------------------------------------------------------
    # TEST 2: Verify All 9 Kafka Core Event Topics
    # -------------------------------------------------------------
    print("\n[TEST 2] Verifying 9 Kafka Core Event Topics...")
    expected_topics = [
        'autoera.leads.created',
        'autoera.leads.status_changed',
        'autoera.job_cards.created',
        'autoera.job_cards.stage_changed',
        'autoera.insurance.expiry_alert',
        'autoera.fleet.anomaly_detected',
        'autoera.payments.completed',
        'autoera.ai.prediction_made',
        'autoera.users.login_failed'
    ]
    for t in expected_topics:
        assert t in KafkaTopics.ALL_TOPICS, f"Missing topic: {t}"
    print(f" -> Successfully validated all 9 core Kafka event topics.")
    passed_count += 1

    # -------------------------------------------------------------
    # TEST 3: Verify Kafka 4 Consumer Groups & Subscriptions
    # -------------------------------------------------------------
    print("\n[TEST 3] Verifying Kafka 4 Consumer Groups & Subscriptions...")
    assert len(KafkaConsumerGroups.ALL_GROUPS) == 4
    assert KafkaConsumerGroups.NOTIFICATION_SERVICE in KafkaConsumerGroups.ALL_GROUPS
    assert KafkaConsumerGroups.ANALYTICS_SERVICE in KafkaConsumerGroups.ALL_GROUPS
    assert KafkaConsumerGroups.AI_SERVICE in KafkaConsumerGroups.ALL_GROUPS
    assert KafkaConsumerGroups.BILLING_SERVICE in KafkaConsumerGroups.ALL_GROUPS

    leads_created_subs = KafkaConsumerGroups.TOPIC_SUBSCRIPTIONS[KafkaTopics.LEADS_CREATED]
    assert KafkaConsumerGroups.AI_SERVICE in leads_created_subs
    assert KafkaConsumerGroups.NOTIFICATION_SERVICE in leads_created_subs

    payments_subs = KafkaConsumerGroups.TOPIC_SUBSCRIPTIONS[KafkaTopics.PAYMENTS_COMPLETED]
    assert KafkaConsumerGroups.BILLING_SERVICE in payments_subs
    print(" -> All 4 Consumer Groups verified with targeted topic subscription mappings.")
    passed_count += 1

    # -------------------------------------------------------------
    # TEST 4: Verify Event Publishing with Guaranteed Envelope (tenant_id, timestamp, correlation_id)
    # -------------------------------------------------------------
    print("\n[TEST 4] Testing Event Publishing with Guaranteed Envelope...")
    producer = KafkaEventProducer.get_instance()
    corr_id = "corr_test_98765"
    t_id = "org_tata_motors_south"
    pub_res = producer.publish(
        topic=KafkaTopics.LEADS_CREATED,
        event_type="LEAD_INGESTED",
        payload={"lead_id": "l-101", "budget": "15L", "fuel": "EV"},
        tenant_id=t_id,
        correlation_id=corr_id
    )
    assert pub_res["status"] in ["PUBLISHED_KAFKA", "BUFFERED_LOCAL"]
    assert "message_id" in pub_res
    assert "timestamp" in pub_res

    # Check buffered event envelope
    buffered = producer.get_buffered_events(topic=KafkaTopics.LEADS_CREATED)
    assert len(buffered) > 0
    latest_event = buffered[-1]
    assert latest_event["tenant_id"] == t_id
    assert latest_event["correlation_id"] == corr_id
    assert latest_event["topic"] == KafkaTopics.LEADS_CREATED
    print(f" -> Published event {latest_event['message_id']} with correlation_id: {corr_id}")
    passed_count += 1

    # -------------------------------------------------------------
    # TEST 5: Verify REST API Standard Response Envelope
    # -------------------------------------------------------------
    print("\n[TEST 5] Verifying REST API Standard Response Envelope...")
    sample_data = [{"lead_id": "l_1", "score": 9}, {"lead_id": "l_2", "score": 8}]
    env = MicroservicesMeshService.format_envelope(sample_data, page=1, cursor="l_2")
    assert "data" in env and len(env["data"]) == 2
    assert "meta" in env
    assert env["meta"]["total"] == 2
    assert env["meta"]["cursor"] == "l_2"
    assert "timestamp" in env["meta"]
    assert env["errors"] == []
    print(f" -> Standard envelope verified: data, meta (page, total, cursor, timestamp), errors.")
    passed_count += 1

    # -------------------------------------------------------------
    # TEST 6: Verify REST API Standard Error Format
    # -------------------------------------------------------------
    print("\n[TEST 6] Verifying REST API Standard Error Format...")
    err_env = MicroservicesMeshService.format_error("LEAD_NOT_FOUND", "Lead l-999 does not exist", field="lead_id")
    assert err_env["data"] is None
    assert len(err_env["errors"]) == 1
    err = err_env["errors"][0]
    assert err["code"] == "LEAD_NOT_FOUND"
    assert err["message"] == "Lead l-999 does not exist"
    assert err["field"] == "lead_id"
    print(f" -> Standard error envelope verified: code={err['code']}, field={err['field']}")
    passed_count += 1

    # -------------------------------------------------------------
    # TEST 7: Verify Structured Filtering & Cursor Pagination Parser
    # -------------------------------------------------------------
    print("\n[TEST 7] Testing Structured Filtering & Cursor Pagination Parser...")
    query_params = {
        "filter[status]": "hot",
        "filter[score][gte]": "7",
        "sort": "-created_at",
        "after": "lead_xyz_123",
        "limit": "50"
    }
    parsed = MicroservicesMeshService.parse_structured_filters(query_params)
    assert parsed["filters"]["status"] == "hot"
    assert parsed["filters"]["score"]["gte"] == "7"
    assert parsed["sort"] == "-created_at"
    assert parsed["cursor"] == "lead_xyz_123"
    assert parsed["limit"] == 50
    print(f" -> Successfully parsed structured filters: {parsed['filters']}")
    passed_count += 1

    # -------------------------------------------------------------
    # TEST 8: Verify Tiered Rate Limiting Policies
    # -------------------------------------------------------------
    print("\n[TEST 8] Verifying Tiered Rate Limiting Policies...")
    limits = MicroservicesMeshService.get_rate_limits()
    assert limits["STARTER"]["limit"] == 100
    assert limits["GROWTH"]["limit"] == 500
    assert limits["ENTERPRISE"]["limit"] == 2000
    print(" -> Starter: 100 req/min | Growth: 500 req/min | Enterprise: 2000 req/min verified.")
    passed_count += 1

    # -------------------------------------------------------------
    # TEST 9: Testing REST API Endpoints
    # -------------------------------------------------------------
    print("\n[TEST 9] Testing Microservices REST API Endpoints...")
    factory = APIRequestFactory()

    # GET /api/v1/mesh/services/
    request = factory.get('/api/v1/mesh/services/')
    resp = MicroservicesCatalogAPIView.as_view()(request)
    assert resp.status_code == 200
    assert len(resp.data["data"]) == 16

    # GET /api/v1/mesh/kafka/topics/
    request = factory.get('/api/v1/mesh/kafka/topics/')
    resp = KafkaMeshTopicsAPIView.as_view()(request)
    assert resp.status_code == 200
    assert len(resp.data["data"]["topics"]) == 9

    # POST /api/v1/mesh/kafka/publish/
    request = factory.post('/api/v1/mesh/kafka/publish/', {
        'topic': KafkaTopics.JOB_CARDS_STAGE_CHANGED,
        'event_type': 'STAGE_UPDATED',
        'payload': {'job_id': 'job_123', 'stage': 'PAINT_BOOTH'},
        'tenant_id': 'tenant_maruti_delhi'
    }, format='json')
    resp = KafkaPublishEventAPIView.as_view()(request)
    assert resp.status_code == 201
    assert "message_id" in resp.data["data"]

    # GET /api/v1/mesh/gateway/standards/
    request = factory.get('/api/v1/mesh/gateway/standards/')
    resp = APIGatewayStandardsAPIView.as_view()(request)
    assert resp.status_code == 200
    assert "response_envelope" in resp.data["data"]

    # POST /api/v1/mesh/gateway/test-envelope/
    request = factory.post('/api/v1/mesh/gateway/test-envelope/', {'mode': 'ERROR'}, format='json')
    resp = TestEnvelopeAPIView.as_view()(request)
    assert resp.status_code == 404
    assert resp.data["errors"][0]["code"] == "LEAD_NOT_FOUND"

    print(" -> Verified all 5 Mesh & Gateway endpoints with HTTP 200 / 201 / 404.")
    passed_count += 1

    # -------------------------------------------------------------
    # TEST 10: Verify GraphQL & Versioning Headers
    # -------------------------------------------------------------
    print("\n[TEST 10] Verifying GraphQL Gateway & Versioning Headers...")
    standards = resp = APIGatewayStandardsAPIView.as_view()(factory.get('/api/v1/mesh/gateway/standards/')).data["data"]
    assert "POST /api/v1/graphql/" in standards["graphql"]
    assert "v1" in standards["versioning"]["active_versions"]
    assert any("X-API-Deprecated" in h for h in standards["versioning"]["deprecation_headers"])
    print(" -> Verified GraphQL gateway hook and deprecation sunset policy.")
    passed_count += 1

    print("\n" + "=" * 70)
    print(f"SECTION 13 BACKEND ARCHITECTURE TEST RESULT: {passed_count}/10 PASSED (100%)")
    print("=" * 70)
    return True

if __name__ == "__main__":
    success = run_tests()
    if not success:
        sys.exit(1)
