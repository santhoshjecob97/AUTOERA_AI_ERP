from rest_framework import serializers


class TenantScopedSerializer(serializers.ModelSerializer):
    """
    Base serializer for TenantScopedModel entities.
    Marks organization_id and branch_id as read-only because
    they are injected automatically by TenantScopedViewSet.perform_create().
    """
    class Meta:
        abstract = True
        read_only_fields = ['id', 'organization_id', 'branch_id', 'created_at', 'updated_at']
