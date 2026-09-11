from rest_framework import serializers
from core.serializers import TenantScopedSerializer
from .models import WorkshopBay, Technician, TechnicianTimeLog, DailyTechnicianMetrics


class WorkshopBaySerializer(TenantScopedSerializer):
    class Meta(TenantScopedSerializer.Meta):
        model = WorkshopBay
        fields = '__all__'


class TechnicianSerializer(TenantScopedSerializer):
    class Meta(TenantScopedSerializer.Meta):
        model = Technician
        fields = '__all__'


class TechnicianTimeLogSerializer(TenantScopedSerializer):
    technician_name = serializers.CharField(source='technician.name', read_only=True)
    job_card_number = serializers.CharField(source='job_card.job_card_number', read_only=True, default='')

    class Meta(TenantScopedSerializer.Meta):
        model = TechnicianTimeLog
        fields = '__all__'
        read_only_fields = ['id', 'organization_id', 'branch_id', 'created_at', 'updated_at', 'actual_hours', 'ai_efficiency_flag']


class DailyTechnicianMetricsSerializer(TenantScopedSerializer):
    technician_name = serializers.CharField(source='technician.name', read_only=True)
    skill_tier = serializers.CharField(source='technician.skill_tier', read_only=True)

    class Meta(TenantScopedSerializer.Meta):
        model = DailyTechnicianMetrics
        fields = '__all__'
        read_only_fields = ['id', 'organization_id', 'branch_id', 'created_at', 'updated_at', 'productivity_pct', 'efficiency_pct', 'utilization_pct']

