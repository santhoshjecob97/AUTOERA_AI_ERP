# AutoEra AI ERP — Stage 7.2 Baseline Freeze

**Document ID**: `STAGE7.2-FREEZE-001`  
**Classification**: Production Baseline Freeze & Architecture State Lock  
**Date**: August 22, 2026  
**Auditor**: Principal SaaS Solutions Architect & DevSecOps Lead  

---

## 1. Baseline State Lock

| Attribute | Verified State |
| :--- | :--- |
| **Repository URL** | `https://github.com/santhoshjecob97/AUTOERA_AI_ERP.git` |
| **Current Target Branch** | `main` / `pilot` / `develop` |
| **Backend Framework** | Django 5.x / Django REST Framework (Python 3.11) |
| **Frontend Framework** | React 18 / Vite 6.4 / TypeScript 5.x |
| **Primary Database** | PostgreSQL 16.4 + `pgvector` extension |
| **Task Queue / Cache** | Celery 5.3 + Redis 7.2 |
| **Primary LLM** | `gemini-3.6-flash` |
| **Voice LLM** | `gemini-3.5-flash-lite` |
| **Embedding Model** | `models/gemini-embedding-2` (768-dim) |
| **Telephony Adapter** | Twilio REST API + HMAC Webhook Validator |
| **STT Engine** | Google Cloud Speech v1 (16kHz linear PCM) |
| **TTS Engine** | Google Cloud WaveNet (en-IN, ta-IN) |
| **Backend Test Suite** | 84 / 84 tests passing (100%) |
| **Frontend Test Suite** | 95 / 95 tests passing (100%) |
| **TypeScript Errors** | 0 errors (`tsc --noEmit` clean) |
| **Production Build** | Clean Vite production asset bundle |

---

## 2. Unresolved External Cloud Dependencies

1. **Vercel Public Frontend Hosting**: Requires live Vercel CLI token or GitHub deployment hook to publish `autoera-erp.vercel.app`.
2. **Managed Cloud PostgreSQL (RDS / Supabase)**: Requires active cloud connection string with `pgvector` enabled.
3. **Managed Cloud Redis (Upstash / ElastiCache)**: Requires active cloud Redis URI.
4. **Live Twilio Number**: Requires provisioned PSTN inbound DID with webhook URL pointed to deployed backend.
