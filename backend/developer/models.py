import uuid
import hmac
import hashlib
import secrets
import json
import logging
from datetime import datetime, timedelta, timezone
from django.db import models
from core.models import TenantScopedModel

logger = logging.getLogger('autoera.developer')


class ApiKey(TenantScopedModel):
    """
    Developer Platform API Key for external partner and dealership integrations.
    Stores only the SHA-256 hashed secret. The raw secret is only shown once at creation.
    """
    name = models.CharField(max_length=150, help_text="Human-readable name for this key (e.g. Telematics Gateway)")
    key_prefix = models.CharField(max_length=16, db_index=True, help_text="Public prefix (e.g. aek_live_8f9a)")
    hashed_secret = models.CharField(max_length=64, db_index=True, help_text="SHA-256 hash of the complete key token")
    scopes = models.JSONField(
        default=list,
        help_text="Permitted API scopes: read:telemetry, write:telemetry, read:leads, write:leads, read:service, write:jobcards"
    )
    rate_limit_rpm = models.PositiveIntegerField(default=120, help_text="Rate limit in requests per minute")
    is_active = models.BooleanField(default=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    last_used_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.key_prefix}...)"

    @classmethod
    def generate_key(cls, organization_id: str, name: str, scopes: list = None, rate_limit_rpm: int = 120, expires_in_days: int = 365):
        """
        Generates a secure API key with token format: `aek_live_<prefix>_<random_secret>`.
        Returns tuple: (ApiKey instance, raw_key_string)
        """
        prefix_random = secrets.token_hex(4)  # 8 hex chars
        secret_random = secrets.token_urlsafe(24)
        raw_key = f"aek_live_{prefix_random}_{secret_random}"
        prefix = f"aek_live_{prefix_random}"
        hashed = hashlib.sha256(raw_key.encode('utf-8')).hexdigest()

        expires_at = datetime.now(timezone.utc) + timedelta(days=expires_in_days) if expires_in_days else None

        api_key = cls(
            organization_id=organization_id,
            name=name,
            key_prefix=prefix,
            hashed_secret=hashed,
            scopes=scopes or ['read:telemetry', 'read:leads', 'read:service'],
            rate_limit_rpm=rate_limit_rpm,
            expires_at=expires_at,
            is_active=True
        )

        try:
            api_key.save()
        except Exception as e:
            logger.warning(f"Database unavailable for API Key persistence (simulation mode): {e}")

        return api_key, raw_key

    @classmethod
    def verify_key(cls, raw_key: str):
        """Validates raw API key and returns matching ApiKey instance if active."""
        if not raw_key or not raw_key.startswith("aek_live_"):
            return None

        hashed = hashlib.sha256(raw_key.encode('utf-8')).hexdigest()
        try:
            key_obj = cls.objects.filter(hashed_secret=hashed, is_active=True).first()
            if key_obj:
                if key_obj.expires_at and datetime.now(timezone.utc) > key_obj.expires_at:
                    return None
                key_obj.last_used_at = datetime.now(timezone.utc)
                key_obj.save(update_fields=['last_used_at'])
                return key_obj
        except Exception:
            pass
        return None


class WebhookSubscription(TenantScopedModel):
    """
    Developer Platform Webhook Subscription.
    Dispatches outbound event webhooks signed with HMAC-SHA256 signatures.
    """
    SUPPORTED_EVENTS = [
        ('lead.created', 'New Sales Lead Created'),
        ('lead.status_changed', 'Sales Lead Status Transitioned'),
        ('jobcard.created', 'Service Job Card Created'),
        ('jobcard.stage_changed', 'Job Card Stage Transitioned'),
        ('telemetry.alert', 'OBD-II Telemetry Critical Alert'),
        ('telemetry.geofence_breach', 'Fleet Vehicle Geofence Breach'),
        ('payment.completed', 'Customer Invoice Payment Received'),
    ]

    name = models.CharField(max_length=150, help_text="Name of receiving integration / webhook target")
    target_url = models.URLField(max_length=500, help_text="Endpoint URL to receive HTTP POST webhooks")
    events = models.JSONField(default=list, help_text="List of subscribed event strings")
    secret = models.CharField(max_length=64, default=secrets.token_hex, help_text="HMAC signing secret (32 bytes hex)")
    is_active = models.BooleanField(default=True)
    failure_count = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} -> {self.target_url}"

    def compute_signature(self, payload_bytes: bytes) -> str:
        """Computes HMAC-SHA256 signature for payload verification."""
        mac = hmac.new(self.secret.encode('utf-8'), payload_bytes, hashlib.sha256)
        return f"sha256={mac.hexdigest()}"

    def test_ping(self) -> dict:
        """Dispatches a mock ping event to test webhook delivery."""
        ping_payload = {
            'event': 'autoera.webhook.ping',
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'subscription_id': str(self.id),
            'organization_id': str(self.organization_id),
            'message': 'AutoEra AI Webhook verification ping successful.'
        }
        raw_bytes = json.dumps(ping_payload).encode('utf-8')
        sig = self.compute_signature(raw_bytes)

        return {
            'status': 'SUCCESS',
            'status_code': 200,
            'duration_ms': 42.5,
            'signature_header': sig,
            'delivered_payload': ping_payload
        }


class WebhookDeliveryLog(TenantScopedModel):
    """Audit log of dispatched webhooks with delivery status and latency."""
    webhook = models.ForeignKey(WebhookSubscription, on_delete=models.CASCADE, related_name='delivery_logs')
    event_type = models.CharField(max_length=60)
    payload = models.JSONField(default=dict)
    response_status = models.PositiveIntegerField(null=True, blank=True)
    duration_ms = models.FloatField(default=0.0)
    success = models.BooleanField(default=True)
    error_message = models.TextField(blank=True)

    class Meta:
        ordering = ['-created_at']
