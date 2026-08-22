# AutoEra AI ERP — Stage 6C Baseline Assessment

## 1. Executive Summary
- **Current Verified Status (from Stage 6B)**: `96 / 100 (RAG & AI Service Advisor Pilot Verified)`
- **Stage 6C Objective**: Implement the enterprise AI Agent Orchestration, ERP Tool Registry (Safe Read/Write Tools), Human Approval Engine for High-Risk Actions (`ActionProposal`), Multi-Step Reasoning, and Multi-Agent Copilot Suite.

---

## 2. Component Baseline Inventory

| Component | Current Implementation | Baseline State | Stage 6C Target Enhancement |
| :--- | :--- | :--- | :--- |
| **Vector Storage** | `KnowledgeChunk.embedding` (JSON float list) | App-layer cosine similarity | Document vector infrastructure decision and migration strategy. |
| **AI Gateway** | `gateway.ModelGateway` | Google GenAI Gemini 1.5 Flash + Local Deterministic Fallback | Preserve unified gateway and adversarial injection defense. |
| **Agent Supervisor** | `agents.AgentSupervisor` | Keyword routing map | Upgrade to dynamic Intent Router + Tool Planner + Tool Execution Loop. |
| **ERP Tool Layer** | Ad-hoc service calls | None | Standardized `ToolRegistry` with risk levels, schemas, and RBAC authorization. |
| **Human Approval** | `requires_human_review: true` flag | Flag only | Dedicated `ActionProposal` model with approval/rejection lifecycle. |
| **Specialist Agents** | 8 Agent names in routing | General prompt | 7 Dedicated Agents (Service, Sales, CRM, Parts, Finance, Insurance, Management Copilot). |
| **AI Prompting** | Hardcoded templates | In code | Versioned `PromptTemplate` model with audit tracking in `AIUsageLog`. |
| **Telemetry & Audit** | `AIUsageLog` | Tracks tokens, latency, status | Track tool calls, tool arguments, action proposals, and human approvals. |
