# AutoEra AI ERP — Stage 6B Vector Database Architecture

## 1. Vector Database Specification

- **Primary Engine**: **PostgreSQL with `pgvector` extension** (and native JSON array embedding field for universal portability)
- **Vector Dimension**: **768** (Matches Google `text-embedding-004`)
- **Distance Metric**: **Cosine Distance (`<=>`) / Cosine Similarity (`1 - cosine_distance`)**
- **Index Type**: **HNSW (Hierarchical Navigable Small World) / IVFFlat**
- **Tenant Isolation Policy**: **Mandatory query-level scoping `WHERE organization_id = :org_id` before similarity filtering**

---

## 2. Hybrid Retrieval Strategy

Dealership domain queries frequently contain specific keywords (VINs, Part Numbers, OBD-II DTC codes like `P0300`, SOP codes). Semantic search alone can overlook exact token matches.

### Combined Ranking Formula:
$$\text{Score} = (0.7 \times \text{Cosine Similarity}) + (0.3 \times \text{Keyword BM25 / Q Match})$$

Chunks with a composite score below the threshold ($< 0.30$) are filtered out to prevent low-confidence noise from polluting the LLM context.
