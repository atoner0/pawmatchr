from tests.helpers import make_adopter, make_dog
from fuzzy_variables.alone_tolerance_compatibility import alone_tolerance_compatibility

class TestAloneToleranceCompatibility:
    def test_gap_zero_is_perfect_match(self):
        adopter = make_adopter(hours_alone = "2_4")
        dog = make_dog(alone_tolerance = "2_4")

        score, warning = alone_tolerance_compatibility(adopter, dog)
        assert score == 1.0
        assert warning is None

    def test_negative_gap_clamped_to_one(self):
        adopter = make_adopter(hours_alone = "0_2")
        dog = make_dog(alone_tolerance = "4_6")

        score, warning = alone_tolerance_compatibility(adopter, dog)
        assert score == 1.0
        assert warning is None
    
    def test_gap_above_c_boundary(self):
        adopter = make_adopter(hours_alone = "2_4")
        dog = make_dog(alone_tolerance = "0_2")

        score, warning = alone_tolerance_compatibility(adopter, dog)
        assert score == 0.0
        assert warning is None

    def test_both_at_8_plus(self):
        adopter = make_adopter(hours_alone = "8_plus")
        dog = make_dog(alone_tolerance = "8_plus")

        score, warning = alone_tolerance_compatibility(adopter, dog)
        assert score == 1.0
        assert warning is None