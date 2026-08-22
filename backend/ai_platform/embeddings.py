import os
import math
import hashlib
import logging
from abc import ABC, abstractmethod
from typing import List
from django.conf import settings

logger = logging.getLogger('autoera.embeddings')


class EmbeddingProvider(ABC):
    """Abstract base class for vector embedding generation."""

    @abstractmethod
    def embed_text(self, text: str) -> List[float]:
        pass

    @abstractmethod
    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        pass

    @abstractmethod
    def get_dimension(self) -> int:
        pass


class GoogleEmbeddingProvider(EmbeddingProvider):
    """
    Stage 6D.4 Production Embedding Provider:
    Supports modern Google Generative AI embeddings (models/gemini-embedding-2).
    Produces normalized vectors with configurable dimensionality.
    """


    def __init__(self, api_key: str = None, model_name: str = None, dimension: int = None):
        self.api_key = api_key or getattr(settings, 'GEMINI_API_KEY', '') or os.environ.get('GEMINI_API_KEY', '')
        self.model_name = model_name or getattr(settings, 'GEMINI_EMBEDDING_MODEL', 'models/gemini-embedding-2')
        self.dimension = dimension or getattr(settings, 'GEMINI_EMBEDDING_DIMENSION', 768)
        self._initialized = False

        if self.api_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                self._initialized = True
                logger.info(f"Initialized Google GenAI Embedding Provider with model: {self.model_name}")
            except Exception as e:
                logger.error(f"Failed to initialize Google GenAI embedding provider: {e}")

    def embed_text(self, text: str) -> List[float]:
        if not self._initialized or not self.api_key:
            return DeterministicLocalEmbeddingProvider(dimension=self.dimension).embed_text(text)

        try:
            import google.generativeai as genai
            kwargs = {
                'model': self.model_name,
                'content': text,
                'task_type': 'retrieval_document'
            }
            if self.dimension and hasattr(genai, 'output_dimensionality'):
                kwargs['output_dimensionality'] = self.dimension

            result = genai.embed_content(**kwargs)
            emb = result['embedding']
            
            # Normalize vector
            norm = math.sqrt(sum(x * x for x in emb))
            if norm > 0:
                emb = [x / norm for x in emb]
            return emb
        except Exception as e:
            logger.warning(f"Google embedding call failed for {self.model_name}: {e}. Falling back.")
            return DeterministicLocalEmbeddingProvider(dimension=self.dimension).embed_text(text)

    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        return [self.embed_text(t) for t in texts]

    def get_dimension(self) -> int:
        return self.dimension


class DeterministicLocalEmbeddingProvider(EmbeddingProvider):
    """
    Deterministic, zero-cost, normalized embedding provider
    for testing, offline CI/CD pipelines, and failover redundancy.
    """

    def __init__(self, dimension: int = None):
        self.dimension = dimension or getattr(settings, 'GEMINI_EMBEDDING_DIMENSION', 768)

    def embed_text(self, text: str) -> List[float]:
        cleaned = text.strip().lower()
        if not cleaned:
            return [0.0] * self.dimension

        # Generate deterministic vector based on SHA-256 hash seeds and character n-grams
        vector = []
        for i in range(self.dimension):
            seed = f"{cleaned}:{i}"
            hash_val = int(hashlib.sha256(seed.encode('utf-8')).hexdigest()[:8], 16)
            # Map to [-1.0, 1.0]
            val = (hash_val / 0xFFFFFFFF) * 2.0 - 1.0
            vector.append(val)

        # L2-normalize the vector
        norm = math.sqrt(sum(x * x for x in vector))
        if norm > 0:
            vector = [x / norm for x in vector]
        return vector

    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        return [self.embed_text(t) for t in texts]

    def get_dimension(self) -> int:
        return self.dimension


def get_embedding_provider() -> EmbeddingProvider:
    """Factory to retrieve the active EmbeddingProvider."""
    api_key = getattr(settings, 'GEMINI_API_KEY', '') or os.environ.get('GEMINI_API_KEY', '')
    if api_key:
        return GoogleEmbeddingProvider(api_key=api_key)
    return DeterministicLocalEmbeddingProvider()

