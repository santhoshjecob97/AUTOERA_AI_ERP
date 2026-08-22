# AutoEra AI ERP — Stage 6C AI Tool Architecture

## 1. Tool Layer Design Principles

The ERP Tool Layer provides a controlled, auditable, and RBAC-restricted interface between AI Agents and the underlying domain entities:

- **Strict Schema & Parameter Validation**: Every tool specifies input types, required fields, and return payloads.
- **Tenant Scope Enforcement**: Every tool execution mandates valid `organization_id` context (`WHERE organization_id = :org_id`).
- **No Direct SQL / Arbitrary ORM Access**: Agents interact exclusively through predefined functions in `ai_platform.tools.tool_registry`.
- **Risk-Based Action Classification**:
  - `LOW`: Safe reads (`get_customer`, `get_vehicle`, `get_service_history`, `get_job_card`, `get_parts_availability`, `get_inventory_low_stock`, `search_knowledge`).
  - `MEDIUM`: Controlled workflow writes (`create_followup`, `create_service_appointment`, `create_service_note`).
  - `HIGH`: Financial / stock altering actions (`approve_estimate`, `modify_inventory`). Intercepted into `ActionProposal`.
  - `CRITICAL`: Irreversible monetary actions (`issue_refund`, `process_payment`). Intercepted into `ActionProposal`.
