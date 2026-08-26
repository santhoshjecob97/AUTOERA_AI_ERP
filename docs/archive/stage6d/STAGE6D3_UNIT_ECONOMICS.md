# AutoEra AI ERP — Stage 6D.3 Calibrated Unit Economics & Modernized Model Pricing

**Document ID**: `STAGE6D3-ECONOMICS-009`  
**Classification**: Financial Model & Upstream Provider Pricing Breakdown  
**Date**: August 22, 2026  

---

## 1. Upstream Provider Published Pricing Comparison

| Service Layer | Legacy Model Tier | Modernized Model Tier (2026) | Rate / Unit | Turn Cost (2.5 min call) |
| :--- | :--- | :--- | :--- | ---: |
| **Inbound Telephony** | Twilio India PSTN | Twilio India PSTN | $\$0.0085\text{ / min}$ | $\$0.02125$ |
| **Speech-to-Text (STT)** | Google Cloud Speech v1 | Google Cloud Speech v1 | $\$0.0240\text{ / min}$ | $\$0.06000$ |
| **LLM Inference** | `gemini-1.5-flash` | **`gemini-3.6-flash` / `3.5-lite`** | $\$0.075 / \$0.300\text{ per 1M tokens}$ | $\$0.00063$ |
| **Dense Embeddings** | `text-embedding-004` | **`gemini-embedding-2`** | Included in Tier / Zero variable | $\$0.00000$ |
| **Text-to-Speech (TTS)** | Google Cloud TTS WaveNet | Google Cloud TTS WaveNet | $\$4.00\text{ / 1M chars}$ | $\$0.00160$ |
| **Cloud Hosting & DB** | CloudSQL + Cloud Run | CloudSQL + Cloud Run | Allocated per minute | $\$0.00204$ |
| **TOTAL COST PER 2.5 MIN CALL** | | | | **$\$0.08552$ ($\approx \text{₹}7.22$)** |

---

## 2. Cost Analysis Across Call Durations

| Call Duration | Turn Count | USD Total | INR Total ($\text{₹}84.50/\$$) | Human BDC Cost | Gross Savings |
| :--- | :---: | ---: | ---: | ---: | :---: |
| **1.0 Minute** | 2 turns | **$\$0.0342$** | **$\text{₹}2.89$** | $\text{₹}30.00$ | **$90.4\%$** |
| **2.5 Minutes** | 4 turns | **$\$0.0855$** | **$\text{₹}7.22$** | $\text{₹}60.00$ | **$88.0\%$** |
| **5.0 Minutes** | 8 turns | **$\$0.1710$** | **$\text{₹}14.45$** | $\text{₹}100.00$ | **$85.6\%$** |
| **10.0 Minutes** | 15 turns | **$\$0.3421$** | **$\text{₹}28.91$** | $\text{₹}180.00$ | **$84.0\%$** |

---

## 3. SaaS Revenue & Fleet Volume Projections

| Fleet Scale | Monthly Calls | Monthly Variable Cost | Dealership Revenue ($\text{₹}25/\text{call}$) | Monthly Gross Margin ($\%$) |
| :--- | :---: | ---: | ---: | :---: |
| **Single Dealership** (100 calls/day) | 3,000 | $\text{₹}21,660$ | $\text{₹}75,000$ | **$71.1\%$** |
| **Dealer Group** (1,000 calls/day) | 30,000 | $\text{₹}216,600$ | $\text{₹}750,000$ | **$71.1\%$** |
| **OEM Network** (10,000 calls/day) | 300,000 | $\text{₹}2,166,000$ | $\text{₹}7,500,000$ | **$71.1\%$** |
| **Enterprise Fleet** (100,000 calls/mo) | 100,000 | $\text{₹}722,000$ | $\text{₹}2,500,000$ | **$71.1\%$** |
