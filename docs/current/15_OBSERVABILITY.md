# 15 — Observability & Structured Logging

**Logging Standard**: Structured JSON / Verbose Formatter in `backend/config/settings.py`

---

## 1. Log Schema & Metadata Context

Every API and background event logs:
- `timestamp`: ISO-8601 UTC timestamp.
- `level`: `INFO`, `WARNING`, `ERROR`, `CRITICAL`.
- `request_id`: Correlation UUID propagated across frontend and backend.
- `endpoint`: HTTP method and requested URL path.
- `status_code`: HTTP response status code.
- `duration_ms`: Total execution time.
- `tenant_id`: Authenticated organization UUID.
- `user_id`: Authenticated user UUID.

---

## 2. Redaction & Privacy Guardrails

The logging subsystem strictly redacts:
- Passwords and raw credential strings.
- JWT tokens (`Authorization: Bearer ...`).
- Full payment instrument details (Card CVV, full card numbers, bank PINs).
- Third-party API secrets (`GEMINI_API_KEY`, `RAZORPAY_KEY_SECRET`).
