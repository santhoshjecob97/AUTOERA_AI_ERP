# AutoEra AI ERP — Stage 6D.2 Real Embeddings & RAG Retrieval Report

**Document ID**: `STAGE6D2-EMBEDDINGS-003`  
**Classification**: Vector Retrieval & Knowledge Ingestion Audit  
**Active Provider**: `GoogleEmbeddingProvider` with `DeterministicLocalEmbeddingProvider` failover  
**Vector Dimension**: 768  

---

## 1. Embedding Model Properties

- **Model Identifier**: `models/text-embedding-004`
- **Output Vector Length**: 768 float values
- **Normalization**: $L_2$ normalized ($\sqrt{\sum x_i^2} = 1.0$)
- **Task Type**: `retrieval_document` (for chunks), `retrieval_query` (for queries)

---

## 2. Ingestion & Retrieval Pipeline Evidence

### Document Ingestion Run

1. **Document Created**: `Brake Diagnostic SOP` (Title: "Brake System Diagnostic Standard Operating Procedure", Version 1).
2. **Chunking**: `DocumentChunker` splits document into semantic blocks with section tags.
3. **Embedding Computation**: 768-dimensional normalized embedding generated and stored in `KnowledgeChunk.embedding`.
4. **Database Record**: Verified in database with status `READY`.

### Semantic Retrieval Verification

- **Test Query**: `"My car is making a strange grinding noise when I brake"`
- **Retrieved Chunk**: `Brake Diagnostic SOP v1 (Section: 1.1)`
- **Similarity Score**: $> 0.15$ threshold (Hybrid Semantic + Keyword boost)
- **Grounding Citation**: Included in Agent response as factual source evidence.
- **Cross-Tenant Guardrail**: Organization B queries return **0 chunks** from Organization A.
