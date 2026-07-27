from tests.helpers import make_adopter, make_dog
from fuzzy_variables.other_dog_compatibility import (
    other_dog_compatibility_batch
)

class TestOtherDogCompatibilityBatchScalarCases:
    def test_adopter_has_no_dog(self):
        adopter = make_adopter()
        dog = make_dog(good_with_dogs = "yes")

        scores, warnings, labels = other_dog_compatibility_batch(adopter, [dog])
        assert scores[0] == 1.0
        assert warnings[0] is None
        assert labels[0] == "not_weighed"

    def test_adopter_has_dog_dog_good_with_cats(self):
        adopter = make_adopter(current_pet_type = ["dog"])
        dog = make_dog(good_with_dogs = "yes")

        scores, warnings, labels = other_dog_compatibility_batch(adopter, [dog])
        assert scores[0] == 1.0
        assert warnings[0] is None
        assert labels[0] == "known_compatible"

    def test_adopter_has_dog_dog_unknown(self):
        adopter = make_adopter(current_pet_type = ["dog"])
        dog = make_dog(good_with_dogs = "unknown")

        scores, warnings, labels = other_dog_compatibility_batch(adopter, [dog])
        assert scores[0] == 0.5
        assert warnings[0] == "Unknown whether this dog is good with other dogs"
        assert labels[0] == "unknown"

    def test_adopter_has_dog_dog_not_good_with_cats(self):
        adopter = make_adopter(current_pet_type = ["dog"])
        dog = make_dog(good_with_dogs = "no")

        scores, warnings, labels = other_dog_compatibility_batch(adopter, [dog])
        assert scores[0] == 0.0
        assert warnings[0] is None
        assert labels[0] == "not_compatible"

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