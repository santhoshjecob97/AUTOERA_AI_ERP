from core.views import TenantScopedViewSet
from .models import Notification
from .serializers import NotificationSerializer


class NotificationViewSet(TenantScopedViewSet):
    """Notification management — tenant-isolated."""
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    filterset_fields = ['channel', 'is_read']
    ordering_fields = ['created_at', 'is_read']
    ordering = ['-created_at']
