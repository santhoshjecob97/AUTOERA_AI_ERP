# AutoEra AI ERP — Stage 7 Real Unit Economics & Cost Calibration

**Document ID**: `STAGE7-ECON-001`  
**Classification**: Infrastructure Cost Breakdown, Per-Call Unit Economics & Gross Margin Modeling  
**Audit Date**: August 22, 2026  
**Auditor**: Principal SaaS Financial Architect & Cloud Economist  

---

## 1. 2.5-Minute Inbound Voice Call Cost Model (2026 Rates)

| Cost Component | Pricing Basis | Usage per 2.5 min Call | Subtotal (USD) | Subtotal (INR @ ₹84.50/$) |
| :--- | :--- | :--- | :---: | :---: |
| **PSTN Telephony Inbound** | $\$0.0085$ / min | $2.5\text{ minutes}$ | $\$0.021250$ | $\text{₹}1.80$ |
| **Speech-to-Text (STT)** | $\$0.0240$ / min | $2.5\text{ minutes}$ | $\$0.060000$ | $\text{₹}5.07$ |
| **LLM Inference (Gemini Flash)**| $\$0.075 / \$0.300$ per 1M tok | $2,100\text{ tokens}$ | $\$0.000630$ | $\text{₹}0.05$ |
| **Text-to-Speech (TTS)** | $\$4.00$ / 1M chars | $400\text{ characters}$ | $\$0.001600$ | $\text{₹}0.14$ |
| **Cloud Compute & Database** | App Service + Cloud SQL | $2.5\text{ min shared}$ | $\$0.002040$ | $\text{₹}0.17$ |
| **Total Direct Variable Cost** | | | **$\$0.085520$** | **$\mathbf{\text{₹}7.22}$** |

---

## 2. Dealership BDC Cost Comparison

$$\text{Human BDC Agent Cost per 2.5 min Call} \approx \mathbf{\text{₹}60.00}$$
$$\text{AutoEra AI Direct Cost per 2.5 min Call} = \mathbf{\text{₹}7.22}$$
$$\text{Gross Direct Savings} = \frac{\text{₹}60.00 - \text{₹}7.22}{\text{₹}60.00} = \mathbf{88.0\%}$$

---

## 3. Commercial Dealership SaaS Pricing Scenarios & Gross Margins

| Commercial Pricing Scenario | Dealership Price per Call | Direct Variable Cost | Gross Margin per Call | Gross Margin % |
| :---: | :---: | :---: | :---: | :---: |
| **Tier 1 (High Volume Pilot)** | $\text{₹}15.00$ | $\text{₹}7.22$ | $\text{₹}7.78$ | **$51.9\%$** |
| **Tier 2 (Standard Dealership)**| $\text{₹}20.00$ | $\text{₹}7.22$ | $\text{₹}12.78$ | **$63.9\%$** |
| **Tier 3 (Recommended SaaS)** | $\text{₹}25.00$ | $\text{₹}7.22$ | $\text{₹}17.78$ | **$71.1\%$** |
| **Tier 4 (Premium 24/7 BDC)** | $\text{₹}30.00$ | $\text{₹}7.22$ | $\text{₹}22.78$ | **$75.9\%$** |
