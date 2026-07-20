from tests.helpers import make_adopter, make_dog
from fuzzy_variables.age_compatibility import (
    age_compatibility,
    age_compatibility_batch
)

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

class TestAgeCompatibilityBatch:
    def test_preserves_dog_order(self):
        adopter = make_adopter(age_pref = ["0_2", "3_5"])
        dogs = [
            make_dog(age = "0_2"),
            make_dog(age = "3_5"),
            make_dog(age = "8_plus"),
        ]

        scores, warnings, labels = age_compatibility_batch(adopter, dogs)

        assert scores.tolist() == [1.0, 1.0, 0.0]

        assert labels == ["match", "match", "no_match"]
        assert warnings == [None, None, None]

    def test_no_preference_matches_every_dog(self):
        adopter = make_adopter(age_pref = ["none"])
        dogs = [
            make_dog(age = "0_2"),
            make_dog(age = "8_plus"),
        ]

        scores, warnings, labels = age_compatibility_batch(adopter, dogs)

        assert scores.tolist() == [1.0, 1.0]

        assert labels == ["match", "match"]
        assert warnings == [None, None]

    def test_empty_dog_list(self):
        adopter = make_adopter(age_pref = ["0_2", "3_5"])
        scores, warnings, labels = age_compatibility_batch(adopter, [])

        assert len(scores) == 0
        assert warnings == []
        assert labels == []