from rest_framework import serializers
from core.serializers import TenantScopedSerializer
from .models import Vehicle, VehicleStock


class VehicleSerializer(TenantScopedSerializer):
    customer_name = serializers.CharField(source='customer.__str__', read_only=True)

    class Meta(TenantScopedSerializer.Meta):
        model = Vehicle
        fields = '__all__'


class VehicleStockSerializer(TenantScopedSerializer):
    allocated_customer_name = serializers.CharField(source='allocated_to_customer.__str__', read_only=True)

    class Meta(TenantScopedSerializer.Meta):
        model = VehicleStock
        fields = '__all__'
