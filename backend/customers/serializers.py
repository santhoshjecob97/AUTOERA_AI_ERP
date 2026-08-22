from rest_framework import serializers
from core.serializers import TenantScopedSerializer
from .models import Customer, CustomerTimeline


class CustomerTimelineSerializer(TenantScopedSerializer):
    class Meta(TenantScopedSerializer.Meta):
        model = CustomerTimeline
        fields = '__all__'


class CustomerSerializer(TenantScopedSerializer):
    timeline_events = CustomerTimelineSerializer(many=True, read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta(TenantScopedSerializer.Meta):
        model = Customer
        fields = '__all__'

    def get_full_name(self, obj) -> str:
        return f"{obj.first_name} {obj.last_name}".strip()

