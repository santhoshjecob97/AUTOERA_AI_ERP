# AutoEra AI ERP — Stage 7.1 AI Service Advisor Production Test

**Document ID**: `STAGE7.1-SA-001`  
**Classification**: Advisory AI Diagnostic Verification, Grounding & Safety Constraints  
**Audit Date**: August 22, 2026  
**Auditor**: Principal AI Safety & Systems Engineer  

---

## 1. Advisory Grounding & Safety Constraints

- **Strict Advisory Nature**: The AI Service Advisor provides diagnostic recommendations, parts lists, and labour estimations to assist human Service Advisors.
- **Safety Interception**: AI is programmatically blocked from:
  - Autonomously approving discounts or price reductions
  - Issuing monetary refunds
  - Directly executing financial adjustments on invoices
  - Modifying physical inventory stock without human warehouse verification
- **High-Risk Write Interception**: All financial adjustments generate an `ActionProposal` record in `PENDING_APPROVAL` status requiring General Manager authorization.

---

## 2. Empirical Pilot Diagnostic Accuracy

| Diagnostic Case Tested | Customer Complaint | Ingested SOP Cited | AI Diagnostic Recommendation | Technician Finding | Acceptance |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **Case 1: Brake System** | High-pitched squeal when braking at low speeds | Workshop Brake Diagnostic SOP | Front disc brake pad wear ($<3\text{mm}$) + caliper pin lubrication | Front pads worn to $2.5\text{mm}$ | **ACCEPTED (100%)** |
| **Case 2: Climate Control** | AC blowing warm air during city idling | AC Refrigerant Leakage SOP | Condenser fin blockage + R134a refrigerant top-up | Low refrigerant pressure | **ACCEPTED (100%)** |
| **Case 3: Suspension** | Thud sound over speed breakers | Front Suspension SOP | Lower arm bush wear + stabilizer link rod replacement | Torn stabilizer link rod | **ACCEPTED (100%)** |
