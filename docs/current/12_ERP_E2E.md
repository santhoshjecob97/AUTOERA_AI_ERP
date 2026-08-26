# 12 — End-to-End Dealership ERP Workflows

**Core Workflow Validations**: Ingestion to Delivery Lifecycle.

---

## 1. Complete Dealership Service Lifecycle

```
[ 1. Appointment Booking ]
    Customer books via portal / phone → POST /api/v1/appointments/
             │
             ▼
[ 2. Security Check-In & Gate Pass ]
    Vehicle arrives at dealership → POST /api/v1/check-ins/
    Odometer, fuel level, initial damages recorded.
             │
             ▼
[ 3. Inspection & Job Card Creation ]
    Service Advisor runs inspection → POST /api/v1/inspections/
    Creates Job Card → POST /api/v1/job-cards/ (Status: DRAFT → IN_PROGRESS)
             │
             ▼
[ 4. Bay Allocation & Parts Requisition ]
    Assign to Workshop Bay & Technician → PATCH /api/v1/job-cards/{id}/
    Add required parts → POST /api/v1/job-card-parts/ (Stock automatically checked)
    Add labour items → POST /api/v1/job-card-labour/
             │
             ▼
[ 5. Quality Control & Work Completion ]
    Technician completes work → PATCH /api/v1/job-cards/{id}/ (Status: QC_PENDING → READY_FOR_BILLING)
             │
             ▼
[ 6. Invoicing & Payment Processing ]
    Generate Invoice → POST /api/v1/invoices/
    Record Payment (Cash, UPI, Card, Razorpay) → POST /api/v1/payments/
    Close Job Card & Issue Gate Pass → Status: DELIVERED
```

---

## 2. Relational Consistency & Transaction Guarantees

- Parts inventory is decremented atomically upon job card closure.
- Invoices cannot be marked `PAID` without corresponding valid `Payment` records.
- All transactional events generate structured `AuditLog` entries.
