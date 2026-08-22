from rest_framework import serializers
from core.serializers import TenantScopedSerializer
from .models import InsurancePolicy, InsuranceRenewal, InsuranceClaim


class InsuranceRenewalSerializer(TenantScopedSerializer):
    policy_number = serializers.CharField(source='policy.policy_number', read_only=True)

    class Meta(TenantScopedSerializer.Meta):
        model = InsuranceRenewal
        fields = '__all__'


class InsuranceClaimSerializer(TenantScopedSerializer):
    policy_number = serializers.CharField(source='policy.policy_number', read_only=True)
    vehicle_registration = serializers.CharField(source='policy.vehicle.registration_number', read_only=True)

    class Meta(TenantScopedSerializer.Meta):
        model = InsuranceClaim
        fields = '__all__'


class InsurancePolicySerializer(TenantScopedSerializer):
    customer_name = serializers.CharField(source='customer.__str__', read_only=True)
    vehicle_details = serializers.CharField(source='vehicle.__str__', read_only=True)
    renewals = InsuranceRenewalSerializer(many=True, read_only=True)
    claims = InsuranceClaimSerializer(many=True, read_only=True)

    class Meta(TenantScopedSerializer.Meta):
        model = InsurancePolicy
        fields = '__all__'
