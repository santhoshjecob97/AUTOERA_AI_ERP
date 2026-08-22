from decimal import Decimal
from django.utils import timezone
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from core.views import TenantScopedViewSet
from core.permissions import IsManagerOrAbove, IsServiceRole
from .models import (
    KnowledgeDocument, KnowledgeChunk, AIUsageLog, ActionProposal,
    PromptTemplate, VoiceSession, VoiceTranscript
)
from .serializers import (
    KnowledgeDocumentSerializer, KnowledgeChunkSerializer, AIUsageLogSerializer,
    ActionProposalSerializer, PromptTemplateSerializer,
    VoiceSessionSerializer, VoiceTranscriptSerializer
)
from .agents import supervisor
from .rag import HybridRetriever, RAGContextBuilder, RAGPromptEngine
from .gateway import gateway
from .ingestion import pipeline
from .service_advisor import service_advisor_engine


class AICopilotChatView(APIView):
    """
    AI Copilot Chat endpoint with tenant isolation and role guardrails.
    POST /api/v1/ai/copilot/chat/
    Body: { "prompt": "What is the status of bay 1?" }
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        prompt = request.data.get('prompt', '')
        if not prompt:
            return Response({'error': 'Prompt is required'}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        org_id = getattr(request, 'organization_id', None) or (user.organization.id if getattr(user, 'organization', None) else None)
        branch_id = getattr(request, 'branch_id', None) or (user.branch.id if getattr(user, 'branch', None) else None)

        user_context = {
            'user_id': str(user.id),
            'user_name': f"{user.first_name} {user.last_name}".strip() or user.username,
            'email': user.email or user.username,
            'role': getattr(user, 'role', 'STAFF'),
            'organization_id': org_id,
            'organization_name': user.organization.name if getattr(user, 'organization', None) else 'AutoEra ERP',
            'branch_id': branch_id,
            'request_id': getattr(request, 'request_id', '')
        }

        result = supervisor.route_and_execute(prompt, user_context=user_context)
        return Response(result, status=status.HTTP_200_OK)


class KnowledgeSearchAPIView(APIView):
    """
    Semantic Vector Search + Keyword Hybrid Search in Dealership Knowledge Base.
    POST /api/v1/ai/knowledge/search/
    Body: { "query": "brake inspection procedure", "document_type": "SOP", "top_k": 5 }
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        query = request.data.get('query', '').strip()
        if not query:
            return Response({'error': 'Query string is required'}, status=status.HTTP_400_BAD_REQUEST)

        org_id = getattr(request, 'organization_id', None) or (request.user.organization.id if getattr(request.user, 'organization', None) else None)
        branch_id = getattr(request, 'branch_id', None)
        doc_type = request.data.get('document_type')
        top_k = int(request.data.get('top_k', 5))

        retriever = HybridRetriever()
        results = retriever.retrieve(
            query=query,
            organization_id=org_id,
            branch_id=branch_id,
            document_type=doc_type,
            top_k=top_k
        )

        return Response({
            'query': query,
            'total_results': len(results),
            'results': results
        }, status=status.HTTP_200_OK)


class KnowledgeQueryAPIView(APIView):
    """
    RAG-Grounded AI Question Answering with Anti-Hallucination Guardrail and Citations.
    POST /api/v1/ai/knowledge/query/
    Body: { "question": "What is the warranty period for brake pads?" }
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        question = request.data.get('question', '').strip()
        if not question:
            return Response({'error': 'Question is required'}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        org_id = getattr(request, 'organization_id', None) or (user.organization.id if getattr(user, 'organization', None) else None)
        branch_id = getattr(request, 'branch_id', None)
        org_name = user.organization.name if getattr(user, 'organization', None) else 'AutoEra Dealership'

        # 1. Hybrid Retrieval
        retriever = HybridRetriever()
        chunks = retriever.retrieve(query=question, organization_id=org_id, branch_id=branch_id, top_k=4)

        # 2. Context Builder
        context_block = RAGContextBuilder.build_context(chunks)

        # 3. Anti-Hallucination Guardrail Check
        if not context_block['has_knowledge']:
            return Response({
                'answer': "I couldn't find sufficient information in the dealership knowledge base to answer this reliably.",
                'citations': [],
                'has_grounded_sources': False,
                'confidence': 0.0
            }, status=status.HTTP_200_OK)

        # 4. Grounded Prompt Generation & LLM Execution
        rag_prompt = (
            f"USER QUESTION: {question}\n\n"
            f"FACTUAL CONTEXT:\n{context_block['context_text']}\n\n"
            "Please provide a precise, professional answer strictly citing the document sources."
        )

        user_context = {
            'organization_id': org_id,
            'organization_name': org_name,
            'user_name': user.username,
            'role': getattr(user, 'role', 'STAFF')
        }

        gateway_resp = gateway.generate_response(rag_prompt, context=user_context)

        return Response({
            'question': question,
            'answer': gateway_resp.get('response', ''),
            'citations': context_block['citations'],
            'has_grounded_sources': True,
            'provider': gateway_resp.get('provider', ''),
            'model': gateway_resp.get('model', ''),
            'latency_ms': gateway_resp.get('latency_ms', 0)
        }, status=status.HTTP_200_OK)


class AIServiceAdvisorRecommendationView(APIView):
    """
    AI Service Advisor Recommendation Engine combining ERP context + RAG knowledge.
    POST /api/v1/ai/service-advisor/recommendation/
    Body: { "complaint": "Brake squealing and vibrations at 60 km/h", "vehicle_id": "<uuid>", "customer_id": "<uuid>" }
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        complaint = request.data.get('complaint', '').strip()
        if not complaint:
            return Response({'error': 'Customer complaint is required'}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        org_id = getattr(request, 'organization_id', None) or (user.organization.id if getattr(user, 'organization', None) else None)
        branch_id = getattr(request, 'branch_id', None)

        recommendation = service_advisor_engine.generate_recommendation(
            organization_id=org_id,
            branch_id=branch_id,
            user_email=user.email or user.username,
            complaint=complaint,
            vehicle_id=request.data.get('vehicle_id'),
            customer_id=request.data.get('customer_id'),
            job_card_id=request.data.get('job_card_id'),
            inspection_findings=request.data.get('inspection_findings')
        )

        return Response(recommendation, status=status.HTTP_200_OK)


class AIServiceAdvisorContextView(APIView):
    """
    AI Service Advisor Data Contract Provider.
    GET /api/v1/ai/service-advisor/context/?vehicle_id=<uuid>&customer_id=<uuid>
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        vehicle_id = request.query_params.get('vehicle_id')
        customer_id = request.query_params.get('customer_id')

        from customers.models import Customer
        from vehicles.models import Vehicle
        from service.models import JobCard

        org_id = getattr(request, 'organization_id', None) or (request.user.organization.id if getattr(request.user, 'organization', None) else None)

        context_data = {
            'organization_id': str(org_id),
            'customer': None,
            'vehicle': None,
            'recent_service_history': [],
            'open_job_cards': [],
            'fast_moving_parts_available': []
        }

        if customer_id:
            cust = Customer.objects.filter(id=customer_id, organization_id=org_id).first()
            if cust:
                context_data['customer'] = {
                    'id': str(cust.id),
                    'name': f"{cust.first_name} {cust.last_name}",
                    'phone': cust.phone,
                    'customer_type': cust.customer_type
                }

        if vehicle_id:
            veh = Vehicle.objects.filter(id=vehicle_id, organization_id=org_id).first()
            if veh:
                context_data['vehicle'] = {
                    'id': str(veh.id),
                    'vin': veh.vin,
                    'registration_number': veh.registration_number,
                    'make': veh.make,
                    'model': veh.model,
                    'odometer': veh.odometer_reading,
                    'warranty_valid': bool(veh.warranty_expiry_date)
                }
                jcs = JobCard.objects.filter(vehicle=veh, organization_id=org_id).order_by('-created_at')[:5]
                context_data['recent_service_history'] = [
                    {'job_card_number': jc.job_card_number, 'status': jc.status, 'complaints': jc.customer_complaints, 'date': jc.created_at.strftime('%Y-%m-%d')}
                    for jc in jcs
                ]

        return Response(context_data, status=status.HTTP_200_OK)


class KnowledgeDocumentViewSet(TenantScopedViewSet):
    """RAG Data Foundation: Ingested Knowledge Base documents."""
    queryset = KnowledgeDocument.objects.prefetch_related('chunks').all()
    serializer_class = KnowledgeDocumentSerializer
    permission_classes = [IsManagerOrAbove]
    search_fields = ['title', 'document_type', 'description']
    filterset_fields = ['document_type', 'status']
    ordering = ['-created_at']

    def perform_create(self, serializer):
        org_id, branch_id = self._get_tenant_context()
        raw_content = self.request.data.get('content_text', '')
        instance = serializer.save(
            organization_id=org_id,
            branch_id=branch_id,
            created_by_user=self.request.user.username
        )
        if raw_content:
            pipeline.ingest_document_text(instance, raw_content, default_section=instance.title)


class KnowledgeChunkViewSet(TenantScopedViewSet):
    """RAG Data Foundation: Chunked text segments with vector embeddings."""
    queryset = KnowledgeChunk.objects.select_related('document').all()
    serializer_class = KnowledgeChunkSerializer
    permission_classes = [IsManagerOrAbove]
    search_fields = ['content_text']


class ActionProposalViewSet(TenantScopedViewSet):
    """
    Stage 6C Human Approval Engine:
    View and authorize high-risk ERP actions proposed by AI Agents.
    """
    queryset = ActionProposal.objects.all()
    serializer_class = ActionProposalSerializer
    permission_classes = [IsManagerOrAbove]
    filterset_fields = ['status', 'risk_level', 'agent_name', 'tool_name']
    ordering = ['-created_at']

    @action(detail=True, methods=['post'], permission_classes=[IsManagerOrAbove])
    def approve(self, request, pk=None):
        proposal = self.get_object()
        if proposal.status != 'PENDING_APPROVAL':
            return Response({'error': f"Cannot approve proposal in status '{proposal.status}'."}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        proposal.status = 'APPROVED'
        proposal.approved_by_user = user.username
        proposal.approved_at = timezone.now()
        proposal.save(update_fields=['status', 'approved_by_user', 'approved_at'])

        # Execute the tool
        from .tools import tool_registry
        user_context = {
            'organization_id': getattr(request, 'organization_id', None) or (user.organization.id if getattr(user, 'organization', None) else None),
            'branch_id': getattr(request, 'branch_id', None),
            'user_name': user.username,
            'role': getattr(user, 'role', 'MANAGER')
        }
        exec_res = tool_registry.execute(proposal.tool_name, user_context, is_approved=True, **proposal.parameters_json)
        if exec_res.get('status') == 'SUCCESS':
            proposal.status = 'EXECUTED'
        else:
            proposal.status = 'FAILED'
        proposal.execution_result_json = exec_res
        proposal.save(update_fields=['status', 'execution_result_json'])

        return Response({
            'status': proposal.status,
            'proposal_id': str(proposal.id),
            'execution_result': exec_res
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsManagerOrAbove])
    def reject(self, request, pk=None):
        proposal = self.get_object()
        if proposal.status != 'PENDING_APPROVAL':
            return Response({'error': f"Cannot reject proposal in status '{proposal.status}'."}, status=status.HTTP_400_BAD_REQUEST)

        proposal.status = 'REJECTED'
        proposal.rejection_reason = request.data.get('reason', 'Rejected by manager')
        proposal.approved_by_user = request.user.username
        proposal.approved_at = timezone.now()
        proposal.save(update_fields=['status', 'rejection_reason', 'approved_by_user', 'approved_at'])

        return Response({
            'status': 'REJECTED',
            'proposal_id': str(proposal.id),
            'reason': proposal.rejection_reason
        }, status=status.HTTP_200_OK)


class PromptTemplateViewSet(TenantScopedViewSet):
    """
    Stage 6C Prompt Management:
    Manage versioned AI prompt templates.
    """
    queryset = PromptTemplate.objects.all()
    serializer_class = PromptTemplateSerializer
    permission_classes = [IsManagerOrAbove]
    filterset_fields = ['agent_name', 'status']
    ordering = ['-version']


class VoiceTranscriptViewSet(TenantScopedViewSet):
    """
    Stage 6D Secure Voice Transcript ViewSet.
    """
    queryset = VoiceTranscript.objects.all()
    serializer_class = VoiceTranscriptSerializer
    filterset_fields = ['session_id', 'speaker', 'language']
    ordering = ['created_at']


class VoiceSessionViewSet(TenantScopedViewSet):
    """
    Stage 6D Real AI Voice Session Management ViewSet.
    """
    queryset = VoiceSession.objects.all()
    serializer_class = VoiceSessionSerializer
    filterset_fields = ['status', 'agent_name', 'channel', 'provider']
    ordering = ['-created_at']

    @action(detail=False, methods=['post'])
    def initiate(self, request):
        from .voice import voice_gateway
        phone = request.data.get('phone', '+91-9876543210')
        agent_name = request.data.get('agent_name', 'Service Advisor Agent')
        session = voice_gateway.initiate_call(
            organization_id=request.user.organization_id,
            branch_id=getattr(request.user, 'branch_id', None),
            to_phone=phone,
            agent_name=agent_name,
            user_email=request.user.username
        )
        return Response(VoiceSessionSerializer(session).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def interact(self, request, pk=None):
        from .voice import voice_gateway
        session = self.get_object()
        utterance = request.data.get('utterance', '')
        if not utterance:
            return Response({'error': 'Utterance text is required.'}, status=status.HTTP_400_BAD_REQUEST)

        result = voice_gateway.process_utterance(session, utterance)
        return Response(result, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def end(self, request, pk=None):
        from .voice import voice_gateway
        session = self.get_object()
        reason = request.data.get('reason', 'User ended call')
        ended_session = voice_gateway.end_call(session, reason=reason)
        return Response(VoiceSessionSerializer(ended_session).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def handoff(self, request, pk=None):
        session = self.get_object()
        session.status = 'HUMAN_HANDOFF'
        session.handoff_status = True
        session.handoff_reason = request.data.get('reason', 'Manual handoff triggered by operator')
        session.save(update_fields=['status', 'handoff_status', 'handoff_reason', 'updated_at'])
        return Response({
            'status': 'HUMAN_HANDOFF',
            'session_id': str(session.session_id),
            'handoff_reason': session.handoff_reason
        }, status=status.HTTP_200_OK)


class VoiceAnalyticsAPIView(APIView):
    """
    Dealership Voice Call Center Operations Analytics.
    """
    def get(self, request):
        from django.db.models import Avg, Sum, Count
        org_id = request.user.organization_id
        qs = VoiceSession.objects.filter(organization_id=org_id)

        total_calls = qs.count()
        active_calls = qs.filter(status='AI_ACTIVE').count()
        completed_calls = qs.filter(status='COMPLETED').count()
        handoffs = qs.filter(handoff_status=True).count()
        
        avg_duration = qs.aggregate(Avg('duration_seconds'))['duration_seconds__avg'] or 0
        avg_llm_latency = qs.aggregate(Avg('llm_latency_ms'))['llm_latency_ms__avg'] or 0
        total_cost = qs.aggregate(Sum('total_cost_usd'))['total_cost_usd__sum'] or Decimal('0.000000')

        containment_rate = round(((completed_calls - handoffs) / total_calls * 100.0), 1) if total_calls > 0 else 100.0

        return Response({
            'total_calls': total_calls,
            'active_calls': active_calls,
            'completed_calls': completed_calls,
            'human_handoffs': handoffs,
            'ai_containment_rate_pct': max(0.0, containment_rate),
            'avg_call_duration_seconds': round(avg_duration, 1),
            'avg_response_latency_ms': round(avg_llm_latency, 1),
            'total_ai_voice_cost_usd': str(total_cost)
        }, status=status.HTTP_200_OK)


class VoiceWebhookAPIView(APIView):
    """
    Secure Telephony Webhook Endpoint with HMAC Signature Verification.
    """
    permission_classes = [] # Webhooks use HMAC signature authorization

    def post(self, request):
        from .voice import voice_gateway
        signature = request.headers.get('X-AutoEra-Signature', '')
        payload = request.body.decode('utf-8')

        if not voice_gateway.provider.validate_webhook_signature(payload, signature):
            return Response({'error': 'Invalid webhook signature.'}, status=status.HTTP_403_FORBIDDEN)

        event_type = request.data.get('event', 'call.status')
        call_id = request.data.get('call_id')
        call_status = request.data.get('status', 'in-progress')

        if call_id:
            VoiceSession.objects.filter(provider_call_id=call_id).update(status=call_status.upper())

        return Response({'status': 'RECEIVED', 'event': event_type}, status=status.HTTP_200_OK)


