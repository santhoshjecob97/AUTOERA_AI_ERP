from rest_framework import serializers
from core.serializers import TenantScopedSerializer
from .models import JobCard, ServiceCheckIn, ServiceInspection, InspectionItem, JobCardPart, JobCardLabour


class JobCardPartSerializer(TenantScopedSerializer):
    part_name = serializers.CharField(source='part.name', read_only=True)
    part_number = serializers.CharField(source='part.part_number', read_only=True)

    class Meta(TenantScopedSerializer.Meta):
        model = JobCardPart
        fields = '__all__'


class JobCardLabourSerializer(TenantScopedSerializer):
    technician_name = serializers.CharField(source='technician.name', read_only=True)

    class Meta(TenantScopedSerializer.Meta):
        model = JobCardLabour
        fields = '__all__'


class InspectionItemSerializer(TenantScopedSerializer):
    class Meta(TenantScopedSerializer.Meta):
        model = InspectionItem
        fields = '__all__'


class ServiceInspectionSerializer(TenantScopedSerializer):
    items = InspectionItemSerializer(many=True, read_only=True)

    class Meta(TenantScopedSerializer.Meta):
        model = ServiceInspection
        fields = '__all__'


class ServiceCheckInSerializer(TenantScopedSerializer):
    customer_name = serializers.CharField(source='customer.__str__', read_only=True)
    vehicle_details = serializers.CharField(source='vehicle.__str__', read_only=True)

    class Meta(TenantScopedSerializer.Meta):
        model = ServiceCheckIn
        fields = '__all__'


class JobCardSerializer(TenantScopedSerializer):
    customer_name = serializers.CharField(source='customer.__str__', read_only=True)
    customer_phone = serializers.CharField(source='customer.phone', read_only=True)
    vehicle_details = serializers.CharField(source='vehicle.__str__', read_only=True)
    bay_name = serializers.CharField(source='allocated_bay.name', read_only=True)
    technician_name = serializers.CharField(source='assigned_technician.name', read_only=True)
    parts_consumed = JobCardPartSerializer(many=True, read_only=True)
    labour_items = JobCardLabourSerializer(many=True, read_only=True)
    inspections = ServiceInspectionSerializer(many=True, read_only=True)

    class Meta(TenantScopedSerializer.Meta):
        model = JobCard
        fields = '__all__'


class ServiceAppointmentScheduleSerializer(TenantScopedSerializer):
    class Meta(TenantScopedSerializer.Meta):
        from .models import ServiceAppointmentSchedule
        model = ServiceAppointmentSchedule
        fields = '__all__'


class WarrantyClaimSerializer(TenantScopedSerializer):
    class Meta(TenantScopedSerializer.Meta):
        from .models import WarrantyClaim
        model = WarrantyClaim
        fields = '__all__'


class QualityChecklistSerializer(TenantScopedSerializer):
    class Meta(TenantScopedSerializer.Meta):
        from .models import QualityChecklist
        model = QualityChecklist
        fields = '__all__'

