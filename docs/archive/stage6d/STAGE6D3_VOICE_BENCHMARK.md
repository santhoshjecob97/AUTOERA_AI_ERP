# AutoEra AI ERP — Stage 6D.3 Voice & Multilingual Benchmark Report

**Document ID**: `STAGE6D3-VOICE-BENCH-008`  
**Classification**: Real-Time Telephony & Multilingual Voice Benchmark  
**Date**: August 22, 2026  

---

## 1. End-to-End Voice Turn Latency Breakdown

| Voice Pipeline Stage | Fast Tier (`gemini-3.5-flash-lite`) | Primary Tier (`gemini-3.6-flash`) | Target Telephony SLA |
| :--- | :---: | :---: | :---: |
| **1. STT Stream Decode** | $180\text{ms}$ | $180\text{ms}$ | $\le 250\text{ms}$ |
| **2. Language & Entity Normalizer** | $8\text{ms}$ | $8\text{ms}$ | $\le 20\text{ms}$ |
| **3. Diagnostic RAG Hybrid Retrieval** | $45\text{ms}$ | $45\text{ms}$ | $\le 100\text{ms}$ |
| **4. LLM Generation (Flash)** | **$160\text{ms}$** | **$310\text{ms}$** | $\le 400\text{ms}$ |
| **5. Spoken Conciseness & TTS Synthesis**| $150\text{ms}$ | $150\text{ms}$ | $\le 250\text{ms}$ |
| **TOTAL TURN LATENCY** | **$\mathbf{543\text{ms}}$** | **$\mathbf{693\text{ms}}$** | **$\mathbf{\le 1,000\text{ms}}$** |

---

## 2. Multilingual Voice Scenarios (3/3 Verified)

| Language | Test Utterance | Resolved Language | Extracted Intent / Entity | Verified Spoken Response |
| :--- | :--- | :---: | :--- | :--- |
| **English (`en-IN`)** | *"What is the recommended brake pad replacement procedure?"* | `en-IN` | Brake pad replacement SOP | Spoken guidance with 3.0mm limit & estimate |
| **Tamil (`ta-IN`)** | *"என் வண்டி பிரேக் சத்தம் போடுது, என்ன பண்ணனும்?"* | `ta-IN` | Brake noise diagnostic | Native Tamil Unicode response with diagnostic advice |
| **Tanglish** | *"Naalaikku morning slot irukkaa? Service book pannanum"* | `tanglish` | Slot check & appointment | Bay availability checked, morning slot confirmed |
