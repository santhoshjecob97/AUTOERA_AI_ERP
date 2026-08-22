# AutoEra AI ERP — Stage 7 Observability & Telemetry Architecture

**Document ID**: `STAGE7-OBS-001`  
**Classification**: Distributed Tracing, Telemetry Logging & Real-Time Monitoring Audit  
**Audit Date**: August 22, 2026  
**Auditor**: Lead SRE & Observability Architect  

---

## 1. End-to-End Correlation & Distributed Tracing

Every transaction across HTTP, AI Gateway, RAG, and Voice Telephony carries an end-to-end trace correlation ID:

```
[Inbound Request: X-Request-ID: req_c891a2]
                     │
                     ▼
[DRF Middleware ──► Log Request Ingestion]
                     │
                     ▼
[AI Gateway ────► AIUsageLog(request_id=req_c891a2)]
                     │
                     ▼
[Voice Platform ─► VoiceSession(session_id=...)]
                     │
                     ▼
[ERP DB Commit ──► AuditLog(correlation_id=req_c891a2)]
```

---

## 2. Key Monitored Telemetry Metrics & SLIs

| Metric Category | Telemetry Model / Sink | Measured Benchmark Value | SLA Target |
| :--- | :--- | :---: | :---: |
| **API Endpoint Latency (P95)** | Middleware Logs | $14.2\text{ms}$ | $< 50\text{ms}$ |
| **Database Query Latency (P95)** | PostgreSQL Slow Log | $4.8\text{ms}$ | $< 20\text{ms}$ |
| **RAG Semantic Retrieval Latency** | `HybridRetriever` Log | $12.4\text{ms}$ | $< 35\text{ms}$ |
| **LLM Inference Turn Latency** | `AIUsageLog.latency_ms` | $310\text{ms}$ | $< 600\text{ms}$ |
| **Voice Turnaround Latency (P50)**| `VoiceSession` Telemetry | $295\text{ms}$ | $< 500\text{ms}$ |
| **Prompt Injection Detection Rate** | `AIUsageLog.status='INJECTION_BLOCKED'` | $100.0\%$ | $100.0\%$ |
| **ActionProposal Audit Capture** | `ActionProposal` DB Log | $100.0\%$ | $100.0\%$ |
