from scorer import score_dog, FUZZY_SPLIT, SEMANTIC_SPLIT
from unittest.mock import patch
from tests.helpers import make_adopter, make_dog
import numpy as np

DOG_EMBEDDING = np.array([0.1, 0.2, 0.3, 0.4])
ADOPTER_EMBEDDING = np.array([0.5, 0.6, 0.7, 0.8])

class TestScoreDog:
    @patch("scorer.calculate_semantic_score")
    @patch("scorer.aggregate_fuzzy_score")
    @patch("scorer.select_profile")
    def test_blends_fuzzy_and_semantic_score_correct_returns(
        self, mock_select_profile, mock_aggregate_fuzzy, mock_semantic
    ):
        mock_select_profile.return_value = "first_time_no_pets"
        mock_aggregate_fuzzy.return_value = (0.8, [])
        mock_semantic.return_value = 0.6


        adopter = make_adopter()
        dog = make_dog()

        result = score_dog(adopter, dog, ADOPTER_EMBEDDING, DOG_EMBEDDING)

        expected = round(0.8 * FUZZY_SPLIT + 0.6 * SEMANTIC_SPLIT, 3)
        assert round(result.overall_score, 3) == expected
        assert result.fuzzy_score == 0.8
        assert result.semantic_score == 0.6
        assert result.warnings == []
        assert result.dog_id == dog.dog_id
        assert result.explanation is None
        
        mock_select_profile.assert_called_once_with(adopter)
        mock_aggregate_fuzzy.assert_called_once_with(adopter, dog, "first_time_no_pets")
        mock_semantic.assert_called_once_with(DOG_EMBEDDING, ADOPTER_EMBEDDING)

    @patch("scorer.calculate_semantic_score")
    @patch("scorer.aggregate_fuzzy_score")
    @patch("scorer.select_profile")
    def test_warnings_pass_through(
        self, mock_select_profile, mock_aggregate_fuzzy, mock_semantic
    ):
        mock_select_profile.return_value = "first_time_multi_pet"
        mock_aggregate_fuzzy.return_value = (0.8, ["Unknown whether this dog is good with cats"])
        mock_semantic.return_value = 0.6


        adopter = make_adopter()
        dog = make_dog()

        result = score_dog(adopter, dog, ADOPTER_EMBEDDING, DOG_EMBEDDING)

        assert result.warnings == ["Unknown whether this dog is good with cats"]

    @patch("scorer.calculate_semantic_score")
    @patch("scorer.aggregate_fuzzy_score")
    @patch("scorer.select_profile")
    def test_both_scores_at_max(
        self, mock_select_profile, mock_aggregate_fuzzy, mock_semantic
    ):
        mock_select_profile.return_value = "first_time_no_pets"
        mock_aggregate_fuzzy.return_value = (1.0, [])
        mock_semantic.return_value = 1.0


        adopter = make_adopter()
        dog = make_dog()

        result = score_dog(adopter, dog, ADOPTER_EMBEDDING, DOG_EMBEDDING)

        expected = round(FUZZY_SPLIT + SEMANTIC_SPLIT, 3)
        assert round(result.overall_score, 3) == expected

    @patch("scorer.calculate_semantic_score")
    @patch("scorer.aggregate_fuzzy_score")
    @patch("scorer.select_profile")
    def test_zero_and_max_score_blend_correctly(
        self, mock_select_profile, mock_aggregate_fuzzy, mock_semantic
    ):
        mock_select_profile.return_value = "first_time_no_pets"
        mock_aggregate_fuzzy.return_value = (0.0, [])
        mock_semantic.return_value = 1.0


        adopter = make_adopter()
        dog = make_dog()

        result = score_dog(adopter, dog, ADOPTER_EMBEDDING, DOG_EMBEDDING)

        expected = round(0.0 * FUZZY_SPLIT + 1.0 * SEMANTIC_SPLIT, 3)
        assert round(result.overall_score, 3) == expected

    
        

