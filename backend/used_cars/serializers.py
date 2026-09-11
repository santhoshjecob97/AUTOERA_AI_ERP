"""
Used-Car Engine — DRF Serializers.
Provides serialization for Appraisal, Valuation, and Inventory models
with computed property fields exposed as read-only.
"""
from rest_framework import serializers
from core.serializers import TenantScopedSerializer
from .models import UsedCarAppraisal, UsedCarValuation, UsedCarInventory


class UsedCarAppraisalSerializer(TenantScopedSerializer):
    overall_inspection_score = serializers.DecimalField(
        max_digits=5, decimal_places=1, read_only=True
    )
    inspection_grade = serializers.CharField(read_only=True)
    vehicle_age_years = serializers.IntegerField(read_only=True)

    class Meta(TenantScopedSerializer.Meta):
        model = UsedCarAppraisal
        fields = '__all__'


class UsedCarValuationSerializer(TenantScopedSerializer):
    appraisal_number = serializers.ReadOnlyField(source='appraisal.appraisal_number')
    vehicle_description = serializers.SerializerMethodField()
    total_all_in_cost = serializers.DecimalField(
        max_digits=12, decimal_places=2, read_only=True
    )

    class Meta(TenantScopedSerializer.Meta):
        model = UsedCarValuation
        fields = '__all__'

    def get_vehicle_description(self, obj):
        a = obj.appraisal
        return f"{a.make} {a.model_name} {a.variant} ({a.manufacturing_year})"


class UsedCarInventorySerializer(TenantScopedSerializer):
    days_in_stock = serializers.IntegerField(read_only=True)
    accumulated_holding_cost = serializers.DecimalField(
        max_digits=12, decimal_places=2, read_only=True
    )
    total_cost_with_holding = serializers.DecimalField(
        max_digits=12, decimal_places=2, read_only=True
    )
    appraisal_number = serializers.ReadOnlyField(source='appraisal.appraisal_number')

    class Meta(TenantScopedSerializer.Meta):
        model = UsedCarInventory
        fields = '__all__'


class UsedCarAppraisalDetailSerializer(UsedCarAppraisalSerializer):
    """Extended serializer including nested valuation and inventory data."""
    valuation = UsedCarValuationSerializer(read_only=True)
    inventory = UsedCarInventorySerializer(read_only=True)

    class Meta(UsedCarAppraisalSerializer.Meta):
        fields = '__all__'
