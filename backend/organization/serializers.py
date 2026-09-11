from rest_framework import serializers
from core.serializers import TenantScopedSerializer
from .models import Organization, DealerGroup, Branch, Department, BusinessSettings, DailyBranchChecklist


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


class DailyBranchChecklistSerializer(TenantScopedSerializer):
    branch_name = serializers.CharField(source='branch.name', read_only=True)

    class Meta(TenantScopedSerializer.Meta):
        model = DailyBranchChecklist
        fields = '__all__'
        read_only_fields = [
            'id', 'organization_id', 'branch_id', 'created_at', 'updated_at',
            'completion_percentage', 'critical_issues_count'
        ]

