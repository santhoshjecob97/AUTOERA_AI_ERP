# AutoEra AI ERP — Stage 7 Environment Strategy & Separation

**Document ID**: `STAGE7-ENV-001`  
**Classification**: Production Environment Separation & Configuration Strategy  
**Audit Date**: August 22, 2026  
**Auditor**: Principal SaaS Architect & DevSecOps Lead  

---

## 1. Environment Topology & Separation Matrix

AutoEra AI ERP implements strict, isolated configuration boundaries across 5 environment tiers:

```
[LOCAL DEV] ──► [DEVELOPMENT] ──► [STAGING] ──► [PILOT DEALERSHIP] ──► [MULTI-TENANT PROD]
(SQLite/Fast)     (CI Pipelines)   (Cloud Mirror)    (Whitelisted Branch)   (High-Availability RDS)
```

| Dimension | LOCAL | DEVELOPMENT | STAGING | PILOT | PRODUCTION |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Database Engine** | SQLite (Fast testing) | PostgreSQL 16.4 | PostgreSQL 16.4 | Managed PostgreSQL | AWS RDS Multi-AZ / Cloud SQL |
| **Vector Engine** | In-Memory Cosine | pgvector (HNSW) | pgvector (HNSW) | pgvector (HNSW) | pgvector HNSW ($m=16, ef=64$) |
| **Embedding Model** | Deterministic / Local | `gemini-embedding-2` | `gemini-embedding-2`| `gemini-embedding-2` | `models/gemini-embedding-2` (768d)|
| **Primary LLM** | Deterministic Mock | `gemini-3.6-flash` | `gemini-3.6-flash` | `gemini-3.6-flash` | `gemini-3.6-flash` (Production) |
| **Fast Voice LLM** | Fast Mock | `gemini-3.5-flash-lite`| `gemini-3.5-flash-lite`| `gemini-3.5-flash-lite`| `gemini-3.5-flash-lite` (<200ms) |
| **Telephony Adapter**| SimulatedTelephony | Twilio Dev Sandbox | Twilio Staging Trunk| Real Twilio Live DID | High-Throughput PSTN Trunk |
| **STT Engine** | Simulated Stream | Google Speech v1 | Google Speech v1 | Google Speech v1 | Google Cloud Speech Telephony |
| **TTS Engine** | Waveform Synth | Google WaveNet | Google WaveNet | Google WaveNet | Google Cloud TTS WaveNet |
| **Payment Gateway** | Razorpay Mock | Razorpay Test Key | Razorpay Sandbox | Razorpay Pilot Live | Razorpay Live Gateway |
| **`DEBUG` Flag** | `True` | `False` | `False` | `False` | **`False` (MANDATORY)** |
| **CORS Policy** | `*` (Local only) | Specific Dev Host | Staging Domain | Pilot Whitelist | Strict Origin Whitelist |

---

## 2. Secrets & Credential State (Non-Disclosing Audit)

| Variable Identifier | Environment Purpose | Security Classification | Runtime Audit Status |
| :--- | :--- | :---: | :---: |
| `DATABASE_URL` | PostgreSQL Connection String | Sensitive | **SET / ENVIRONMENT BOUND** |
| `REDIS_URL` | Cache & Celery Message Broker | Sensitive | **SET / CONFIGURABLE** |
| `GEMINI_API_KEY` | Google Generative AI Access | High Security | **VALID / MANAGED SECRET** |
| `VOICE_ACCOUNT_ID` | Twilio Account SID | High Security | **VALID / MANAGED SECRET** |
| `VOICE_AUTH_TOKEN` | Twilio API Token | High Security | **VALID / MANAGED SECRET** |
| `VOICE_PHONE_NUMBER`| Inbound PSTN Carrier DID | Sensitive | **VALID / TELEPHONY BOUND** |
| `GOOGLE_SPEECH_API_KEY`| Google Cloud STT API Key | High Security | **VALID / MANAGED SECRET** |
| `GOOGLE_TTS_API_KEY` | Google Cloud TTS API Key | High Security | **VALID / MANAGED SECRET** |
| `RAZORPAY_KEY_ID` | Payment Gateway Merchant ID | Sensitive | **VALID / PRODUCTION BOUND** |
| `JWT_SECRET_KEY` | HS256 Token Signing Secret | High Security | **SET / ROTATION POLICY ENFORCED** |
