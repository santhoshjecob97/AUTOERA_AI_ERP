import logging
from typing import Dict, Any, List
from django.db import transaction
from .models import KnowledgeDocument, KnowledgeChunk
from .rag import DocumentChunker
from .embeddings import get_embedding_provider

logger = logging.getLogger('autoera.ingestion')


class KnowledgeIngestionPipeline:
    """
    Asynchronous and synchronous ingestion pipeline for dealership documents.
    Pipeline: Raw Text/File -> Extraction -> Chunking -> Vector Embedding -> PostgreSQL Storage.
    """

    def __init__(self):
        self.chunker = DocumentChunker(chunk_size_words=120, overlap_words=20)
        self.embedding_provider = get_embedding_provider()

    def ingest_document_text(
        self,
        document: KnowledgeDocument,
        raw_text: str,
        default_section: str = 'General'
    ) -> Dict[str, Any]:
        """
        Processes text into chunks, generates vector embeddings, and stores them in the DB.
        """
        if not raw_text or not raw_text.strip():
            document.status = 'FAILED'
            document.save(update_fields=['status'])
            return {'status': 'FAILED', 'error': 'Empty document content'}

        try:
            document.status = 'PROCESSED'
            document.save(update_fields=['status'])

            # 1. Chunking
            chunks_data = self.chunker.chunk_text(raw_text, default_section=default_section)
            if not chunks_data:
                document.status = 'FAILED'
                document.save(update_fields=['status'])
                return {'status': 'FAILED', 'error': 'No chunks generated'}

            # 2. Embedding generation
            texts_to_embed = [c['text'] for c in chunks_data]
            embeddings = self.embedding_provider.embed_batch(texts_to_embed)

            # 3. Atomic Database Storage
            with transaction.atomic():
                # Remove existing chunks for this document (idempotency)
                KnowledgeChunk.objects.filter(document=document).delete()

                chunk_objects = []
                for c_data, emb in zip(chunks_data, embeddings):
                    chunk_objects.append(
                        KnowledgeChunk(
                            organization_id=document.organization_id,
                            branch_id=document.branch_id,
                            document=document,
                            chunk_index=c_data['chunk_index'],
                            content_text=c_data['text'],
                            token_count=c_data['token_count'],
                            embedding=emb,
                            embedding_model=getattr(self.embedding_provider, 'model_name', 'deterministic-768'),
                            metadata_json=c_data['metadata']
                        )
                    )
                KnowledgeChunk.objects.bulk_create(chunk_objects)

                document.status = 'READY'
                document.total_chunks = len(chunk_objects)
                document.save(update_fields=['status', 'total_chunks'])

            logger.info(f"Successfully ingested Document #{document.id} with {len(chunk_objects)} embedded chunks.")
            return {
                'status': 'SUCCESS',
                'document_id': str(document.id),
                'total_chunks': len(chunk_objects),
                'dimension': len(embeddings[0]) if embeddings else 0
            }

        except Exception as e:
            logger.error(f"Ingestion failed for Document #{document.id}: {e}")
            document.status = 'FAILED'
            document.save(update_fields=['status'])
            return {'status': 'FAILED', 'error': str(e)}

    def reembed_all_documents(self, organization_id: Any = None, new_provider: Any = None) -> Dict[str, Any]:
        """
        Zero-Downtime Knowledge Re-embedding Migration:
        Regenerates vector embeddings for all existing knowledge documents
        using modern embedding provider (e.g. gemini-embedding-2) while preserving documents.
        """
        provider = new_provider or self.embedding_provider
        qs = KnowledgeDocument.objects.filter(status='READY')
        if organization_id:
            qs = qs.filter(organization_id=organization_id)

        reembedded_docs = 0
        total_chunks_reembedded = 0

        for doc in qs:
            chunks = list(KnowledgeChunk.objects.filter(document=doc).order_by('chunk_index'))
            if not chunks:
                continue

            texts = [c.content_text for c in chunks]
            new_embeddings = provider.embed_batch(texts)

            with transaction.atomic():
                for chunk, new_emb in zip(chunks, new_embeddings):
                    chunk.embedding = new_emb
                    chunk.embedding_model = getattr(provider, 'model_name', 'gemini-embedding-2')
                    chunk.save(update_fields=['embedding', 'embedding_model', 'updated_at'])

            reembedded_docs += 1
            total_chunks_reembedded += len(chunks)

        logger.info(f"Zero-Downtime Knowledge Re-embedding complete: {reembedded_docs} docs, {total_chunks_reembedded} chunks.")
        return {
            'status': 'SUCCESS',
            'documents_reembedded': reembedded_docs,
            'chunks_reembedded': total_chunks_reembedded,
            'model': getattr(provider, 'model_name', 'gemini-embedding-2')
        }


pipeline = KnowledgeIngestionPipeline()

