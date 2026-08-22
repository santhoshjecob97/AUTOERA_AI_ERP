from core.serializers import TenantScopedSerializer
from .models import WorkshopBay, Technician


class WorkshopBaySerializer(TenantScopedSerializer):
    class Meta(TenantScopedSerializer.Meta):
        model = WorkshopBay
        fields = '__all__'


class TechnicianSerializer(TenantScopedSerializer):
    class Meta(TenantScopedSerializer.Meta):
        model = Technician
        fields = '__all__'
