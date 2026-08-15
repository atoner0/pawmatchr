from sentence_transformers import SentenceTransformer
import numpy as np

_model = SentenceTransformer('all-MiniLM-L6-v2')

def get_embedding(text: str) -> np.ndarray :
    """
    Embeds a single piece of text
    """
    return _model.encode(text)

def get_embeddings_batch(texts: list[str]) -> np.ndarray:
    """
    Embeds a list of texts in a single forward pass through the model, rather than calling get_embedding() once per text

    Returns a 2D array of shape (len(texts), embedding_dim), where embeddings[i] corresponds to texts[i]. Callers must not reorder texts after calling this function
    """
    return _model.encode(texts)