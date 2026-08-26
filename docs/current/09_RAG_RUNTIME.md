# 09 — RAG Knowledge Engine & Vector Retrieval

**Domain Scope**: Dealership SOPs, OEM Service Manuals, Warranty Policies, Parts Catalogues.

---

## 1. RAG Ingestion Pipeline

```
[ Document Upload: PDF/Markdown/Text ]
                 │
                 ▼
[ Ingestion Service (`ai_platform.ingestion`) ]
                 │
                 ├── 1. Chunking: 512-token chunks with 64-token overlap
                 ├── 2. Embedding: Dense vector calculation via `models/gemini-embedding-2`
                 ├── 3. Tenant Partitioning: Injected with `organization_id` & `branch_id`
                 └── 4. Storage: Persisted in `ai_platform.models.KnowledgeChunk`
```

---

## 2. Hybrid Retrieval & Grounding Truth

1. **Retrieval**: Executes vector cosine similarity + keyword BM25 ranking scoped strictly to the requesting tenant's `organization_id`.
2. **Tenant Isolation Check**: Cross-tenant queries return 0 knowledge chunks.
3. **Citation Guarantee**: Every LLM answer includes verifiable source document titles, section headers, and confidence scores.
4. **Zero-Hallucination Behavior**: When relevant context is absent, the engine explicitly outputs `Insufficient evidence in knowledge base` rather than fabricating technical instructions.
