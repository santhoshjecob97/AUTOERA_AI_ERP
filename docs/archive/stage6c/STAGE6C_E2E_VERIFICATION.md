# AutoEra AI ERP — Stage 6C E2E Workflows & Pilot Scenarios

## 1. 5 Real-World Pilot Dealership Scenarios

1. **Scenario 1: Service Status Inquiry**
   - *Query*: `"What is the status of my vehicle service?"`
   - *Result*: Routes to `Service Advisor Agent`, runs `get_job_card`, returns current job card state and complaints.
2. **Scenario 2: Service Appointment Booking**
   - *Query*: `"Book service appointment for customer Ananya Roy tomorrow."`
   - *Result*: Runs `create_service_appointment` (`MEDIUM` risk), returns scheduled timestamp and appointment ID.
3. **Scenario 3: Job Delay Diagnostics**
   - *Query*: `"Why is Job Card #JC-ORCH-01 delayed and what does our SOP recommend?"`
   - *Result*: Runs `get_job_card` + `get_parts_availability` + `search_knowledge`. Synthesizes grounded response with SOP citation.
4. **Scenario 4: Inventory & Low Stock Alert**
   - *Query*: `"Which parts are below reorder level?"`
   - *Result*: Routes to `Parts Agent`, runs `get_inventory_low_stock`, returns part numbers and stock quantities.
5. **Scenario 5: High-Risk Refund Proposal**
   - *Query*: `"Create refund of Rs 5000 for customer invoice."`
   - *Result*: Routes to `Finance Assistant`, runs `issue_refund` (`CRITICAL` risk), creates `ActionProposal` in `PENDING_APPROVAL` status awaiting General Manager authorization.
