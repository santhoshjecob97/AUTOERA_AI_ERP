# AutoEra AI ERP — Stage 6D Telephony Provider & Webhook Security

## 1. Telephony Provider Abstraction (`VoiceProvider`)

AutoEra decouples business logic from carrier protocols using the `VoiceProvider` interface:

- `start_call(to_number, from_number, metadata)`
- `accept_audio(call_id, audio_bytes_or_stream)`
- `stream_audio(call_id, audio_chunk)`
- `stop_call(call_id)`
- `transfer_call(call_id, target_phone)`
- `get_call_status(call_id)`
- `validate_webhook_signature(payload, signature, timestamp)`

---

## 2. Telephony Adapters

| Adapter | Target Environment | Security & Protocol | Status |
| :--- | :--- | :--- | :---: |
| **`TwilioTelephonyAdapter`** | Production Cloud | Twilio Voice REST API + HMAC-SHA1 signature validation | ✅ **READY** |
| **`SimulatedTelephonyAdapter`** | CI/CD / Non-credential dev | In-memory session tracker + HMAC-SHA256 signature validation | ✅ **OPERATIONAL** |

---

## 3. Webhook Security & Idempotency
- Telephony webhook requests to `/api/v1/voice/webhook/` must supply valid provider signature in `X-AutoEra-Signature`.
- Replayed or forged signatures receive HTTP 403 Forbidden.
- Session updates validate `provider_call_id` and ensure idempotent state progression.
