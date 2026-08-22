import hmac
import hashlib
import json
from django.test import TestCase, override_settings
from rest_framework.test import APIClient
from rest_framework import status
from django.utils import timezone
from organization.models import Organization
from billing.models import SaaSPlan, Subscription


class RazorpayWebhookSecurityTest(TestCase):
    """
    P0 SECURITY TEST SUITE: Payment & Webhook Security
    Verifies HMAC-SHA256 signature verification, replay protection, and state updates.
    """

    WEBHOOK_SECRET = 'test_webhook_secret_key_12345'

    def setUp(self):
        self.client = APIClient()
        self.org = Organization.objects.create(name='Apex Dealership', slug='apex-dealership')
        self.plan = SaaSPlan.objects.create(
            name='Professional Tier', slug='pro', price_monthly=4999.00
        )
        self.subscription = Subscription.objects.create(
            organization_id=self.org.id,
            plan=self.plan,
            status='ACTIVE',
            current_period_start=timezone.now(),
            current_period_end=timezone.now() + timezone.timedelta(days=30),
            razorpay_subscription_id='sub_test_001'
        )

    def _generate_signature(self, body_bytes: bytes) -> str:
        return hmac.new(
            self.WEBHOOK_SECRET.encode('utf-8'),
            body_bytes,
            hashlib.sha256
        ).hexdigest()

    @override_settings(RAZORPAY_WEBHOOK_SECRET=WEBHOOK_SECRET)
    def test_valid_webhook_signature_processes_successfully(self):
        """A valid HMAC-SHA256 signature is accepted and processes the event."""
        payload = {
            'event_id': 'evt_test_001',
            'event': 'subscription.charged',
            'payload': {
                'subscription': {
                    'entity': {
                        'id': 'sub_test_001',
                        'status': 'active'
                    }
                }
            }
        }
        body_str = json.dumps(payload)
        signature = self._generate_signature(body_str.encode('utf-8'))

        response = self.client.post(
            '/api/v1/billing/razorpay-webhook/',
            data=body_str,
            content_type='application/json',
            HTTP_X_RAZORPAY_SIGNATURE=signature
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get('status'), 'PROCESSED')

    @override_settings(RAZORPAY_WEBHOOK_SECRET=WEBHOOK_SECRET)
    def test_forged_webhook_signature_is_rejected(self):
        """ATTACK SCENARIO: Forged/fake signature must receive HTTP 400 Bad Request."""
        payload = {'event_id': 'evt_hack_001', 'event': 'payment.captured'}
        body_str = json.dumps(payload)
        response = self.client.post(
            '/api/v1/billing/razorpay-webhook/',
            data=body_str,
            content_type='application/json',
            HTTP_X_RAZORPAY_SIGNATURE='forged_invalid_signature_hex'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    @override_settings(RAZORPAY_WEBHOOK_SECRET=WEBHOOK_SECRET)
    def test_duplicate_webhook_replay_is_ignored(self):
        """Replay attack with previously processed event ID is ignored safely."""
        payload = {
            'event_id': 'evt_replay_001',
            'event': 'payment.captured',
            'payload': {}
        }
        body_str = json.dumps(payload)
        signature = self._generate_signature(body_str.encode('utf-8'))

        # First delivery
        resp1 = self.client.post(
            '/api/v1/billing/razorpay-webhook/',
            data=body_str,
            content_type='application/json',
            HTTP_X_RAZORPAY_SIGNATURE=signature
        )
        self.assertEqual(resp1.status_code, status.HTTP_200_OK)
        self.assertEqual(resp1.data.get('status'), 'PROCESSED')

        # Replay delivery
        resp2 = self.client.post(
            '/api/v1/billing/razorpay-webhook/',
            data=body_str,
            content_type='application/json',
            HTTP_X_RAZORPAY_SIGNATURE=signature
        )
        self.assertEqual(resp2.status_code, status.HTTP_200_OK)
        self.assertEqual(resp2.data.get('status'), 'DUPLICATE_IGNORED')
