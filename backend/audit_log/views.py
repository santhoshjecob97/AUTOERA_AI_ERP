from core.views import TenantScopedReadOnlyViewSet
from core.permissions import IsManagerOrAbove
from .models import AuditLog
from .serializers import AuditLogSerializer


class AuditLogViewSet(TenantScopedReadOnlyViewSet):
    """Audit log history — tenant-isolated, manager+ access only."""
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsManagerOrAbove]
    search_fields = ['user_email', 'action', 'resource_type']
    filterset_fields = ['action', 'resource_type']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
