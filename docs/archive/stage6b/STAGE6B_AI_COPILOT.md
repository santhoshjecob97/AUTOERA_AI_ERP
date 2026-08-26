# AutoEra AI ERP — Stage 6B AI Copilot Architecture & Routing

## 1. Supervisor Routing Architecture

The AutoEra AI Copilot operates via `AgentSupervisor` (`backend/ai_platform/agents.py`), routing incoming natural language queries to specialized sub-agents based on authenticated user context and intent:

| Specialized Agent | Keywords / Intent | ERP & RAG Integration |
| :--- | :--- | :--- |
| **Service Advisor Agent** | `service`, `bay`, `technician`, `job card`, `maintenance`, `repair` | Integrates Vehicle History + Dealership SOP RAG |
| **Sales Engine Agent** | `lead`, `sales`, `showroom`, `prospect`, `booking`, `quotation` | Integrates CRM Funnel + Inventory Availability |
| **Inventory Agent** | `part`, `stock`, `inventory`, `procurement`, `supplier`, `reorder` | Integrates Parts Ledger + Min Reorder Thresholds |
| **Finance Agent** | `invoice`, `payment`, `loan`, `finance`, `emi`, `credit` | Integrates GST Billing Engine + Loan Applications |
| **Insurance Agent** | `claim`, `policy`, `insurance`, `surveyor`, `damage` | Integrates Renewal Pipeline + Fraud Scoring |
| **Fleet Intelligence Agent**| `fleet`, `telemetry`, `obd`, `gps`, `geofence`, `driver` | Integrates OBD-II Telemetry Streams |
| **General Copilot Agent** | Default conversational fallback | Integrates Knowledge Query RAG with Citations |
