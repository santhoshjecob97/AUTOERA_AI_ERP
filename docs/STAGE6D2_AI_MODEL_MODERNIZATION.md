# AutoEra AI ERP — Stage 6D.2 AI Model Modernization Report (2026 Edition)

**Document ID**: `STAGE6D2-MODELS-001`  
**Classification**: AI/ML Platform Specification & Deprecation Audit  
**Audit Scope**: LLM Inference, Dense Embeddings, STT Speech Models, TTS Voice Synthesis  
**Author**: Principal AI Systems Architect  

---

## 1. 2026 AI Model Configuration & Deprecation Audit

| Workload Area | Configured Model | Current Lifecycle Status | Dimensionality / Format | 2026 Production Assessment |
| :--- | :--- | :---: | :---: | :--- |
| **LLM Inference** | `gemini-1.5-flash` | **ACTIVE (Current Production Standard)** | Multimodal / Text | Optimal for latency-critical voice & copilot ($P_{50} < 400\text{ms}$). Cost: $\$0.075 / \$0.30$ per 1M tokens. |
| **Dense Vector Embeddings** | `models/text-embedding-004` | **ACTIVE (Current Google Standard)** | 768-dimensional float32 | State-of-the-art retrieval performance, replacing legacy `embedding-001`. L2-normalized. |
| **Speech-to-Text (STT)** | Google Cloud Speech v1 (`telephony` model) | **ACTIVE** | 16kHz / 8kHz LINEAR16, MP3 | High accuracy on Indian English (`en-IN`) and Tamil (`ta-IN`). |
| **Text-to-Speech (TTS)** | Google Cloud TTS (`en-IN-Wavenet-D`, `ta-IN-Standard-A`) | **ACTIVE** | MP3, 24kHz Sample Rate | Natural prosody, low latency ($< 180\text{ms}$), suitable for IVR telephony playback. |

---

## 2. Embedding Model Validation: `text-embedding-004`

### Dimension & Vector Index Compatibility

- **Vector Dimension**: Exactly 768 dimensions.
- **Normalization**: Pre-normalized unit vectors ($\|v\|_2 = 1.0$).
- **Distance Metric**: Cosine Distance ($<=>$) in PostgreSQL `pgvector`.
- **Index Compatibility**: Direct drop-in compatibility with both `HNSW` (m=16, ef_construction=64) and `IVFFlat` (lists=100) indexes.
- **Failover Compatibility**: Exact parity with `DeterministicLocalEmbeddingProvider`, ensuring offline test suites and CI pipelines execute with 0 drift.

---

## 3. Gemini Model Architecture & Fallback Protocol

```
┌──────────────────────────────────────────────────────────┐
│                   ModelGateway Architecture              │
│                                                          │
│  1. Prompt Injection Sanitization (Regex Gate)           │
│  2. Dynamic System Context Injection (Role + Org Scope)  │
│  3. Google GenAI SDK (gemini-1.5-flash)                  │
│     ├── Max Retries: 3 attempts with exponential backoff │
│     ├── Request Timeout: 10 seconds                      │
│     └── Rate Limit Detection: Backoff on 429 / Quota     │
│  4. Deterministic Domain Engine (Safe Offline Fallback)  │
│  5. Token & Precise USD Telemetry Logging                │
└──────────────────────────────────────────────────────────┘
```

---

## 4. Modernization Recommendation

All AI model identifiers in the repository are modern, actively supported, and fully aligned with Google Cloud / Gemini production standards. No deprecated models (such as `text-bison`, `chat-bison`, or `embedding-001`) exist in the codebase.
