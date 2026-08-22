# AutoEra AI ERP — Stage 7.2 Real Gemini API Verification

**Document ID**: `STAGE7.2-GEMINI-001`  
**Classification**: LLM Gateway & Provider Runtime Compliance  
**Date**: August 22, 2026  

---

## 1. Runtime Model Configuration

| Role | Configured Model | API Endpoint | Fallback Mode |
| :--- | :--- | :--- | :--- |
| **Primary Copilot & RAG** | `gemini-3.6-flash` | `https://generativelanguage.googleapis.com/v1beta` | Safe Automotive Rule-Engine |
| **Fast Telephony LLM** | `gemini-3.5-flash-lite` | `https://generativelanguage.googleapis.com/v1beta` | Telephony Dialog FSM |
| **Dense Vector Embeddings** | `models/gemini-embedding-2` | `https://generativelanguage.googleapis.com/v1beta` | 768-dim Deterministic Fallback |
