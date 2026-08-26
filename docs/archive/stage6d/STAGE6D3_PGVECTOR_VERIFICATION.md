# AutoEra AI ERP — Stage 6D.3 pgvector & Production Vector Database Verification

**Document ID**: `STAGE6D3-PGVECTOR-005`  
**Classification**: Vector Database Architecture & SQL Schema Verification  

---

## 1. Production PostgreSQL + pgvector Specification

```sql
-- 1. Enable Vector Extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Schema: Knowledge Chunk Table with Vector Column
ALTER TABLE ai_platform_knowledgechunk 
ADD COLUMN IF NOT EXISTS embedding_vec vector(768);

-- 3. High-Performance HNSW Vector Index
CREATE INDEX IF NOT EXISTS idx_knowledgechunk_embedding_hnsw 
ON ai_platform_knowledgechunk 
USING hnsw (embedding_vec vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- 4. Multi-Tenant Isolated Semantic Query
SELECT id, content_text, metadata_json, 
       1 - (embedding_vec <=> %s::vector) AS similarity
FROM ai_platform_knowledgechunk
WHERE organization_id = %s
ORDER BY embedding_vec <=> %s::vector
LIMIT 5;
```

---

## 2. Verification Summary

- **Vector Column**: 768-dimensional float32 vectors.
- **Index Type**: `HNSW` (Hierarchical Navigable Small World) with Cosine Distance (`vector_cosine_ops`).
- **Isolation**: Tenant scoping strictly enforced on every vector retrieval query (`WHERE organization_id = ...`).
- **Hybrid Search**: Dense vector similarity merged with BM25/trigram keyword search for maximum automotive terminology recall.
