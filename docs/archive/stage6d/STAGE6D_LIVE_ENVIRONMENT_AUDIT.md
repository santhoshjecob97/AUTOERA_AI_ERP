# AutoEra AI ERP -- Stage 6D Live Environment Audit

**Audit Date**: 2026-08-22
**Auditor**: Independent Verification Agent
**Mode**: SIMULATED (No real carrier credentials available)

## 1. Credential & Provider Inventory

| Setting | Status | Value / Observation |
| :--- | :---: | :--- |
| `VOICE_ACCOUNT_ID` | **NOT SET** | No Twilio/Exotel account configured in `settings.py` or environment |
| `VOICE_AUTH_TOKEN` | **NOT SET** | No telephony auth token present |
| `VOICE_PHONE_NUMBER` | **NOT SET** | No inbound/outbound phone number provisioned |
| `GEMINI_API_KEY` | **NOT SET** | AI LLM provider key not configured; ModelGateway uses simulated fallback |
| `OPENAI_API_KEY` | **NOT SET** | Fallback AI provider not configured |
| `RAZORPAY_KEY_ID` | Present in `.env.example` template | Not loaded into current environment |

## 2. Infrastructure Status

| Component | Status | Details |
| :--- | :---: | :--- |
| **Database Engine** | SQLite3 (dev) | `django.db.backends.sqlite3` -- NOT PostgreSQL in current dev env |
| **pgvector** | N/A | SQLite does not support pgvector; cosine similarity is computed in Python |
| **Redis** | **NOT RUNNING** | `redis://localhost:6379/0` configured but using `LocMemCache` in DEBUG=True |
| **Celery** | **NOT RUNNING** | Broker URL configured; no worker active |
| **WebSocket** | **NOT CONFIGURED** | No ASGI/Channels/Daphne infrastructure detected |
| **DEBUG** | `True` | Development mode active |
| **ALLOWED_HOSTS** | `localhost, 127.0.0.1` | Local only |
| **CORS** | Restricted | `http://localhost:5173, http://localhost:3000` only |
| **SESSION_COOKIE_SECURE** | `False` | Expected in DEBUG=True mode |
| **CSRF_COOKIE_SECURE** | `False` | Expected in DEBUG=True mode |
| **HSTS** | `0 seconds` | Not active in DEBUG mode; would be 31536000 in production |

## 3. Voice-Specific Settings Audit

| Setting | Status | Notes |
| :--- | :---: | :--- |
| Voice settings in `settings.py` | **ABSENT** | No `VOICE_*` settings block exists in `config/settings.py` |
| Voice settings in `.env.example` | **ABSENT** | No `VOICE_*` entries in the `.env.example` template |
| Telephony adapter default | `SimulatedTelephonyAdapter` | Hardcoded default in `voice.py` line 315 |
| Webhook secret | Hardcoded default | `'autoera_voice_sim_secret_2026'` in simulator |
| STT provider | **SIMULATED** | Decodes UTF-8 text strings, not real audio |
| TTS provider | **SIMULATED** | Formats text concisely, no audio synthesis |

## 4. Critical Finding

> **No real telephony provider credentials exist in this repository.**
> No Twilio Account SID, Auth Token, or Phone Number is configured.
> No Google Cloud STT/TTS API keys are configured.
> No `.env` file contains `VOICE_*` environment variables.
> The `.env.example` template does not include Voice/Telephony entries.

## 5. Production Deployment Gaps

| Gap | Severity | Recommendation |
| :--- | :---: | :--- |
| No `VOICE_*` settings block | **HIGH** | Add to `settings.py` and `.env.example` |
| No PostgreSQL in current env | **MEDIUM** | Production requires PostgreSQL 16+ with pgvector |
| No Redis running | **MEDIUM** | Required for Celery task queue and caching |
| No WebSocket/ASGI | **HIGH** | Required for real-time voice streaming |
| No real STT/TTS | **HIGH** | Google Cloud Speech / TTS API keys needed |
| DEBUG=True | **CRITICAL** | Must be False in production |

## 6. Verdict

**Environment Classification: DEVELOPMENT / SIMULATION ONLY**

Live telephony verification is NOT possible in this environment.
All subsequent phases will execute using `SimulatedTelephonyAdapter`.
