import numpy as np
from numpy.linalg import norm

#placeholder values before tuning stage
SEMANTIC_MIN = 0.1
SEMANTIC_MAX = 0.6

def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    return float(np.dot(a, b) / (norm(a) * norm(b)))

def semantic_score(dog_embedding: np.ndarray, adopter_embedding: np.ndarray) -> float:
    raw = cosine_similarity(dog_embedding, adopter_embedding)
    scaled = (raw - SEMANTIC_MIN) / (SEMANTIC_MAX - SEMANTIC_MIN)
    return max(0.0, min(1.0, scaled))