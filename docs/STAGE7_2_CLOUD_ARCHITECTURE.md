# AutoEra AI ERP — Stage 7.2 Cloud Deployment Architecture

**Document ID**: `STAGE7.2-ARCH-001`  
**Classification**: Multi-Tier Cloud Production Topology  
**Date**: August 22, 2026  

---

## 1. Target Multi-Cloud Infrastructure Topology

```
                  ┌────────────────────────────────────────┐
                  │          PUBLIC INTERNET / USERS       │
                  └──────────────────┬─────────────────────┘
                                     │
                 HTTPS               │               PSTN Voice Calls
                   │                 │                      │
                   ▼                 ▼                      ▼
        ┌─────────────────────┐  ┌────────────────┐  ┌──────────────┐
        │    VERCEL EDGE      │  │  CLOUDFLARE    │  │ TWILIO VOICE │
        │ (React 18 / Vite SPA│  │ (CDN / WAF)    │  │ (PSTN Trunk) │
        │  Static Assets)     │  └───────┬────────┘  └──────┬───────┘
        └──────────┬──────────┘          │                  │
                   │ HTTPS API           │ HTTPS API        │ Webhooks
                   └──────────────┐      │                  │
                                  ▼      ▼                  ▼
                        ┌────────────────────────────────────────┐
                        │        APPLICATION LOAD BALANCER       │
                        └──────────────────┬─────────────────────┘
                                           │
                        ┌──────────────────┴─────────────────────┐
                        │      BACKEND CONTAINER PLATFORM        │
                        │    (Django 5 / Gunicorn / ASGI)        │
                        ├──────────────────┬─────────────────────┤
                        │  Core ERP APIs   │  AI Platform Gateway│
                        │  Customer 360    │  RAG Hybrid Engine  │
                        │  Vehicle 360     │  Voice Gateway      │
                        │  Service Workflow│  Tool Registry      │
                        └────────┬─────────┴──────────┬──────────┘
                                 │                    │
                ┌────────────────┴────────┐           │ Celery Tasks
                ▼                         ▼           ▼
      ┌────────────────────┐   ┌────────────────┐   ┌───────────────┐
      │ MANAGED POSTGRESQL │   │ MANAGED REDIS  │   │ CELERY WORKER │
      │ (RDS / Supabase)   │   │ (Cache / Queue)│   │ (Async Jobs)  │
      │ PostgreSQL 16.4    │   └────────────────┘   └───────────────┘
      │ + pgvector (768d)  │
      └────────────────────┘
```
