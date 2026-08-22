# AutoEra AI ERP — Stage 6D Voice End-to-End Workflows

## 1. Verified Voice Interaction Scenarios

1. **Scenario 1: Inbound Service Inquiry with RAG SOP Guidance**
   - *Customer*: *"My car is making a strange noise when I brake, what should I do?"*
   - *AI*: Identifies vehicle `TN09AB1234`, queries `search_knowledge` for Brake Inspection SOP, cites procedure, and recommends scheduling an appointment.
2. **Scenario 2: Multi-Lingual Tamil Service Booking**
   - *Customer*: *"என் வண்டிக்கு சர்வீஸ் அப்பாயின்ட்மென்ட் புக் பண்ணுங்க"*
   - *AI*: Detects `ta-IN`, identifies customer, executes `create_service_appointment`, and delivers spoken confirmation in natural Tamil.
3. **Scenario 3: High-Risk Refund Request Interception**
   - *Customer*: *"I want a refund of Rs 3000 for invoice INV-1001."*
   - *AI*: Intercepts into `ActionProposal` in `PENDING_APPROVAL` status. Explains that the request is submitted for General Manager review.
4. **Scenario 4: Immediate Human Handoff**
   - *Customer*: *"I am extremely upset and want to talk to the human manager immediately."*
   - *AI*: Sets `status = 'HUMAN_HANDOFF'`, routes to manager SIP trunk, and preserves all conversation context.
