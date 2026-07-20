from semantic.comparison import (
    calculate_semantic_score, 
    SEMANTIC_MAX, 
    SEMANTIC_MIN,
    calculate_semantic_score_batch
)
import pytest
import numpy as np
from unittest.mock import patch

class TestSemanticScore:
    def test_similarity_below_min_clamps_to_zero(self):
        with patch('semantic.comparison.cosine_similarity_batch', return_value = np.array([-1.0])):
            assert calculate_semantic_score(np.array([0.0]), np.array([0.0])) == pytest.approx(0.0)
    
    def test_similarity_above_max_clamps_to_one(self):
        with patch('semantic.comparison.cosine_similarity_batch', return_value = np.array([1.0])):
            assert calculate_semantic_score(np.array([0.0]), np.array([0.0])) == pytest.approx(1.0)

    def test_exact_min_scales_to_zero(self):
        with patch('semantic.comparison.cosine_similarity_batch', return_value = np.array([SEMANTIC_MIN])):
            assert calculate_semantic_score(np.array([0.0]), np.array([0.0])) == pytest.approx(0.0)

    def test_exact_max_scales_to_one(self):
        with patch('semantic.comparison.cosine_similarity_batch', return_value=np.array([SEMANTIC_MAX])):
            assert calculate_semantic_score(np.array([0.0]), np.array([0.0])) == pytest.approx(1.0)

    def test_midpoint_scales_to_half(self):
        midpoint = (SEMANTIC_MIN + SEMANTIC_MAX) / 2
        with patch('semantic.comparison.cosine_similarity_batch', return_value=np.array([midpoint])):
            assert calculate_semantic_score(np.array([0.0]), np.array([0.0])) == pytest.approx(0.5)

class TestCalculateSemanticScoreBatch:
    def test_preserves_dog_order(self):
        adopter_embedding = np.array([1.0, 0.0, 0.0])
        dog_embeddings = np.array([
            [1.0, 0.0, 0.0],   # identical - raw cosine sim = 1.0
            [0.0, 1.0, 0.0],   # orthogonal - raw cosine sim = 0.0
            [1.0, 0.0, 0.0],   # identical again - raw cosine sim = 1.0
        ])

        scores = calculate_semantic_score_batch(dog_embeddings, adopter_embedding)

        # raw=1.0 scaled: (1.0 - 0.1) / (0.6 - 0.1) = 1.8, clamped to 1.0
        # raw=0.0 scaled: (0.0 - 0.1) / (0.6 - 0.1) = -0.2, clamped to 0.0
        assert round(scores[0], 3) == 1.0
        assert round(scores[1], 3) == 0.0
        assert round(scores[2], 3) == 1.0

    def test_empty_dog_embeddings(self):
        adopter_embedding = np.array([1.0, 0.0, 0.0])
        dog_embeddings = np.empty((0, 3))

        scores = calculate_semantic_score_batch(dog_embeddings, adopter_embedding)

        assert len(scores) == 0