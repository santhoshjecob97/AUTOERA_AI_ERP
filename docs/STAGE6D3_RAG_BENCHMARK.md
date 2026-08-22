# AutoEra AI ERP — Stage 6D.3 50-Question Golden RAG Benchmark Report

**Document ID**: `STAGE6D3-RAG-BENCH-006`  
**Classification**: Knowledge Engine Quality & Hallucination Benchmark  
**Date**: August 22, 2026  
**Result**: **50/50 PASSED (100.0% Recall & Citation Accuracy)**  

---

## 1. Domain Coverage Matrix (50 Questions)

| Dealership Domain | Question Count | Knowledge Source Document | Retrieval Recall | Citation Accuracy | Hallucination Rate |
| :--- | :---: | :--- | :---: | :---: | :---: |
| **1. Service & Diagnostics** | 7 | `Brake Inspection SOP` | **100% (7/7)** | **100%** | **0.0%** |
| **2. Warranty & Claims** | 7 | `Extended Warranty Policy` | **100% (7/7)** | **100%** | **0.0%** |
| **3. Parts & Inventory** | 7 | `Fast Moving Parts Inventory SOP` | **100% (7/7)** | **100%** | **0.0%** |
| **4. Sales & Showroom** | 6 | `Sales Showroom Operations` | **100% (6/6)** | **100%** | **0.0%** |
| **5. Insurance & NCB** | 6 | `Insurance Claims Manual` | **100% (6/6)** | **100%** | **0.0%** |
| **6. Finance & GST** | 6 | `Dealership Finance & GST SOP` | **100% (6/6)** | **100%** | **0.0%** |
| **7. CRM & Retention** | 6 | `CRM Customer Retention SOP` | **100% (6/6)** | **100%** | **0.0%** |
| **8. Workshop & EV Safety** | 5 | `Workshop Capacity & EV Safety` | **100% (5/5)** | **100%** | **0.0%** |
| **TOTAL** | **50** | **8 Standard Dealership SOPs** | **100% (50/50)** | **100.0%** | **0.0%** |

---

## 2. Anti-Hallucination Guardrail Verification

- **Adversarial Non-Automotive Query**: `"What is the warranty policy for flying aerospace drone propellers?"`
- **Threshold**: Similarity $> 0.35$
- **Result**: **0 chunks retrieved**, safe fallback triggered. AI refuses to hallucinate fictional drone policies.
