# 14 — Failure Testing & Graceful Degradation

**Resilience Objective**: Ensure zero white screens, zero unhandled 500 crashes, and zero silent fake mock displays under system degradation.

---

## 1. Failure Scenarios Evaluated

| Component Failure | Injected Condition | System Response | UI Behavior | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Gemini API Down / 429 Rate Limit** | Simulated API key absent or 429 quota exhaustion | Gateway catches exception, logs event, returns structured degraded status | UI displays "AI Service Temporarily Unavailable - Retry" | **[TEST_VERIFIED]** |
| **Redis Cache Down** | Redis service stopped / unconfigured | Django automatically falls back to `LocMemCache` | Normal operation without interruption | **[TEST_VERIFIED]** |
| **PostgreSQL Disconnect** | Database connection timeout | Django raises 503 on health check; endpoints return database connection error | UI displays "Database Connection Offline" | **[TEST_VERIFIED]** |
| **Expired JWT Token** | Expired access & refresh tokens | DRF returns `401 Unauthorized` | Interceptor clears storage and redirects to `/` | **[TEST_VERIFIED]** |
| **Malformed JSON Payload** | Invalid payload syntax sent to REST API | DRF returns `400 Bad Request` with field error details | UI displays inline validation error messages | **[TEST_VERIFIED]** |
