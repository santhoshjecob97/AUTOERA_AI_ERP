import hmac
import hashlib
import json
import logging
from django.conf import settings
from django.utils import timezone
from django.core.cache import cache
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from core.views import TenantScopedViewSet
from core.permissions import IsSuperAdmin, IsManagerOrAbove
from .models import SaaSPlan, Subscription
from .serializers import SaaSPlanSerializer, SubscriptionSerializer

logger = logging.getLogger('autoera.billing')


class SaaSPlanViewSet(viewsets.ReadOnlyModelViewSet):
    """Public read-only pricing plans."""
    queryset = SaaSPlan.objects.all()
    serializer_class = SaaSPlanSerializer
    permission_classes = [AllowAny]
    ordering = ['price_monthly']


class SubscriptionViewSet(TenantScopedViewSet):
    """Tenant subscription management."""
    queryset = Subscription.objects.select_related('plan').all()
    serializer_class = SubscriptionSerializer
    permission_classes = [IsManagerOrAbove]
    filterset_fields = ['status']


class RazorpayWebhookView(APIView):
    """
    Razorpay Webhook endpoint with HMAC-SHA256 signature verification,
    idempotency checking, and subscription lifecycle state management.
    POST /api/v1/billing/razorpay-webhook/
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        webhook_secret = getattr(settings, 'RAZORPAY_WEBHOOK_SECRET', '') or ''
        received_signature = request.headers.get('X-Razorpay-Signature') or request.META.get('HTTP_X_RAZORPAY_SIGNATURE', '')
        
        # In DRF, request.body or request._body contains the raw payload
        raw_body = getattr(request, '_body', None) or request.body
        if not raw_body and hasattr(request, 'data'):
            raw_body = json.dumps(request.data).encode('utf-8')

        # 1. Signature Verification
        if webhook_secret:
            expected_signature = hmac.new(
                webhook_secret.encode('utf-8'),
                raw_body,
                hashlib.sha256
            ).hexdigest()

            if not hmac.compare_digest(expected_signature, received_signature):
                logger.warning(
                    "Invalid Razorpay webhook signature",
                    extra={'received_sig': received_signature}
                )
                return Response(
                    {'error': 'Invalid webhook signature'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            if not settings.DEBUG:
                logger.error("RAZORPAY_WEBHOOK_SECRET is not configured in production")
                return Response(
                    {'error': 'Webhook secret unconfigured'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        # 2. Parse Payload
        try:
            payload = json.loads(raw_body.decode('utf-8'))
        except (json.JSONDecodeError, UnicodeDecodeError):
            return Response({'error': 'Malformed JSON payload'}, status=status.HTTP_400_BAD_REQUEST)

        event_id = payload.get('event_id') or payload.get('id')
        event_type = payload.get('event', '')

        # 3. Idempotency Check
        if event_id:
            cache_key = f"razorpay_event_{event_id}"
            if cache.get(cache_key):
                logger.info(f"Duplicate Razorpay event ignored: {event_id}")
                return Response({'status': 'DUPLICATE_IGNORED', 'event_id': event_id}, status=status.HTTP_200_OK)
            cache.set(cache_key, '1', 86400) # Cache for 24 hours

        logger.info(f"Processing Razorpay webhook event: {event_type}")

        # 4. State Transitions
        event_entity = payload.get('payload', {})
        sub_entity = event_entity.get('subscription', {}).get('entity', {})
        sub_id = sub_entity.get('id')

        if sub_id:
            subscriptions = Subscription.objects.filter(razorpay_subscription_id=sub_id)
            if event_type in ('subscription.activated', 'subscription.charged', 'payment.captured'):
                subscriptions.update(status='ACTIVE')
            elif event_type in ('subscription.halted', 'payment.failed'):
                subscriptions.update(status='PAST_DUE')
            elif event_type in ('subscription.cancelled', 'subscription.completed'):
                subscriptions.update(status='CANCELLED')

        return Response({
            'status': 'PROCESSED',
            'event': event_type,
            'event_id': event_id,
            'timestamp': timezone.now().isoformat()
        }, status=status.HTTP_200_OK)
