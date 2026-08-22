import apiService from './api';

export interface VoiceSessionContract {
  id: string;
  session_id: string;
  customer?: string;
  vehicle?: string;
  user?: string;
  channel: 'PHONE' | 'WEBRTC' | 'SIMULATOR';
  provider: string;
  provider_call_id: string;
  direction: 'INBOUND' | 'OUTBOUND';
  status: 'INITIATED' | 'RINGING' | 'CONNECTED' | 'AI_ACTIVE' | 'HUMAN_HANDOFF' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  started_at?: string;
  ended_at?: string;
  language: string;
  agent_name: string;
  transcript_reference?: string;
  recording_reference?: string;
  consent_status: boolean;
  handoff_status: boolean;
  handoff_reason?: string;
  summary?: string;
  duration_seconds: number;
  stt_latency_ms: number;
  llm_latency_ms: number;
  tts_latency_ms: number;
  total_cost_usd: string;
  transcripts?: TranscriptionSegment[];
}

export interface TranscriptionSegment {
  id?: string;
  speaker: 'CUSTOMER' | 'AGENT' | 'SYSTEM' | 'HUMAN_STAFF';
  text: string;
  confidence?: number;
  audio_offset_ms?: number;
  language?: string;
  created_at?: string;
}

export interface VoiceInteractionResult {
  session_id: string;
  status: string;
  agent: string;
  response_text: string;
  audio: {
    text: string;
    language: string;
    audio_format: string;
    audio_duration_estimate_sec: number;
    latency_ms: number;
    is_interruptible: boolean;
  };
  tools_executed?: string[];
  citations?: Array<{
    document_title: string;
    version: number;
    section: string;
    relevance_score: number;
  }>;
  customer_id?: string;
  vehicle_id?: string;
  total_latency_ms: number;
  handoff?: boolean;
}

export interface VoiceAnalyticsMetrics {
  total_calls: number;
  active_calls: number;
  completed_calls: number;
  human_handoffs: number;
  ai_containment_rate_pct: number;
  avg_call_duration_seconds: number;
  avg_response_latency_ms: number;
  total_ai_voice_cost_usd: string;
}

export interface InitiateCallRequest {
  phone: string;
  agent_name?: string;
  channel?: 'PHONE' | 'WEBRTC' | 'SIMULATOR';
}

class VoiceAPI {
  // Get all voice sessions
  async getSessions(params?: Record<string, string>): Promise<{ results: VoiceSessionContract[] } | VoiceSessionContract[]> {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiService.get(`/api/v1/voice/sessions/${qs}`);
  }

  // Get single session details with full transcripts
  async getSession(sessionId: string): Promise<VoiceSessionContract> {
    return apiService.get(`/api/v1/voice/sessions/${sessionId}/`);
  }

  // Initiate a new voice call session
  async initiateCall(request: InitiateCallRequest): Promise<VoiceSessionContract> {
    return apiService.post('/api/v1/voice/sessions/initiate/', request);
  }

  // Send an utterance to active voice agent turn
  async interact(sessionId: string, utterance: string): Promise<VoiceInteractionResult> {
    return apiService.post(`/api/v1/voice/sessions/${sessionId}/interact/`, { utterance });
  }

  // End voice call session
  async endCall(sessionId: string, reason: string = 'Operator ended call'): Promise<VoiceSessionContract> {
    return apiService.post(`/api/v1/voice/sessions/${sessionId}/end/`, { reason });
  }

  // Trigger manual human handoff
  async handoff(sessionId: string, reason: string = 'Staff requested takeover'): Promise<{ status: string; session_id: string; handoff_reason: string }> {
    return apiService.post(`/api/v1/voice/sessions/${sessionId}/handoff/`, { reason });
  }

  // Get aggregated call center analytics
  async getAnalytics(): Promise<VoiceAnalyticsMetrics> {
    return apiService.get('/api/v1/voice/analytics/');
  }
}

export const voiceApi = new VoiceAPI();
export default voiceApi;

