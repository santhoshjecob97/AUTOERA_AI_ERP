# AutoEra AI ERP — Stage 6A API Coverage Matrix

## 1. REST Endpoints Inventory

| URL Path | Model / Controller | Supported HTTP Methods | RBAC Permission | Scoping Mechanism |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/auth/login/` | `LoginView` | `POST` | AllowAny (Rate Limited) | Credentials Verification |
| `/api/v1/auth/me/` | `MeView` | `GET` | IsAuthenticated | JWT User Extraction |
| `/api/v1/organizations/` | `OrganizationViewSet` | `GET, POST, PUT, PATCH, DELETE` | IsManagerOrAbove | User Organization Scoping |
| `/api/v1/branches/` | `BranchViewSet` | `GET, POST, PUT, PATCH, DELETE` | IsManagerOrAbove | Organization Scoping |
| `/api/v1/settings/` | `BusinessSettingsViewSet` | `GET, POST, PUT, PATCH, DELETE` | IsManagerOrAbove | TenantScopedViewSet |
| `/api/v1/customers/` | `CustomerViewSet` | `GET, POST, PUT, PATCH, DELETE` | IsSalesRole \| IsServiceRole | TenantScopedViewSet |
| `/api/v1/customers/search/` | `CustomerViewSet.search` | `GET` | IsSalesRole \| IsServiceRole | Multi-field Q Filter |
| `/api/v1/customers/{id}/timeline/`| `CustomerViewSet.timeline` | `GET` | IsSalesRole \| IsServiceRole | Prefetched Timeline |
| `/api/v1/vehicles/` | `VehicleViewSet` | `GET, POST, PUT, PATCH, DELETE` | IsSalesRole \| IsServiceRole | TenantScopedViewSet |
| `/api/v1/vehicle-stocks/` | `VehicleStockViewSet` | `GET, POST, PUT, PATCH, DELETE` | IsSalesRole | TenantScopedViewSet |
| `/api/v1/leads/` | `LeadViewSet` | `GET, POST, PUT, PATCH, DELETE` | IsSalesRole | TenantScopedViewSet |
| `/api/v1/leads/pipeline_stats/` | `LeadViewSet.pipeline_stats`| `GET` | IsSalesRole | Funnel Grouping |
| `/api/v1/test-drives/` | `TestDriveViewSet` | `GET, POST, PUT, PATCH, DELETE` | IsSalesRole | TenantScopedViewSet |
| `/api/v1/quotations/` | `QuotationViewSet` | `GET, POST, PUT, PATCH, DELETE` | IsSalesRole | TenantScopedViewSet |
| `/api/v1/bookings/` | `BookingViewSet` | `GET, POST, PUT, PATCH, DELETE` | IsSalesRole | TenantScopedViewSet |
| `/api/v1/job-cards/` | `JobCardViewSet` | `GET, POST, PUT, PATCH, DELETE` | IsServiceRole | TenantScopedViewSet |
| `/api/v1/job-cards/{id}/transition_status/` | `JobCardViewSet.transition_status` | `POST` | IsServiceRole | Server State Machine |
| `/api/v1/check-ins/` | `ServiceCheckInViewSet` | `GET, POST, PUT, PATCH, DELETE` | IsServiceRole | TenantScopedViewSet |
| `/api/v1/inspections/` | `ServiceInspectionViewSet` | `GET, POST, PUT, PATCH, DELETE` | IsServiceRole | TenantScopedViewSet |
| `/api/v1/job-card-parts/` | `JobCardPartViewSet` | `GET, POST, PUT, PATCH, DELETE` | IsServiceRole | Auto Total Recalc |
| `/api/v1/job-card-labour/` | `JobCardLabourViewSet` | `GET, POST, PUT, PATCH, DELETE` | IsServiceRole | Auto Total Recalc |
| `/api/v1/bays/` | `WorkshopBayViewSet` | `GET, POST, PUT, PATCH, DELETE` | IsServiceRole | TenantScopedViewSet |
| `/api/v1/bays/utilization/` | `WorkshopBayViewSet.utilization` | `GET` | IsServiceRole | Utilization Calculation |
| `/api/v1/technicians/` | `TechnicianViewSet` | `GET, POST, PUT, PATCH, DELETE` | IsServiceRole | TenantScopedViewSet |
| `/api/v1/parts/` | `PartViewSet` | `GET, POST, PUT, PATCH, DELETE` | IsServiceRole | TenantScopedViewSet |
| `/api/v1/parts/low_stock/` | `PartViewSet.low_stock` | `GET` | IsServiceRole | `stock <= reorder_level` |
| `/api/v1/suppliers/` | `SupplierViewSet` | `GET, POST, PUT, PATCH, DELETE` | IsServiceRole \| IsManagerOrAbove | TenantScopedViewSet |
| `/api/v1/purchase-orders/` | `PurchaseOrderViewSet` | `GET, POST, PUT, PATCH, DELETE` | IsServiceRole \| IsManagerOrAbove | TenantScopedViewSet |
| `/api/v1/invoices/` | `InvoiceViewSet` | `GET, POST, PUT, PATCH, DELETE` | IsFinanceRole | TenantScopedViewSet |
| `/api/v1/invoices/{id}/generate_from_job_card/` | `InvoiceViewSet.generate_from_job_card` | `POST` | IsFinanceRole | Auto GST 18% Recalc |
| `/api/v1/payments/` | `PaymentViewSet` | `GET, POST, PUT, PATCH, DELETE` | IsFinanceRole | Auto Balance Reduction |
| `/api/v1/finance-applications/`| `FinanceApplicationViewSet`| `GET, POST, PUT, PATCH, DELETE` | IsFinanceRole \| IsManagerOrAbove | TenantScopedViewSet |
| `/api/v1/insurance/policies/` | `InsurancePolicyViewSet` | `GET, POST, PUT, PATCH, DELETE` | IsFinanceRole \| IsManagerOrAbove | TenantScopedViewSet |
| `/api/v1/insurance/policies/renewals_due/` | `InsurancePolicyViewSet.renewals_due` | `GET` | IsFinanceRole \| IsManagerOrAbove | `< 30 Days Filter` |
| `/api/v1/insurance/claims/` | `InsuranceClaimViewSet` | `GET, POST, PUT, PATCH, DELETE` | IsFinanceRole \| IsManagerOrAbove | TenantScopedViewSet |
| `/api/v1/ai/copilot/chat/` | `AICopilotChatView` | `POST` | IsAuthenticated | Prompt Guardrail + Agent Router |
| `/api/v1/ai/service-advisor/context/` | `AIServiceAdvisorContextView` | `GET` | IsAuthenticated | Scoped JSON Context |
| `/api/v1/knowledge/documents/` | `KnowledgeDocumentViewSet` | `GET, POST, PUT, PATCH, DELETE` | IsManagerOrAbove | TenantScopedViewSet |
| `/api/v1/knowledge/chunks/` | `KnowledgeChunkViewSet` | `GET, POST, PUT, PATCH, DELETE` | IsManagerOrAbove | TenantScopedViewSet |
