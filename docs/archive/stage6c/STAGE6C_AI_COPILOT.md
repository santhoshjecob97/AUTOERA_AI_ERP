# AutoEra AI ERP — Stage 6C AI Copilot Specification

## 1. Copilot Capabilities & Natural Language Understanding

The conversational AI Copilot endpoint (`POST /api/v1/ai/copilot/chat/`) provides an interactive interface across all dealership departments:

- **Context-Aware Intent Resolution**: Automatically resolves whether queries relate to Service, Sales, Parts, Finance, Insurance, or Management.
- **Dynamic Tool Invocation**: Automatically determines if real-time ERP entity lookup (e.g. phone lookup, VIN search, stock query) or knowledge base retrieval is required.
- **Source Citations**: Returns verifiable citation metadata for every knowledge chunk utilized.
- **Action Proposal Alerts**: Generates interactive proposal alerts with risk levels when financial or inventory changes are requested.
