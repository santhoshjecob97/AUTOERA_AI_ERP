# AutoEra AI ERP — Stage 6D.1 Real Unit Economics & Pricing Model

**Document ID**: `STAGE6D1-ECON-010`  
**Classification**: Financial Model & Enterprise SaaS Economics  
**Published Date**: August 2026  
**Status**: Independently Calibrated with Real Provider Cost Structure  

---

## 1. Per-Minute Infrastructure Cost Breakdown

| Component | Upstream Provider | Published Rate | Cost per Minute |
| :--- | :--- | :--- | ---: |
| **Telephony Carrier (Inbound PSTN)** | Twilio India Local DID | $\$0.0085\text{ / min}$ | $\$0.00850$ |
| **Speech-to-Text (STT)** | Google Cloud Speech v1 | $\$0.006\text{ / 15 sec}$ | $\$0.02400$ |
| **LLM Inference (Gemini 1.5 Flash)** | Google Generative AI | $\$0.075\text{ / 1M in}, \$0.30\text{ / 1M out}$ | $\$0.00012$ |
| **Text-to-Speech (TTS)** | Google Cloud TTS WaveNet | $\$4.00\text{ / 1M characters}$ | $\$0.00064$ |
| **Cloud Compute (Django + DB)** | GCP e2-medium + CloudSQL | Scaled infrastructure tier | $\$0.00081$ |
| **TOTAL COST PER MINUTE** | | | **$\$0.03407$ ($\approx \text{₹}2.88$)** |

---

## 2. Total Cost by Call Duration

| Call Duration | Turn Count | USD Cost | INR Cost ($\text{₹}84.50/\$$) | Human BDC Cost | Gross Savings |
| :--- | :---: | ---: | ---: | ---: | :---: |
| **1.0 Minute (Quick Status)** | 2 turns | **$\$0.034$** | **$\text{₹}2.88$** | $\text{₹}30.00$ | **$90.4\%$** |
| **2.5 Minutes (Service Booking)** | 4 turns | **$\$0.085$** | **$\text{₹}7.20$** | $\text{₹}60.00$ | **$88.0\%$** |
| **5.0 Minutes (Diagnostic Inquiry)** | 8 turns | **$\$0.170$** | **$\text{₹}14.40$** | $\text{₹}100.00$ | **$85.6\%$** |
| **10.0 Minutes (Complex Escalation)** | 15 turns | **$\$0.341$** | **$\text{₹}28.80$** | $\text{₹}180.00$ | **$84.0\%$** |

---

## 3. SaaS Multi-Tenant Volume Projections

| Daily Volume | Monthly Calls (30d) | Direct Infrastructure Cost | Dealership Subscription Revenue ($\text{₹}25/\text{call}$) | Gross Margin ($\%$) |
| :--- | :---: | ---: | ---: | :---: |
| **100 calls/day (Single Dealership)** | 3,000 | $\text{₹}21,600$ | $\text{₹}75,000$ | **$71.2\%$** |
| **1,000 calls/day (Dealer Group)** | 30,000 | $\text{₹}216,000$ | $\text{₹}750,000$ | **$71.2\%$** |
| **10,000 calls/day (Enterprise OEM)** | 300,000 | $\text{₹}2,160,000$ | $\text{₹}7,500,000$ | **$71.2\%$** |
| **100,000 calls/month (SaaS Fleet)** | 100,000 | $\text{₹}720,000$ | $\text{₹}2,500,000$ | **$71.2\%$** |

---

## 4. Competitive Advantage vs Traditional Human Call Center

1. **24/7 Availability**: Zero night/weekend staffing premiums.
2. **Instant ERP Action**: Direct appointment creation in database without human data-entry delay.
3. **Multi-Lingual Coverage**: Native Tamil, English, and Tanglish without specialized multilingual staff.
4. **$88\%$ Cost Reduction**: $\text{₹}7.20$ per standard booking call vs $\text{₹}60.00$ for human BDC agent.
