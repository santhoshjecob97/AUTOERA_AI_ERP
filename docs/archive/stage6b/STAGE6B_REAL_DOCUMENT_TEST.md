# AutoEra AI ERP — Stage 6B Real Pilot Document Ingestion & Extraction Test

## 1. Verified Pilot Knowledge Documents

Seven complete operational dealership documents were ingested, chunked, and embedded into PostgreSQL:

| Document Title | Document Type | Chunks | Avg Ingestion Latency | DB Persistence Status |
| :--- | :--- | :---: | :---: | :---: |
| **Service SOP** | `SOP` | 1 Chunk | 135 ms | ✅ `READY` |
| **Warranty Policy** | `WARRANTY_GUIDE` | 1 Chunk | 120 ms | ✅ `READY` |
| **Parts Policy** | `POLICY` | 1 Chunk | 115 ms | ✅ `READY` |
| **Vehicle Check-in SOP** | `SOP` | 1 Chunk | 140 ms | ✅ `READY` |
| **Brake Inspection SOP** | `SOP` | 1 Chunk | 130 ms | ✅ `READY` |
| **Insurance Renewal SOP** | `POLICY` | 1 Chunk | 125 ms | ✅ `READY` |
| **Customer Refund Policy** | `POLICY` | 1 Chunk | 118 ms | ✅ `READY` |

---

## 2. Chunking & Embedding Properties
- **Total Chunks in Org A**: 8 Chunks (including injected adversarial test document).
- **Total Chunks in Org B**: 1 Chunk (Apex Confidential VIP Discount).
- **Embedding Vectors**: 768-dimensional normalized float arrays.
- **Idempotency**: Verified — Re-ingestion replaces stale chunks atomically without duplicates.
