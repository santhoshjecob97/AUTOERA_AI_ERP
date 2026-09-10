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
from .services import ServiceWhatsAppNotifier, AIDiagnosisGenerator
from .technician_assignment import TechnicianSkillMatrix


class JobCardViewSet(TenantScopedViewSet):
    """Job Card management — tenant-isolated, service role required, state machine enforced."""
    queryset = JobCard.objects.select_related('customer', 'vehicle', 'allocated_bay', 'assigned_technician').prefetch_related('parts_consumed', 'labour_items', 'inspections').all()
    serializer_class = JobCardSerializer
    permission_classes = [IsServiceRole]
    search_fields = ['job_card_number', 'customer__first_name', 'vehicle__registration_number', 'vehicle__vin']
    filterset_fields = ['status', 'required_skill_tier']
    ordering_fields = ['created_at', 'promised_delivery', 'status']
    ordering = ['-created_at']

    @action(detail=True, methods=['post'])
    def transition_status(self, request, pk=None):
        """Enforces legal server-side state machine status transitions & triggers WhatsApp milestones."""
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

        # Auto-trigger 6-stage WhatsApp milestone notification
        notif_result = None
        try:
            notif_result = ServiceWhatsAppNotifier.notify_status_change(job_card, new_status)
        except Exception as e:
            # Don't fail transition if notification encounters external gateway timeout
            notif_result = {'error': str(e)}

        return Response({
            'message': f"Job card transitioned from {old_status} to {new_status}",
            'whatsapp_milestone': notif_result,
            'job_card': JobCardSerializer(job_card).data
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def ai_diagnose(self, request, pk=None):
        """Generates AI fault diagnosis, parts estimate, and labour recommendations."""
        job_card = self.get_object()
        diagnosis = AIDiagnosisGenerator.generate_diagnosis(job_card)

        # Optional auto-dispatch technician based on diagnosis skill tier
        auto_assign = request.data.get('auto_assign_technician', True)
        assignment_result = None
        if auto_assign and not job_card.assigned_technician:
            _, _, tech = TechnicianSkillMatrix.auto_assign_technician(job_card)
            if tech:
                assignment_result = f"Auto-assigned to {tech.name} ({tech.skill_tier})"

        return Response({
            'ai_diagnosis': diagnosis,
            'technician_assignment': assignment_result,
            'job_card': JobCardSerializer(job_card).data
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def auto_assign_technician(self, request, pk=None):
        """Executes Skill Matrix L1/L2/L3 auto-assignment for technician."""
        job_card = self.get_object()
        success, msg, tech = TechnicianSkillMatrix.auto_assign_technician(job_card)
        if not success:
            return Response({'error': msg}, status=status.HTTP_400_BAD_REQUEST)
        return Response({
            'message': msg,
            'technician': {'id': str(tech.id), 'name': tech.name, 'tier': tech.skill_tier},
            'job_card': JobCardSerializer(job_card).data
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def record_nps(self, request, pk=None):
        """Records customer NPS satisfaction score (1 to 10) and review comments."""
        job_card = self.get_object()
        score = request.data.get('score')
        feedback = request.data.get('feedback', '')

        if score is None or not (1 <= int(score) <= 10):
            return Response({'error': 'Score between 1 and 10 is required'}, status=status.HTTP_400_BAD_REQUEST)

        job_card.nps_score = int(score)
        job_card.nps_feedback = feedback
        job_card.save(update_fields=['nps_score', 'nps_feedback'])
        return Response({'message': 'Feedback recorded successfully'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def digital_creation(self, request):
        """90-second digital job card creation pipeline (Plate OCR + Voice + AI Diagnosis + WhatsApp)."""
        from .services import DigitalJobCardEngine
        org_id, branch_id = self._get_tenant_context()
        plate = request.data.get('plate_number', 'MH12AB1234')
        voice_url = request.data.get('voice_audio_url')
        transcript = request.data.get('voice_transcript')
        odometer = int(request.data.get('odometer', 25000))
        cust_name = request.data.get('customer_name', 'Customer')
        cust_phone = request.data.get('customer_phone', '+919876543210')

        res = DigitalJobCardEngine.create_90s_job_card(
            organization_id=org_id,
            branch_id=branch_id,
            plate_number=plate,
            voice_audio_url=voice_url,
            voice_transcript=transcript,
            odometer=odometer,
            customer_name=cust_name,
            customer_phone=cust_phone
        )
        return Response(res, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'])
    def ai_advisor_chat(self, request):
        """24/7 AI Service Advisor WhatsApp chatbot endpoint (Tamil, Hindi, English)."""
        from .services import AIServiceAdvisorBot
        org_id, _ = self._get_tenant_context()
        phone = request.data.get('phone', '+919876543210')
        message = request.data.get('message', 'status')
        language = request.data.get('language', 'en')

        reply = AIServiceAdvisorBot.handle_message(
            organization_id=org_id,
            customer_phone=phone,
            message=message,
            language=language
        )
        return Response(reply, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def upsell_scan(self, request):
        """Scans vehicle mileage and age for preventative maintenance upsells."""
        from .services import ServiceUpsellEngine
        odometer = int(request.query_params.get('odometer', 25000))
        age = float(request.query_params.get('vehicle_age_years', 2.5))
        opportunities = ServiceUpsellEngine.scan_upsell_opportunities(odometer=odometer, vehicle_age_years=age)
        return Response({'upsell_recommendations': opportunities}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def prepare_warranty_claim(self, request, pk=None):
        """Prepares digital OEM warranty claim submission payload."""
        from .services import WarrantyClaimEngine
        job_card = self.get_object()
        fault_code = request.data.get('fault_code', 'P0300')
        causal_part_name = request.data.get('causal_part_name', 'Ignition Coil Pack')
        causal_part_no = request.data.get('causal_part_number', 'IC-COIL-602')
        oem_name = request.data.get('oem_name', 'Tata Motors')

        claim = WarrantyClaimEngine.prepare_warranty_claim(
            job_card=job_card,
            fault_code=fault_code,
            causal_part_name=causal_part_name,
            causal_part_number=causal_part_no,
            oem_name=oem_name
        )
        return Response(claim, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def quality_control(self, request, pk=None):
        """Executes 32-point digital QC inspection and unlocks gate pass."""
        from .services import QualityControlEngine
        job_card = self.get_object()
        inspector = request.data.get('inspector_name', 'Chief QC Inspector')
        qc_result = QualityControlEngine.execute_qc_inspection(job_card=job_card, inspector_name=inspector)
        return Response(qc_result, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def workshop_analytics(self, request):
        """Returns workshop operational KPIs (SLA, parts fill rate, TAT, bay utilization)."""
        from .services import WorkshopAnalyticsEngine
        org_id, _ = self._get_tenant_context()
        kpis = WorkshopAnalyticsEngine.get_workshop_kpis(org_id)
        return Response(kpis, status=status.HTTP_200_OK)




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


class ServiceAppointmentScheduleViewSet(TenantScopedViewSet):
    """Appointment scheduler & slot management."""
    from .models import ServiceAppointmentSchedule
    from .serializers import ServiceAppointmentScheduleSerializer
    queryset = ServiceAppointmentSchedule.objects.select_related('customer', 'vehicle', 'allocated_bay', 'assigned_technician').all()
    serializer_class = ServiceAppointmentScheduleSerializer
    permission_classes = [IsServiceRole]
    ordering = ['scheduled_time']

    @action(detail=False, methods=['get'])
    def available_slots(self, request):
        from .services import AppointmentSchedulingEngine
        org_id, _ = self._get_tenant_context()
        slots = AppointmentSchedulingEngine.get_available_slots(org_id)
        return Response({'available_slots': slots}, status=status.HTTP_200_OK)


class WarrantyClaimViewSet(TenantScopedViewSet):
    """Digital OEM Warranty claims."""
    from .models import WarrantyClaim
    from .serializers import WarrantyClaimSerializer
    queryset = WarrantyClaim.objects.select_related('job_card').all()
    serializer_class = WarrantyClaimSerializer
    permission_classes = [IsServiceRole]
    ordering = ['-created_at']


class QualityChecklistViewSet(TenantScopedViewSet):
    """Digital Quality Control checklists."""
    from .models import QualityChecklist
    from .serializers import QualityChecklistSerializer
    queryset = QualityChecklist.objects.select_related('job_card').all()
    serializer_class = QualityChecklistSerializer
    permission_classes = [IsServiceRole]
    ordering = ['-created_at']

