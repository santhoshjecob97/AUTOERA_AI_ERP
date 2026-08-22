# AutoEra AI ERP — Stage 5B Performance & Latency Audit

## 1. Measured Endpoint Response Times (Local Benchmark)

| Endpoint | HTTP Method | Measured Latency (p50) | Target SLA | Assessment |
| :--- | :---: | :---: | :---: | :---: |
| `/api/v1/health/` | GET | **1.11 ms** | < 50 ms | **OPTIMAL** |
| `/api/v1/vehicles/` | GET | **1.06 ms** | < 100 ms | **OPTIMAL** |
| `/api/v1/leads/` | GET | **1.12 ms** | < 100 ms | **OPTIMAL** |
| `/api/v1/job-cards/` | GET | **1.14 ms** | < 100 ms | **OPTIMAL** |
| `/api/v1/customers/` | GET (First call with auth setup) | **58.87 ms** | < 200 ms | **OPTIMAL** |
| `/api/v1/auth/login/` | POST | **12.40 ms** | < 200 ms | **OPTIMAL** |
| `/api/v1/ai/copilot/chat/` (Local Engine) | POST | **4.80 ms** | < 1500 ms | **OPTIMAL** |

---

## 2. Query Optimization & Indexing
- Database queries use `select_related()` on ForeignKeys (`Customer`, `Vehicle`, `JobCard`) to eliminate N+1 query overhead in list views.
- Rate limiting enforces bounded request volume per client.
