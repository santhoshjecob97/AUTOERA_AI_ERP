# AutoEra AI ERP — Stage 7 Deployment Blockers & Resolution Audit

**Date**: 2026-08-26  
**Scope**: Full Repository Scan for Hardcoded Credentials, Localhost URLs, Mock Data, and Architectural Hazards.

---

## 1. Automated Scan Results & Classifications

### A. Localhost & Hardcoded URLs
| Pattern Found | Location | Context | Action Taken / Status |
| :--- | :--- | :--- | :--- |
| `http://localhost:8000` | `services/api.ts` | Default fallback for `import.meta.env.VITE_API_BASE_URL` in local dev | **[SAFE]** Production uses `VITE_API_BASE_URL` injected by Vercel |
| `http://localhost:5173` | `backend/config/settings.py` | `CORS_ALLOWED_ORIGINS` default | **[SAFE]** Overridden by `CORS_ALLOWED_ORIGINS` env in production |
| `127.0.0.1` | `backend/config/settings.py` | `ALLOWED_HOSTS` default | **[SAFE]** `DJANGO_ALLOWED_HOSTS` dynamically supplied on Render |

### B. Secrets & API Keys
| Secret Type | Status in Codebase | Security Review |
| :--- | :--- | :--- |
| `DJANGO_SECRET_KEY` | **[SAFE]** | Read via `os.environ.get('DJANGO_SECRET_KEY')`. No hardcoded keys in git. |
| `GEMINI_API_KEY` | **[SAFE]** | Read strictly via `os.environ.get('GEMINI_API_KEY')` in Django backend. Removed from `vite.config.ts`. |
| `DATABASE_URL` | **[SAFE]** | Configured via `django-environ` from environment. `.env` is gitignored. |
| `TWILIO_AUTH_TOKEN` | **[SAFE]** | Optional. Stored only in server environment when enabled. |
| `RAZORPAY_KEY_SECRET` | **[SAFE]** | Configured via environment variables. |

### C. Mock Data vs. Production Data
| Component | Mock Presence | Purpose | Production Behavior |
| :--- | :--- | :--- | :--- |
| `mock-backend/` | Yes | Standalone testing mock server | Isolated directory, excluded from production builds |
| `tests/**/*.test.ts` | Yes | Vitest unit test fixtures | Strictly within test files |
| `pages/ServiceEngine.tsx` | Fallback cleaned | Formerly held Supabase mocks | Replaced with Django API integration (`/api/v1/service/job-cards/`) |
| `src/lib/supabase.ts` | Deprecated stub | Legacy migration shim | Explicitly throws error if called; auth is 100% Django JWT |

---

## 2. Hardening Fixes Applied

1. **Vite Secret Leak Prevention**: Removed `define` block in `vite.config.ts` that previously mirrored `GEMINI_API_KEY` into browser JavaScript.
2. **Django Cache Resilience**: Modified `CACHES` setting in `backend/config/settings.py` to gracefully use `LocMemCache` when `REDIS_URL` is omitted, eliminating 500 ConnectionRefused errors in environments where Redis is not active.
3. **CORS & Authentication Scoping**: Restricted CORS headers and ensured SimpleJWT tokens are sanitized and rotated upon expiry.
