from tests.helpers import make_adopter, make_dog
from fuzzy_variables.outdoor_space_compatibility import (
    outdoor_space_compatibility_batch
)

class TestOutdoorSpaceCompatibilityBatchScalarCases:
    def test_large_space(self):
        adopter = make_adopter(outdoor_space = "large")
        dog = make_dog()

        scores, warnings, labels = outdoor_space_compatibility_batch(adopter, [dog])
        assert scores[0] == 1.0
        assert warnings[0] is None
        assert labels[0] == "ideal"
    
    def test_medium_space(self):
        adopter = make_adopter(outdoor_space = "medium")
        dog = make_dog()

        scores, warnings, labels = outdoor_space_compatibility_batch(adopter, [dog])
        assert scores[0] == 0.75
        assert warnings[0] is None
        assert labels[0] == "acceptable"

    def test_small_space(self):
        adopter = make_adopter(outdoor_space = "small")
        dog = make_dog()

        scores, warnings, labels = outdoor_space_compatibility_batch(adopter, [dog])
        assert scores[0] == 0.25
        assert warnings[0] is None
        assert labels[0] == "poor"

    def test_no_space(self):
        adopter = make_adopter(outdoor_space = "none")
        dog = make_dog()

        scores, warnings, labels = outdoor_space_compatibility_batch(adopter, [dog])
        assert scores[0] == 0.0
        assert warnings[0] is None
        assert labels[0] == "not_acceptable"

class TestOutdoorSpaceCompatibilityBatch:
    def test_same_score_for_every_dog(self):
        adopter = make_adopter(outdoor_space="large")
        dogs = [make_dog(), make_dog(), make_dog()]

        scores, warnings, labels = outdoor_space_compatibility_batch(adopter, dogs)

        assert scores.tolist() == [1.0, 1.0, 1.0]
        assert labels == [labels[0]] * 3
        assert warnings == [None, None, None]

    def test_empty_dog_list(self):
        adopter = make_adopter(outdoor_space="small")

        scores, warnings, labels = outdoor_space_compatibility_batch(adopter, [])

        assert len(scores) == 0
        assert warnings == []
        assert labels == []