# AutoEra AI ERP — Stage 6D.4 Actual Runtime Model Truth & Configuration Inventory

**Document ID**: `STAGE6D4-RUNTIME-TRUTH-001`  
**Classification**: Runtime AI System Audit & Single Model Truth  
**Audit Date**: August 22, 2026  
**Auditor**: Independent Principal AI Architect & QA Lead  

---

## 1. Single Model Truth Inventory

| Workload Area | Configured Provider | Single Production Model ID | API Protocol | Runtime State in Dev/CI | Production Fallback Protocol |
| :--- | :---: | :--- | :---: | :---: | :--- |
| **Primary Production LLM** | Google GenAI | **`gemini-3.6-flash`** | Google GenAI REST/SDK | Local Safe Domain Engine Active | 3-Attempt Backoff $\to$ Safe Deterministic Domain Engine |
| **Voice / Fast LLM Tier** | Google GenAI | **`gemini-3.5-flash-lite`** | Google GenAI REST/SDK | Local Safe Domain Engine Active | 3-Attempt Backoff $\to$ Concise Spoken Fallback |
| **Dense Vector Embeddings** | Google GenAI | **`models/text-embedding-004`** | `embed_content` (768-dim) | Deterministic 768-dim Provider Active | Deterministic Normalized 768-dim L2 Vector Generator |
| **Speech-to-Text (STT)** | Google Cloud Speech | **Google Cloud Speech v1 Telephony** | Google Speech REST API | Audio Stream Decoded in Harness | Telephony Codec Decoder $\to$ Human Operator Handoff |
| **Text-to-Speech (TTS)** | Google Cloud TTS | **Google Cloud TTS WaveNet (`en-IN`, `ta-IN`)**| Google TTS REST API | Audio Synthesized in Harness | Spoken Conciseness Filter ($\le 3$ sentences) $\to$ IVR Tone |
| **ERP Tool Layer** | Internal ERP | **12 Scoped Tools** | Direct Python Django ORM | **LIVE ACTIVE** | Validation Rejection $\to$ Safe Error Logging |
| **Human Approval Layer** | Internal Engine | **`ActionProposal` Engine** | PostgreSQL / SQLite Atomic DB | **LIVE ACTIVE** | Block Execution $\to$ Route to Manager Queue |

---

## 2. Explicit Verification Disclosures

> [!IMPORTANT]
> **Single Model Truth Declarations**:
> 1. **No Ambiguous Slashes**: The single official dense embedding model configured for production RAG is **`models/text-embedding-004`** (768 dimensions, L2-normalized).
> 2. **Fallback Separation**: When `GEMINI_API_KEY` is not present in runtime environment, all model calls execute via `DeterministicLocalEmbeddingProvider` and `ModelGateway` safe domain fallback with explicit telemetry attribution (`status: FALLBACK_DOMAIN`).

---

## 3. Configuration Source Verification

All parameters are bound in `backend/config/settings.py`:
- `GEMINI_MODEL_NAME = 'gemini-3.6-flash'`
- `GEMINI_FAST_MODEL_NAME = 'gemini-3.5-flash-lite'`
- `GEMINI_EMBEDDING_MODEL = 'models/text-embedding-004'`
- `GEMINI_EMBEDDING_DIMENSION = 768`
