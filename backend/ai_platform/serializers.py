from rest_framework import serializers
from core.serializers import TenantScopedSerializer
from .models import (
    AIConversation, AIMessage, AIUsageLog, KnowledgeDocument,
    KnowledgeChunk, ActionProposal, PromptTemplate, VoiceSession, VoiceTranscript
)


class KnowledgeChunkSerializer(TenantScopedSerializer):
    class Meta(TenantScopedSerializer.Meta):
        model = KnowledgeChunk
        fields = '__all__'


class KnowledgeDocumentSerializer(TenantScopedSerializer):
    chunks = KnowledgeChunkSerializer(many=True, read_only=True)

    class Meta(TenantScopedSerializer.Meta):
        model = KnowledgeDocument
        fields = '__all__'


class AIUsageLogSerializer(TenantScopedSerializer):
    class Meta(TenantScopedSerializer.Meta):
        model = AIUsageLog
        fields = '__all__'


class ActionProposalSerializer(TenantScopedSerializer):
    class Meta(TenantScopedSerializer.Meta):
        model = ActionProposal
        fields = '__all__'


class PromptTemplateSerializer(TenantScopedSerializer):
    class Meta(TenantScopedSerializer.Meta):
        model = PromptTemplate
        fields = '__all__'


class VoiceTranscriptSerializer(TenantScopedSerializer):
    class Meta(TenantScopedSerializer.Meta):
        model = VoiceTranscript
        fields = '__all__'


class VoiceSessionSerializer(TenantScopedSerializer):
    transcripts = VoiceTranscriptSerializer(many=True, read_only=True)

    class Meta(TenantScopedSerializer.Meta):
        model = VoiceSession
        fields = '__all__'


