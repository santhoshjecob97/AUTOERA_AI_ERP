import { describe, it, expect, vi } from 'vitest';
import voiceApi, { VoiceSessionContract, VoiceInteractionResult, VoiceAnalyticsMetrics } from '../../services/voiceApi';
import apiService from '../../services/api';

vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Stage 6D Voice Agent Frontend Integration Tests', () => {
  it('should initiate a voice session via API', async () => {
    const mockSession: VoiceSessionContract = {
      id: 'vs-101',
      session_id: 'session-uuid-101',
      channel: 'PHONE',
      provider: 'SIMULATOR',
      provider_call_id: 'SIM_101',
      direction: 'INBOUND',
      status: 'AI_ACTIVE',
      language: 'en-IN',
      agent_name: 'Service Advisor Agent',
      consent_status: true,
      handoff_status: false,
      duration_seconds: 0,
      stt_latency_ms: 25,
      llm_latency_ms: 120,
      tts_latency_ms: 30,
      total_cost_usd: '0.000120'
    };

    (apiService.post as any).mockResolvedValueOnce(mockSession);

    const res = await voiceApi.initiateCall({ phone: '+919840123456', agent_name: 'Service Advisor Agent' });
    expect(res.session_id).toBe('session-uuid-101');
    expect(res.status).toBe('AI_ACTIVE');
    expect(apiService.post).toHaveBeenCalledWith('/api/v1/voice/sessions/initiate/', {
      phone: '+919840123456',
      agent_name: 'Service Advisor Agent'
    });
  });

  it('should execute a voice utterance turn and receive synthesized response with citations', async () => {
    const mockTurnResult: VoiceInteractionResult = {
      session_id: 'session-uuid-101',
      status: 'AI_ACTIVE',
      agent: 'Service Advisor Agent',
      response_text: 'Based on the brake symptoms reported, we recommend an inspection.',
      audio: {
        text: 'Based on the brake symptoms reported, we recommend an inspection.',
        language: 'en-IN',
        audio_format: 'mp3',
        audio_duration_estimate_sec: 4,
        latency_ms: 35,
        is_interruptible: true
      },
      tools_executed: ['get_customer', 'search_knowledge'],
      citations: [
        {
          document_title: 'Brake System Inspection SOP',
          version: 1,
          section: 'Diagnostics',
          relevance_score: 0.92
        }
      ],
      total_latency_ms: 180
    };

    (apiService.post as any).mockResolvedValueOnce(mockTurnResult);

    const res = await voiceApi.interact('session-uuid-101', 'My brakes are making a grinding noise');
    expect(res.status).toBe('AI_ACTIVE');
    expect(res.citations).toHaveLength(1);
    expect(res.citations?.[0].document_title).toBe('Brake System Inspection SOP');
    expect(apiService.post).toHaveBeenCalledWith('/api/v1/voice/sessions/session-uuid-101/interact/', {
      utterance: 'My brakes are making a grinding noise'
    });
  });

  it('should fetch aggregated call center analytics', async () => {
    const mockAnalytics: VoiceAnalyticsMetrics = {
      total_calls: 150,
      active_calls: 4,
      completed_calls: 140,
      human_handoffs: 6,
      ai_containment_rate_pct: 95.7,
      avg_call_duration_seconds: 145.2,
      avg_response_latency_ms: 165.4,
      total_ai_voice_cost_usd: '0.185200'
    };

    (apiService.get as any).mockResolvedValueOnce(mockAnalytics);

    const analytics = await voiceApi.getAnalytics();
    expect(analytics.total_calls).toBe(150);
    expect(analytics.ai_containment_rate_pct).toBe(95.7);
    expect(apiService.get).toHaveBeenCalledWith('/api/v1/voice/analytics/');
  });
});
