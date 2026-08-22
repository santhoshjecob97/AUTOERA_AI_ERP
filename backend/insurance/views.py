from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from core.views import TenantScopedViewSet
from core.permissions import IsFinanceRole, IsManagerOrAbove
from .models import InsurancePolicy, InsuranceRenewal, InsuranceClaim
from .serializers import InsurancePolicySerializer, InsuranceRenewalSerializer, InsuranceClaimSerializer


class InsurancePolicyViewSet(TenantScopedViewSet):
    """Insurance policies — tenant-isolated."""
    queryset = InsurancePolicy.objects.select_related('customer', 'vehicle').prefetch_related('renewals', 'claims').all()
    serializer_class = InsurancePolicySerializer
    permission_classes = [IsFinanceRole | IsManagerOrAbove]
    search_fields = ['policy_number', 'insurer_name', 'customer__first_name', 'vehicle__registration_number']
    filterset_fields = ['status', 'policy_type', 'insurer_name']
    ordering_fields = ['expiry_date', 'start_date', 'created_at']
    ordering = ['expiry_date']

    @action(detail=False, methods=['get'])
    def renewals_due(self, request):
        """Returns policies expiring within the next 30 days."""
        from django.utils import timezone
        today = timezone.now().date()
        in_30_days = today + timezone.timedelta(days=30)
        qs = self.get_queryset().filter(expiry_date__lte=in_30_days, expiry_date__gte=today)
        serializer = self.get_serializer(qs, many=True)
        return Response({'policies_expiring_soon': serializer.data, 'count': qs.count()}, status=status.HTTP_200_OK)


class InsuranceRenewalViewSet(TenantScopedViewSet):
    """Policy renewal tasks."""
    queryset = InsuranceRenewal.objects.select_related('policy').all()
    serializer_class = InsuranceRenewalSerializer
    permission_classes = [IsFinanceRole | IsManagerOrAbove]
    filterset_fields = ['status']
    ordering = ['renewal_due_date']


class InsuranceClaimViewSet(TenantScopedViewSet):
    """Insurance claims — tenant-isolated, fraud risk tracking."""
    queryset = InsuranceClaim.objects.select_related('policy').all()
    serializer_class = InsuranceClaimSerializer
    permission_classes = [IsFinanceRole | IsManagerOrAbove]
    search_fields = ['claim_number', 'status']
    filterset_fields = ['status']
    ordering_fields = ['incident_date', 'claim_amount', 'ai_fraud_risk_score']
    ordering = ['-incident_date']
