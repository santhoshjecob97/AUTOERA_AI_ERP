# 01 — Architecture Truth

**AutoEra AI ERP 2026 Enterprise Architecture Map**

```
[ DEALERSHIP USER BROWSER ]
           │
           │ HTTPS (TLS 1.3)
           ▼
   [ VERCEL CDN / EDGE ]
   React 19 + TypeScript + Vite + TailwindCSS 4
   - Client-side Routing (React Router 7)
   - Axios Interceptors (SimpleJWT Bearer Token injection & 401 refresh handling)
   - Zero-Mock Policy on Production Screens
           │
           │ HTTPS REST API Calls (JSON)
           ▼
   [ RENDER WEB SERVICE ]
   Hardened Django 4.2 LTS + Django REST Framework + Gunicorn + WSGI
   ├── Middleware Pipeline:
   │   ├── SecurityMiddleware & Security Headers (HSTS, X-Content-Type, X-Frame-Options)
   │   ├── CorsMiddleware (Restricted to Vercel domain & local dev)
   │   ├── AuthenticationMiddleware & SimpleJWT Authentication
   │   ├── TenantMiddleware (Server-side organization resolution & spoofing prevention)
   │   └── AuditLogMiddleware (Non-blocking request audit tracing)
   ├── Domain Services & ViewSets:
   │   ├── identity / organization / customers / vehicles / sales / service / workshop
   │   └── inventory / finance / insurance / billing / communication / audit_log
   ├── AI Gateway & Orchestration:
   │   ├── ai_platform.gateway (Gemini 3.6 Flash & Fast Lite LLM interface)
   │   ├── ai_platform.embeddings (Gemini Dense Embedding 2, 768-dim)
   │   ├── ai_platform.rag (Hybrid Keyword + Vector Search with strict tenant filters)
   │   └── ai_platform.voice (Twilio / Simulator adapter, VOICE_ENABLED=false)
   └── Task Engine / Cache:
       └── Redis 7 (Key Value) / LocMemCache Fallback + Celery 5.3
           │
           │ TLS Database Connection (Pool size: 20, max age: 600s)
           ▼
   [ RENDER POSTGRESQL 16+ ]
   ├── Multi-Tenant Row-Level Partitioned Relational Tables
   └── pgvector Extension for Vector Embedding Storage & Indexing
```

---

## Key Invariants & Truths

1. **No Client-Side Secrets**: Browser bundles contain zero API keys. Google Gemini API keys are maintained strictly server-side in Render environment variables.
2. **Server-Derived Multi-Tenancy**: Organization identity is derived exclusively from the authenticated JWT session (`request.user.organization_id`). Client-provided headers (`X-Organization-ID`) attempting to override the tenant context are rejected.
3. **Graceful Cache Degradation**: When external Redis instances are unprovisioned, Django switches to in-memory local caching rather than failing requests.
4. **ActionProposal Safety Gate**: High-risk financial and transactional AI suggestions require explicit human staff approval prior to execution.
