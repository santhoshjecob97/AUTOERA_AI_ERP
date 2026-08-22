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

    title = models.CharField(max_length=255)
    message = models.TextField()
    channel = models.CharField(max_length=50, choices=CHANNEL_CHOICES, default='IN_APP')
    recipient_email = models.EmailField(blank=True)
    recipient_phone = models.CharField(max_length=20, blank=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} ({self.get_channel_display()})"
