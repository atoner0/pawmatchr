from semantic.embeddings import get_embedding
from semantic.comparison import cosine_similarity
import numpy as np
import pytest

class TestGetEmbeddings:
    def test_returns_numpy_array(self):
        embedding = get_embedding("Buddy is a friendly senior dog")
        assert isinstance(embedding, np.ndarray)

    def test_similar_sentences_score_higher_than_unrelated(self):
        dog_description = get_embedding("Relaxed senior dog, great with children and other dogs")
        similar_notes = get_embedding("Looking for an older, calm dog that's good with kids")
        unrelated_notes = get_embedding("I enjoy rock climbing and want an active young puppy")

        similar_score = cosine_similarity(dog_description, similar_notes)
        unrelated_score = cosine_similarity(dog_description, unrelated_notes)

        assert similar_score > unrelated_score