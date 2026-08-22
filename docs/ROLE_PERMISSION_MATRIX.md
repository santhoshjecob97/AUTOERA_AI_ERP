# AutoEra AI ERP — Role-Based Access Control (RBAC) Matrix

## 1. Enterprise Hierarchy & Roles

| Role | Code | Scope | Primary Responsibility |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `SUPER_ADMIN` | Global Platform | Full system & multi-tenant administration |
| **Enterprise Admin** | `ENTERPRISE_ADMIN` | Dealer Group | Multi-dealership oversight, group analytics |
| **Dealer Principal** | `DEALER_PRINCIPAL` | Dealership | P&L, business decisions, overall dealership operations |
| **General Manager** | `GENERAL_MANAGER` | Dealership/Branch | Day-to-day cross-functional department management |
| **Sales Manager** | `SALES_MANAGER` | Sales Dept | Lead pipeline, quota, test drives, sales reps |
| **Sales Executive** | `SALES_EXECUTIVE` | Sales Dept | Lead follow-up, customer consultation, bookings |
| **Service Manager** | `SERVICE_MANAGER` | Service/Workshop | Workshop bay allocation, SLA, parts requisition |
| **Service Advisor** | `SERVICE_ADVISOR` | Service Dept | Customer check-in, job cards, repair estimates |
| **Technician** | `TECHNICIAN` | Workshop Bay | Vehicle inspection, repair execution, parts usage |
| **Finance Officer** | `FINANCE_OFFICER` | Finance Dept | Invoicing, payments, loan processing, accounting |
| **Insurance Officer** | `INSURANCE_OFFICER` | Insurance Dept | Policy renewals, claim filing, survey coordination |

---

## 2. Server-Side Permission Matrix

| Resource / Endpoint | `SUPER_ADMIN` | `GENERAL_MANAGER` | `SALES` | `SERVICE` | `TECHNICIAN` | `FINANCE` | `INSURANCE` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `/api/v1/customers/` | CRUD | CRUD | CRUD | CRUD | Read-Only | Read-Only | Read-Only |
| `/api/v1/vehicles/` | CRUD | CRUD | CRUD | CRUD | Read-Only | Read-Only | Read-Only |
| `/api/v1/leads/` | CRUD | CRUD | CRUD | — | — | — | — |
| `/api/v1/appointments/` | CRUD | CRUD | CRUD | CRUD | Read-Only | — | — |
| `/api/v1/job-cards/` | CRUD | CRUD | Read-Only | CRUD | Update | Read-Only | Read-Only |
| `/api/v1/bays/` | CRUD | CRUD | Read-Only | CRUD | Update | — | — |
| `/api/v1/parts/` | CRUD | CRUD | Read-Only | CRUD | Use | — | — |
| `/api/v1/invoices/` | CRUD | CRUD | — | Read-Only | **DENIED** | CRUD | Read-Only |
| `/api/v1/payments/` | CRUD | CRUD | — | — | **DENIED** | CRUD | — |
| `/api/v1/insurance/policies/` | CRUD | CRUD | Read-Only | — | — | Read-Only | CRUD |
| `/api/v1/insurance/claims/` | CRUD | CRUD | — | Read-Only | — | Read-Only | CRUD |
| `/api/v1/users/` | CRUD | Read/Write (Org) | — | — | — | — | — |
| `/api/v1/audit-logs/` | Read-All | Read (Org) | — | — | — | — | — |
| `/api/v1/billing/subscriptions/` | CRUD | Manage (Org) | — | — | — | — | — |
| `/api/v1/ai/copilot/chat/` | Full | Full | Sales Copilot | Service Copilot | Service Copilot | Finance Copilot | Insurance Copilot |

> **Note**: Permissions are enforced strictly on the backend via `core/permissions.py` classes (`IsSuperAdmin`, `IsManagerOrAbove`, `IsFinanceRole`, `IsServiceRole`, `IsSalesRole`). Frontend button hiding is purely for UI cleanliness and is never relied upon for security.
