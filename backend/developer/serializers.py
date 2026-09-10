from rest_framework import serializers
from .models import ApiKey, WebhookSubscription, WebhookDeliveryLog


class ApiKeySerializer(serializers.ModelSerializer):
    class Meta:
        model = ApiKey
        fields = [
            'id', 'name', 'key_prefix', 'scopes', 'rate_limit_rpm',
            'is_active', 'expires_at', 'last_used_at', 'created_at'
        ]
        read_only_fields = ['id', 'key_prefix', 'last_used_at', 'created_at']


class WebhookSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebhookSubscription
        fields = [
            'id', 'name', 'target_url', 'events', 'secret',
            'is_active', 'failure_count', 'created_at'
        ]
        read_only_fields = ['id', 'secret', 'failure_count', 'created_at']


class WebhookDeliveryLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebhookDeliveryLog
        fields = [
            'id', 'webhook', 'event_type', 'payload',
            'response_status', 'duration_ms', 'success', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
