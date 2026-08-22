# AutoEra AI ERP — Stage 7.2 Real Voice → ERP E2E Workflow

**Document ID**: `STAGE7.2-VOICE-E2E-001`  
**Classification**: Telephony Speech → AI Reasoner → Database Action  
**Date**: August 22, 2026  

---

## 1. Verified Telephony Flow

1. Customer calls dealership DID.
2. Twilio connects call -> `VoiceSession` initialized with tenant scope.
3. Customer speaks in Tamil/English -> STT streams audio.
4. Gemini extracts intent (`create_service_appointment`).
5. Safe Tool `tool_get_appointment_availability` checks slot.
6. Safe Tool `tool_create_service_appointment` books appointment in PostgreSQL.
7. TTS generates confirmation audio.
8. Customer receives instant SMS/WhatsApp confirmation.
