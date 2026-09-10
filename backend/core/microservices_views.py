"""
AutoEra AI — Microservices Mesh & Kafka Architecture API Views
Section 13: 16 Microservices · Kafka Event Bus · REST + GraphQL · API Gateway
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .microservices_mesh import MicroservicesMeshService, MICROSERVICES_CATALOGUE
from .kafka_bus import KafkaTopics, KafkaConsumerGroups, KafkaEventProducer


class MicroservicesCatalogAPIView(APIView):
    """
    GET: Returns all 16 microservices with technology, responsibility, and scaling strategies.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        service_param = request.query_params.get('service')
        if service_param:
            s = MicroservicesMeshService.get_service(service_param)
            if not s:
                return Response(
                    MicroservicesMeshService.format_error("SERVICE_NOT_FOUND", f"Service '{service_param}' not found in 16 microservices mesh.", field="service"),
                    status=status.HTTP_404_NOT_FOUND
                )
            return Response(MicroservicesMeshService.format_envelope(s), status=status.HTTP_200_OK)

        services = MicroservicesMeshService.get_services()
        meta = {
            "page": 1,
            "total": len(services),
            "healthy_count": sum(1 for s in services if s["status"] == "HEALTHY"),
            "scaling_types": {
                "horizontal": sum(1 for s in services if "Horizontal" in s["scaling_strategy"]),
                "vertical": sum(1 for s in services if "Vertical" in s["scaling_strategy"])
            }
        }
        return Response(MicroservicesMeshService.format_envelope(services, total=len(services)), status=status.HTTP_200_OK)


class KafkaMeshTopicsAPIView(APIView):
    """
    GET: Returns all 9 Kafka topics, consumer groups, and MSK broker configuration.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        producer = KafkaEventProducer.get_instance()
        buffered = producer.get_buffered_events(limit=20)

        topics_data = []
        for t in KafkaTopics.ALL_TOPICS[:9]:
            topics_data.append({
                "topic": t,
                "subscribers": KafkaConsumerGroups.TOPIC_SUBSCRIPTIONS.get(t, []),
                "replication_factor": 3,
                "min_insync_replicas": 2,
                "retention_hours": 168
            })

        data = {
            "cluster": {
                "provider": "Apache Kafka (AWS MSK)",
                "brokers": 3,
                "availability_zones": 3,
                "replication_factor": 3,
                "status": "ONLINE" if producer.is_connected else "LOCAL_BUFFER_ACTIVE"
            },
            "topics": topics_data,
            "consumer_groups": KafkaConsumerGroups.ALL_GROUPS,
            "recent_events_count": len(buffered),
            "recent_events": buffered[-10:]
        }
        return Response(MicroservicesMeshService.format_envelope(data), status=status.HTTP_200_OK)


class KafkaPublishEventAPIView(APIView):
    """
    POST: Publishes an event to Kafka bus with guaranteed tenant_id, timestamp, correlation_id.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        topic = request.data.get('topic', KafkaTopics.LEADS_CREATED)
        event_type = request.data.get('event_type', 'LEAD_CREATED')
        payload = request.data.get('payload', {})
        tenant_id = request.data.get('tenant_id', 'org_apex_motors')
        correlation_id = request.data.get('correlation_id')

        producer = KafkaEventProducer.get_instance()
        result = producer.publish(
            topic=topic,
            event_type=event_type,
            payload=payload,
            tenant_id=tenant_id,
            correlation_id=correlation_id
        )
        return Response(MicroservicesMeshService.format_envelope(result), status=status.HTTP_201_CREATED)


class APIGatewayStandardsAPIView(APIView):
    """
    GET: Returns REST API design standards, rate limit tiers, error patterns, and GraphQL config.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        standards = {
            "url_pattern": "/{version}/{resource} — tenant extracted from JWT, not URL",
            "auth_header": "Bearer JWT in Authorization header. Tenant + role extracted from JWT claims.",
            "response_envelope": {
                "template": "{ data: T|T[], meta: { page, total, cursor, timestamp }, errors: [] }",
                "example": {
                    "data": [{"lead_id": "lead_123", "ai_score": 85}],
                    "meta": {"page": 1, "total": 47, "cursor": "lead_123", "timestamp": "2026-09-09T16:30:00Z"},
                    "errors": []
                }
            },
            "error_format": {
                "template": "{ code: 'LEAD_NOT_FOUND', message: 'Human readable', field: 'lead_id' }",
                "sample_codes": ["LEAD_NOT_FOUND", "UNAUTHORIZED_TENANT", "RATE_LIMIT_EXCEEDED", "JOB_CARD_LOCKED"]
            },
            "rate_limiting": MicroservicesMeshService.get_rate_limits(),
            "websocket": "/ws/channel/{channel} — JWT auth on WebSocket connection upgrade",
            "graphql": "POST /api/v1/graphql/ — for complex nested dashboard queries",
            "versioning": {
                "active_versions": ["v1", "v2"],
                "deprecation_headers": ["X-API-Deprecated: true", "Sunset: 2027-01-01"]
            }
        }
        return Response(MicroservicesMeshService.format_envelope(standards), status=status.HTTP_200_OK)


class TestEnvelopeAPIView(APIView):
    """
    POST: Demonstrates response envelope formatting, cursor pagination, or error generation.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        mode = request.data.get('mode', 'SUCCESS')
        if mode == 'ERROR':
            err = MicroservicesMeshService.format_error(
                code="LEAD_NOT_FOUND",
                message="Requested lead could not be located for active dealership.",
                field="lead_id"
            )
            return Response(err, status=status.HTTP_404_NOT_FOUND)

        parsed = MicroservicesMeshService.parse_structured_filters(request.query_params.dict())
        sample_data = [
            {"lead_id": "lead_xyz_1", "status": "HOT", "ai_score": 9.2, "customer": "Suresh Kumar"},
            {"lead_id": "lead_xyz_2", "status": "WARM", "ai_score": 7.8, "customer": "Ananya Sharma"}
        ]
        return Response(MicroservicesMeshService.format_envelope(sample_data, cursor="lead_xyz_2"), status=status.HTTP_200_OK)
