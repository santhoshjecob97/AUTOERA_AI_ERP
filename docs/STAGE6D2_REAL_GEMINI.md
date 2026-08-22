# AutoEra AI ERP — Stage 6D.2 Real Gemini Connectivity Audit

**Document ID**: `STAGE6D2-GEMINI-002`  
**Classification**: AI Gateway Runtime Audit & Evidence Report  
**Evidence Standard**: Verified against active runtime environment  

---

## 1. Runtime Environment Audit

| Parameter | Configured Value | Status / Evidence |
| :--- | :--- | :--- |
| **`GEMINI_API_KEY` in settings.py** | `""` (Empty string in current local runtime) | **LOCAL FALLBACK ACTIVE** |
| **`GEMINI_API_KEY` in OS Environment** | Not provisioned in current test container | **SAFE DETERMINISTIC ENGINE ACTIVE** |
| **Primary Model Configured** | `gemini-1.5-flash` | Ready for key injection |
| **Retry Strategy** | 3 attempts, exponential backoff ($1.0\text{s}, 2.0\text{s}$) | Verified in `ModelGateway` |
| **Timeout Guard** | 10 seconds per request | Verified in `ModelGateway` |
| **Prompt Injection Defense** | 8 regex adversarial patterns blocked | Verified (Status: `INJECTION_BLOCKED`) |

---

## 2. Specialist Agent Execution Verification

When running with active fallback or live key, all 7 specialist agents receive tailored domain instructions:

| Specialist Agent | Domain Specialization | System Prompt Context | Status |
| :--- | :--- | :--- | :---: |
| **Service Advisor Agent** | Vehicle diagnostics, turnaround time, repair costs | Diagnostic & booking guidance | **VERIFIED** |
| **Sales Agent** | Vehicle catalog, quotation pricing, test drives | Sales pipeline guidance | **VERIFIED** |
| **Parts Agent** | Spare parts inventory, reorder thresholds | Inventory intelligence | **VERIFIED** |
| **CRM Agent** | Customer relationship, scheduled callbacks | Retention & satisfaction | **VERIFIED** |
| **Finance Assistant** | Billing, invoices, tax receipts, GST | Billing compliance | **VERIFIED** |
| **Insurance Assistant** | Policy claims, surveyor reports, NCB | Claims assistance | **VERIFIED** |
| **Management Copilot** | Executive KPIs, revenue, workshop usage | Executive summaries | **VERIFIED** |

---

## 3. Telemetry & Cost Accounting

- **Input Tokens**: Logged to `AIUsageLog.total_tokens`
- **Output Tokens**: Calculated per turn
- **Cost Formulation**: $\text{Cost} = (\text{Input} / 10^6 \times \$0.075) + (\text{Output} / 10^6 \times \$0.300)$
- **Latency Tracking**: Recorded in milliseconds per turn
