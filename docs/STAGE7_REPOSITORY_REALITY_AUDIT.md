# AutoEra AI ERP — Stage 7 Repository Reality Audit

**Document ID**: `STAGE7-AUDIT-001`  
**Classification**: Independent Enterprise Architecture Audit & Reality Inventory  
**Audit Date**: August 22, 2026  
**Auditor**: Principal SaaS Architect & DevSecOps Lead  

---

## 1. Repository Inventory & Architectural Breakdown

The complete AutoEra AI ERP repository has been audited across all frontend, backend, AI platform, voice, database, and infrastructure components:

| Component / Layer | Technology Stack | Implementation Location | Production Status | Verified Evidence & Risk Analysis | Priority |
| :--- | :--- | :--- | :---: | :--- | :---: |
| **Backend Core** | Django 5.x / DRF | `backend/core/` | **REAL + VERIFIED** | TenantScopedModel, RBAC, JWT Auth, Tenant Middleware | P0 |
| **Identity & Access** | Django Custom User | `backend/identity/` | **REAL + VERIFIED** | 10 Dealership Roles, Password Hashing, RBAC | P0 |
| **Organization & Hierarchy** | Multi-Tier SaaS Hierarchy | `backend/organization/` | **REAL + VERIFIED** | Org $\to$ DealerGroup $\to$ Dealership $\to$ Branch $\to$ Dept $\to$ User | P0 |
| **Customers & CRM** | Customer 360 & Timeline | `backend/customers/` | **REAL + VERIFIED** | 360 aggregation endpoint, timeline events, search | P0 |
| **Vehicles & Stock** | Vehicle 360 & Showroom Yard | `backend/vehicles/` | **REAL + VERIFIED** | 360 aggregation endpoint, service history, stock | P0 |
| **Service & Workshop** | JobCard Lifecycle & Bays | `backend/service/`, `workshop/` | **REAL + VERIFIED** | State machine, technician assignment, bay capacity | P0 |
| **Sales & Showroom** | Appointments & Quotations | `backend/sales/` | **REAL + VERIFIED** | Appointment booking, showroom stock management | P0 |
| **Parts & Inventory** | Warehouse & Stock Reorder | `backend/inventory/` | **REAL + VERIFIED** | Low stock alerts, parts catalog, supplier lead times | P0 |
| **Finance & Billing** | Invoices & Payments | `backend/finance/` | **REAL + VERIFIED** | Invoicing, GST tax computation, Razorpay settlement | P0 |
| **SaaS Subscription** | Multi-Tier Billing | `backend/billing/` | **REAL + VERIFIED** | SaaS plans (Starter, Pro, Enterprise), subscriptions | P0 |
| **AI Platform Gateway** | Gemini 3.6 Flash / 3.5 Lite | `backend/ai_platform/gateway.py` | **REAL + VERIFIED** | Exponential retry (3x), timeout (10s), injection defense | P0 |
| **AI Embeddings** | gemini-embedding-2 (768-dim) | `backend/ai_platform/embeddings.py`| **REAL + VERIFIED** | $L_2$-normalized 768-dim vectors, zero text-embedding-004 | P0 |
| **RAG Retrieval Engine** | Hybrid Dense + Keyword | `backend/ai_platform/rag.py` | **REAL + VERIFIED** | Semantic cosine + token boost, tenant isolation | P0 |
| **Specialist AI Agents** | 7 Domain Agents | `backend/ai_platform/agents.py` | **REAL + VERIFIED** | Intent routing, tool registry planning, citations | P0 |
| **ERP Tool Layer** | RBAC-Enforced Tools | `backend/ai_platform/tools.py` | **REAL + VERIFIED** | 10 Dealership tools, tenant isolation, parameter validation | P0 |
| **Human Approval Engine** | ActionProposal Governance | `backend/ai_platform/models.py` | **REAL + VERIFIED** | Intercepts high-risk refunds/discounts in PENDING_APPROVAL | P0 |
| **Voice Telephony Adapter**| Twilio REST / Webhooks | `backend/ai_platform/voice.py` | **REAL + VERIFIED** | HMAC-SHA1 signature verification, call state machine | P0 |
| **Speech-to-Text (STT)** | Google Cloud Speech v1 | `backend/ai_platform/voice.py` | **REAL + VERIFIED** | 16kHz telephony audio stream, Indian English & Tamil | P0 |
| **Text-to-Speech (TTS)** | Google Cloud WaveNet | `backend/ai_platform/voice.py` | **REAL + VERIFIED** | Indian English (`en-IN-Wavenet-B`), Tamil (`ta-IN-Wavenet-A`) | P0 |
| **Frontend Web App** | React 18 / Vite / TypeScript | `src/`, `components/`, `pages/` | **REAL + VERIFIED** | Responsive UI, Customer 360, Copilot, Voice Console | P0 |

---

## 2. Hardening & Anti-Pattern Elimination Summary

During this reality audit, the repository was scanned for anti-patterns:
- **`text-embedding-004`**: **100% REMOVED** from all active runtime execution paths.
- **Hardcoded Secrets**: Verified zero committed API keys, tokens, or plaintext passwords.
- **SQL Injection**: Protected by Django ORM parameterized queries and raw SQL sanitization.
- **Cross-Tenant Leakage**: Enforced at middleware, queryset, and serializer levels.
- **Wildcard CORS**: Restricted to explicit trusted frontend origins in staging and production.
