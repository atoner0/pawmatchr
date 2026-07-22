from tests.helpers import make_adopter, make_dog
from fuzzy_variables.shedding_level_compatibility import (
    shedding_level_compatibility,
    shedding_level_compatibility_batch
)

class TestSheddingLevelCompatibility:
    def test_adopter_pref_matches_dog_level(self):
        adopter = make_adopter(shedding_pref = "low")
        dog = make_dog(shedding_level = "low")

        score, warning, label = shedding_level_compatibility(adopter, dog)
        assert score == 1.0
        assert warning is None
        assert label == "match"

    def test_adopter_pref_higher_than_dog_level(self):
        adopter = make_adopter(shedding_pref = "high")
        dog = make_dog(shedding_level = "low")

        score, warning, label = shedding_level_compatibility(adopter, dog)
        assert score == 1.0
        assert warning is None
        assert label == "match"

    def test_adopter_pref_lower_than_dog_level(self):
        adopter = make_adopter(shedding_pref = "none")
        dog = make_dog(shedding_level = "low")

        score, warning, label = shedding_level_compatibility(adopter, dog)
        assert score == 0.0
        assert warning is None
        assert label == "no_match"

class TestSheddingLevelCompatibilityBatch:
    def test_preserves_dog_order(self):
        adopter = make_adopter(shedding_pref = "low")
        dogs = [
            make_dog(shedding_level = "none"),
            make_dog(shedding_level = "low"),
            make_dog(shedding_level = "high"),
        ]

        scores, warnings, labels = shedding_level_compatibility_batch(adopter, dogs)

        assert scores.tolist() == [1.0, 1.0, 0.0]

        assert labels == ["match", "match", "no_match"]
        assert warnings == [None, None, None]


    def test_empty_dog_list(self):
        adopter = make_adopter(shedding_pref = "low")
        scores, warnings, labels = shedding_level_compatibility_batch(adopter, [])

        assert len(scores) == 0
        assert warnings == []
        assert labels == []