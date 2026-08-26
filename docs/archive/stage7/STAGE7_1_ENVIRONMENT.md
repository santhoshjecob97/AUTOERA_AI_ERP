# AutoEra AI ERP — Stage 7.1 Environment & Pilot Infrastructure

**Document ID**: `STAGE7.1-ENV-001`  
**Classification**: Live Dealership Pilot Environment Separation & Cloud Configuration  
**Audit Date**: August 22, 2026  
**Auditor**: Lead DevSecOps & Cloud Infrastructure Architect  

---

## 1. Live Pilot Environment Topology

```
┌────────────────────────────────────────────────────────┐
│             PILOT DEALERSHIP ENVIRONMENT               │
│       (Horizon Hyundai Anna Nagar 3S Facility)         │
├────────────────────────────────────────────────────────┤
│  Application Server : Django 5.x / DRF (Gunicorn)      │
│  Frontend Client    : React 18 / Vite / TypeScript     │
│  Primary Database   : PostgreSQL 16.4 (RDS Multi-AZ)   │
│  Vector Store       : pgvector HNSW Index (768-dim)    │
│  Primary LLM        : gemini-3.6-flash                 │
│  Fast Voice LLM     : gemini-3.5-flash-lite            │
│  Embeddings Model   : models/gemini-embedding-2 (768d) │
│  Telephony Carrier  : Twilio Live Inbound / Outbound   │
│  STT Engine         : Google Cloud Speech v1 (16kHz)   │
│  TTS Engine         : Google Cloud WaveNet (en-IN/ta)  │
│  Payment Gateway    : Razorpay (Live Pilot Sandbox)    │
└────────────────────────────────────────────────────────┘
```

---

## 2. Environment Configuration & Security Hardening

- **`DJANGO_DEBUG`**: Set to `False` in staging and production pilot.
- **CORS Allowed Origins**: Strict whitelist configured for `https://horizon.autoera.ai` and authorized pilot staff portals.
- **Secrets Management**: Zero credentials committed in git; all API tokens injected securely via environment variables.
- **Database Connection Pooling**: PgBouncer connection pooler with max 100 client connections and transaction pooling.
