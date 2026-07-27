from tests.helpers import make_adopter, make_dog
from fuzzy_variables.cat_compatibility import (
    cat_compatibility_batch
)

class TestCatCompatibilityBatchScalarCases:
    def test_adopter_has_no_cat(self):
        adopter = make_adopter()
        dog = make_dog(good_with_cats = "yes")

        scores, warnings, labels = cat_compatibility_batch(adopter, [dog])
        assert scores[0] == 1.0
        assert warnings[0] is None
        assert labels[0] == "not_weighed"

    def test_adopter_has_cat_dog_good_with_cats(self):
        adopter = make_adopter(current_pet_type = ["cat"])
        dog = make_dog(good_with_cats = "yes")

        scores, warnings, labels = cat_compatibility_batch(adopter, [dog])
        assert scores[0] == 1.0
        assert warnings[0] is None
        assert labels[0] == "known_compatible"

    def test_adopter_has_cat_dog_unknown(self):
        adopter = make_adopter(current_pet_type = ["cat"])
        dog = make_dog(good_with_cats = "unknown")

        scores, warnings, labels = cat_compatibility_batch(adopter, [dog])
        assert scores[0] == 0.5
        assert warnings[0] == "Unknown whether this dog is good with cats"
        assert labels[0] == "unknown"

    def test_adopter_has_cat_dog_not_good_with_cats(self):
        adopter = make_adopter(current_pet_type = ["cat"])
        dog = make_dog(good_with_cats = "no")

        scores, warnings, labels = cat_compatibility_batch(adopter, [dog])
        assert scores[0] == 0.0
        assert warnings[0] is None
        assert labels[0] == "not_compatible"

class TestCatCompatibilityBatch:
    def test_preserves_dog_order(self):
        adopter = make_adopter(current_pet_type = ["cat"])
        dogs = [
            make_dog(good_with_cats = "yes"),
            make_dog(good_with_cats = "unknown"),
            make_dog(good_with_cats = "no"),
        ]

        scores, warnings, labels = cat_compatibility_batch(adopter, dogs)

        assert scores.tolist() == [1.0, 0.5, 0.0]

        assert labels == ["known_compatible", "unknown", "not_compatible"]
        assert warnings == [None, "Unknown whether this dog is good with cats", None]

    def test_adopter_no_cat_not_weighed(self):
        adopter = make_adopter()
        dogs = [
            make_dog(good_with_cats = "yes"),
            make_dog(good_with_cats = "unknown"),
            make_dog(good_with_cats = "no"),
        ]

        scores, warnings, labels = cat_compatibility_batch(adopter, dogs)

        assert scores.tolist() == [1.0, 1.0, 1.0]

        assert labels == ["not_weighed", "not_weighed", "not_weighed"]
        assert warnings == [None, None, None]

    def test_empty_dog_list(self):
        adopter = make_adopter(current_pet_type = ["cat"])
        scores, warnings, labels = cat_compatibility_batch(adopter, [])

        assert len(scores) == 0
        assert warnings == []
        assert labels == []