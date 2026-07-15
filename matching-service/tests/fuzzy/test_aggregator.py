from unittest.mock import patch
from fuzzy_variables.aggregator import aggregate_fuzzy_score
from tests.helpers import make_adopter, make_dog

class TestAggregateFuzzyScore:
    def test_returns_score_between_zero_and_one(self):
        adopter = make_adopter()
        dog = make_dog()

        fuzzy_score, warnings = aggregate_fuzzy_score(adopter, dog, "first_time_no_pets")

        assert 0.0 <= fuzzy_score <= 1.0
        assert isinstance(warnings, list)

    def test_zero_weight_variable_excluded_from_average(self):
        adopter = make_adopter(current_pets = True, current_pet_type = ["cat"])
        dog = make_dog()

        # deliberately give cat a low score with zero weight
        with patch("fuzzy_variables.aggregator.cat_compatibility") as mock_cat_score, \
             patch("fuzzy_variables.aggregator.adjust_cat_compatibility_weight") as mock_adjust_cat:
            mock_cat_score.return_value = (0.0, None)
            mock_adjust_cat.return_value = 0.0

            excluded_score, warnings = aggregate_fuzzy_score(adopter, dog, "first_time_no_pets")

        # if cats low score had counted at nonzero weight, it should have dragged average down compared to excluding entirely
        with patch("fuzzy_variables.aggregator.cat_compatibility") as mock_cat_score, \
             patch("fuzzy_variables.aggregator.adjust_cat_compatibility_weight") as mock_adjust_cat:
            mock_cat_score.return_value = (0.0, None)
            mock_adjust_cat.return_value = 0.09

            included_score, warnings = aggregate_fuzzy_score(adopter, dog, "first_time_no_pets")

        

        assert excluded_score > included_score

    @patch("fuzzy_variables.aggregator.adjust_home_location_weight")
    @patch("fuzzy_variables.aggregator.home_location_compatibility")
    @patch("fuzzy_variables.aggregator.adjust_cat_compatibility_weight")
    @patch("fuzzy_variables.aggregator.cat_compatibility")
    def test_warnings_collected_from_multiple_variables(
        self, mock_cat_score, mock_adjust_cat, mock_home_location, mock_adjust_home_location,
    ):
        mock_adjust_cat.return_value = 0.09  # nonzero, so warning isn't dropped
        mock_cat_score.return_value = (0.5, "Unknown whether this dog is good with cats")

        mock_adjust_home_location.return_value = 0.08 # nonzero, so warning isn't dropped
        mock_home_location.return_value = (0.25, "Dog has location-relevant behavioural flags")

        adopter = make_adopter()
        dog = make_dog()

        _, warnings = aggregate_fuzzy_score(adopter, dog, "first_time_no_pets")

        assert "Unknown whether this dog is good with cats" in warnings
        assert "Dog has location-relevant behavioural flags" in warnings
        assert len(warnings) == 2

    @patch("fuzzy_variables.aggregator.adjust_cat_compatibility_weight")
    @patch("fuzzy_variables.aggregator.cat_compatibility")
    def test_warning_dropped_when_weight_is_zero(
        self, mock_cat_score, mock_adjust_cat
    ):
        mock_adjust_cat.return_value = 0.0
        mock_cat_score.return_value = (0.5, "Unknown whether this dog is good with cats")


        adopter = make_adopter()
        dog = make_dog()

        _, warnings = aggregate_fuzzy_score(adopter, dog, "first_time_no_pets")

        assert "Unknown whether this dog is good with cats" not in warnings

            

