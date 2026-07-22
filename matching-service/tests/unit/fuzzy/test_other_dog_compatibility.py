from tests.helpers import make_adopter, make_dog
from fuzzy_variables.other_dog_compatibility import (
    other_dog_compatibility,
    other_dog_compatibility_batch
)

class TestOtherDogCompatibility:
    def test_adopter_has_no_dog(self):
        adopter = make_adopter()
        dog = make_dog(good_with_dogs = "yes")

        score, warning, label = other_dog_compatibility(adopter, dog)
        assert score == 1.0
        assert warning is None
        assert label == "not_weighed"

    def test_adopter_has_dog_dog_good_with_cats(self):
        adopter = make_adopter(current_pet_type = ["dog"])
        dog = make_dog(good_with_dogs = "yes")

        score, warning, label = other_dog_compatibility(adopter, dog)
        assert score == 1.0
        assert warning is None
        assert label == "known_compatible"

    def test_adopter_has_dog_dog_unknown(self):
        adopter = make_adopter(current_pet_type = ["dog"])
        dog = make_dog(good_with_dogs = "unknown")

        score, warning, label = other_dog_compatibility(adopter, dog)
        assert score == 0.5
        assert warning == "Unknown whether this dog is good with other dogs"
        assert label == "unknown"

    def test_adopter_has_dog_dog_not_good_with_cats(self):
        adopter = make_adopter(current_pet_type = ["dog"])
        dog = make_dog(good_with_dogs = "no")

        score, warning, label = other_dog_compatibility(adopter, dog)
        assert score == 0.0
        assert warning is None
        assert label == "not_compatible"

class TestOtherDogCompatibilityBatch:
    def test_preserves_dog_order(self):
        adopter = make_adopter(current_pet_type = ["dog"])
        dogs = [
            make_dog(good_with_dogs = "yes"),
            make_dog(good_with_dogs = "unknown"),
            make_dog(good_with_dogs = "no"),
        ]

        scores, warnings, labels = other_dog_compatibility_batch(adopter, dogs)

        assert scores.tolist() == [1.0, 0.5, 0.0]

        assert labels == ["known_compatible", "unknown", "not_compatible"]
        assert warnings == [None, "Unknown whether this dog is good with other dogs", None]

    def test_adopter_no_dog_not_weighed(self):
        adopter = make_adopter()
        dogs = [
            make_dog(good_with_dogs = "yes"),
            make_dog(good_with_dogs = "unknown"),
            make_dog(good_with_dogs = "no"),
        ]

        scores, warnings, labels = other_dog_compatibility_batch(adopter, dogs)

        assert scores.tolist() == [1.0, 1.0, 1.0]

        assert labels == ["not_weighed", "not_weighed", "not_weighed"]
        assert warnings == [None, None, None]

    def test_empty_dog_list(self):
        adopter = make_adopter(current_pet_type = ["dog"])
        scores, warnings, labels = other_dog_compatibility_batch(adopter, [])

        assert len(scores) == 0
        assert warnings == []
        assert labels == []