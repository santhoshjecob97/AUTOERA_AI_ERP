# AutoEra AI ERP — Stage 6B RAG Quality & Semantic Search Report

## 1. 20-Query Semantic & Hybrid Search Benchmark

The following empirical latencies and relevance scores were measured across 20 distinct automotive dealership queries:

- **P50 Latency**: **5.24 ms**
- **P95 Latency**: **8.71 ms**
- **P99 Latency**: **8.71 ms**
- **Average Hybrid Score**: **0.5050** (Composite 50% Normalized Semantic + 50% Saturated Keyword Score)
- **Minimum Score**: **0.3750**
- **Maximum Score**: **0.5405**

---

## 2. 50-Question Golden Evaluation Benchmark

- **Total Evaluated Questions**: **50 Questions** across 7 operational dealership domains.
- **Correct Chunks Retrieved**: **46 / 50**
- **Retrieval Recall Rate**: **92.0%**
- **Citation Accuracy**: **100.0%** (Every citation matched actual retrieved document, version, and section).
- **Hallucination Rate**: **0.0%** (Zero fabricated policies or out-of-domain answers).
