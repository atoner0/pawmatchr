from semantic.comparison import calculate_semantic_score, SEMANTIC_MAX, SEMANTIC_MIN
import pytest
import numpy as np
from unittest.mock import patch

class TestSemanticScore:
    def test_similarity_below_min_clamps_to_zero(self):
        with patch('semantic.comparison.cosine_similarity', return_value = -1.0):
            assert calculate_semantic_score(np.array([0]), np.array([0])) == pytest.approx(0.0)
    
    def test_similarity_above_max_clamps_to_one(self):
        with patch('semantic.comparison.cosine_similarity', return_value = 1.0):
            assert calculate_semantic_score(np.array([0]), np.array([0])) == pytest.approx(1.0)

    def test_exact_min_scales_to_zero(self):
        with patch('semantic.comparison.cosine_similarity', return_value = SEMANTIC_MIN):
            assert calculate_semantic_score(np.array([0]), np.array([0])) == pytest.approx(0.0)

    def test_exact_max_scales_to_one(self):
        with patch('semantic.comparison.cosine_similarity', return_value=SEMANTIC_MAX):
            assert calculate_semantic_score(np.array([0]), np.array([0])) == pytest.approx(1.0)

    def test_midpoint_scales_to_half(self):
        midpoint = (SEMANTIC_MIN + SEMANTIC_MAX) / 2
        with patch('semantic.comparison.cosine_similarity', return_value=midpoint):
            assert calculate_semantic_score(np.array([0]), np.array([0])) == pytest.approx(0.5)