from core.serializers import TenantScopedSerializer
from .models import AuditLog


class AuditLogSerializer(TenantScopedSerializer):
    class Meta(TenantScopedSerializer.Meta):
        model = AuditLog
        fields = '__all__'
