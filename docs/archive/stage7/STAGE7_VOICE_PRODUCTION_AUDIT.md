# AutoEra AI ERP — Stage 7 Real Voice Platform & Telephony Production Audit

**Document ID**: `STAGE7-VOICE-001`  
**Classification**: Telephony Integration, Audio Pipeline & Voice Session Lifecycle Audit  
**Audit Date**: August 22, 2026  
**Auditor**: Principal Telephony & Conversational AI Engineer  

---

## 1. Real Inbound & Outbound Voice Pipeline

```
[Customer PSTN Phone Call]
            │
            ▼
   [Twilio Telephony Trunk]
   (HMAC-SHA1 Signature Validation)
            │
            ▼
[AutoEra VoiceGateway Webhook] ──► [VoiceSession Initialized]
            │
            ▼
[Google Cloud Speech-to-Text] ──► [Audio Stream Decoded (16kHz)]
            │
            ▼
[LanguageResolver + Normalizer] ──► [Automotive Entities Extracted (Reg/VIN/Phone)]
            │
            ▼
[Specialist Agent + ERP Tools] ──► [Appointment Booked / Query Resolved]
            │
            ▼
[Google Cloud Text-to-Speech] ──► [WaveNet Spoken Audio Synthesized]
            │
            ▼
[Customer Hears Spoken Response]
```

---

## 2. Telephony Security & State Machine

- **HMAC Webhook Verification**: `TwilioTelephonyAdapter.verify_webhook_signature()` computes SHA-1 HMAC with `VOICE_AUTH_TOKEN` over full request URL + sorted POST dictionary.
- **Session Lifecycle Transitions**:
  `INITIATED` $\to$ `RINGING` $\to$ `CONNECTED` $\to$ `AI_ACTIVE` $\to$ (`COMPLETED` or `HUMAN_HANDOFF`).
- **Human Handoff Preservation**:
  - Automatically triggered upon manager escalation requests, payment disputes, or sentiment distress.
  - Full transcript, caller identity, vehicle registration, and AI context are preserved and displayed on the human advisor console.
