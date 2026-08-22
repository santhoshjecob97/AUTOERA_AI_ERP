# AutoEra AI ERP — Stage 7 Core Dealership Service Workflow Audit

**Document ID**: `STAGE7-WORKFLOW-001`  
**Classification**: End-to-End Service Transaction & Workshop Lifecycle Verification  
**Audit Date**: August 22, 2026  
**Auditor**: Lead Automotive ERP Domain Architect  

---

## 1. Complete Dealership Service Lifecycle

```
[1. Inbound Voice/Web] ──► [2. Appointment Booking] ──► [3. Gate Check-in] ──► [4. SA Inspection]
                                                                                      │
                                                                                      ▼
[8. QC Inspection] ◄── [7. Technician Repair] ◄── [6. Customer Approval] ◄── [5. Job Card & Est]
        │
        ▼
[9. Invoice Generation] ──► [10. Online/UPI Payment] ──► [11. Vehicle Delivery] ──► [12. AI Follow-up]
```

---

## 2. State Machine & Transition Rules

| Step | State | Allowed Next States | Triggering Role | Transaction Integrity Verification |
| :---: | :--- | :--- | :--- | :--- |
| **1** | `SCHEDULED` | `CHECKED_IN`, `CANCELLED` | Service Advisor / AI Voice | `Appointment` committed to DB with timestamp |
| **2** | `CHECKED_IN` | `INSPECTION`, `ESTIMATE_PENDING` | Security / Service Advisor | Odometer reading & inventory check recorded |
| **3** | `INSPECTION` | `ESTIMATE_PENDING`, `IN_PROGRESS` | Service Advisor / Tech | Inspection report & customer complaints logged |
| **4** | `ESTIMATE_PENDING` | `APPROVED`, `CANCELLED` | Customer / General Manager | Parts cost + Labour cost calculated with 18% GST |
| **5** | `APPROVED` | `IN_PROGRESS`, `CANCELLED` | Customer / Service Advisor | High-value estimates ($>\text{₹}20,000$) approved |
| **6** | `IN_PROGRESS` | `WAITING_PARTS`, `QUALITY_CHECK` | Assigned Technician | Parts reserved from inventory warehouse |
| **7** | `QUALITY_CHECK`| `READY_FOR_DELIVERY`, `IN_PROGRESS`| Workshop QC Supervisor | Road test & checklist signoff completed |
| **8** | `READY_FOR_DELIVERY`| `DELIVERED` | Service Advisor / Cashier | Final invoice calculated from actual parts/labour |
| **9** | `DELIVERED` | Terminal State | Cashier / Customer | Payment marked `PAID` via Razorpay/Cash/UPI |

---

## 3. Verified End-to-End Transaction Evidence

- **Appointment Booking**: Appointment `#6bce0961` created via Voice AI API with customer Karthik and vehicle Creta (`TN091A0E`).
- **Job Card Lifecycle**: Transitioned `CHECKED_IN` $\to$ `IN_PROGRESS` $\to$ `COMPLETED` with estimated cost $\text{₹}4,200.00$ and final cost $\text{₹}4,200.00$.
- **Invoice Generation**: `Invoice` `#INV-WF-1A0E55` generated with Subtotal $\text{₹}3,559.32$, GST Tax $\text{₹}640.68$ ($18\%$), and Total $\text{₹}4,200.00$.
- **Payment Settlement**: `Payment` settled via Razorpay with balance reduced to $\text{₹}0.00$ and invoice status updated to `PAID`.
