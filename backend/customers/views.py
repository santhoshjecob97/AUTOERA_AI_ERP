from django.db import models
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from core.views import TenantScopedViewSet
from core.permissions import IsSalesRole, IsServiceRole
from .models import Customer, CustomerTimeline, CustomerComplaint
from .serializers import CustomerSerializer, CustomerTimelineSerializer, CustomerComplaintSerializer


class CustomerViewSet(TenantScopedViewSet):
    """Customer 360 CRUD — tenant-isolated, RBAC-enforced."""
    queryset = Customer.objects.prefetch_related('timeline_events', 'vehicles').all()
    serializer_class = CustomerSerializer
    permission_classes = [IsSalesRole | IsServiceRole]
    search_fields = ['first_name', 'last_name', 'phone', 'email', 'gstin']
    filterset_fields = ['city', 'state', 'customer_type', 'is_active']
    ordering_fields = ['created_at', 'first_name', 'last_name']
    ordering = ['-created_at']

    @action(detail=True, methods=['get'], url_path='360')
    def customer_360(self, request, pk=None):
        """
        Stage 7 Production Customer 360 Aggregation:
        Aggregates identity, vehicles, appointments, service history, job cards,
        invoices, payments, timeline activity, and voice AI interactions.
        """
        customer = self.get_object()
        
        # Vehicles
        vehicles_data = [
            {
                'id': str(v.id),
                'vin': v.vin,
                'registration_number': v.registration_number,
                'make': v.make,
                'model': v.model,
                'year': v.year,
                'fuel_type': v.fuel_type,
                'odometer_reading': v.odometer_reading,
                'is_active': v.is_active
            }
            for v in customer.vehicles.all()
        ]

        # Appointments
        appointments_data = []
        try:
            from sales.models import Appointment
            appts = Appointment.objects.filter(customer=customer, organization_id=customer.organization_id).order_by('-scheduled_time')[:10]
            appointments_data = [
                {
                    'id': str(a.id),
                    'appointment_type': getattr(a, 'appointment_type', 'SERVICE_CHECKUP'),
                    'scheduled_time': a.scheduled_time.isoformat() if hasattr(a, 'scheduled_time') and a.scheduled_time else None,
                    'status': a.status,
                    'notes': a.notes
                }
                for a in appts
            ]
        except Exception:
            pass

        # Job Cards / Service History
        job_cards_data = []
        try:
            from service.models import JobCard
            jcs = JobCard.objects.filter(customer=customer, organization_id=customer.organization_id).order_by('-created_at')[:10]
            job_cards_data = [
                {
                    'id': str(jc.id),
                    'job_card_number': jc.job_card_number,
                    'status': jc.status,
                    'customer_complaints': jc.customer_complaints,
                    'estimated_cost': str(jc.estimated_cost),
                    'final_total_cost': str(jc.final_total_cost),
                    'created_at': jc.created_at.isoformat()
                }
                for jc in jcs
            ]
        except Exception:
            pass

        # Invoices & Payments
        invoices_data = []
        payments_data = []
        try:
            from finance.models import Invoice, Payment
            invs = Invoice.objects.filter(customer=customer, organization_id=customer.organization_id).order_by('-created_at')[:10]
            invoices_data = [
                {
                    'id': str(inv.id),
                    'invoice_number': inv.invoice_number,
                    'status': inv.status,
                    'total_amount': str(inv.total_amount),
                    'paid_amount': str(inv.paid_amount),
                    'created_at': inv.created_at.isoformat()
                }
                for inv in invs
            ]
            pmts = Payment.objects.filter(invoice__customer=customer, organization_id=customer.organization_id).order_by('-payment_date')[:10]
            payments_data = [
                {
                    'id': str(p.id),
                    'payment_method': p.payment_method,
                    'amount': str(p.amount),
                    'status': p.status,
                    'payment_date': p.payment_date.isoformat()
                }
                for p in pmts
            ]
        except Exception:
            pass

        # Timeline
        events = customer.timeline_events.all().order_by('-created_at')[:20]
        timeline_data = CustomerTimelineSerializer(events, many=True).data

        # Voice Sessions
        voice_data = []
        try:
            from ai_platform.models import VoiceSession
            vs_list = VoiceSession.objects.filter(customer=customer, organization_id=customer.organization_id).order_by('-created_at')[:5]
            voice_data = [
                {
                    'id': str(vs.id),
                    'channel': vs.channel,
                    'language': vs.language,
                    'status': vs.status,
                    'call_duration_seconds': vs.call_duration_seconds,
                    'created_at': vs.created_at.isoformat()
                }
                for vs in vs_list
            ]
        except Exception:
            pass

        return Response({
            'customer': CustomerSerializer(customer).data,
            'vehicles': vehicles_data,
            'appointments': appointments_data,
            'job_cards': job_cards_data,
            'invoices': invoices_data,
            'payments': payments_data,
            'timeline': timeline_data,
            'voice_interactions': voice_data,
            'total_vehicles': len(vehicles_data),
            'total_job_cards': len(job_cards_data)
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'])
    def timeline(self, request, pk=None):
        """Returns the full Customer 360 unified activity timeline."""
        customer = self.get_object()
        events = customer.timeline_events.all().order_by('-created_at')
        serializer = CustomerTimelineSerializer(events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def search(self, request):
        """High-performance customer search by phone, VIN, registration, or name."""
        query = request.query_params.get('q', '').strip()
        if not query:
            return Response({'results': []}, status=status.HTTP_200_OK)

        qs = self.get_queryset().filter(
            models.Q(first_name__icontains=query) |
            models.Q(last_name__icontains=query) |
            models.Q(phone__icontains=query) |
            models.Q(email__icontains=query) |
            models.Q(vehicles__vin__icontains=query) |
            models.Q(vehicles__registration_number__icontains=query)
        ).distinct()[:20]

        serializer = self.get_serializer(qs, many=True)
        return Response({'results': serializer.data}, status=status.HTTP_200_OK)


class CustomerTimelineViewSet(TenantScopedViewSet):
    """Customer activity timeline records."""
    queryset = CustomerTimeline.objects.select_related('customer').all()
    serializer_class = CustomerTimelineSerializer
    permission_classes = [IsSalesRole | IsServiceRole]
    filterset_fields = ['event_type']
    ordering = ['-created_at']


from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .compliance import DPDPComplianceEngine


class DPDPExportView(APIView):
    """
    DPDP Act 2023 Section 11 Data Portability Export API.
    Returns complete, tamper-evident JSON dossier for a customer.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        org_id = getattr(request.user, 'organization_id', None) or request.headers.get('X-Organization-ID', 'default-org')
        result = DPDPComplianceEngine.export_customer_dossier(
            customer_id=str(id),
            organization_id=str(org_id)
        )
        return Response(result, status=status.HTTP_200_OK)


class DPDPEraseView(APIView):
    """
    DPDP Act 2023 Section 12 Right to Erasure / Forgotten API.
    Irreversibly anonymizes customer PII while retaining ledger audit history.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        org_id = getattr(request.user, 'organization_id', None) or request.headers.get('X-Organization-ID', 'default-org')
        reason = request.data.get('reason', 'Customer Erasure Request per DPDP Act Section 12')
        result = DPDPComplianceEngine.anonymize_customer_pii(
            customer_id=str(id),
            organization_id=str(org_id),
            reason=reason
        )
        return Response(result, status=status.HTTP_200_OK)


class CustomerComplaintViewSet(TenantScopedViewSet):
    """
    Area 22 — Customer Complaint & Grievance Escalation ViewSet.
    Provides ticket creation, severity assignment, SLA monitoring, and resolution actions.
    """
    queryset = CustomerComplaint.objects.select_related('customer').all()
    serializer_class = CustomerComplaintSerializer
    permission_classes = [IsSalesRole | IsServiceRole]
    search_fields = ['complaint_number', 'subject', 'customer__first_name', 'customer__last_name', 'vehicle_registration']
    filterset_fields = ['department', 'severity', 'status', 'sla_breached']
    ordering_fields = ['created_at', 'sla_deadline', 'severity']
    ordering = ['-created_at']

    @action(detail=True, methods=['post'], url_path='resolve')
    def resolve_complaint(self, request, pk=None):
        """Offers resolution to customer with RCA and corrective action."""
        complaint = self.get_object()
        from django.utils import timezone
        complaint.status = 'RESOLVED'
        complaint.root_cause_analysis = request.data.get('root_cause_analysis', complaint.root_cause_analysis)
        complaint.corrective_action = request.data.get('corrective_action', complaint.corrective_action)
        complaint.resolved_at = timezone.now()
        complaint.save()
        return Response(CustomerComplaintSerializer(complaint).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='close')
    def close_complaint(self, request, pk=None):
        """Records customer confirmation and closes dispute."""
        complaint = self.get_object()
        from django.utils import timezone
        complaint.status = 'CLOSED'
        complaint.csi_recovery_score = request.data.get('csi_recovery_score', 5)
        complaint.customer_feedback = request.data.get('customer_feedback', '')
        complaint.closed_at = timezone.now()
        complaint.save()
        return Response(CustomerComplaintSerializer(complaint).data, status=status.HTTP_200_OK)


