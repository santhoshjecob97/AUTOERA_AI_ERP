from core.serializers import TenantScopedSerializer
from .models import Notification


class NotificationSerializer(TenantScopedSerializer):
    class Meta(TenantScopedSerializer.Meta):
        model = Notification
        fields = '__all__'
