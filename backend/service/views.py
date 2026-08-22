from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from core.views import TenantScopedViewSet
from core.permissions import IsServiceRole
from .models import JobCard, ServiceCheckIn, ServiceInspection, InspectionItem, JobCardPart, JobCardLabour
from .serializers import (
    JobCardSerializer, ServiceCheckInSerializer, ServiceInspectionSerializer,
    InspectionItemSerializer, JobCardPartSerializer, JobCardLabourSerializer
)


class JobCardViewSet(TenantScopedViewSet):
    """Job Card management — tenant-isolated, service role required, state machine enforced."""
    queryset = JobCard.objects.select_related('customer', 'vehicle', 'allocated_bay', 'assigned_technician').prefetch_related('parts_consumed', 'labour_items', 'inspections').all()
    serializer_class = JobCardSerializer
    permission_classes = [IsServiceRole]
    search_fields = ['job_card_number', 'customer__first_name', 'vehicle__registration_number', 'vehicle__vin']
    filterset_fields = ['status']
    ordering_fields = ['created_at', 'promised_delivery', 'status']
    ordering = ['-created_at']

    @action(detail=True, methods=['post'])
    def transition_status(self, request, pk=None):
        """Enforces legal server-side state machine status transitions."""
        job_card = self.get_object()
        new_status = request.data.get('status')

        if not new_status:
            return Response({'error': 'New status is required'}, status=status.HTTP_400_BAD_REQUEST)

        if not job_card.can_transition_to(new_status):
            return Response({
                'error': f"Illegal status transition from {job_card.status} to {new_status}",
                'allowed_transitions': list(job_card.VALID_TRANSITIONS.get(job_card.status, []))
            }, status=status.HTTP_400_BAD_REQUEST)

        old_status = job_card.status
        job_card.status = new_status
        if new_status == 'DELIVERED':
            from django.utils import timezone
            job_card.actual_delivery = timezone.now()
        job_card.save(update_fields=['status', 'actual_delivery'])

        return Response({
            'message': f"Job card transitioned from {old_status} to {new_status}",
            'job_card': JobCardSerializer(job_card).data
        }, status=status.HTTP_200_OK)


class ServiceCheckInViewSet(TenantScopedViewSet):
    """Vehicle check-in reception."""
    queryset = ServiceCheckIn.objects.select_related('customer', 'vehicle').all()
    serializer_class = ServiceCheckInSerializer
    permission_classes = [IsServiceRole]
    ordering = ['-created_at']


class ServiceInspectionViewSet(TenantScopedViewSet):
    """Multi-point vehicle inspection records."""
    queryset = ServiceInspection.objects.select_related('job_card').prefetch_related('items').all()
    serializer_class = ServiceInspectionSerializer
    permission_classes = [IsServiceRole]
    ordering = ['-created_at']


class JobCardPartViewSet(TenantScopedViewSet):
    """Parts issued and consumed on a Job Card."""
    queryset = JobCardPart.objects.select_related('job_card', 'part').all()
    serializer_class = JobCardPartSerializer
    permission_classes = [IsServiceRole]

    def perform_create(self, serializer):
        instance = serializer.save(organization_id=self._get_tenant_context()[0])
        # Auto-recalculate job card totals
        instance.job_card.recalculate_totals()


class JobCardLabourViewSet(TenantScopedViewSet):
    """Technician labour tasks on a Job Card."""
    queryset = JobCardLabour.objects.select_related('job_card', 'technician').all()
    serializer_class = JobCardLabourSerializer
    permission_classes = [IsServiceRole]

    def perform_create(self, serializer):
        instance = serializer.save(organization_id=self._get_tenant_context()[0])
        instance.job_card.recalculate_totals()
