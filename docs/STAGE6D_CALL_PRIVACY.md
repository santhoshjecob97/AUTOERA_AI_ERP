# AutoEra AI ERP — Stage 6D Call Privacy & Transcript Security

## 1. Privacy Standards & Regulatory Compliance

1. **Consent Handling**: `VoiceSession.consent_status` records caller recording and AI processing consent.
2. **Encrypted Transcript Storage**: `VoiceTranscript` records are tenant-isolated and stored with speaker role attribution (`CUSTOMER`, `AGENT`, `SYSTEM`, `HUMAN_STAFF`).
3. **Data Retention & Masking**: Sensitive identifiers (phone numbers, VINs, addresses) are accessible only by authenticated staff within the tenant organization.
