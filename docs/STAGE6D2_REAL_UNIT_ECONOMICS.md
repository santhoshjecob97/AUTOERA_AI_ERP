# AutoEra AI ERP — Stage 6D.2 Real Unit Economics & Financial Calibration

**Document ID**: `STAGE6D2-ECONOMICS-013`  
**Classification**: Production Cost Structure & Dealership Margin Analysis  

---

## 1. Upstream Provider Published Cost Baseline

| Cost Element | Provider | Published Rate | Cost / Call (2.5 min) |
| :--- | :--- | :--- | ---: |
| **Inbound Telephony** | Twilio India Local PSTN | $\$0.0085\text{ / min}$ | $\$0.02125$ |
| **Speech-to-Text** | Google Cloud Speech v1 | $\$0.006\text{ / 15s}$ | $\$0.06000$ |
| **Gemini 1.5 Flash Inference** | Google AI | $\$0.075 / \$0.30\text{ per 1M tokens}$ | $\$0.00029$ |
| **Text-to-Speech** | Google Cloud TTS WaveNet | $\$4.00\text{ per 1M chars}$ | $\$0.00160$ |
| **Cloud Hosting & DB** | GCP Cloud Run + Cloud SQL | Allocation per minute | $\$0.00204$ |
| **TOTAL COST PER 2.5 MIN CALL** | | | **$\$0.08518$ ($\approx \text{₹}7.20$)** |

---

## 2. Comparison with Human Dealership BDC Agent

| Operational Metric | AutoEra AI Voice Agent | Traditional Human BDC Agent | Difference |
| :--- | :---: | :---: | :---: |
| **Cost per Booking Call** | **$\text{₹}7.20$** | **$\text{₹}60.00$** | **$88.0\%$ Cost Reduction** |
| **Operating Hours** | 24 hours / 7 days | 9:00 AM – 6:30 PM | **Continuous Availability** |
| **ERP Booking Latency** | Instant (Database write) | 5 – 30 minutes manual data entry | **Zero Entry Lag** |
| **Multilingual Capability** | English, Tamil, Tanglish | Requires specialized agents | **Built-in Tri-lingual** |

---

## 3. SaaS Revenue & Margin Projections

At a standard subscription fee of **$\text{₹}25.00$ per resolved voice booking**, AutoEra delivers:
- **Direct Variable Cost**: $\text{₹}7.20$
- **Gross Profit per Call**: $\text{₹}17.80$
- **Gross Margin**: **$71.2\%$**
- **Monthly Gross Profit on 10,000 calls/mo**: **$\text{₹}178,000$**
