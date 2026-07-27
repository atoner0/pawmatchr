from tests.helpers import make_adopter, make_dog
from fuzzy_variables.size_compatibility import (
    size_compatibility_batch
)

class TestSizeCompatibilityBatchScalarCases:
    def test_dog_size_within_adopter_pref(self):
        adopter = make_adopter(size_pref = ["small", "medium"])
        dog = make_dog(size = "small")

        scores, warnings, labels = size_compatibility_batch(adopter, [dog])
        assert scores[0] == 1.0
        assert warnings[0] is None
        assert labels[0] == "match"

    def test_dog_size_not_in_adopter_pref(self):
        adopter = make_adopter(size_pref = ["small", "medium"])
        dog = make_dog(size = "giant")

        scores, warnings, labels = size_compatibility_batch(adopter, [dog])
        assert scores[0] == 0.0
        assert warnings[0] is None
        assert labels[0] == "no_match"

    def test_adopter_pref_is_none(self):
        adopter = make_adopter(size_pref = ["none"])
        dog = make_dog(size = "small")

        scores, warnings, labels = size_compatibility_batch(adopter, [dog])
        assert scores[0] == 1.0
        assert warnings[0] is None
        assert labels[0] == "match"

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