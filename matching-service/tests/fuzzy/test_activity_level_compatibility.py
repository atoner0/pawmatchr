from tests.helpers import make_adopter, make_dog
from fuzzy_variables.activity_level_compatibility import activity_level_compatibility

class TestActivityLevelCompatibility:
    def test_gap_in_ideal_zone(self):
        adopter = make_adopter(activity_level="medium")
        dog = make_dog(activity_level = "medium")

        score, warning = activity_level_compatibility(adopter, dog) 
        assert score == 1.0
        assert warning is None

    def test_gap_at_c_boundary_still_ideal(self):
        adopter = make_adopter(activity_level="moderate")
        dog = make_dog(activity_level = "medium")

        score, warning = activity_level_compatibility(adopter, dog) 
        assert score == 1.0
        assert warning is None

    def test_gap_at_b_boundary_still_ideal(self):
        adopter = make_adopter(activity_level="moderate")
        dog = make_dog(activity_level = "high")

        score, warning = activity_level_compatibility(adopter, dog) 
        assert score == 1.0
        assert warning is None

    def test_gap_on_falling_slope(self):
        adopter = make_adopter(activity_level="moderate")
        dog = make_dog(activity_level = "low")

        score, warning = activity_level_compatibility(adopter, dog) 
        assert round(score, 3) == 0.667
        assert warning is None

    def test_gap_far_falling_slope(self):
        adopter = make_adopter(activity_level="high")
        dog = make_dog(activity_level = "low")

        score, warning = activity_level_compatibility(adopter, dog) 
        assert round(score, 3) == 0.333
        assert warning is None

    def test_gap_at_d_boundary(self):
        adopter = make_adopter(activity_level="very_high")
        dog = make_dog(activity_level = "low")

        score, warning = activity_level_compatibility(adopter, dog) 
        assert score == 0.0
        assert warning is None

    def test_gap_at_a_boundaryl(self):
        adopter = make_adopter(activity_level="low")
        dog = make_dog(activity_level = "high")

        score, warning = activity_level_compatibility(adopter, dog) 
        assert score == 0.0
        assert warning is None