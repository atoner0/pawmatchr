import numpy as np
from numpy.linalg import norm

SEMANTIC_MIN = 0.2
SEMANTIC_MAX = 0.8

def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    return float(np.dot(a, b) / (norm(a) * norm(b)))

def cosine_similarity_batch(dog_embeddings: np.ndarray, adopter_embedding: np.ndarray) -> np.ndarray:
    """
    Vectorised cosine similarity between one adopter embedding and many dog embeddings at once
    """
    dot_products = dog_embeddings @ adopter_embedding
    dog_norms = norm(dog_embeddings, axis=1) #axis 1 will compute the norm along each row separately, giving one norm per dog
    adopter_norm = norm(adopter_embedding)

    return dot_products / (dog_norms * adopter_norm)

def calculate_semantic_score_batch(
        dog_embeddings: np.ndarray, adopter_embedding: np.ndarray
) -> np.ndarray:
    """
    Batch version of calculate_semantic_score, scoring one adopter embedding against many dog embeddings in a single call.

    Raw cosine similarity is linearly scaled from the SEMANTIC_MIN/MAX band to a wider 0-1 range, then clamped in case a raw value falls outside that band

    Dogs are scored positionally: dog_embeddings[i] corresponds to
    scores[i]. Callers must not reorder dogs between calling this
    function and consuming its output
    """
    raw = cosine_similarity_batch(dog_embeddings, adopter_embedding)
    scaled = (raw - SEMANTIC_MIN) / (SEMANTIC_MAX - SEMANTIC_MIN)

    return np.clip(scaled, 0.0, 1.0)