# AutoEra AI ERP — Security Status & Controls Record

**Document**: `STAGE7_SECURITY_STATUS.md`  
**Classification**: Cybersecurity & DevSecOps Controls Summary  

---

## 1. Core Security Controls

### 1.1 Secret Management
- **Zero Committed Secrets**: Rigorous git scanning verified no production API keys, database credentials, or private signing keys exist in the repository.
- **Server-Side API Key Storage**: The `GEMINI_API_KEY` is loaded exclusively in the backend runtime container via environment variables.

### 1.2 Tenant Isolation & BOLA/IDOR Defense
- **User-Bound Isolation**: `TenantMiddleware` derives tenant context (`organization_id`, `branch_id`) strictly from `request.user`. Client-supplied tenant headers (`X-Organization-ID`) are explicitly ignored and logged as security warnings if mismatched.
- **Queryset Scoping**: All ViewSets inherit from `TenantScopedViewSet`, enforcing strict SQL filtering on `organization_id`. Cross-tenant record access attempts return `HTTP 404 Not Found`.

### 1.3 CORS & API Hardening
- **Restricted Origins**: `CORS_ALLOWED_ORIGINS` restricts access to authorized frontend domains (`https://autoera-ai-erp.vercel.app`, local dev). Wildcard origins (`*`) are disabled.
- **Role-Based Access Control**: 11 enterprise roles (`SUPER_ADMIN`, `GENERAL_MANAGER`, `SERVICE_ADVISOR`, etc.) enforced via Django REST Framework permission classes across all endpoints.

### 1.4 AI Action Governance
- **Action Proposals**: Mutating or financial AI operations (discounts, estimate approvals, refunds) are intercepted into an `ActionProposal` queue requiring manual manager review and approval before execution.
