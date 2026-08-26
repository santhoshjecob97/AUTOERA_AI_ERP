# AutoEra AI — Target System Architecture

## Architecture Overview

AutoEra AI is designed as a multi-tenant, cloud-native, AI-first Enterprise Resource Planning (ERP) platform for automotive dealerships.

```
+-----------------------------------------------------------------------+
|                           Presentation Layer                          |
|                     React 19 + Vite + TypeScript SPA                  |
+-----------------------------------------------------------------------+
                                   |
                                   v (HTTPS / REST / WS)
+-----------------------------------------------------------------------+
|                              API Gateway                              |
|                          (Nginx / Traefik / CORS)                     |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                          Application Layer                            |
|                 Django 4.2 REST Framework Backend                     |
|                                                                       |
|  [Identity & RBAC]   [Organization / Multi-Tenant]   [Customers 360]   |
|  [Vehicles]          [Sales Pipeline]               [Service / Jobs]|
|  [Workshop & Bays]   [Inventory & Parts]            [Finance]       |
|  [Billing & SaaS]    [Communication Engine]         [AI Platform]   |
+-----------------------------------------------------------------------+
             |                             |                  |
             v                             v                  v
+------------------------+   +-------------------+  +-------------------+
|  PostgreSQL Database   |   |   Redis Cache &   |  |   AI Platform &   |
|   (Relational Data +   |   |   Celery Queue    |  |   Model Gateway   |
|    Multi-Tenant RLS)   |   | (Async Messaging) |  | (Gemini, Claude)  |
+------------------------+   +-------------------+  +-------------------+
```

## Multi-Tenancy Hierarchy

AutoEra AI uses a strict hierarchical data partitioning strategy:

1. **Organization Group**: Top-level enterprise account (e.g., *Navnit Motors Group*)
2. **Dealer Group**: Brand/Regional group (e.g., *Navnit BMW South*)
3. **Dealership**: Individual physical location/entity
4. **Branch**: Operational unit or facility
5. **Department**: Functional unit (Sales, Service, Spares, Finance)

Every query is automatically scoped by `organization_id` and `branch_id` at the database and API middleware levels.

## Key Modules

- **`identity`**: User accounts, JWT/Session auth, Roles (RBAC), and Permissions.
- **`organization`**: Multi-tenant hierarchy management.
- **`customers`**: Customer 360 view, contact history, preferences.
- **`vehicles`**: VIN decoder, vehicle history, maintenance records.
- **`sales`**: Lead scoring, pipeline, test drive scheduling, quotations.
- **`service`**: Job card workflows, service estimates, maintenance schedules.
- **`workshop`**: Bay allocation algorithm, technician load balancing.
- **`inventory`**: Parts catalog, stock alerts, purchase orders.
- **`finance`**: Invoicing, payment collection, EMI calculation.
- **`billing`**: SaaS subscription management, tier entitlements, usage metering.
- **`ai_platform`**: Model routing gateway, specialist agent orchestration, RAG embeddings.
- **`audit_log`**: Security and operational audit trails.
