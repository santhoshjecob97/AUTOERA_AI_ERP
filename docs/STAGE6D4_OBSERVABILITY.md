# AutoEra AI ERP — Stage 6D.4 End-to-End Observability & Traceability

**Document ID**: `STAGE6D4-OBSERVABILITY-010`  
**Classification**: Telemetry, Distributed Tracing & Audit Trail  

---

## 1. End-to-End Traceability Chain

Every voice session and ERP transaction produces a correlated audit trail:

```
[Inbound PSTN Call: Twilio Call SID `CA_6d82512888a349d8`]
                           │
                           ▼
          [VoiceSession ID: `18a57d07-e733-49d0-a348-244eb6cbbffc`]
                           │
                           ▼
          [AI Usage Log ID: `46c084f1-ab2f-4fbb-b2ab-97c8a00e4605`]
          Tokens: 245 in, 110 out | Latency: 310ms | Cost: $0.000051
                           │
                           ▼
          [ERP Tool Execution: `create_service_appointment`]
          Tool Execution ID: `tool_exec_9021`
                           │
                           ▼
          [Database Record ID: `sales_appointment: 6a22c477...`]
                           │
                           ▼
          [System Audit Trail: `AuditLog: Action AppointmentCreated`]
```

---

## 2. Telemetry Fields Recorded

1. `request_id`: UUIDv4 tracking the HTTP request lifecycle.
2. `session_id`: Correlating multi-turn voice sessions.
3. `organization_id` & `branch_id`: Enforcing tenant scoping across all logs.
4. `cost_usd`: Exact token and cloud cost accounted per turn.
5. `latency_ms`: Measured separately for STT, LLM, RAG, and TTS.
