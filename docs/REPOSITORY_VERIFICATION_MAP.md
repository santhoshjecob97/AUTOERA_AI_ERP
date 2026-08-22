# AutoEra AI ERP — Repository Verification Map

| Directory / Module | Core Purpose | Technology Stack | Production Relevance | Test Coverage | Assessed Risk |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `backend/core/` | Base tenant scoping, middleware, base ViewSets, RBAC permissions, custom exception handling | Django 4.2, DRF, MiddlewareMixin | **CRITICAL (P0)** | Automated Suite (`core/test_*.py` - 20 tests) | **LOW (Hardened)** |
| `backend/identity/` | User model, RBAC role definitions, SimpleJWT token lifecycle, password management | Django Auth, SimpleJWT | **CRITICAL (P0)** | Integration tests (`test_api_crud.py`) | **LOW (Hardened)** |
| `backend/organization/` | Hierarchy: Organization → DealerGroup → Branch | Django ORM, UUID PKs | **CRITICAL (P0)** | Seeded in test suites | **LOW** |
| `backend/customers/` | Customer 360, GSTIN, contact details | DRF ModelViewSet, TenantScopedModel | **CRITICAL** | Automated CRUD & Isolation Tests | **LOW** |
| `backend/vehicles/` | VIN lifecycle, registration, fuel type, owner FK | DRF ModelViewSet, TenantScopedModel | **CRITICAL** | Automated CRUD & Isolation Tests | **LOW** |
| `backend/sales/` | CRM Leads, pipeline scoring, appointments | DRF ModelViewSet, TenantScopedModel | **HIGH** | Automated CRUD & RBAC Tests | **LOW** |
| `backend/service/` | Job Card state machine (8 states), complaints, diagnosis | DRF ModelViewSet, TenantScopedModel | **CRITICAL** | Automated Integration & Workflow Tests | **MEDIUM (Needs line-item parts/labour)** |
| `backend/workshop/` | Bay allocation, technician management | DRF ModelViewSet, TenantScopedModel | **HIGH** | RBAC permission tests | **LOW** |
| `backend/inventory/` | Spare parts catalog, reorder threshold, stock count | DRF ModelViewSet, TenantScopedModel | **HIGH** | API & Serializer Tests | **LOW** |
| `backend/finance/` | Invoices, payments, tax calculations | DRF ModelViewSet, TenantScopedModel | **CRITICAL** | RBAC boundary & CRUD tests | **LOW** |
| `backend/insurance/` | Policies, claims, fraud risk tracking | DRF ModelViewSet, TenantScopedModel | **MEDIUM** | Model & Serializer Verification | **LOW** |
| `backend/billing/` | SaaS Plans, Subscriptions, Razorpay Webhooks | DRF APIView, HMAC-SHA256, Redis cache | **CRITICAL (P0)** | Automated Webhook Security Tests (3 tests) | **LOW (Hardened)** |
| `backend/ai_platform/` | ModelGateway (Google GenAI), Prompt Injection Defense, AIUsageLog | Python Google GenAI SDK, regex guardrails | **HIGH** | Automated Injection & Context Tests (3 tests) | **MEDIUM (LLM API key required in prod)** |
| `backend/audit_log/` | Mutating API audit trail, IP tracking | Django Middleware, JSONField | **HIGH** | Integrated in all ViewSet tests | **LOW** |
| `backend/communication/` | Notifications (In-App, Email, SMS, WhatsApp) | DRF ModelViewSet | **MEDIUM** | Model & Serializer Verification | **LOW** |
| `pages/` & `components/` | Automotive Dealership UI (40+ views) | React 19, TypeScript, Lucide, Recharts | **HIGH** | Vitest Component Tests (81 tests) | **LOW** |
| `services/` | Axios API client, Gemini wrapper, Voice client, WebSockets | TypeScript, Axios | **HIGH** | Vitest API Client Tests | **MEDIUM (Voice telephony is client simulation)** |
| `.github/workflows/` | Continuous Integration / CD pipeline | GitHub Actions | **CRITICAL** | Pipeline config verified | **LOW** |
| `Dockerfile` | Multi-stage production container build | Docker, Python 3.11-slim, non-root user | **CRITICAL** | Verified multi-stage specification | **LOW** |
