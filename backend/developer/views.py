from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from core.views import TenantScopedViewSet
from .models import ApiKey, WebhookSubscription, WebhookDeliveryLog
from .serializers import (
    ApiKeySerializer,
    WebhookSubscriptionSerializer,
    WebhookDeliveryLogSerializer
)


class ApiKeyViewSet(TenantScopedViewSet):
    """
    Tenant-isolated API Key Lifecycle Management.
    Enables dealerships & partners to provision, rotate, and revoke programmatic keys.
    """
    queryset = ApiKey.objects.all()
    serializer_class = ApiKeySerializer
    permission_classes = [IsAuthenticated]
    search_fields = ['name', 'key_prefix']
    filterset_fields = ['is_active']
    ordering_fields = ['created_at', 'last_used_at']

    def create(self, request, *args, **kwargs):
        name = request.data.get('name', 'External Partner Key')
        scopes = request.data.get('scopes', ['read:telemetry', 'read:leads', 'read:service'])
        rate_limit_rpm = int(request.data.get('rate_limit_rpm', 120))
        expires_in_days = int(request.data.get('expires_in_days', 365))

        org_id = getattr(request.user, 'organization_id', None) or 'org-default'

        api_key_obj, raw_token = ApiKey.generate_key(
            organization_id=str(org_id),
            name=name,
            scopes=scopes,
            rate_limit_rpm=rate_limit_rpm,
            expires_in_days=expires_in_days
        )

        serializer = self.get_serializer(api_key_obj)
        return Response({
            'api_key': serializer.data,
            'secret_token': raw_token,
            'warning': 'Copy this secret key now. It will never be shown again.'
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def revoke(self, request, pk=None):
        """Revokes an active API key immediately."""
        key_obj = self.get_object()
        key_obj.is_active = False
        key_obj.save(update_fields=['is_active'])
        return Response({
            'status': 'REVOKED',
            'key_prefix': key_obj.key_prefix,
            'message': 'API key revoked successfully.'
        }, status=status.HTTP_200_OK)


class WebhookViewSet(TenantScopedViewSet):
    """
    Manages outbound webhook event subscriptions and delivers test pings.
    """
    queryset = WebhookSubscription.objects.all()
    serializer_class = WebhookSubscriptionSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ['name', 'target_url']
    filterset_fields = ['is_active']

    @action(detail=True, methods=['post'])
    def ping(self, request, pk=None):
        """Sends a signed test ping to the webhook endpoint."""
        webhook = self.get_object()
        result = webhook.test_ping()
        return Response(result, status=status.HTTP_200_OK)


class DeveloperDocsView(APIView):
    """
    Developer Platform Interactive API Schema & Code Snippets.
    GET /api/v1/developer/docs/
    """
    permission_classes = []

    def get(self, request):
        docs_payload = {
            'platform': 'AutoEra AI Automotive Operating System API v1.0',
            'base_url': 'https://api.autoera.ai/api/v1',
            'auth_header': 'Authorization: Bearer aek_live_<prefix>_<secret>',
            'scopes': [
                {'scope': 'read:telemetry', 'description': 'Stream live OBD-II vehicle metrics, GPS, and DTC alerts'},
                {'scope': 'write:telemetry', 'description': 'Ingest batch CAN-bus and IoT data packets'},
                {'scope': 'read:leads', 'description': 'Query sales CRM prospect records and AI lead scores'},
                {'scope': 'write:leads', 'description': 'Create prospects, schedule test drives, issue quotes'},
                {'scope': 'read:service', 'description': 'Access job card stages, workshop bay telemetry, inspection checklists'},
                {'scope': 'write:jobcards', 'description': 'Transition service milestone stages and dispatch digital gate passes'}
            ],
            'webhook_events': [
                'lead.created', 'lead.status_changed', 'jobcard.created',
                'jobcard.stage_changed', 'telemetry.alert', 'payment.completed'
            ],
            'curl_example': (
                "curl -X POST https://api.autoera.ai/api/v1/fleet/telemetry/ingest/ \\\n"
                "  -H 'Authorization: Bearer aek_live_8f3a_x90Kq8zL12A...' \\\n"
                "  -H 'Content-Type: application/json' \\\n"
                "  -d '{\"device_id\":\"OBD-9001\",\"records\":[{\"vin\":\"MA3EWBF1S00129841\",\"speed\":75.2}]}'"
            ),
            'python_example': (
                "import requests\n\n"
                "headers = {'Authorization': 'Bearer aek_live_8f3a_x90Kq8zL12A...'}\n"
                "response = requests.get('https://api.autoera.ai/api/v1/vehicles/', headers=headers)\n"
                "print(response.json())"
            )
        }
        return Response(docs_payload, status=status.HTTP_200_OK)
