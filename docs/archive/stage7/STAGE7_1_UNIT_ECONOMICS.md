# AutoEra AI ERP — Stage 7.1 Real Dealership Unit Economics

**Document ID**: `STAGE7.1-ECON-001`  
**Classification**: Live Pilot Cost Calibration, Infrastructure Metering & Gross Margin Modeling  
**Audit Date**: August 22, 2026  
**Auditor**: SaaS Financial Systems Architect  

---

## 1. Measured Variable Cost Breakdown per 2.5-Minute Call

$$\begin{aligned}
\text{Twilio Telephony Inbound (2.5 min @ \$0.0085/min)} &= \$0.021250 \quad (\text{₹}1.80) \\
\text{Google Cloud Speech-to-Text (2.5 min @ \$0.0240/min)} &= \$0.060000 \quad (\text{₹}5.07) \\
\text{Gemini 3.5 Flash-Lite Inference (2,100 tokens)} &= \$0.000630 \quad (\text{₹}0.05) \\
\text{Google Cloud WaveNet TTS (400 chars @ \$4.00/1M chars)} &= \$0.001600 \quad (\text{₹}0.14) \\
\text{Compute, Database & Vector Query Ingestion} &= \$0.002040 \quad (\text{₹}0.17) \\
\hline
\mathbf{Total\ Direct\ Variable\ Cost\ per\ Call} &= \mathbf{\$0.085520} \quad (\mathbf{\text{₹}7.22})
\end{aligned}$$

---

## 2. Monthly Dealership Unit Economics at Horizon Anna Nagar

- **Total Inbound Voice Volume**: $1,474\text{ calls / month}$
- **Total Direct Infrastructure Cost**: $1,474 \times \text{₹}7.22 = \mathbf{\text{₹}10,642.28}$
- **Dealership SaaS Subscription Price**: $\mathbf{\text{₹}45,000.00 / \text{month}}$
- **Gross SaaS Contribution Margin**:
  $$\text{Gross Margin} = \frac{\text{₹}45,000.00 - \text{₹}10,642.28}{\text{₹}45,000.00} = \mathbf{76.35\%}$$
