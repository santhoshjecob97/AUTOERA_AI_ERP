from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from core.views import TenantScopedViewSet
from core.permissions import IsServiceRole
from .models import WorkshopBay, Technician
from .serializers import WorkshopBaySerializer, TechnicianSerializer


class WorkshopBayViewSet(TenantScopedViewSet):
    """Workshop bay management — tenant-isolated, service role."""
    queryset = WorkshopBay.objects.select_related('current_job_card').all()
    serializer_class = WorkshopBaySerializer
    permission_classes = [IsServiceRole]
    search_fields = ['name']
    filterset_fields = ['bay_type', 'is_occupied', 'is_active']
    ordering = ['name']

    @action(detail=False, methods=['get'])
    def utilization(self, request):
        """Returns real-time bay utilization statistics."""
        qs = self.get_queryset()
        total_bays = qs.count()
        occupied_bays = qs.filter(is_occupied=True).count()
        utilization_rate = round((occupied_bays / total_bays * 100), 1) if total_bays > 0 else 0
        return Response({
            'total_bays': total_bays,
            'occupied_bays': occupied_bays,
            'available_bays': total_bays - occupied_bays,
            'utilization_rate_pct': utilization_rate
        }, status=status.HTTP_200_OK)


class TechnicianViewSet(TenantScopedViewSet):
    """Technician management — tenant-isolated, service role."""
    queryset = Technician.objects.all()
    serializer_class = TechnicianSerializer
    permission_classes = [IsServiceRole]
    search_fields = ['name', 'specialization']
    filterset_fields = ['is_available', 'is_active']
    ordering = ['name']
