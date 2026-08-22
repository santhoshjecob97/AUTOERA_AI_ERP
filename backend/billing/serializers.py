from rest_framework import serializers
from core.serializers import TenantScopedSerializer
from .models import SaaSPlan, Subscription


class SaaSPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaaSPlan
        fields = '__all__'


class SubscriptionSerializer(TenantScopedSerializer):
    plan_details = SaaSPlanSerializer(source='plan', read_only=True)

    class Meta(TenantScopedSerializer.Meta):
        model = Subscription
        fields = '__all__'
