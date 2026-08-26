# 08 — Gemini AI Architecture & Runtime Truth

**AI Provider**: Google Gemini API  
**Primary Production Model**: `gemini-3.6-flash`  
**Fast Turn / Voice Model**: `gemini-3.5-flash-lite`  
**Embedding Model**: `models/gemini-embedding-2` (768 dimensions)

---

## 1. Gateway Architecture (`backend/ai_platform/gateway.py`)

- **Server-Side Key Isolation**: `GEMINI_API_KEY` is accessed only within backend Python code via `google.generativeai`.
- **Timeouts & Retries**: 15s timeout with exponential backoff on HTTP 429 and 503 responses.
- **Safety Filters**: Blocking of dangerous prompt injection patterns (e.g., system prompt override attempts, role hijack triggers).
- **Graceful Fallback**: In the absence of an active Gemini key or during external network failure, returns clear structured error states rather than crashing or returning fake fabricated data.

---

## 2. Cost & Token Telemetry

Every Gemini call is tracked with:
- `prompt_tokens`
- `completion_tokens`
- `latency_ms`
- `cost_usd` (computed against official 2026 pricing tiers)
- Logged into structured backend logs and `audit_log` records.
