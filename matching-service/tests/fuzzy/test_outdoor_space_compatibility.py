from tests.helpers import make_adopter, make_dog
from fuzzy_variables.outdoor_space_compatibility import outdoor_space_compatibility

class TestOutdoorSpaceCompatibility:
    def test_large_space(self):
        adopter = make_adopter(outdoor_space = "large")
        dog = make_dog()

        score, warning = outdoor_space_compatibility(adopter, dog)
        assert score == 1.0
        assert warning is None
    
    def test_medium_space(self):
        adopter = make_adopter(outdoor_space = "medium")
        dog = make_dog()

        score, warning = outdoor_space_compatibility(adopter, dog)
        assert score == 0.75
        assert warning is None

    def test_small_space(self):
        adopter = make_adopter(outdoor_space = "small")
        dog = make_dog()

        score, warning = outdoor_space_compatibility(adopter, dog)
        assert score == 0.25
        assert warning is None

    def test_no_space(self):
        adopter = make_adopter(outdoor_space = "none")
        dog = make_dog()

        score, warning = outdoor_space_compatibility(adopter, dog)
        assert score == 0.0
        assert warning is None