# AutoEra AI ERP — Stage 6C E2E Workflows & Playwright Report

## 1. Verified End-to-End User Journeys

1. **AI Copilot Login & Intent Resolution**: Authenticated users access the Copilot; prompts are routed to the corresponding department agent.
2. **ERP Data Query**: Natural language customer and parts inquiries execute read tools securely and return structured entity cards.
3. **Knowledge Retrieval**: Complex warranty and procedure inquiries retrieve grounded SOP citations.
4. **Action Proposal Workflow**: High-risk operations (e.g. estimate approval, refunds) create proposals in `PENDING_APPROVAL` status.
5. **Manager Review & Execution**: Managers review pending proposals and approve via `/api/v1/ai/proposals/{id}/approve/`, executing the ERP tool and marking status as `EXECUTED`.
