# AutoEra AI ERP 2026 — Final Deployment Architecture

**Audit & Deployment Mode**: Autonomous Production Release  
**Target Hosts**: Vercel (Frontend) + Render (Backend + PostgreSQL) + Google AI (Gemini)

---

## 1. End-to-End Topology & Data Flow

```
                               ┌────────────────────────────────────────────────────────┐
                               │                    DEALERSHIP USERS                    │
                               │        (Managers, Advisors, Techs, Sales, Finance)     │
                               └───────────────────────────┬────────────────────────────┘
                                                           │ HTTPS (TLS 1.3)
                                                           ▼
                               ┌────────────────────────────────────────────────────────┐
                               │                 VERCEL EDGE HOSTING                    │
                               │         https://autoera-ai-erp.vercel.app              │
                               │                                                        │
                               │  • React 19 + TypeScript + Vite 6 + TailwindCSS 4      │
                               │  • Client-side SPA routing (React Router 7)            │
                               │  • SimpleJWT Bearer Authentication                     │
                               │  • Dynamic API URL (`VITE_API_BASE_URL`)               │
                               │  • 100% Real API integration (Zero Silent Mocks)       │
                               └───────────────────────────┬────────────────────────────┘
                                                           │
                                                           │ Secure HTTPS JSON API
                                                           ▼
                               ┌────────────────────────────────────────────────────────┐
                               │              RENDER MANAGED WEB SERVICE                │
                               │          https://<service-name>.onrender.com           │
                               │                                                        │
                               │  • Hardened Django 4.2 LTS + Django REST Framework     │
                               │  • WSGI Gunicorn (2 workers, 2 threads)                │
                               │  • WhiteNoise Compressed Manifest Static Serving       │
                               │  • Strict Server-Derived Multi-Tenancy Middleware      │
                               │  • SimpleJWT Rotation & Expiry (30m access / 7d refresh│
                               │  • Probes: /health/, /health/live/, /health/ready/     │
                               └──────────────┬──────────────────────────┬──────────────┘
                                              │                          │
                 TLS Database Connection (5432)│                          │ HTTPS REST API
                                              ▼                          ▼
┌──────────────────────────────────────────────────┐   ┌──────────────────────────────────────────────────┐
│             RENDER MANAGED POSTGRESQL            │   │               GOOGLE GEMINI AI API               │
│                   (v16+ Engine)                  │   │                                                  │
│                                                  │   │ • Primary LLM: `gemini-3.6-flash`                │
│ • 14 Partitioned Multi-Tenant Domain Schemas     │   │ • Fast/Voice Turn: `gemini-3.5-flash-lite`       │
│ • Row-Level Tenant Scoping (`organization_id`)   │   │ • Embeddings: `models/gemini-embedding-2`        │
│ • pgvector extension for dense RAG embeddings    │   │ • Server-Side Only (`GEMINI_API_KEY`)            │
│ • Compound performance indexes & ACID rollback   │   │ • Prompt Injection Defense & Token Telemetry     │
└──────────────────────────────────────────────────┘   └──────────────────────────────────────────────────┘
```

---

## 2. Component Verification & Operational Guarantees

1. **Authentication Truth**:
   - `POST /api/v1/auth/login/` → Issues JWT access & refresh tokens.
   - `POST /api/v1/auth/refresh/` → Rotates access token seamlessly.
   - `GET /api/v1/auth/me/` → Returns authenticated user role and tenant context.
   - Zero production reliance on Supabase.
2. **Tenant Isolation Truth**:
   - All querysets filter by `request.user.organization_id`.
   - Cross-tenant IDOR attempts are rejected with `404 Not Found`.
3. **AI Safety & Action Proposals**:
   - High-risk operations (discounts, refunds, estimate approvals) create `ActionProposal` objects requiring human authorization.
4. **Voice AI Invariant**:
   - Codebase preserved; `VOICE_ENABLED=false` until Twilio credentials provided.
