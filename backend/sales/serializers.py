from rest_framework import serializers
from core.serializers import TenantScopedSerializer
from .models import (
    Lead, LeadFollowUp, TestDrive, Quotation, Booking, Appointment,
    SalesTarget, IncentiveRule, IncentiveCalculation
)


class LeadFollowUpSerializer(TenantScopedSerializer):
    class Meta(TenantScopedSerializer.Meta):
        model = LeadFollowUp
        fields = '__all__'


class LeadSerializer(TenantScopedSerializer):
    customer_name = serializers.CharField(source='customer.__str__', read_only=True)
    follow_ups = LeadFollowUpSerializer(many=True, read_only=True)

    class Meta(TenantScopedSerializer.Meta):
        model = Lead
        fields = '__all__'


class TestDriveSerializer(TenantScopedSerializer):
    customer_name = serializers.CharField(source='customer.__str__', read_only=True)

    class Meta(TenantScopedSerializer.Meta):
        model = TestDrive
        fields = '__all__'


class QuotationSerializer(TenantScopedSerializer):
    customer_name = serializers.CharField(source='customer.__str__', read_only=True)

    class Meta(TenantScopedSerializer.Meta):
        model = Quotation
        fields = '__all__'


class BookingSerializer(TenantScopedSerializer):
    customer_name = serializers.CharField(source='customer.__str__', read_only=True)

    class Meta(TenantScopedSerializer.Meta):
        model = Booking
        fields = '__all__'


class AppointmentSerializer(TenantScopedSerializer):
    customer_name = serializers.CharField(source='customer.__str__', read_only=True)
    vehicle_details = serializers.CharField(source='vehicle.__str__', read_only=True)

    class Meta(TenantScopedSerializer.Meta):
        model = Appointment
        fields = '__all__'


class SalesTargetSerializer(TenantScopedSerializer):
    branch_name = serializers.CharField(source='branch.name', read_only=True, default='')

    class Meta(TenantScopedSerializer.Meta):
        model = SalesTarget
        fields = '__all__'
        read_only_fields = ['id', 'organization_id', 'branch_id', 'created_at', 'updated_at', 'achievement_percentage', 'gap_to_target_units', 'ai_predicted_units']


class IncentiveRuleSerializer(TenantScopedSerializer):
    class Meta(TenantScopedSerializer.Meta):
        model = IncentiveRule
        fields = '__all__'


class IncentiveCalculationSerializer(TenantScopedSerializer):
    rule_name = serializers.CharField(source='rule.name', read_only=True)

    class Meta(TenantScopedSerializer.Meta):
        model = IncentiveCalculation
        fields = '__all__'
        read_only_fields = ['id', 'organization_id', 'branch_id', 'created_at', 'updated_at', 'final_payable', 'calculation_audit_trail']

