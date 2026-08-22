# AutoEra AI ERP — Stage 7 Multi-Tenancy Architecture & Hierarchy Audit

**Document ID**: `STAGE7-TENANT-001`  
**Classification**: Multi-Tenant Isolation & Hierarchical Security Verification  
**Audit Date**: August 22, 2026  
**Auditor**: Principal SaaS Security Architect  

---

## 1. Dealership Tenant Hierarchy

AutoEra AI ERP models real automotive dealer group structures through a 6-level hierarchy:

```
┌─────────────────────────────────────────────────────────────┐
│                       ORGANIZATION                          │
│               (Root SaaS Subscriber / Billing)              │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                       DEALER GROUP                          │
│            (e.g., Horizon Automotive Group Chennai)         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                        DEALERSHIP                           │
│                (e.g., Horizon Hyundai OEM Dealership)       │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                          BRANCH                             │
│         (e.g., Anna Nagar 3S Facility - Sales/Service/Parts)│
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                        DEPARTMENT                           │
│       (e.g., Workshop Service, Showroom Sales, Bodyshop)    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                           USER                              │
│         (e.g., Service Advisor, GM, Parts Executive)        │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Multi-Tenant Defense-in-Depth Layering

1. **Layer 1: JWT & Session Authentication**: The user's authenticated `organization_id` and `branch_id` are signed inside the JWT payload. Client headers (e.g. `X-Tenant-ID`) are never trusted to override JWT claims.
2. **Layer 2: DRF ViewSet Scoping (`TenantScopedViewSet`)**: QuerySets automatically apply `.filter(organization_id=request.user.organization_id)` across all read and write operations.
3. **Layer 3: Model Persistence Validation (`TenantScopedModel`)**: Model `save()` methods automatically assign and validate `organization_id`.
4. **Layer 4: Direct Object Identifier (IDOR) Protection**: UUID access to objects from other organizations automatically returns HTTP 404 Not Found.
5. **Layer 5: AI & RAG Query Vector Scoping**: Vector similarity queries strictly filter by `organization_id` in SQL before applying semantic ranking.
6. **Layer 6: Telephony & Voice Isolation**: Twilio webhook endpoints look up callers within the organization's dedicated customer database.

---

## 3. Cross-Tenant Penetration Test Results

| Attack Vector | Simulated Scenario | Expected Outcome | Runtime Verified Result |
| :--- | :--- | :---: | :---: |
| **Cross-Tenant Customer 360** | User from Org B requests `/api/v1/customers/{org_a_id}/360/` | HTTP 404 | **404 BLOCKED** |
| **Cross-Tenant Vehicle 360** | User from Org B requests `/api/v1/vehicles/{org_a_id}/360/` | HTTP 404 | **404 BLOCKED** |
| **Tenant Header Override** | Malicious header `X-Tenant-Override: OrgA` passed | Ignored | **OVERRIDE BLOCKED** |
| **Cross-Tenant RAG Exfiltration**| Org B user asks AI about Org A warranty policy | Zero matches | **0 MATCHES RETURNED** |
| **Cross-Tenant Proposal Approval**| Org B GM attempts to approve Org A ActionProposal | Forbidden | **FORBIDDEN (404/403)** |
