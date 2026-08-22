# AutoEra AI ERP — Stage 7.2 Environment Strategy

**Document ID**: `STAGE7.2-ENV-STRATEGY-001`  
**Classification**: Multi-Stage Environment Isolation & Governance  
**Date**: August 22, 2026  

---

## 1. Environment Matrix

| Environment | Database | Redis | LLM Gateway | Telephony | Host Platform |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **LOCAL** | SQLite / Local Postgres | Local Redis / In-memory | `gemini-3.6-flash` / Fallback | Simulated Voice | Localhost:8000 / :5173 |
| **STAGING** | Managed PostgreSQL (pgvector) | Upstash Redis | `gemini-3.6-flash` | Twilio Sandbox | Render / AWS ECS Staging |
| **PILOT** | Dedicated Pilot DB Schema | Dedicated Redis DB 1 | `gemini-3.6-flash` | Live Pilot DID (`+91...`)| Production Container Pool |
| **PRODUCTION**| Multi-AZ RDS PostgreSQL | ElastiCache Redis Cluster | Multi-region Gemini Pool| Enterprise Twilio Trunk | Kubernetes / AWS ECS Cluster|

---

## 2. Hard Security Constraints
- `DEBUG = False` enforced in Staging, Pilot, and Production.
- `CORS_ALLOWED_ORIGINS` strictly limited to authorized frontend URLs.
- Cross-tenant database access blocked at ORM query and connection level.
