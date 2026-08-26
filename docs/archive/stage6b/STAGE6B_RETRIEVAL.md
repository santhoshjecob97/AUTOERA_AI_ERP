# AutoEra AI ERP — Stage 6B Hybrid Retrieval & Semantic Search

## 1. Multi-Modal Retrieval Strategy

Automotive dealership knowledge queries encompass both semantic descriptions (*"vehicle pulling to the left during acceleration"*) and exact alphanumeric tokens (*"DOT-4"*, *"5W-30 API SP"*, *"P0300"*, *"VINHYUNDAI001"*).

### Hybrid Formula
$$\text{Score} = (0.50 \times \max(0, \cos(\vec{q}, \vec{d}))) + \left(0.50 \times \frac{|\text{Matched Terms}|}{|\text{Query Terms}|}\right)$$

---

## 2. Database Scoping & Filtering

All vector lookups execute with hard query-level tenant constraints:
```sql
SELECT chunk.*, doc.*
FROM ai_platform_knowledgechunk chunk
JOIN ai_platform_knowledgedocument doc ON chunk.document_id = doc.id
WHERE chunk.organization_id = :authenticated_org_id
  AND doc.status = 'READY'
```

### Filtering Capabilities:
- **`branch_id`**: Optional branch-level scoping.
- **`document_type`**: Restrict search to `SOP`, `SERVICE_MANUAL`, `POLICY`, etc.
- **`min_similarity_threshold`**: Minimum composite score (default `0.20`) to discard low-confidence noise.
