# AutoEra AI ERP — Stage 6D VoiceSession & State Lifecycle

## 1. `VoiceSession` Model Specification

Every voice interaction creates a tenant-scoped `VoiceSession` in PostgreSQL:

| Field | Type | Description |
| :--- | :--- | :--- |
| `session_id` | `UUIDField` | Unique public session identifier |
| `organization_id` | `UUIDField` | Multi-tenant tenant boundary |
| `customer` | `ForeignKey(Customer)` | Identified customer record |
| `vehicle` | `ForeignKey(Vehicle)` | Identified vehicle record |
| `channel` | `CharField` | `PHONE`, `WEBRTC`, or `SIMULATOR` |
| `provider` | `CharField` | `twilio`, `exotel`, or `simulator` |
| `provider_call_id` | `CharField` | Carrier call SID / simulation token |
| `status` | `CharField` | `INITIATED` -> `RINGING` -> `CONNECTED` -> `AI_ACTIVE` -> `HUMAN_HANDOFF` -> `COMPLETED` |
| `language` | `CharField` | Detected interaction language (`en-IN`, `ta-IN`, `tanglish`) |
| `agent_name` | `CharField` | Active specialist agent |
| `handoff_status` | `BooleanField` | True if call escalated to human staff |
| `duration_seconds`| `IntegerField` | Total call duration in seconds |
| `stt_latency_ms` | `IntegerField` | Speech-to-text processing time |
| `llm_latency_ms` | `IntegerField` | Supervisor reasoning and tool execution time |
| `tts_latency_ms` | `IntegerField` | Text-to-speech synthesis time |
| `total_cost_usd` | `DecimalField` | Aggregated AI token and telephony cost |
