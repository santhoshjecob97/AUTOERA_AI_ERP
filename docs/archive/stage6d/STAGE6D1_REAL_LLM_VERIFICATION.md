# AutoEra AI ERP — Stage 6D.1 Real Gemini LLM Verification

**Document ID**: `STAGE6D1-LLM-003`  
**Classification**: AI Gateway Production Hardening  
**Primary Model**: `gemini-1.5-flash`  
**Provider**: Google Generative AI / ModelGateway  

---

## 1. ModelGateway Architecture Overview

AutoEra AI ERP integrates with **Google Gemini 1.5 Flash** through the `ModelGateway` abstraction located in `backend/ai_platform/gateway.py`. The gateway provides enterprise reliability, rate-limiting backoff, token telemetry, and adversarial injection defense.

```
┌──────────────────────────────────────────────────────────┐
│                   Agent Supervisor / Copilot             │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│              ModelGateway.generate_response()            │
│  - Prompt Injection Scanner (regex patterns)             │
│  - System Instruction Builder (Role & Org Scope)         │
│  - Retry Loop (3 attempts with exponential backoff)      │
│  - Timeout Guard (10s per request)                       │
│  - Token & USD Cost Tracking ($0.075 / $0.30 per 1M)     │
└────────────┬─────────────────────────────┬───────────────┘
             │ (If GEMINI_API_KEY set)     │ (If API key missing / offline)
             ▼                             ▼
┌───────────────────────────┐ ┌───────────────────────────┐
│ Google Gemini 1.5 Flash   │ │ Deterministic Local       │
│ REST / SDK Generation     │ │ Domain Fallback Engine    │
└───────────────────────────┘ └───────────────────────────┘
```

---

## 2. Agent Specialization Matrix

The `ModelGateway` dynamically tailors system prompts based on the specialist agent requested:

| Agent Name | Specialization Domain | Focus Area |
| :--- | :--- | :--- |
| **Service Advisor Agent** | Diagnostics, repair turnaround, warranty | Maintenance booking, brake/engine diagnosis |
| **Sales Agent** | Vehicle catalog, quotation pricing | Showroom walk-in, test drives, discount policy |
| **Parts Agent** | Inventory stock, reorder thresholds | SKU lookup, warehouse reorder levels |
| **CRM Agent** | Customer relationship, follow-up schedule | Satisfaction tracking, scheduled callbacks |
| **Finance Assistant** | Billing, invoices, tax receipts, GST | Payment verification, pending invoice collections |
| **Insurance Assistant** | Policy claims, surveyor reports, NCB | Claim status, cashless settlement, renewal |
| **Management Copilot** | Executive KPIs, revenue, workshop usage | Daily dealership summary, bay utilization |

---

## 3. Resilience, Timeout & Rate-Limiting

### Exponential Backoff Strategy

1. **Attempt 1**: Immediate call with 10s timeout.
2. **Attempt 2** (on failure / 429): Backoff $1.0\text{s}$.
3. **Attempt 3** (on failure / 429): Backoff $2.0\text{s}$.
4. **Failover**: Graceful transition to deterministic local domain intelligence.

```python
# Rate-Limit & Backoff Handling
for attempt in range(1, self.max_retries + 1):
    try:
        model = genai.GenerativeModel(model_name='gemini-1.5-flash', system_instruction=system_instruction)
        gemini_resp = model.generate_content(prompt, request_options={'timeout': self.timeout_seconds})
        return self._format_success(gemini_resp)
    except Exception as e:
        if '429' in str(e) or 'quota' in str(e):
            time.sleep((2 ** attempt) * 0.5)
```

---

## 4. Cost & Token Telemetry Verification

Token metrics and USD costs are logged per request:
- **Input Tokens**: $1.3 \times \text{word count}$ ($0.075\text{ USD per 1M}$).
- **Output Tokens**: $1.3 \times \text{word count}$ ($0.300\text{ USD per 1M}$).
- **Average Cost per Turn**: $\approx \$0.000072$ ($\approx \text{₹}0.006$).
