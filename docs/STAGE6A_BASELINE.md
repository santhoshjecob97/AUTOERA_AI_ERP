# AutoEra AI ERP — Stage 6A Baseline Assessment & Readiness Map

## 1. Executive Summary
- **Current Verified Status (from Stage 5B)**: `84 / 100 (Conditional Go — Limited Pilot)`
- **Stage 6A Target**: Complete Core Automotive Dealership ERP functionality with fully connected vertical slices, server-side state machines, procurement, customer 360, vehicle stock, job card line-items, and RAG data foundation.

---

## 2. Comprehensive Module Baseline Matrix

| Module | Database Layer | API Layer | Frontend Layer | Business Logic | RBAC | Audit | Notifications | Tests | Status | Missing Work for Stage 6A |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Organization Foundation** | `Organization`, `DealerGroup`, `Branch` | ViewSets registered | Settings / Workspace views | Basic CRUD | `IsManagerOrAbove` | Yes | Yes | Baseline | **PARTIAL** | Add `Department`, `Team`, `BusinessSettings` (tax, labour rate, hours). |
| **Customer 360** | `Customer` | ViewSets | Customer views | Basic CRUD | `IsSalesRole` | Yes | Yes | Isolated | **PARTIAL** | Add unified timeline events, duplicate prevention, and search API. |
| **Vehicle 360** | `Vehicle` | ViewSets | Vehicle views | Basic CRUD | Scoped | Yes | Yes | Isolated | **PARTIAL** | Add VIN uniqueness constraints, warranty tracking, and service history. |
| **CRM & Leads** | `Lead`, `Appointment` | ViewSets | Sales / Leads view | Basic CRUD | `IsSalesRole` | Yes | Yes | Isolated | **PARTIAL** | Add `LeadFollowUp`, `Quotation`, `QuotationItem`, `Booking`. |
| **Test Drive** | None | None | UI component | None | None | None | None | None | **MISSING** | Create `TestDrive` model, double-booking prevention, and API. |
| **Vehicle Stock** | None | None | Inventory view | None | None | None | None | None | **MISSING** | Create `VehicleStock` model (yard, allocation, PDI, delivery status). |
| **Service Check-In & Inspection** | None | None | Service views | None | None | None | None | None | **MISSING** | Create `ServiceCheckIn` and `ServiceInspection` with categorized checks. |
| **Job Card & Workshop** | `JobCard`, `WorkshopBay`, `Technician` | ViewSets | Service / Bays | Basic CRUD | `IsServiceRole` | Yes | Yes | Isolated | **PARTIAL** | Fix `WorkshopBayViewSet` fields, add `JobCardPart`, `JobCardLabour`, and state transitions. |
| **Parts & Inventory** | `Part` | ViewSets | Inventory views | Basic CRUD | `IsServiceRole` | Yes | Yes | Isolated | **PARTIAL** | Add `StockMovement`, `PartCategory`, reservation & consumption logic. |
| **Procurement** | None | None | Procurement view | None | None | None | None | None | **MISSING** | Create `Supplier`, `PurchaseOrder`, `PurchaseOrderItem`. |
| **Billing & Payments** | `Invoice`, `Payment`, `Subscription` | ViewSets + Webhooks | Finance views | HMAC Webhooks | `IsFinanceRole` | Yes | Yes | Verified | **PARTIAL** | Add automated total calculation from JobCard parts + labour. |
| **Insurance** | `InsurancePolicy`, `InsuranceClaim` | ViewSets | Insurance views | Basic CRUD | Scoped | Yes | Yes | Baseline | **PARTIAL** | Add policy renewal workflow and expiration alerts. |
| **Finance Tracking** | Model stubs | ViewSets | Finance views | Basic CRUD | Scoped | Yes | Yes | Baseline | **PARTIAL** | Add `FinanceApplication` tracking lifecycle. |
| **AI Platform & Context** | `AIUsageLog`, `AIConversation` | AICopilotChatView | Ask AI Modal | GenAI SDK + Regex Guardrail | `IsAuthenticated` | Yes | Yes | Verified | **PARTIAL** | Add AI Service Advisor context provider and RAG data models. |
| **RAG Data Foundation** | None | None | BulkUpload UI | None | None | None | None | None | **MISSING** | Create `KnowledgeDocument`, `KnowledgeChunk`, and metadata contracts. |
| **E2E Testing** | None (Vitest only) | None | Full UI | None | None | None | None | 81 Vitest | **PARTIAL** | Install Playwright and create browser E2E test specs. |
