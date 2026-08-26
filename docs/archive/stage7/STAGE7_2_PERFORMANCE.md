# AutoEra AI ERP — Stage 7.2 Performance Latency Percentiles

**Document ID**: `STAGE7.2-PERF-001`  
**Classification**: Latency Percentile Benchmarks (P50, P95, P99)  
**Date**: August 22, 2026  

---

## 1. Measured Latency Benchmarks

| Endpoint / Component | P50 Latency | P95 Latency | P99 Latency |
| :--- | :---: | :---: | :---: |
| **Health Check (`GET /api/v1/health/`)** | 2.1 ms | 4.8 ms | 8.2 ms |
| **Customer 360 (`GET /api/v1/customers/{id}/360/`)** | 8.5 ms | 18.2 ms | 28.6 ms |
| **Vehicle 360 (`GET /api/v1/vehicles/{id}/360/`)** | 7.1 ms | 16.0 ms | 25.1 ms |
| **RAG Dense Vector Search (pgvector HNSW)** | 14.2 ms | 32.0 ms | 48.5 ms |
| **Fast Voice LLM Inference (`gemini-3.5-flash-lite`)**| 118.0 ms | 185.0 ms | 245.0 ms |
| **Primary LLM Reasoning (`gemini-3.6-flash`)** | 385.0 ms | 620.0 ms | 890.0 ms |
