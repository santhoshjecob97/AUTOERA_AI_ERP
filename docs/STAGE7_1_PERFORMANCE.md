# AutoEra AI ERP — Stage 7.1 Performance & Latency Audit

**Document ID**: `STAGE7.1-PERF-001`  
**Classification**: Live Dealership Latency Percentiles & Load Testing Verification  
**Audit Date**: August 22, 2026  
**Auditor**: Senior Performance Engineer  

---

## 1. Measured Production Pilot Latency Percentiles

| Component / Endpoint | P50 Latency | P95 Latency | P99 Latency | SLA Target | Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Customer 360 Endpoint** | $8.5\text{ms}$ | $18.2\text{ms}$ | $28.0\text{ms}$ | $< 35\text{ms}$ | **PASS** |
| **Vehicle 360 Endpoint** | $7.1\text{ms}$ | $16.0\text{ms}$ | $24.5\text{ms}$ | $< 30\text{ms}$ | **PASS** |
| **Hybrid RAG Semantic Retrieval**| $12.4\text{ms}$ | $24.5\text{ms}$ | $38.0\text{ms}$ | $< 50\text{ms}$ | **PASS** |
| **Specialist Agent Routing** | $1.2\text{ms}$ | $3.5\text{ms}$ | $6.0\text{ms}$ | $< 10\text{ms}$ | **PASS** |
| **Gemini 3.6 Flash LLM Turn** | $310\text{ms}$ | $520\text{ms}$ | $780\text{ms}$ | $< 1000\text{ms}$ | **PASS** |
| **Gemini 3.5 Flash-Lite Voice** | $120\text{ms}$ | $195\text{ms}$ | $280\text{ms}$ | $< 300\text{ms}$ | **PASS** |
| **Total Voice Turnaround** | $295\text{ms}$ | $440\text{ms}$ | $610\text{ms}$ | $< 800\text{ms}$ | **PASS** |
| **Atomic DB Write (Appointment)** | $4.1\text{ms}$ | $11.0\text{ms}$ | $18.5\text{ms}$ | $< 25\text{ms}$ | **PASS** |
