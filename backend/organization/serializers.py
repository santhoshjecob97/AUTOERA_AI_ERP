from rest_framework import serializers
from core.serializers import TenantScopedSerializer
from .models import Organization, DealerGroup, Branch, Department, BusinessSettings


class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = '__all__'


class DealerGroupSerializer(serializers.ModelSerializer):
    branches = BranchSerializer(many=True, read_only=True)

    class Meta:
        model = DealerGroup
        fields = '__all__'


class OrganizationSerializer(serializers.ModelSerializer):
    dealer_groups = DealerGroupSerializer(many=True, read_only=True)

    class Meta:
        model = Organization
        fields = '__all__'


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'


class BusinessSettingsSerializer(TenantScopedSerializer):
    class Meta(TenantScopedSerializer.Meta):
        model = BusinessSettings
        fields = '__all__'
