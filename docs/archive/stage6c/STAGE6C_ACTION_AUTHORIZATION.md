# AutoEra AI ERP — Stage 6C Action Authorization & Human Approval Engine

## 1. ActionProposal Model Specification

To prevent unintended autonomous operations, all high-risk actions generate an `ActionProposal` record requiring authorized human review:

- **Lifecycle Statuses**: `PROPOSED` → `PENDING_APPROVAL` → `APPROVED` / `REJECTED` → `EXECUTED` / `FAILED`
- **Protected Endpoints**:
  - `GET /api/v1/ai/proposals/` (View tenant proposals filtered by status and risk level)
  - `POST /api/v1/ai/proposals/{id}/approve/` (Requires manager permission; invokes tool with `is_approved=True`)
  - `POST /api/v1/ai/proposals/{id}/reject/` (Requires manager permission; logs rejection reason)

---

## 2. Risk Enforcement Matrix

| Action | Risk Classification | Autonomous AI Execution Allowed? | Required Human Approver |
| :--- | :---: | :---: | :--- |
| **Search Customer / Vehicle** | `LOW` | ✅ Yes | N/A |
| **Check Parts Stock** | `LOW` | ✅ Yes | N/A |
| **Create CRM Follow-up** | `MEDIUM` | ✅ Yes | N/A |
| **Book Service Appointment** | `MEDIUM` | ✅ Yes | N/A |
| **Approve Repair Estimate** | `HIGH` | ❌ No | Service Manager / GM |
| **Issue Invoice Refund** | `CRITICAL` | ❌ No | General Manager / Dealer Principal |
| **Process Payment Capture** | `CRITICAL` | ❌ No | Finance Officer / GM |
