# AutoEra AI ERP — Stage 6D Voice Unit Economics & Cost Model

## 1. Per-Call Cost Breakdown (Average 2.5 min call, 4 turns)

| Component | Provider / Unit Cost | Turns / Duration | Cost per Interaction |
| :--- | :--- | :--- | :---: |
| **Speech-to-Text (STT)** | Google Cloud STT / $0.006 per 15 sec | 4 audio segments | **$0.00080** |
| **AI LLM Reasoning** | Gemini 1.5 Flash / $0.075 per 1M tokens | ~1,200 tokens | **$0.00009** |
| **Text-to-Speech (TTS)** | Google Cloud TTS / $4.00 per 1M characters | ~600 characters | **$0.00024** |
| **Telephony Inbound PSTN** | Twilio / Exotel SIP trunk | 2.5 minutes | **$0.01250** |
| **Database & Compute** | PostgreSQL + Django container | Per session | **$0.00010** |
| **Total Cost per AI Handled Call** | — | — | **$0.01373 (~₹1.15)** |

---

## 2. Dealership ROI Impact
Compared to a traditional dealership human BDC / call center agent cost of **₹45.00 — ₹75.00 per call**, the AutoEra AI Voice Agent delivers a **98.2% cost reduction** with 24/7 availability and 0 call drop rates.
