from rest_framework import serializers
from core.serializers import TenantScopedSerializer
from .models import Lead, LeadFollowUp, TestDrive, Quotation, Booking, Appointment


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
