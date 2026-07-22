from tests.helpers import make_adopter, make_dog
from fuzzy_variables.training_level_compatibility import (
    training_level_compatibility,
    training_level_compatibility_batch
)

class TestTrainingLevelCompatibility:
    def test_adopter_commitment_matches_dog_level(self):
        adopter = make_adopter(training_commitment = "intensive")
        dog = make_dog(training_level="experienced_only")

        score, warning, label = training_level_compatibility(adopter, dog)
        assert score == 1.0
        assert warning is None
        assert label == "meets_requirement"

    def test_adopter_commitment_exceeds_dog_level(self):
        adopter = make_adopter(training_commitment = "moderate")
        dog = make_dog(training_level="basic")

        score, warning, label = training_level_compatibility(adopter, dog)
        assert score == 1.0
        assert warning is None
        assert label == "meets_requirement"

    def test_adopter_commitment_one_level_below_dog_level(self):
        adopter = make_adopter(training_commitment = "basic")
        dog = make_dog(training_level="moderate")

        score, warning, label = training_level_compatibility(adopter, dog)
        assert score == 0.5
        assert warning is None
        assert label == "one_level_below"

    def test_adopter_commitment_two_levels_below_dog_level(self):
        adopter = make_adopter(training_commitment = "none")
        dog = make_dog(training_level="moderate")

        score, warning, label = training_level_compatibility(adopter, dog)
        assert score == 0.0
        assert warning is None
        assert label == "far_below"

class TestTrainingLevelCompatibilityBatch:
    def test_preserves_dog_order(self):
        adopter = make_adopter(training_commitment="moderate")  
        dogs = [
            make_dog(training_level="none"),              
            make_dog(training_level="moderate"),           
            make_dog(training_level="experienced_only"),  
        ]

        scores, warnings, labels = training_level_compatibility_batch(adopter, dogs)

        assert scores.tolist() == [1.0, 1.0, 0.5]
        assert labels == ["meets_requirement", "meets_requirement", "one_level_below"]
        assert warnings == [None, None, None]

    def test_one_level_below(self):
        adopter = make_adopter(training_commitment="basic")  
        dog = make_dog(training_level="moderate")             

        scores, warnings, labels = training_level_compatibility_batch(adopter, [dog])

        assert scores.tolist() == [0.5]
        assert labels == ["one_level_below"]

    def test_far_below(self):
        adopter = make_adopter(training_commitment="none")        
        dog = make_dog(training_level="experienced_only")          

        scores, warnings, labels = training_level_compatibility_batch(adopter, [dog])

        assert scores.tolist() == [0.0]
        assert labels == ["far_below"]

    def test_empty_dog_list(self):
        adopter = make_adopter(training_commitment="moderate")

        scores, warnings, labels = training_level_compatibility_batch(adopter, [])

        assert len(scores) == 0
        assert warnings == []
        assert labels == []