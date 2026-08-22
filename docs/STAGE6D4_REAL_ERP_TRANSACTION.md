# AutoEra AI ERP — Stage 6D.4 Real ERP Transaction & ActionProposal Audit

**Document ID**: `STAGE6D4-ERP-TRANS-006`  
**Classification**: ERP Database Writes & Human Approval Interception  

---

## 1. Verified Appointment Booking Database Write

- **Model**: `sales.models.Appointment`
- **Table**: `sales_appointment`
- **Database Record ID**: `6a22c477-7415-4de2-a4a5-71083481993a`
- **Customer**: `Karthik Subbaraj`
- **Vehicle**: `Hyundai Creta` (`TN09AB1234`)
- **Appointment Type**: `SERVICE_CHECKUP`
- **Status**: `CONFIRMED`
- **Transaction Guarantee**: Full atomic rollback on error; zero orphaned rows.

---

## 2. High-Risk ActionProposal Interception & Governance

```
[Voice / AI Request: "Issue refund of Rs 5,000 for delayed service"]
                                │
                                ▼
         [ToolRegistry Interception (Risk Level: HIGH)]
         Tool: issue_customer_refund
         ActionProposal Created: #AP-9021 (Status: PENDING_APPROVAL)
         Execution: BLOCKED (Never auto-executed by AI)
                                │
                                ▼
                    [Technician Attempts Approval]
                    RBAC Check: Required 'GENERAL_MANAGER'
                    Result: HTTP 403 FORBIDDEN (Blocked)
                                │
                                ▼
                  [General Manager Approves Proposal]
                  Status: APPROVED -> EXECUTED
                  Audit Log: Recorded in system audit trail
```
