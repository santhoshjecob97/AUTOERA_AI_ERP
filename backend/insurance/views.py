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

    @action(detail=False, methods=['post'])
    def trigger_renewal_sequences(self, request):
        """Executes automated 90/60/30/7-day WhatsApp renewal notification sequences."""
        from .services import InsuranceRenewalAutomation
        org_id = getattr(request, 'organization_id', None)
        result = InsuranceRenewalAutomation.run_renewal_sequence(organization_id=org_id)
        return Response({'message': 'Renewal sequence processed', 'result': result}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def commission_dashboard(self, request):
        """Calculates dealer gross insurance commissions and executive incentive pools."""
        from .services import CommissionDashboardEngine
        org_id = getattr(request, 'organization_id', None)
        data = CommissionDashboardEngine.get_commission_dashboard(organization_id=org_id)
        return Response(data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def compare_quotes(self, request):
        """Aggregates live comparative quotes from 4+ insurers via API."""
        from .services import MultiInsurerQuoteComparisonEngine
        from decimal import Decimal
        idv = Decimal(str(request.query_params.get('idv', '850000.00')))
        ncb = int(request.query_params.get('ncb', 25))
        zero_dep = request.query_params.get('zero_dep', 'true').lower() == 'true'
        quotes = MultiInsurerQuoteComparisonEngine.get_comparative_quotes(idv=idv, ncb_pct=ncb, zero_dep_requested=zero_dep)
        return Response({'quotes': quotes}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def one_click_renewal(self, request):
        """Processes 1-click renewal with payment capture, policy issuance, and WhatsApp PDF dispatch."""
        from .services import OneClickRenewalProcessingEngine
        from decimal import Decimal
        policy_id = request.data.get('policy_id')
        chosen_insurer = request.data.get('chosen_insurer', 'HDFC ERGO')
        total_premium = Decimal(str(request.data.get('total_premium', '18500.00')))
        cust_name = request.data.get('customer_name', 'Customer')
        cust_phone = request.data.get('customer_phone', '+919876543210')
        payment_ref = request.data.get('payment_reference')

        res = OneClickRenewalProcessingEngine.process_one_click_renewal(
            policy_id=policy_id,
            chosen_insurer=chosen_insurer,
            total_premium=total_premium,
            customer_name=cust_name,
            customer_phone=cust_phone,
            payment_ref=payment_ref
        )
        return Response(res, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def predict_renewal(self, request):
        """AI renewal propensity classification model."""
        from .services import RenewalPredictionModel
        age = float(request.data.get('vehicle_age_years', 2.5))
        claims = int(request.data.get('claims_in_last_year', 0))
        visits = int(request.data.get('service_visits_past_year', 2))
        ncb = int(request.data.get('current_ncb_pct', 35))

        res = RenewalPredictionModel.predict_renewal_probability(
            vehicle_age_years=age,
            claims_in_last_year=claims,
            service_visits_past_year=visits,
            current_ncb_pct=ncb
        )
        return Response(res, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def evaluate_ncb(self, request):
        """Evaluates claim cost vs projected NCB loss to advise customer."""
        from .services import NCBTrackingEngine
        from decimal import Decimal
        ncb = int(request.data.get('current_ncb_pct', 25))
        od = Decimal(str(request.data.get('estimated_od_premium', '15000.00')))
        claim_cost = Decimal(str(request.data.get('claim_repair_cost', '4500.00')))

        res = NCBTrackingEngine.evaluate_claim_vs_ncb_loss(
            current_ncb_pct=ncb,
            estimated_od_premium=od,
            claim_repair_cost=claim_cost
        )
        return Response(res, status=status.HTTP_200_OK)



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

    @action(detail=False, methods=['post'])
    def ai_claim_filing(self, request):
        """6-angle photo damage assessment replacing physical surveyor."""
        from .services import AIClaimFilingEngine
        photos = request.data.get('photos', [])
        report = AIClaimFilingEngine.assess_damage_photos(photos_6_angles=photos)
        return Response(report, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Updates claim status and sends real-time WhatsApp notification."""
        from .services import ClaimStatusTrackingEngine
        from decimal import Decimal
        claim = self.get_object()
        new_status = request.data.get('status', 'AI_SURVEY_APPROVED')
        approved_amt = Decimal(str(request.data.get('approved_amount', claim.approved_amount or '18500.00')))
        customer_phone = claim.policy.customer.phone if claim.policy and claim.policy.customer else '+919876543210'

        res = ClaimStatusTrackingEngine.update_claim_status(
            claim_number=claim.claim_number or 'CLM-01',
            new_status=new_status,
            customer_phone=customer_phone,
            approved_amount=approved_amt
        )
        claim.status = new_status
        claim.approved_amount = approved_amt
        claim.save(update_fields=['status', 'approved_amount'])
        return Response(res, status=status.HTTP_200_OK)

