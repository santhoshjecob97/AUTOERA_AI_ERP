# AutoEra AI ERP — Stage 6D.3 Complete AI Model Inventory (August 2026)

**Document ID**: `STAGE6D3-INVENTORY-001`  
**Classification**: Codebase AI Model Audit & Registry  
**Audit Date**: August 22, 2026  

---

## 1. Complete Model Occurrence Registry

| Component / Layer | Source File & Line | Configured Provider | Model Identifier | Purpose / Scope | Lifecycle Status |
| :--- | :--- | :---: | :--- | :--- | :---: |
| **Settings Configuration** | `backend/config/settings.py:288` | Google GenAI | `gemini-3.6-flash` | Primary Production LLM | **GA / RECOMMENDED** |
| **Settings Fast Voice** | `backend/config/settings.py:289` | Google GenAI | `gemini-3.5-flash-lite` | Low-cost Voice LLM | **GA / RECOMMENDED** |
| **Settings Embeddings** | `backend/config/settings.py:290` | Google GenAI | `models/text-embedding-004` | 768-dim Dense Vectors | **GA / CURRENT** |
| **Model Gateway** | `backend/ai_platform/gateway.py:137` | Google GenAI | Dynamic (`settings.GEMINI_MODEL_NAME`) | Agent Reasoning & Tool Planning | **GA / RECOMMENDED** |
| **Embedding Provider** | `backend/ai_platform/embeddings.py:36` | Google GenAI | Dynamic (`settings.GEMINI_EMBEDDING_MODEL`) | Semantic Chunk & Query Embedding | **GA / CURRENT** |
| **Local Failover Embedding**| `backend/ai_platform/embeddings.py:75` | Deterministic | `deterministic-768` | Offline CI & Failover Redundancy | **LOCAL ACTIVE** |
| **Knowledge Chunks Model** | `backend/ai_platform/models.py:98` | Metadata Field | `embedding_model` | Chunk Vector Model Attribution | **SCHEMA READY** |
| **Service Advisor Service** | `backend/ai_platform/service_advisor.py:122` | Google GenAI | Gateway Response Attribution | Diagnostic Synthesis & Voice Advice | **GA / RECOMMENDED** |
| **Multi-Agent Orchestrator**| `backend/ai_platform/agents.py:164` | Google GenAI | Gateway Response Attribution | Specialist Agent Execution | **GA / RECOMMENDED** |
| **Speech-to-Text (STT)** | `backend/ai_platform/voice.py:380` | Google Cloud Speech | `telephony` / `default` | Audio Transcription (en-IN, ta-IN) | **ACTIVE** |
| **Text-to-Speech (TTS)** | `backend/ai_platform/voice.py:470` | Google Cloud TTS | `en-IN-Wavenet-D`, `ta-IN-Standard-A` | Spoken Voice Audio Synthesis | **ACTIVE** |

---

## 2. Deprecation Clearance Finding

Zero deprecated models (`text-bison`, `chat-bison`, `embedding-001`, `code-gecko`) remain in the codebase. All AI workloads are unified behind dynamic settings configuration in `backend/config/settings.py`.
