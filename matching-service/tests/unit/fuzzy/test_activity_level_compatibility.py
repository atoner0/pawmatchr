from tests.helpers import make_adopter, make_dog
from fuzzy_variables.activity_level_compatibility import (
    activity_level_compatibility_batch
)

class TestActivityLevelCompatibilityBatchScalarCases:
    def test_gap_in_ideal_zone(self):
        adopter = make_adopter(activity_level="medium")
        dog = make_dog(activity_level = "medium")

        scores, warnings, labels = activity_level_compatibility_batch(adopter, [dog])
        assert scores[0] == 1.0
        assert warnings[0] is None
        assert labels[0] == "aligned"

    def test_gap_at_c_boundary_still_ideal(self):
        adopter = make_adopter(activity_level="moderate")
        dog = make_dog(activity_level = "medium")

        scores, warnings, labels = activity_level_compatibility_batch(adopter, [dog])
        assert scores[0] == 1.0
        assert warnings[0] is None
        assert labels[0] == "aligned"

    def test_gap_at_b_boundary_still_ideal(self):
        adopter = make_adopter(activity_level="moderate")
        dog = make_dog(activity_level = "high")

        scores, warnings, labels = activity_level_compatibility_batch(adopter, [dog])
        assert scores[0] == 1.0
        assert warnings[0] is None
        assert labels[0] == "aligned"

    def test_gap_on_falling_slope(self):
        adopter = make_adopter(activity_level="moderate")
        dog = make_dog(activity_level = "low")

        scores, warnings, labels = activity_level_compatibility_batch(adopter, [dog])
        assert round(scores[0], 3) == 0.667
        assert warnings[0] is None
        assert labels[0] == "adopter_more_active"

    def test_gap_far_falling_slope(self):
        adopter = make_adopter(activity_level="high")
        dog = make_dog(activity_level = "low")

        scores, warnings, labels = activity_level_compatibility_batch(adopter, [dog])
        assert round(scores[0], 3) == 0.333
        assert warnings[0] is None
        assert labels[0] == "adopter_more_active"

    def test_gap_at_d_boundary(self):
        adopter = make_adopter(activity_level="very_high")
        dog = make_dog(activity_level = "low")

        scores, warnings, labels = activity_level_compatibility_batch(adopter, [dog])
        assert scores[0] == 0.0
        assert warnings[0] is None
        assert labels[0] == "adopter_more_active"

    def test_gap_at_a_boundary(self):
        adopter = make_adopter(activity_level="low")
        dog = make_dog(activity_level = "high")

        scores, warnings, labels = activity_level_compatibility_batch(adopter, [dog])
        assert scores[0] == 0.0
        assert warnings[0] is None
        assert labels[0] == "adopter_less_active"

class TestActivityLevelCompatibilityBatch:
    def test_preserves_dog_order(self):
        adopter = make_adopter(activity_level = "moderate")
        dogs = [
            make_dog(activity_level = "low"),
            make_dog(activity_level = "medium"),
            make_dog(activity_level = "high"),
        ]

        scores, warnings, labels = activity_level_compatibility_batch(adopter, dogs)

        assert round(scores[0], 3) == 0.667
        assert round(scores[1], 3) == 1.0
        assert round(scores[2], 3) == 1.0

        assert labels == ["adopter_more_active", "aligned", "aligned"]
        assert warnings == [None, None, None]

    def test_empty_dog_list(self):
        adopter = make_adopter(activity_level = "moderate")
        scores, warnings, labels = activity_level_compatibility_batch(adopter, [])

        assert len(scores) == 0
        assert warnings == []
        assert labels == []