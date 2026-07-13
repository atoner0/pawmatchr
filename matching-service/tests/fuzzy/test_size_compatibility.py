from tests.helpers import make_adopter, make_dog
from fuzzy_variables.size_compatibility import size_compatibility

class TestSizeCompatibility:
    def test_dog_size_within_adopter_pref(self):
        adopter = make_adopter(size_pref = ["small", "medium"])
        dog = make_dog(size = "small")

        score, warning = size_compatibility(adopter, dog)
        assert score == 1.0
        assert warning is None

    def test_dog_size_not_in_adopter_pref(self):
        adopter = make_adopter(size_pref = ["small", "medium"])
        dog = make_dog(size = "giant")

        score, warning = size_compatibility(adopter, dog)
        assert score == 0.0
        assert warning is None

    def test_adopter_pref_is_none(self):
        adopter = make_adopter(size_pref = ["none"])
        dog = make_dog(size = "small")

        score, warning = size_compatibility(adopter, dog)
        assert score == 1.0
        assert warning is None