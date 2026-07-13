from tests.helpers import make_adopter, make_dog
from fuzzy_variables.training_level_compatibility import training_level_compatibility

class TestTrainingLevelCompatibility:
    def test_adopter_commitment_matches_dog_level(self):
        adopter = make_adopter(training_commitment = "intensive")
        dog = make_dog(training_level="experienced_only")

        score, warning = training_level_compatibility(adopter, dog)
        assert score == 1.0
        assert warning is None

    def test_adopter_commitment_exceeds_dog_level(self):
        adopter = make_adopter(training_commitment = "moderate")
        dog = make_dog(training_level="basic")

        score, warning = training_level_compatibility(adopter, dog)
        assert score == 1.0
        assert warning is None

    def test_adopter_commitment_one_level_below_dog_level(self):
        adopter = make_adopter(training_commitment = "basic")
        dog = make_dog(training_level="moderate")

        score, warning = training_level_compatibility(adopter, dog)
        assert score == 0.5
        assert warning is None

    def test_adopter_commitment_two_levels_below_dog_level(self):
        adopter = make_adopter(training_commitment = "none")
        dog = make_dog(training_level="moderate")

        score, warning = training_level_compatibility(adopter, dog)
        assert score == 0.0
        assert warning is None