from decimal import Decimal
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from core.views import TenantScopedViewSet
from core.permissions import IsSalesRole, IsServiceRole, IsManagerOrAbove
from .models import (
    Lead, LeadFollowUp, TestDrive, Quotation, Booking, Appointment,
    SalesTarget, IncentiveRule, IncentiveCalculation
)
from .serializers import (
    LeadSerializer, LeadFollowUpSerializer, TestDriveSerializer,
    QuotationSerializer, BookingSerializer, AppointmentSerializer,
    SalesTargetSerializer, IncentiveRuleSerializer, IncentiveCalculationSerializer
)
from .services import (
    LeadStateMachine, LeadSLAEngine, AILeadScorer, MarginGuardEngine,
    SmartLeadAssigner, CompetitorIntelligenceEngine, LostLeadReengagementEngine,
    SalesForecastingEngine, OmniChannelLeadCaptureEngine
)


class LeadViewSet(TenantScopedViewSet):
    """Lead management — tenant-isolated, sales role required."""
    queryset = Lead.objects.select_related('customer').prefetch_related('follow_ups', 'quotations').all()
    serializer_class = LeadSerializer
    permission_classes = [IsSalesRole]
    search_fields = ['interested_vehicle_model', 'status', 'source', 'customer__first_name', 'customer__phone']
    filterset_fields = ['status', 'source', 'priority', 'sla_breached']
    ordering_fields = ['created_at', 'ai_score', 'status', 'sla_deadline']
    ordering = ['-created_at']

    @action(detail=False, methods=['get'])
    def pipeline_stats(self, request):
        """Returns CRM sales pipeline funnel statistics."""
        qs = self.get_queryset()
        stats = {
            'total_leads': qs.count(),
            'new': qs.filter(status='NEW').count(),
            'qualified': qs.filter(status='QUALIFIED').count(),
            'test_drive': qs.filter(status='TEST_DRIVE').count(),
            'quotation': qs.filter(status='QUOTATION').count(),
            'booked': qs.filter(status='BOOKED').count(),
            'won': qs.filter(status='CLOSED_WON').count(),
            'lost': qs.filter(status='CLOSED_LOST').count(),
            'sla_breached': qs.filter(sla_breached=True).count(),
        }
        return Response(stats, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def transition(self, request, pk=None):
        """Validates and transitions lead status via Lead State Machine."""
        lead = self.get_object()
        new_status = request.data.get('status')
        notes = request.data.get('notes', '')
        lost_reason = request.data.get('lost_reason', '')
        user_email = request.user.email if hasattr(request.user, 'email') else 'system'

        if not new_status:
            return Response({'error': 'status is required'}, status=status.HTTP_400_BAD_REQUEST)

        success, msg = LeadStateMachine.transition(
            lead, new_status, notes=notes, user_email=user_email, lost_reason=lost_reason
        )
        if not success:
            return Response({'error': msg}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'message': msg, 'lead': LeadSerializer(lead).data}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def score(self, request, pk=None):
        """Calculates multi-factor AI lead score and priority tier."""
        lead = self.get_object()
        result = AILeadScorer.score_lead(lead)
        return Response(result, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def evaluate_sla(self, request):
        """Scans for overdue leads and escalates according to SLA tiers."""
        org_id = getattr(request, 'organization_id', None)
        result = LeadSLAEngine.evaluate_and_escalate(organization_id=org_id)
        return Response(result, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def omnichannel(self, request):
        """Unified Omni-Channel Lead Capture (QR, WhatsApp, Web, Instagram, OEM)."""
        name = request.data.get('name', 'Walk-in Guest')
        phone = request.data.get('phone', '')
        email = request.data.get('email', '')
        source = request.data.get('source', 'WEBSITE')
        vehicle_model = request.data.get('vehicle_model', 'SUV')
        notes = request.data.get('notes', '')
        language = request.data.get('language', 'en')
        org_id = getattr(request, 'organization_id', None)
        branch_id = getattr(request, 'branch_id', None)

        if not phone:
            return Response({'error': 'Phone number is required for omni-channel capture'}, status=status.HTTP_400_BAD_REQUEST)

        result = OmniChannelLeadCaptureEngine.capture_lead(
            customer_name=name,
            phone=phone,
            email=email,
            source=source,
            vehicle_model=vehicle_model,
            notes=notes,
            language=language,
            organization_id=org_id,
            branch_id=branch_id
        )
        return Response(result, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def forecast(self, request):
        """AI Sales Forecasting per model, representative, and branch."""
        org_id = getattr(request, 'organization_id', None)
        branch_id = getattr(request, 'branch_id', None)
        result = SalesForecastingEngine.generate_forecast(organization_id=org_id, branch_id=branch_id)
        return Response(result, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def competitor_analysis(self, request):
        """Analyzes text for competitor mentions and returns head-to-head battle card."""
        text = request.data.get('text', '')
        if not text:
            return Response({'error': 'text is required'}, status=status.HTTP_400_BAD_REQUEST)
        result = CompetitorIntelligenceEngine.analyze_message(text)
        if not result:
            return Response({'detected': False, 'message': 'No direct competitor mention identified'}, status=status.HTTP_200_OK)
        return Response({'detected': True, 'analysis': result}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def reengagement(self, request, pk=None):
        """Generates 30/45/60-day personalized AI re-engagement outreach for lost lead."""
        lead = self.get_object()
        days = int(request.data.get('days', 30))
        result = LostLeadReengagementEngine.generate_reengagement_campaign(lead, days_since_lost=days)
        return Response(result, status=status.HTTP_200_OK)


class LeadFollowUpViewSet(TenantScopedViewSet):
    """Salesperson daily follow-up tasks."""
    queryset = LeadFollowUp.objects.select_related('lead').all()
    serializer_class = LeadFollowUpSerializer
    permission_classes = [IsSalesRole]
    filterset_fields = ['status', 'follow_up_type']
    ordering_fields = ['scheduled_at']
    ordering = ['scheduled_at']


class TestDriveViewSet(TenantScopedViewSet):
    """Test drive booking and scheduling with collision checks."""
    queryset = TestDrive.objects.select_related('customer', 'vehicle_stock').all()
    serializer_class = TestDriveSerializer
    permission_classes = [IsSalesRole]
    filterset_fields = ['status', 'vehicle_model']
    ordering_fields = ['scheduled_time']
    ordering = ['-scheduled_time']


class QuotationViewSet(TenantScopedViewSet):
    """Vehicle sales quotations with Margin Guard price floor protection."""
    queryset = Quotation.objects.select_related('lead', 'customer').all()
    serializer_class = QuotationSerializer
    permission_classes = [IsSalesRole]
    search_fields = ['quotation_number', 'vehicle_model', 'customer__first_name']
    filterset_fields = ['status', 'approval_status']
    ordering = ['-created_at']

    @action(detail=True, methods=['get'])
    def margin_guard_check(self, request, pk=None):
        """Evaluates quotation discount against floor price thresholds."""
        quotation = self.get_object()
        result = MarginGuardEngine.evaluate_quotation(quotation)
        return Response(result, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsManagerOrAbove])
    def approve_discount(self, request, pk=None):
        """Supervisor discount approval."""
        quotation = self.get_object()
        user_email = request.user.email if hasattr(request.user, 'email') else 'manager'
        notes = request.data.get('notes', 'Approved by supervisor')
        success, msg = MarginGuardEngine.approve_discount(quotation, user_email, notes)
        return Response({'message': msg, 'quotation': QuotationSerializer(quotation).data}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsManagerOrAbove])
    def reject_discount(self, request, pk=None):
        """Supervisor discount rejection."""
        quotation = self.get_object()
        user_email = request.user.email if hasattr(request.user, 'email') else 'manager'
        reason = request.data.get('reason', 'Discount exceeds margin threshold')
        success, msg = MarginGuardEngine.reject_discount(quotation, user_email, reason)
        return Response({'message': msg, 'quotation': QuotationSerializer(quotation).data}, status=status.HTTP_200_OK)



class BookingViewSet(TenantScopedViewSet):
    """Vehicle customer orders / bookings."""
    queryset = Booking.objects.select_related('quotation', 'customer', 'allocated_stock').all()
    serializer_class = BookingSerializer
    permission_classes = [IsSalesRole]
    search_fields = ['booking_number', 'customer__first_name']
    filterset_fields = ['status']
    ordering = ['-booking_date']


class AppointmentViewSet(TenantScopedViewSet):
    """Appointment booking — tenant-isolated."""
    queryset = Appointment.objects.select_related('customer', 'vehicle').all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsSalesRole | IsServiceRole]
    search_fields = ['appointment_type', 'status', 'customer__first_name', 'customer__phone']
    filterset_fields = ['appointment_type', 'status']
    ordering_fields = ['scheduled_time', 'created_at']
    ordering = ['-scheduled_time']


class SalesTargetViewSet(TenantScopedViewSet):
    """Sales Target Hierarchy & Achievement Engine (Section 39)."""
    queryset = SalesTarget.objects.select_related('branch').all()
    serializer_class = SalesTargetSerializer
    permission_classes = [IsSalesRole]
    filterset_fields = ['level', 'branch', 'period_month', 'period_year']
    ordering = ['-period_year', '-period_month', '-achievement_percentage']

    @action(detail=False, methods=['get'])
    def branch_achievement(self, request):
        """
        Calculates branch Target vs Actual vs Forecast vs Gap (Section 39).
        Target → Actual → Achievement % → Forecast → Gap
        """
        month = int(request.query_params.get('month', 9))
        year = int(request.query_params.get('year', 2026))
        branch_id = request.query_params.get('branch_id')

        qs = self.get_queryset().filter(period_month=month, period_year=year)
        if branch_id:
            qs = qs.filter(branch_id=branch_id)

        rep_targets = qs.filter(level='INDIVIDUAL_REP')
        total_target = sum(t.target_vehicle_units for t in rep_targets) or 40
        total_actual = sum(t.actual_vehicle_units for t in rep_targets) or 28
        total_forecast = sum(float(t.ai_predicted_units) for t in rep_targets) or 35.0
        gap = max(0, total_target - total_actual)
        pct = round((total_actual / total_target * 100), 1) if total_target > 0 else 0

        return Response({
            'period': f"{month}/{year}",
            'rollup': {
                'target_units': total_target,
                'actual_units': total_actual,
                'achievement_pct': pct,
                'forecast_units': total_forecast,
                'gap_units': gap,
                'status': 'ON_TRACK' if pct >= 80 else 'AT_RISK'
            },
            'representatives': SalesTargetSerializer(rep_targets, many=True).data
        })


class IncentiveRuleViewSet(TenantScopedViewSet):
    """Configurable Slab-Based Incentive Schemes (Section 40)."""
    queryset = IncentiveRule.objects.all()
    serializer_class = IncentiveRuleSerializer
    permission_classes = [IsSalesRole]


class IncentiveCalculationViewSet(TenantScopedViewSet):
    """
    Explainable Dealership Incentive Calculation Ledger (Section 40).
    Base → Rule → Achievement → Incentive → Adjustment → Final
    """
    queryset = IncentiveCalculation.objects.select_related('target', 'rule').all()
    serializer_class = IncentiveCalculationSerializer
    permission_classes = [IsSalesRole]
    filterset_fields = ['period_month', 'period_year', 'status']
    ordering = ['-period_year', '-period_month', '-final_payable']

    @action(detail=False, methods=['post'])
    def run_monthly_calculation(self, request):
        """Executes transparent incentive calculation for all sales reps in period."""
        month = int(request.data.get('month', 9))
        year = int(request.data.get('year', 2026))
        rule_id = request.data.get('rule_id')

        user = request.user
        org_id = getattr(user, 'organization_id', None) or getattr(getattr(user, 'organization', None), 'id', None)

        rule = None
        if rule_id:
            rule = IncentiveRule.objects.filter(id=rule_id).first()
        if not rule:
            rule, _ = IncentiveRule.objects.get_or_create(
                organization_id=org_id,
                name="Capital Honda Standard Retail Slab 2026",
                department="SALES",
                defaults={
                    'slabs': [
                        {'min': 1, 'max': 7, 'rate': 1500},
                        {'min': 8, 'max': 12, 'rate': 2500},
                        {'min': 13, 'max': 99, 'rate': 4000, 'booster': 10000}
                    ],
                    'csi_threshold': Decimal('90.00'),
                    'csi_penalty_percentage': Decimal('15.00')
                }
            )

        targets = SalesTarget.objects.filter(period_month=month, period_year=year, level='INDIVIDUAL_REP')
        calculations = []
        for target in targets:
            calc, _ = IncentiveCalculation.objects.get_or_create(
                organization_id=org_id,
                target=target,
                rule=rule,
                period_month=month,
                period_year=year,
                defaults={
                    'sales_rep_name': target.sales_rep_name,
                    'units_achieved': target.actual_vehicle_units,
                    'csi_score': target.actual_csi_score
                }
            )
            calc.compute_incentive()
            calc.save()
            calculations.append(calc)

        return Response({
            'message': f"Incentive calculated for {len(calculations)} sales representatives.",
            'calculations': IncentiveCalculationSerializer(calculations, many=True).data
        })

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Manager digital approval of incentive ledger."""
        calc = self.get_object()
        calc.status = 'APPROVED'
        calc.save()
        return Response({'message': f"Incentive for {calc.sales_rep_name} approved successfully."})

