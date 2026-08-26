# AutoEra AI ERP 2026 — Stage 7 Role-Based Access Control (RBAC) Verification

**Audit Date**: 2026-08-26  
**Status**: `[VERIFIED]`

---

## 1. Dealership Hierarchy & Permission Enforcements

```
Organization: Apex Mobility Group
   └── Dealer Group: Apex Premium Cars
         ├── Branch 1: Apex Downtown Showroom & Workshop (Main)
         └── Branch 2: Apex North Hub (Satellite)
```

### Department Matrix

1. **General Management**: Executive dashboards, revenue analytics, AI copilot strategy, cross-department visibility.
2. **Service & Workshop**: Bay management, technician assignment, job cards, estimates, customer 360, vehicle 360, parts requests.
3. **Sales & CRM**: Lead capture, AI lead scoring, virtual showroom, test drive tracking, booking pipelines.
4. **Finance & Accounts**: Invoicing, payment ledger, credit assessment, tax compliance, financial reports.
5. **Insurance & Claims**: Policy management, claim tracking, damage assessment, automated renewal reminders.

---

## 2. Row-Level Tenant Security

- All Django querysets inherit from `TenantScopedViewSet` or explicitly filter by `organization_id`.
- Attempts to pass arbitrary `X-Organization-ID` or `organization` payload parameters from frontend requests are intercepted and stripped by `core.middleware.TenantMiddleware`.
- IDOR attempts against cross-tenant IDs return `404 Not Found`.
