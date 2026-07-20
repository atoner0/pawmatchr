from tests.helpers import make_adopter, make_dog
from fuzzy_variables.alone_tolerance_compatibility import (
    alone_tolerance_compatibility,
    alone_tolerance_compatibility_batch
)

class TestAloneToleranceCompatibility:
    def test_gap_zero_is_perfect_match(self):
        adopter = make_adopter(hours_alone = "2_4")
        dog = make_dog(alone_tolerance = "2_4")

        score, warning, label = alone_tolerance_compatibility(adopter, dog)
        assert score == 1.0
        assert warning is None
        assert label == "within_tolerance"

    def test_negative_gap_clamped_to_one(self):
        adopter = make_adopter(hours_alone = "0_2")
        dog = make_dog(alone_tolerance = "4_6")

        score, warning, label = alone_tolerance_compatibility(adopter, dog)
        assert score == 1.0
        assert warning is None
        assert label == "within_tolerance"
    
    def test_gap_above_c_boundary(self):
        adopter = make_adopter(hours_alone = "2_4")
        dog = make_dog(alone_tolerance = "0_2")

        score, warning, label = alone_tolerance_compatibility(adopter, dog)
        assert score == 0.0
        assert warning is None
        assert label == "exceeds_tolerance"

    def test_both_at_8_plus(self):
        adopter = make_adopter(hours_alone = "8_plus")
        dog = make_dog(alone_tolerance = "8_plus")

        score, warning, label = alone_tolerance_compatibility(adopter, dog)
        assert score == 1.0
        assert warning is None
        assert label == "within_tolerance"

class TestAloneToleranceCompatibilityBatch:
    def test_preserves_dog_order(self):
        adopter = make_adopter(hours_alone = "2_4")
        dogs = [
            make_dog(alone_tolerance = "0_2"),
            make_dog(alone_tolerance = "2_4"),
            make_dog(alone_tolerance = "8_plus"),
        ]

        scores, warnings, labels = alone_tolerance_compatibility_batch(adopter, dogs)

        assert round(scores[0], 3) == 0.0
        assert round(scores[1], 3) == 1.0
        assert round(scores[2], 3) == 1.0

        assert labels == ["exceeds_tolerance", "within_tolerance", "within_tolerance"]
        assert warnings == [None, None, None]

    def test_empty_dog_list(self):
        adopter = make_adopter(hours_alone = "2_4")
        scores, warnings, labels = alone_tolerance_compatibility_batch(adopter, [])

        assert len(scores) == 0
        assert warnings == []
        assert labels == []
