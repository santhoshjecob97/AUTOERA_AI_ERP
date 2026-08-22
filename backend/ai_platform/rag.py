import uuid
import math
import re
import logging
from typing import List, Dict, Any, Optional
from .models import KnowledgeDocument, KnowledgeChunk
from .embeddings import get_embedding_provider, EmbeddingProvider

logger = logging.getLogger('autoera.rag')


def cosine_similarity(v1: List[float], v2: List[float]) -> float:
    """Calculates cosine similarity between two float vectors."""
    if not v1 or not v2 or len(v1) != len(v2):
        return 0.0
    dot_product = sum(a * b for a, b in zip(v1, v2))
    norm_a = math.sqrt(sum(a * a for a in v1))
    norm_b = math.sqrt(sum(b * b for b in v2))
    if norm_a == 0.0 or norm_b == 0.0:
        return 0.0
    return dot_product / (norm_a * norm_b)


class DocumentChunker:
    """
    Splits text documents into semantic chunks with configurable token windows and overlap.
    Merges section headings with their corresponding content bodies.
    """
    def __init__(self, chunk_size_words: int = 150, overlap_words: int = 25):
        self.chunk_size_words = chunk_size_words
        self.overlap_words = overlap_words

    def chunk_text(self, text: str, default_section: str = 'General') -> List[Dict[str, Any]]:
        cleaned = text.strip()
        if not cleaned:
            return []

        raw_blocks = [b.strip() for b in re.split(r'\n\s*\n', cleaned) if b.strip()]
        merged_sections = []
        pending_heading = None

        for block in raw_blocks:
            lines = block.split('\n')
            # If block is just a single short title line without period, treat as heading
            if len(lines) == 1 and len(block) < 80 and not block.endswith('.'):
                pending_heading = block.strip('# ')
            else:
                heading = pending_heading or default_section
                merged_sections.append((heading, block))
                pending_heading = None

        if pending_heading:
            merged_sections.append((pending_heading, pending_heading))

        chunks = []
        current_index = 1

        for heading, body in merged_sections:
            words = body.split()
            if not words:
                continue

            full_text = f"[{heading}]\n{body}" if heading != default_section and not body.startswith(f"[{heading}]") else body

            if len(words) <= self.chunk_size_words:
                chunks.append({
                    'chunk_index': current_index,
                    'text': full_text.strip(),
                    'token_count': len(words),
                    'metadata': {'section': heading}
                })
                current_index += 1
            else:
                i = 0
                while i < len(words):
                    chunk_words = words[i:i + self.chunk_size_words]
                    chunk_body = " ".join(chunk_words)
                    chunk_text = f"[{heading}]\n{chunk_body}" if heading != default_section else chunk_body
                    chunks.append({
                        'chunk_index': current_index,
                        'text': chunk_text.strip(),
                        'token_count': len(chunk_words),
                        'metadata': {'section': heading}
                    })
                    current_index += 1
                    i += (self.chunk_size_words - self.overlap_words)

        return chunks


class HybridRetriever:
    """
    Hybrid semantic vector search + keyword relevance retriever.
    Strictly scoped to the requesting organization at the database query layer.
    """
    STOP_WORDS = {
        'the', 'is', 'for', 'our', 'and', 'are', 'was', 'were', 'has', 'had', 'been',
        'with', 'from', 'what', 'when', 'where', 'which', 'who', 'whom', 'this', 'that',
        'your', 'have', 'does', 'will', 'about', 'can', 'you', 'how', 'the', 'a', 'an',
        'in', 'on', 'at', 'to', 'of', 'by', 'as', 'into', 'all', 'any', 'some'
    }

    def __init__(self, embedding_provider: Optional[EmbeddingProvider] = None):
        self.embedding_provider = embedding_provider or get_embedding_provider()

    def retrieve(
        self,
        query: str,
        organization_id: Any,
        branch_id: Optional[Any] = None,
        document_type: Optional[str] = None,
        top_k: int = 5,
        min_similarity_threshold: float = 0.15
    ) -> List[Dict[str, Any]]:
        if not query or not organization_id:
            return []

        if isinstance(organization_id, str):
            try:
                org_filter = uuid.UUID(organization_id)
            except Exception:
                org_filter = organization_id
        else:
            org_filter = organization_id

        # 1. Embed query
        query_vector = self.embedding_provider.embed_text(query)
        raw_terms = [w.lower() for w in re.findall(r'\w+', query)]
        query_terms = [w for w in raw_terms if len(w) > 1 and w not in self.STOP_WORDS]

        # 2. Database query with strict tenant filter
        qs = KnowledgeChunk.objects.filter(
            organization_id=org_filter,
            document__status='READY'
        ).select_related('document')

        if branch_id:
            if isinstance(branch_id, str):
                try:
                    branch_filter = uuid.UUID(branch_id)
                except Exception:
                    branch_filter = branch_id
            else:
                branch_filter = branch_id
            qs = qs.filter(branch_id=branch_filter)

        if document_type:
            qs = qs.filter(document__document_type=document_type)

        results = []
        for chunk in qs:
            if not chunk.embedding:
                continue

            # Semantic similarity (positive correlation only)
            raw_cosine = cosine_similarity(query_vector, chunk.embedding)
            semantic_score = max(0.0, raw_cosine)

            # Keyword matching boost (exact matching on codes, VINs, part numbers, domain terms)
            content_lower = chunk.content_text.lower()
            keyword_matches = sum(1 for term in query_terms if term in content_lower)
            # Saturate keyword score when 3+ key terms match to prevent dilution on long queries
            norm_factor = min(max(len(query_terms), 1), 4)
            keyword_score = min(1.0, keyword_matches / norm_factor) if query_terms else 0.0

            # Composite hybrid score: 50% semantic + 50% keyword
            hybrid_score = (0.50 * semantic_score) + (0.50 * keyword_score)

            if hybrid_score >= min_similarity_threshold:
                results.append({
                    'chunk_id': str(chunk.id),
                    'document_id': str(chunk.document.id),
                    'document_title': chunk.document.title,
                    'document_type': chunk.document.document_type,
                    'version': chunk.document.version,
                    'chunk_index': chunk.chunk_index,
                    'text': chunk.content_text,
                    'metadata': chunk.metadata_json,
                    'semantic_score': round(semantic_score, 4),
                    'keyword_score': round(keyword_score, 4),
                    'score': round(hybrid_score, 4)
                })

        # Rank by descending score and slice top_k
        results.sort(key=lambda x: x['score'], reverse=True)
        return results[:top_k]


class RAGContextBuilder:
    """
    Assembles retrieved knowledge chunks into formatted, source-traceable context blocks.
    """
    @staticmethod
    def build_context(retrieved_chunks: List[Dict[str, Any]]) -> Dict[str, Any]:
        if not retrieved_chunks:
            return {
                'context_text': "No relevant documents found in the dealership knowledge base.",
                'citations': [],
                'has_knowledge': False
            }

        formatted_lines = []
        citations = []

        for item in retrieved_chunks:
            citation_label = f"[{item['document_title']} v{item['version']} (Section: {item['metadata'].get('section', 'General')})]"
            citations.append({
                'document_title': item['document_title'],
                'document_type': item['document_type'],
                'version': item['version'],
                'chunk_index': item['chunk_index'],
                'section': item['metadata'].get('section', 'General'),
                'relevance_score': item['score']
            })
            formatted_lines.append(f"SOURCE {citation_label}:\n{item['text']}\n")

        context_text = "\n---\n".join(formatted_lines)
        return {
            'context_text': context_text,
            'citations': citations,
            'has_knowledge': True
        }


class RAGPromptEngine:
    """
    Constructs anti-hallucination system and user prompts grounded in retrieved RAG context.
    """
    @staticmethod
    def build_rag_system_prompt(organization_name: str, context_block: Dict[str, Any]) -> str:
        instructions = (
            f"You are the AutoEra Knowledge Engine Assistant for {organization_name}.\n"
            "MANDATORY ANTI-HALLUCINATION & CITATION RULES:\n"
            "1. Answer the user's question STRICTLY using the factual evidence provided in the DEALERSHIP KNOWLEDGE BASE below.\n"
            "2. If the provided knowledge base does NOT contain sufficient information to answer the question with certainty, "
            "you MUST state exactly: 'I couldn't find sufficient information in the dealership knowledge base to answer this reliably.'\n"
            "3. DO NOT speculate, guess, or invent dealership warranty, refund, or repair policies.\n"
            "4. Always cite the document title and section when providing procedural guidance.\n\n"
            f"=== DEALERSHIP KNOWLEDGE BASE ===\n{context_block['context_text']}\n=== END KNOWLEDGE BASE ==="
        )
        return instructions
