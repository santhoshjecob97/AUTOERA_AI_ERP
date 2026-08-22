# AutoEra AI ERP — Stage 6B Baseline Assessment

## 1. Executive Summary
- **Current Verified Status (from Stage 6A)**: `92 / 100 (Core Dealership ERP Pilot Ready)`
- **Stage 6B Objective**: Complete production-grade RAG Knowledge Engine, Semantic Vector Search, AI Service Advisor RAG integration, Anti-hallucination guardrails, and Source Citations.

---

## 2. Component Baseline Inventory

| AI Component | Current Architecture | Strengths | Baseline Gap for Stage 6B |
| :--- | :--- | :--- | :--- |
| **Model Gateway** | `gateway.ModelGateway` with Google GenAI SDK | Regex prompt injection defense, tenant system instructions, usage logs | Needs direct grounding on retrieved RAG chunks and strict anti-hallucination fallback. |
| **Agent Supervisor** | `agents.AgentSupervisor` with 8 domain routes | Role-aware execution and routing | Needs RAG Knowledge search integration for Service Advisor and Copilot. |
| **Knowledge Data Models** | `KnowledgeDocument`, `KnowledgeChunk` | Schema with versioning, doc types, metadata | Missing vector embedding storage field (`embedding`) and ingestion worker. |
| **Embedding Provider** | None | None | Needs `EmbeddingProvider` abstraction with Google `text-embedding-004` & local deterministic fallback. |
| **Vector Search Engine** | None | None | Needs tenant-isolated `HybridRetriever` (cosine similarity + keyword boost). |
| **AI Service Advisor** | Context provider `/api/v1/ai/service-advisor/context/` | Clean structured ERP JSON | Needs `/api/v1/ai/service-advisor/recommendation/` combining ERP telemetry + RAG SOP citations. |
| **Knowledge Ingestion** | `KnowledgeDocumentViewSet` | CRUD endpoints | Needs text extraction (PDF/DOCX/TXT/CSV), chunking engine, and auto-embedding pipeline. |
| **Telemetry & Cost Tracking**| `AIUsageLog` | Token count, latency, request IDs | Needs embedding tokens and RAG retrieval latency logging. |
