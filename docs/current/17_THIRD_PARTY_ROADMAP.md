# 17 — Third-Party Integration Roadmap

**Integration Boundary Policy**: All third-party providers are encapsulated behind abstract adapters with timeouts, circuit breakers, and zero tight coupling to core ERP business logic.

---

## 1. Provider Adapter Status

| Integration Domain | Target Provider | Current Stage | Activation Requirement |
| :--- | :--- | :--- | :--- |
| **Telephony / Voice** | Twilio / Exotel | Inactive / Adapter Ready | `VOICE_ACCOUNT_ID`, `VOICE_AUTH_TOKEN`, `VOICE_PHONE_NUMBER` |
| **Speech Processing** | Google Cloud STT/TTS | Inactive / Adapter Ready | `GOOGLE_APPLICATION_CREDENTIALS` |
| **Payment Gateway** | Razorpay | Inactive / Webhook Ready | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` |
| **WhatsApp / SMS** | Gupshup / Twilio SMS | Roadmap (Phase 2) | Provider API key |
| **OEM DMS Interfaces** | Maruti / Hyundai / Tata OEM APIs | Roadmap (Phase 3) | OEM Sandbox credentials |
| **Insurance APIs** | PolicyBazaar / ICICI Lombard | Roadmap (Phase 3) | Insurance partner credentials |
