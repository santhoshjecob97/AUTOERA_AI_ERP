# AutoEra AI ERP — Stage 6A Database & Relational Coverage

## 1. Relational Entities Summary

- **Total Registered Models**: **28 Models** across 11 domain apps.
- **Tenant Scoping**: All tenant-owned tables inherit from `TenantScopedModel` with indexed `organization_id` and `branch_id`.
- **Primary Keys**: UUID primary keys on all tables.
- **Foreign Key Constraints**: `PROTECT` on vital audit links (`Customer`, `Vehicle`, `JobCard`, `Invoice`), `CASCADE` on child line items (`JobCardPart`, `JobCardLabour`, `PurchaseOrderItem`, `InspectionItem`, `KnowledgeChunk`).
- **Integrity Constraints**: `reorder_level`, `stock_quantity`, `total_on_road_price`, `final_total_cost`, `balance_amount` recalculated via server-side model logic.

---

## 2. Table Index Inventory

| Table / Model | Index Columns | Index Purpose |
| :--- | :--- | :--- |
| `Customer` | `[organization_id, phone]`, `[organization_id, email]` | High-speed phone/email lookup and duplicate prevention |
| `Vehicle` | `[organization_id, vin]`, `[organization_id, registration_number]` | Instant VIN/registration lookups |
| `VehicleStock` | `[organization_id, status]`, `[organization_id, vin]` | Showroom inventory queries |
| `Lead` | `[organization_id, status]`, `[organization_id, ai_score]` | CRM pipeline filters and AI lead ranking |
| `JobCard` | `[organization_id, status]`, `[organization_id, job_card_number]` | Workshop Kanban and lifecycle state queries |
| `Part` | `[organization_id, category]`, `[organization_id, part_number]` | Parts catalogue and inventory audits |
| `Invoice` | `[organization_id, status]`, `[organization_id, invoice_number]` | Accounts receivable & payment status |
| `InsurancePolicy` | `[organization_id, expiry_date]`, `[organization_id, status]` | 30-day renewal alert batch processing |
| `KnowledgeDocument`| `[organization_id, document_type]`, `[organization_id, status]` | RAG knowledge base retrieval |
| `KnowledgeChunk` | `[organization_id, document_id]` | Semantic chunk retrieval |
