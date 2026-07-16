from tests.helpers import make_adopter, make_dog
from fuzzy_variables.age_compatibility import age_compatibility

class TestAgeCompatibility:
    def test_dog_age_within_adopter_pref(self):
        adopter = make_adopter(age_pref = ["3_5", "6_8"])
        dog = make_dog(age = "6_8")

        score, warning, label = age_compatibility(adopter, dog)
        assert score == 1.0
        assert warning is None
        assert label == "match"

    def test_adopter_selects_none(self):
        adopter = make_adopter()
        dog = make_dog(age = "6_8")

        score, warning, label = age_compatibility(adopter, dog)
        assert score == 1.0
        assert warning is None
        assert label == "match"

    def test_dog_age_not_in_adopter_pref(self):
        adopter = make_adopter(age_pref = ["3_5", "6_8"])
        dog = make_dog(age = "0_2")

        score, warning, label = age_compatibility(adopter, dog)
        assert score == 0.0
        assert warning is None
        assert label == "no_match"