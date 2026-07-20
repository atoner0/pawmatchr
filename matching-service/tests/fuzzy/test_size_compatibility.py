from tests.helpers import make_adopter, make_dog
from fuzzy_variables.size_compatibility import (
    size_compatibility,
    size_compatibility_batch
)

class TestSizeCompatibility:
    def test_dog_size_within_adopter_pref(self):
        adopter = make_adopter(size_pref = ["small", "medium"])
        dog = make_dog(size = "small")

        score, warning, label = size_compatibility(adopter, dog)
        assert score == 1.0
        assert warning is None
        assert label == "match"

    def test_dog_size_not_in_adopter_pref(self):
        adopter = make_adopter(size_pref = ["small", "medium"])
        dog = make_dog(size = "giant")

        score, warning, label = size_compatibility(adopter, dog)
        assert score == 0.0
        assert warning is None
        assert label == "no_match"

    def test_adopter_pref_is_none(self):
        adopter = make_adopter(size_pref = ["none"])
        dog = make_dog(size = "small")

        score, warning, label = size_compatibility(adopter, dog)
        assert score == 1.0
        assert warning is None
        assert label == "match"

class TestSizeCompatibilityBatch:
    def test_preserves_dog_order(self):
        adopter = make_adopter(size_pref = ["small", "medium"])
        dogs = [
            make_dog(size = "small"),
            make_dog(size = "medium"),
            make_dog(size = "giant"),
        ]

        scores, warnings, labels = size_compatibility_batch(adopter, dogs)

        assert scores.tolist() == [1.0, 1.0, 0.0]

        assert labels == ["match", "match", "no_match"]
        assert warnings == [None, None, None]

    def test_no_preference_matches_every_dog(self):
        adopter = make_adopter(size_pref = ["none"])
        dogs = [
            make_dog(size = "small"),
            make_dog(size = "giant"),
        ]

        scores, warnings, labels = size_compatibility_batch(adopter, dogs)

        assert scores.tolist() == [1.0, 1.0]

        assert labels == ["match", "match"]
        assert warnings == [None, None]

    def test_empty_dog_list(self):
        adopter = make_adopter(size_pref = ["small", "medium"])
        scores, warnings, labels = size_compatibility_batch(adopter, [])

        assert len(scores) == 0
        assert warnings == []
        assert labels == []