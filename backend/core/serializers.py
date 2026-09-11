from rest_framework import serializers


class TenantScopedSerializer(serializers.ModelSerializer):
    """
    Base serializer for TenantScopedModel entities.
    Marks tenant isolation and audit fields as read-only because
    they are derived and injected automatically by TenantScopedViewSet.perform_create().
    """
    tenant_id = serializers.UUIDField(source='organization_id', read_only=True)

    class Meta:
        abstract = True
        read_only_fields = [
            'id', 'tenant_id', 'organization_id', 'group_id', 'branch_id', 
            'department_id', 'user_id', 'source_system', 'audit_metadata',
            'created_at', 'updated_at'
        ]

