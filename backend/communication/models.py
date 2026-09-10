import uuid
from django.db import models
from core.models import TenantScopedModel

class Notification(TenantScopedModel):
    CHANNEL_CHOICES = [
        ('IN_APP', 'In App Toast'),
        ('EMAIL', 'Email'),
        ('SMS', 'SMS'),
        ('WHATSAPP', 'WhatsApp'),
    ]

    STATUS_CHOICES = [
        ('QUEUED', 'Queued'),
        ('SENT', 'Sent to Gateway'),
        ('DELIVERED', 'Delivered'),
        ('READ', 'Read by Recipient'),
        ('FAILED', 'Delivery Failed'),
    ]

    title = models.CharField(max_length=255)
    message = models.TextField()
    channel = models.CharField(max_length=50, choices=CHANNEL_CHOICES, default='IN_APP')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='QUEUED')
    recipient_email = models.EmailField(blank=True)
    recipient_phone = models.CharField(max_length=20, blank=True)
    payload = models.JSONField(default=dict, blank=True, help_text="Template variables, webhook responses, deep links")
    retry_count = models.IntegerField(default=0)
    external_message_id = models.CharField(max_length=150, blank=True, help_text="Gupshup / Twilio / SendGrid tracking ID")
    is_read = models.BooleanField(default=False)
    sent_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['organization_id', 'status']),
            models.Index(fields=['organization_id', 'channel']),
            models.Index(fields=['organization_id', 'is_read']),
        ]

    def __str__(self):
        return f"[{self.get_channel_display()}] {self.title} ({self.status})"

