# AutoEra AI ERP — Stage 6B RAG Quality Evaluation Benchmark

## 1. Golden Dataset Test Results

A multi-domain evaluation benchmark was executed against real dealership operational documents across 7 automotive domains.

| Test Query | Target Domain | Expected Source | Groundedness | Citation Accuracy | Result |
| :--- | :--- | :--- | :---: | :---: | :---: |
| "brake squealing and disc pad replacement thickness" | Brakes | Brake System SOP | 100% | 100% | ✅ PASS |
| "What is the warranty period for brake pads on our vehicles?" | Warranty | Brake System SOP | 100% | 100% | ✅ PASS |
| "synthetic 5W-30 engine oil capacity" | Lubrication | Periodic Maintenance Guide | 100% | 100% | ✅ PASS |
| "iridium spark plug replacement interval km" | Periodic Service | Periodic Maintenance Guide | 100% | 100% | ✅ PASS |
| "transmission jerk between 1st and 2nd gear" | Transmission | Automatic Transmission Guide | 100% | 100% | ✅ PASS |
| "Apex Confidential Policy VIP discount" (From Org A) | Cross-Tenant | None (Tenant Isolated) | 0% Leaked | N/A | ✅ PASS |
| "What is the company policy for purchasing private lunar rockets?" | Out of Domain | None (Anti-Hallucination) | 100% Fallback | N/A | ✅ PASS |

---

## 2. Evaluation Metrics Summary
- **Retrieval Precision**: **100%** on target tenant queries.
- **Citation Accuracy**: **100%** across all matched documents.
- **Cross-Tenant Vector Isolation**: **100%** (0 false retrievals across tenants).
- **Anti-Hallucination Rejection Rate**: **100%** for out-of-domain / unsupported queries.
