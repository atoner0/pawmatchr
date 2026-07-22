from scorer import score_dog, FUZZY_SPLIT, SEMANTIC_SPLIT, score_dogs_batch
from unittest.mock import patch
from tests.helpers import make_adopter, make_dog
import numpy as np
import pytest

DOG_EMBEDDING = np.array([0.1, 0.2, 0.3, 0.4])
ADOPTER_EMBEDDING = np.array([0.5, 0.6, 0.7, 0.8])

class TestScoreDog:
    @patch("scorer.calculate_semantic_score_batch")
    @patch("scorer.aggregate_fuzzy_score_batch")
    @patch("scorer.select_profile")
    def test_blends_fuzzy_and_semantic_score_correct_returns(
        self, mock_select_profile, mock_aggregate_fuzzy, mock_semantic
    ):
        mock_select_profile.return_value = "first_time_no_pets"
        mock_aggregate_fuzzy.return_value = (np.array([0.8]), [[]], [[]])
        mock_semantic.return_value = np.array([0.6])

        adopter = make_adopter()
        dog = make_dog()

        result, factors = score_dog(adopter, dog, ADOPTER_EMBEDDING, DOG_EMBEDDING)

        expected = round(0.8 * FUZZY_SPLIT + 0.6 * SEMANTIC_SPLIT, 3)
        assert round(result.overall_score, 3) == expected
        assert result.fuzzy_score == 0.8
        assert result.semantic_score == 0.6
        assert result.warnings == []
        assert result.dog_id == dog.dog_id
        assert result.explanation is None
        assert factors == []

        mock_select_profile.assert_called_once_with(adopter)
        mock_aggregate_fuzzy.assert_called_once_with(adopter, [dog], "first_time_no_pets")
        mock_semantic.assert_called_once()

    @patch("scorer.calculate_semantic_score_batch")
    @patch("scorer.aggregate_fuzzy_score_batch")
    @patch("scorer.select_profile")
    def test_warnings_pass_through(
        self, mock_select_profile, mock_aggregate_fuzzy, mock_semantic
    ):
        mock_select_profile.return_value = "first_time_multi_pet"
        mock_aggregate_fuzzy.return_value = (
            np.array([0.8]), [["Unknown whether this dog is good with cats"]], [[]]
        )
        mock_semantic.return_value = np.array([0.6])

        adopter = make_adopter()
        dog = make_dog()

        result, factors = score_dog(adopter, dog, ADOPTER_EMBEDDING, DOG_EMBEDDING)

        assert result.warnings == ["Unknown whether this dog is good with cats"]

    @patch("scorer.calculate_semantic_score_batch")
    @patch("scorer.aggregate_fuzzy_score_batch")
    @patch("scorer.select_profile")
    def test_both_scores_at_max(
        self, mock_select_profile, mock_aggregate_fuzzy, mock_semantic
    ):
        mock_select_profile.return_value = "first_time_no_pets"
        mock_aggregate_fuzzy.return_value = (np.array([1.0]), [[]], [[]])
        mock_semantic.return_value = np.array([1.0])

        adopter = make_adopter()
        dog = make_dog()

        result, factors = score_dog(adopter, dog, ADOPTER_EMBEDDING, DOG_EMBEDDING)

        expected = round(FUZZY_SPLIT + SEMANTIC_SPLIT, 3)
        assert round(result.overall_score, 3) == expected

    @patch("scorer.calculate_semantic_score_batch")
    @patch("scorer.aggregate_fuzzy_score_batch")
    @patch("scorer.select_profile")
    def test_zero_and_max_score_blend_correctly(
        self, mock_select_profile, mock_aggregate_fuzzy, mock_semantic
    ):
        mock_select_profile.return_value = "first_time_no_pets"
        mock_aggregate_fuzzy.return_value = (np.array([0.0]), [[]], [[]])
        mock_semantic.return_value = np.array([1.0])

        adopter = make_adopter()
        dog = make_dog()

        result, factors = score_dog(adopter, dog, ADOPTER_EMBEDDING, DOG_EMBEDDING)

        expected = round(0.0 * FUZZY_SPLIT + 1.0 * SEMANTIC_SPLIT, 3)
        assert round(result.overall_score, 3) == expected

    @patch("scorer.calculate_semantic_score_batch")
    @patch("scorer.aggregate_fuzzy_score_batch")
    @patch("scorer.select_profile")
    def test_factors_pass_through(
        self, mock_select_profile, mock_aggregate_fuzzy, mock_semantic
    ):
        from schemas import ScoringFactor

        mock_select_profile.return_value = "first_time_no_pets"
        mock_factors = [
            ScoringFactor(variable="age", score=1.0, weight=0.1, warning=None, label="match")
        ]
        mock_aggregate_fuzzy.return_value = (np.array([0.8]), [[]], [mock_factors])
        mock_semantic.return_value = np.array([0.6])

        adopter = make_adopter()
        dog = make_dog()

        result, factors = score_dog(adopter, dog, ADOPTER_EMBEDDING, DOG_EMBEDDING)

        assert factors == mock_factors

class TestScoreDogsBatch:
    def test_preserves_dog_order(self):
        adopter = make_adopter()
        dogs = [make_dog(dog_id=1), make_dog(dog_id=2), make_dog(dog_id=3)]
        adopter_embedding = np.array([1.0, 0.0, 0.0])
        dog_embeddings = np.array([
            [1.0, 0.0, 0.0],
            [0.0, 1.0, 0.0],
            [0.7, 0.7, 0.0],
        ])

        results, factors = score_dogs_batch(adopter, dogs, adopter_embedding, dog_embeddings)

        assert [r.dog_id for r in results] == [1, 2, 3]
        assert len(factors) == 3

    def test_final_score_is_weighted_blend(self):
        adopter = make_adopter()
        dog = make_dog(dog_id=1)
        adopter_embedding = np.array([1.0, 0.0, 0.0])
        dog_embeddings = np.array([[1.0, 0.0, 0.0]])

        with patch("scorer.aggregate_fuzzy_score_batch") as mock_fuzzy, \
             patch("scorer.calculate_semantic_score_batch") as mock_semantic:
            mock_fuzzy.return_value = (np.array([0.8]), [[]], [[]])
            mock_semantic.return_value = np.array([0.5])

            results, factors = score_dogs_batch(adopter, [dog], adopter_embedding, dog_embeddings)

        expected = (0.8 * FUZZY_SPLIT) + (0.5 * SEMANTIC_SPLIT)
        assert results[0].overall_score == pytest.approx(expected)
        assert results[0].fuzzy_score == pytest.approx(0.8)
        assert results[0].semantic_score == pytest.approx(0.5)

    def test_empty_dog_list(self):
        adopter = make_adopter()
        adopter_embedding = np.array([1.0, 0.0, 0.0])
        dog_embeddings = np.empty((0, 3))

        results, factors = score_dogs_batch(adopter, [], adopter_embedding, dog_embeddings)

        assert results == []
        assert factors == []
