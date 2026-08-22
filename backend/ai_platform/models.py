import uuid
from django.db import models
from core.models import TenantScopedModel


class AIConversation(TenantScopedModel):
    user_email = models.EmailField()
    agent_name = models.CharField(max_length=100, default='SUPERVISOR')
    title = models.CharField(max_length=255, default='New Conversation')

    def __str__(self):
        return f"{self.title} - {self.user_email} ({self.agent_name})"


class AIMessage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(AIConversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.CharField(max_length=50) # 'USER', 'ASSISTANT', 'SYSTEM'
    content = models.TextField()
    tokens_used = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.sender}] {self.content[:50]}"


class AIUsageLog(TenantScopedModel):
    """
    Tracks all AI invocations for audit, cost management, and rate limiting.
    """
    user_email = models.EmailField()
    provider = models.CharField(max_length=50, default='gemini') # gemini, openai, local
    model_name = models.CharField(max_length=100)
    agent_name = models.CharField(max_length=100)
    prompt_tokens = models.IntegerField(default=0)
    completion_tokens = models.IntegerField(default=0)
    total_tokens = models.IntegerField(default=0)
    estimated_cost_usd = models.DecimalField(max_digits=8, decimal_places=6, default=0.000000)
    latency_ms = models.IntegerField(default=0)
    status = models.CharField(max_length=50, default='SUCCESS') # SUCCESS, RATE_LIMITED, FAILED, INJECTION_BLOCKED
    request_id = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"[{self.provider}] {self.agent_name} - {self.total_tokens} tokens ({self.status})"


class KnowledgeDocument(TenantScopedModel):
    """
    RAG Data Foundation: Ingested dealership knowledge documents, manuals, and SOPs.
    """
    DOC_TYPES = [
        ('SOP', 'Standard Operating Procedure'),
        ('SERVICE_MANUAL', 'OEM Technical Service Manual'),
        ('POLICY', 'Dealership Warranty & Service Policy'),
        ('PRICE_LIST', 'Official Parts & Labour Price List'),
        ('WARRANTY_GUIDE', 'Warranty Coverage Guidelines'),
        ('SALES_BROCHURE', 'Vehicle Model Sales Brochure'),
    ]

    STATUS_CHOICES = [
        ('UPLOADED', 'Uploaded / Awaiting Processing'),
        ('VALIDATING', 'Validating Document Structure'),
        ('PROCESSED', 'Chunked & Processed'),
        ('READY', 'Ready for RAG Retrieval'),
        ('ARCHIVED', 'Archived Version'),
        ('FAILED', 'Processing Failed'),
    ]

    title = models.CharField(max_length=255)
    document_type = models.CharField(max_length=50, choices=DOC_TYPES, default='SOP')
    version = models.IntegerField(default=1)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='UPLOADED')
    file_name = models.CharField(max_length=255, blank=True)
    file_size_bytes = models.IntegerField(default=0)
    total_chunks = models.IntegerField(default=0)
    created_by_user = models.CharField(max_length=150, blank=True)
    description = models.TextField(blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['organization_id', 'document_type']),
            models.Index(fields=['organization_id', 'status']),
        ]

    def __str__(self):
        return f"[{self.document_type}] {self.title} (v{self.version})"


class KnowledgeChunk(TenantScopedModel):
    """
    RAG Data Foundation: Chunked text segments ready for vector embedding and semantic retrieval.
    """
    document = models.ForeignKey(KnowledgeDocument, on_delete=models.CASCADE, related_name='chunks')
    chunk_index = models.IntegerField(default=0)
    content_text = models.TextField()
    token_count = models.IntegerField(default=0)
    embedding = models.JSONField(default=list, blank=True) # Vector embedding (e.g. 768 float array)
    embedding_model = models.CharField(max_length=100, default='gemini-embedding-2', blank=True)
    metadata_json = models.JSONField(default=dict, blank=True) # e.g. section_heading, page_number, vehicle_models

    class Meta:
        indexes = [
            models.Index(fields=['organization_id', 'document_id']),
        ]

    def __str__(self):
        return f"Chunk #{self.chunk_index} of {self.document.title}"


class ActionProposal(TenantScopedModel):
    """
    Stage 6C Human-in-the-Loop Engine:
    High-risk actions proposed by AI Agents that require authorized human review before execution.
    """
    RISK_LEVELS = [
        ('LOW', 'Low Risk (Automated / Read)'),
        ('MEDIUM', 'Medium Risk (Standard CRM / Notes)'),
        ('HIGH', 'High Risk (Estimate Approvals / Parts Adjustments)'),
        ('CRITICAL', 'Critical Risk (Payments, Refunds, Discounts)'),
    ]

    STATUS_CHOICES = [
        ('PROPOSED', 'Proposed by Agent'),
        ('PENDING_APPROVAL', 'Pending Human Authorization'),
        ('APPROVED', 'Approved by Authorized Human'),
        ('REJECTED', 'Rejected by Authorized Human'),
        ('EXECUTED', 'Action Successfully Executed in ERP'),
        ('FAILED', 'Execution Failed'),
        ('EXPIRED', 'Proposal Expired'),
    ]

    created_by_user = models.CharField(max_length=150)
    agent_name = models.CharField(max_length=100)
    tool_name = models.CharField(max_length=100)
    parameters_json = models.JSONField(default=dict)
    risk_level = models.CharField(max_length=20, choices=RISK_LEVELS, default='MEDIUM')
    reason = models.TextField()
    expected_effect = models.TextField()
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='PENDING_APPROVAL')
    approved_by_user = models.CharField(max_length=150, blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)
    execution_result_json = models.JSONField(default=dict, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['organization_id', 'status']),
            models.Index(fields=['organization_id', 'risk_level']),
        ]

    def __str__(self):
        return f"[{self.risk_level}] {self.tool_name} by {self.agent_name} ({self.status})"


class PromptTemplate(TenantScopedModel):
    """
    Stage 6C Prompt Management:
    Versioned prompts for all AI specialist agents.
    """
    STATUS_CHOICES = [
        ('ACTIVE', 'Active Version'),
        ('ARCHIVED', 'Archived Version'),
    ]

    prompt_name = models.CharField(max_length=100)
    version = models.IntegerField(default=1)
    agent_name = models.CharField(max_length=100)
    template_text = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    created_by_user = models.CharField(max_length=150, blank=True)

    class Meta:
        unique_together = ('organization_id', 'prompt_name', 'version')
        indexes = [
            models.Index(fields=['organization_id', 'agent_name', 'status']),
        ]

    def __str__(self):
        return f"{self.prompt_name} v{self.version} ({self.agent_name})"


class VoiceSession(TenantScopedModel):
    """
    Stage 6D Real AI Voice Agent Session:
    Tracks lifecycle, telephony metadata, transcripts, and telemetry for every voice interaction.
    """
    CHANNEL_CHOICES = [
        ('PHONE', 'PSTN / Telephony'),
        ('WEBRTC', 'WebRTC Browser Voice'),
        ('SIMULATOR', 'Local Voice Simulator'),
    ]

    DIRECTION_CHOICES = [
        ('INBOUND', 'Inbound Call from Customer'),
        ('OUTBOUND', 'Outbound Campaign / Follow-up'),
    ]

    STATUS_CHOICES = [
        ('INITIATED', 'Call Initiated'),
        ('RINGING', 'Ringing at Destination'),
        ('CONNECTED', 'Call Connected'),
        ('AI_ACTIVE', 'AI Agent Active in Conversation'),
        ('HUMAN_HANDOFF', 'Transferred to Human Staff'),
        ('COMPLETED', 'Call Completed Successfully'),
        ('FAILED', 'Call Failed / Network Error'),
        ('CANCELLED', 'Call Cancelled by Caller'),
    ]

    session_id = models.UUIDField(default=uuid.uuid4, unique=True, db_index=True)
    customer = models.ForeignKey('customers.Customer', on_delete=models.SET_NULL, null=True, blank=True, related_name='voice_sessions')
    vehicle = models.ForeignKey('vehicles.Vehicle', on_delete=models.SET_NULL, null=True, blank=True, related_name='voice_sessions')
    user = models.ForeignKey('identity.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='voice_sessions')
    channel = models.CharField(max_length=50, choices=CHANNEL_CHOICES, default='PHONE')
    provider = models.CharField(max_length=50, default='SIMULATOR') # twilio, exotel, simulator
    provider_call_id = models.CharField(max_length=150, blank=True, db_index=True)
    direction = models.CharField(max_length=20, choices=DIRECTION_CHOICES, default='INBOUND')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='INITIATED')
    started_at = models.DateTimeField(null=True, blank=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    language = models.CharField(max_length=20, default='en-IN') # en-IN, ta-IN, tanglish
    agent_name = models.CharField(max_length=100, default='Service Advisor Agent')
    transcript_reference = models.CharField(max_length=255, blank=True)
    recording_reference = models.CharField(max_length=255, blank=True)
    consent_status = models.BooleanField(default=True)
    handoff_status = models.BooleanField(default=False)
    handoff_reason = models.TextField(blank=True)
    summary = models.TextField(blank=True)
    metadata_json = models.JSONField(default=dict, blank=True)
    duration_seconds = models.IntegerField(default=0)
    stt_latency_ms = models.IntegerField(default=0)
    llm_latency_ms = models.IntegerField(default=0)
    tts_latency_ms = models.IntegerField(default=0)
    total_cost_usd = models.DecimalField(max_digits=8, decimal_places=6, default=0.000000)

    class Meta:
        indexes = [
            models.Index(fields=['organization_id', 'status']),
            models.Index(fields=['organization_id', 'provider_call_id']),
            models.Index(fields=['organization_id', 'created_at']),
        ]

    def __str__(self):
        return f"VoiceSession #{self.session_id} ({self.status}) - {self.agent_name}"


class VoiceTranscript(TenantScopedModel):
    """
    Stage 6D Secure Transcript Storage:
    Encrypted / tenant-scoped utterances for voice sessions.
    """
    SPEAKER_CHOICES = [
        ('CUSTOMER', 'Customer'),
        ('AGENT', 'AI Specialist Agent'),
        ('SYSTEM', 'Voice System / IVR'),
        ('HUMAN_STAFF', 'Human Service Advisor / Manager'),
    ]

    session = models.ForeignKey(VoiceSession, on_delete=models.CASCADE, related_name='transcripts')
    speaker = models.CharField(max_length=20, choices=SPEAKER_CHOICES)
    text = models.TextField()
    confidence = models.FloatField(default=1.0)
    audio_offset_ms = models.IntegerField(default=0)
    language = models.CharField(max_length=20, default='en-IN')

    class Meta:
        indexes = [
            models.Index(fields=['organization_id', 'session_id']),
        ]

    def __str__(self):
        return f"[{self.speaker}] {self.text[:40]}"


