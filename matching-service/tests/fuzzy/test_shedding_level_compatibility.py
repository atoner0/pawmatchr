from tests.helpers import make_adopter, make_dog
from fuzzy_variables.shedding_level_compatibility import shedding_level_compatibility

class TestSheddingLevelCompatibility:
    def test_adopter_pref_matches_dog_level(self):
        adopter = make_adopter(shedding_pref = "low")
        dog = make_dog(shedding_level = "low")

        score, warning = shedding_level_compatibility(adopter, dog)
        assert score == 1.0
        assert warning is None

    def test_adopter_pref_higher_than_dog_level(self):
        adopter = make_adopter(shedding_pref = "high")
        dog = make_dog(shedding_level = "low")

        score, warning = shedding_level_compatibility(adopter, dog)
        assert score == 1.0
        assert warning is None

    def test_adopter_pref_lower_than_dog_level(self):
        adopter = make_adopter(shedding_pref = "none")
        dog = make_dog(shedding_level = "low")

        score, warning = shedding_level_compatibility(adopter, dog)
        assert score == 0.0
        assert warning is None