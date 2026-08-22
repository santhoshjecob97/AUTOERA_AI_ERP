# AutoEra AI ERP — Stage 6D Baseline Audit Report

## 1. System Inventory & Baseline State Prior to Stage 6D

| Subsystem | Existing Implementation & Capabilities | Verified Status | Stage 6D Transformation Goal |
| :--- | :--- | :---: | :--- |
| **Voice Interface** | `services/voiceApi.ts` (Mock REST contracts), `components/voice/` (UI components) | Mock / Static UI | Implement unified `VoiceProvider`, `VoiceSession`, Telephony Adapter, STT/TTS Providers, Real-time voice pipeline |
| **AI Supervisor** | `backend/ai_platform/agents.py` (`IntentRouter`, `AgentSupervisor`, multi-step tool planner) | Fully Verified (Stage 6C) | Hook Voice Transcription directly into `AgentSupervisor` without creating duplicate agents |
| **ERP Tool Layer** | `backend/ai_platform/tools.py` (`ToolRegistry`, 10 safe read/write/proposal tools) | Fully Verified (Stage 6C) | Retain strict RBAC, Risk evaluation, and tenant scoping for all voice-initiated actions |
| **Human Approval** | `backend/ai_platform/models.py` (`ActionProposal`), `views.py` | Fully Verified (Stage 6C) | Ensure voice requests for high-risk actions intercept into `ActionProposal` in `PENDING_APPROVAL` status |
| **RAG & Knowledge** | `backend/ai_platform/rag.py` (`HybridRetriever`, BM25 + Vector ranking) | Fully Verified (Stage 6B) | Enable Voice Service Advisor to ground diagnostic responses with SOP & manual citations |
| **Multi-Tenancy** | `core/middleware.py` (`TenantMiddleware`), `TenantScopedModel` | Fully Verified (Stage 5B) | Ensure `VoiceSession`, transcripts, and telemetry are strictly scoped to `organization_id` and `branch_id` |
| **Authentication** | SimpleJWT (`LoginView`, `TokenRefreshView`, `MeView`), RBAC permissions | Fully Verified (Stage 5B) | Enforce signature authentication on telephony webhooks and JWT on Voice Console APIs |
| **AI Telemetry** | `backend/ai_platform/models.py` (`AIUsageLog`), `gateway.py` | Fully Verified (Stage 6B/6C)| Extend logging to track STT latency, LLM latency, TTS latency, and call durations |

---

## 2. Telephony & Provider Configuration Strategy

To maintain enterprise integrity without faking live production calls when credentials are not configured in the host environment:
1. **Provider Abstraction (`VoiceProvider`)**: Standardized interface supporting `start_call`, `accept_audio`, `stream_audio`, `stop_call`, `transfer_call`, `send_dtmf`, `get_call_status`, `record_call_metadata`.
2. **Environment Variable Configuration**:
   - `VOICE_PROVIDER`: `twilio`, `exotel`, or `simulator` (default: `simulator`).
   - `VOICE_ACCOUNT_ID`, `VOICE_AUTH_TOKEN`, `VOICE_PHONE_NUMBER`, `VOICE_WEBHOOK_SECRET`.
3. **Local Telephony & Audio Simulator**: A deterministic audio/STT/TTS simulation adapter that allows full end-to-end verification and testing in CI/CD without requiring paid telephony credits.
