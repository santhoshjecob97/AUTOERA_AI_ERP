# AutoEra AI ERP — Stage 6D.4 Calibrated Unit Economics & Pricing Model

**Document ID**: `STAGE6D4-ECONOMICS-011`  
**Classification**: Production Cost Structure & Dealership ROI Model  

---

## 1. Per-Minute Infrastructure Cost Breakdown

| Component | Upstream Provider | Published Rate | Cost per Minute |
| :--- | :--- | :--- | ---: |
| **Inbound Telephony** | Twilio India Local PSTN | $\$0.0085\text{ / min}$ | $\$0.00850$ |
| **Speech-to-Text (STT)** | Google Cloud Speech v1 | $\$0.0240\text{ / min}$ | $\$0.02400$ |
| **LLM Inference (Gemini Flash)** | Google Generative AI | $\$0.075 / \$0.300\text{ per 1M tokens}$ | $\$0.00025$ |
| **Dense Vector Embeddings** | Google Generative AI | Included in Tier / Zero variable | $\$0.00000$ |
| **Text-to-Speech (TTS)** | Google Cloud TTS WaveNet | $\$4.00\text{ per 1M characters}$ | $\$0.00064$ |
| **Cloud Hosting & DB** | GCP Cloud Run + CloudSQL | Scaled infrastructure tier | $\$0.00081$ |
| **TOTAL PER MINUTE** | | | **$\$0.03420$ ($\approx \text{₹}2.89$)** |

---

## 2. Cost Analysis Across Call Durations

| Call Duration | Turn Count | USD Cost | INR Cost ($\text{₹}84.50/\$$) | Human BDC Cost | Gross Savings |
| :--- | :---: | ---: | ---: | ---: | :---: |
| **1.0 Minute** | 2 turns | **$\$0.0342$** | **$\text{₹}2.89$** | $\text{₹}30.00$ | **$90.4\%$** |
| **2.5 Minutes** | 4 turns | **$\$0.0855$** | **$\text{₹}7.22$** | $\text{₹}60.00$ | **$88.0\%$** |
| **5.0 Minutes** | 8 turns | **$\$0.1710$** | **$\text{₹}14.45$** | $\text{₹}100.00$ | **$85.6\%$** |
| **10.0 Minutes** | 15 turns | **$\$0.3420$** | **$\text{₹}28.90$** | $\text{₹}180.00$ | **$84.0\%$** |

---

## 3. SaaS Multi-Tenant Volume Projections

| Daily Volume | Monthly Calls (30d) | Direct Infrastructure Cost | Subscription Revenue ($\text{₹}25/\text{call}$) | Gross Margin ($\%$) |
| :--- | :---: | ---: | ---: | :---: |
| **100 calls/day (Single Dealership)** | 3,000 | $\text{₹}21,660$ | $\text{₹}75,000$ | **$71.1\%$** |
| **1,000 calls/day (Dealer Group)** | 30,000 | $\text{₹}216,600$ | $\text{₹}750,000$ | **$71.1\%$** |
| **10,000 calls/day (Enterprise OEM)** | 300,000 | $\text{₹}2,166,000$ | $\text{₹}7,500,000$ | **$71.1\%$** |
| **100,000 calls/month (SaaS Fleet)** | 100,000 | $\text{₹}722,000$ | $\text{₹}2,500,000$ | **$71.1\%$** |
