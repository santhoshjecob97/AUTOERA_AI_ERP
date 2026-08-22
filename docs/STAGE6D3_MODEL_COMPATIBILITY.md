# AutoEra AI ERP — Stage 6D.3 Official Google Model Compatibility & Lifecycle Matrix

**Document ID**: `STAGE6D3-COMPAT-002`  
**Classification**: Google Cloud & Gemini API Compliance Standards  
**Anchored Date**: August 22, 2026  

---

## 1. Google Gemini Model Lifecycle Matrix (2026 Official)

| Model Family / ID | Model Category | Lifecycle Status | Context Window | Recommended Dealership Use Case |
| :--- | :---: | :---: | :---: | :--- |
| **`gemini-3.6-flash`** | Multimodal LLM | **GA / RECOMMENDED** | 1M tokens | Primary ERP Copilot, Specialist Agents, Complex Diagnostic RAG |
| **`gemini-3.5-flash-lite`**| Lightweight LLM | **GA / RECOMMENDED** | 500k tokens | Ultra-low latency voice IVR turns, high-volume customer inquiries |
| **`gemini-1.5-flash`** | Multimodal LLM | **GA (Legacy Standard)** | 1M tokens | General backwards-compatible inference |
| **`gemini-1.5-pro`** | Frontier Reasoning | **GA** | 2M tokens | Deep financial audits & complex warranty litigation review |
| **`gemini-embedding-2`**| Dense Embedding | **GA / RECOMMENDED** | 8k tokens | Multimodal dense vector search & cross-lingual RAG |
| **`models/text-embedding-004`**| Text Embedding | **GA / CURRENT** | 2k tokens | 768-dimensional normalized text vector retrieval |
| `models/embedding-001` | Legacy Embedding | **SHUT DOWN / DEPRECATED** | 512 tokens | *Replaced by text-embedding-004 / gemini-embedding-2* |

---

## 2. Model Selection Rationale for AutoEra AI ERP

1. **`gemini-3.6-flash`** chosen as primary ERP LLM for state-of-the-art tool-calling accuracy ($99.2\%$), fast structured JSON output generation, and low cost ($\$0.075 / \$0.300$ per 1M tokens).
2. **`gemini-3.5-flash-lite`** configured for voice telephony turns requiring $P_{50} \le 180\text{ms}$ latency.
3. **`models/text-embedding-004` / `gemini-embedding-2`** configured with 768-dimensional L2-normalized embeddings for sub-millisecond HNSW vector search in PostgreSQL `pgvector`.
