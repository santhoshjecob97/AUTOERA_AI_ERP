# AutoEra AI ERP — Stage 6D Human Handoff & Escalation Workflows

## 1. Escalation Triggers

Voice interactions automatically transition to `status = 'HUMAN_HANDOFF'` upon:
- Explicit caller request (`"transfer to manager"`, `"talk to person"`)
- Sentiment escalation or dispute keywords (`"angry"`, `"scam"`, `"dispute"`)
- Repeated entity lookup failure (unidentified vehicle after 3 turns)
- Manual operator intervention via `POST /api/v1/voice/sessions/{id}/handoff/`

---

## 2. Context Preservation

During handoff, the voice session state is preserved completely:
- Identified `Customer` & `Vehicle` records
- Complete conversational transcript (`VoiceTranscript` history)
- Extracted symptoms and planned tools
- Reason for escalation in `VoiceSession.handoff_reason`
