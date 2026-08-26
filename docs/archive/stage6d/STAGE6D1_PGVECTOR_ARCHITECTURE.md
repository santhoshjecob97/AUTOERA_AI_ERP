# AutoEra AI ERP — Stage 6D.1 pgvector Vector Architecture

**Document ID**: `STAGE6D1-PGVECTOR-002`  
**Classification**: AI/ML Infrastructure Specification  
**Embedding Dimensions**: 768 (`models/text-embedding-004`)  
**Distance Metric**: Cosine Distance ($<=>$)  

---

## 1. Vector Search Architecture Overview

AutoEra AI ERP implements a hybrid retrieval engine combining **dense semantic vector search** with **sparse exact-match domain filtering**. In production PostgreSQL, vectors are indexed directly inside the database kernel via `pgvector`.

```
┌──────────────────────────────────────────────────────────┐
│                   Customer / Voice Query                 │
│         "Brake grinding noise when stopping"            │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│              Google text-embedding-004                   │
│             768-dimensional float vector                 │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│       PostgreSQL 16 pgvector Hybrid Query Engine         │
│                                                          │
│  SELECT id, content_text, 1 - (embedding <=> $1) AS sim  │
│  FROM ai_platform_knowledgechunk                         │
│  WHERE organization_id = :tenant_id                      │
│    AND 1 - (embedding <=> $1) > 0.15                     │
│  ORDER BY embedding <=> $1                               │
│  LIMIT 5;                                                │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│             Ranked Knowledge Snippets + Citations         │
│     [Brake System Inspection SOP v1 (Section: 2.1)]       │
└──────────────────────────────────────────────────────────┘
```

---

## 2. Table Schema & Index Definitions

### Schema Specification (`ai_platform_knowledgechunk`)

```sql
CREATE TABLE ai_platform_knowledgechunk (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organization_organization(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES organization_branch(id) ON DELETE SET NULL,
    document_id UUID NOT NULL REFERENCES ai_platform_knowledgedocument(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    content_text TEXT NOT NULL,
    metadata_json JSONB DEFAULT '{}'::jsonb,
    token_count INT DEFAULT 0,
    embedding vector(768) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Production Vector Indexing

For datasets under 1,000,000 chunks per tenant:
- **Index Type**: `HNSW` (Hierarchical Navigable Small World) for maximum query recall and low latency ($P_{99} < 4\text{ms}$).
- **Alternative**: `IVFFlat` with `lists = 100` for low-memory environments.

```sql
-- Production HNSW Vector Index
CREATE INDEX idx_knowledgechunk_hnsw_cosine
ON ai_platform_knowledgechunk
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);
```

---

## 3. Strict Tenant Isolation in Vector Queries

Under NO circumstances are cross-tenant vector comparisons allowed. The PostgreSQL query planner uses the composite tenant index filter before scanning vector index partitions:

```sql
EXPLAIN ANALYZE
SELECT id, document_id, content_text, 1 - (embedding <=> '[0.012, -0.045, ...]') AS similarity
FROM ai_platform_knowledgechunk
WHERE organization_id = '623ec6aa-ed7a-471a-ba29-e746de356da3'
ORDER BY embedding <=> '[0.012, -0.045, ...]'
LIMIT 5;
```

---

## 4. Fallback Architecture (Offline / Local Dev)

In development environments running SQLite:
1. `embedding` is persisted as a native `JSONField` (array of 768 floats).
2. Cosine similarity is computed in Python via `ai_platform.rag.cosine_similarity()`.
3. Strict tenant filtering `qs.filter(organization_id=org_id)` is applied at the ORM layer before computation.
4. Behavior, scores, and ranking are 100% deterministic and identical to PostgreSQL.
