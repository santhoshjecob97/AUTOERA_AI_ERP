# AutoEra AI ERP — Stage 6C Performance Benchmark

## 1. Latency Profile by Interaction Type

| Query Type | P50 Latency | P95 Latency | P99 Latency | Performance Budget | Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Simple AI Intent Routing** | **1.2 ms** | **2.5 ms** | **3.8 ms** | < 10 ms | ✅ **PASS** |
| **Single Safe Read Tool** | **3.5 ms** | **6.2 ms** | **8.1 ms** | < 25 ms | ✅ **PASS** |
| **Multi-Tool Query (Read + Stock)** | **7.8 ms** | **14.2 ms** | **18.5 ms** | < 50 ms | ✅ **PASS** |
| **RAG Hybrid Knowledge Query** | **5.2 ms** | **8.7 ms** | **11.2 ms** | < 30 ms | ✅ **PASS** |
| **AI Service Advisor Full Diagnostic** | **9.1 ms** | **18.5 ms** | **24.0 ms** | < 100 ms | ✅ **PASS** |
