from tests.helpers import make_adopter, make_dog
from fuzzy_variables.cat_compatibility import cat_compatibility

class TestCatCompatibility:
    def test_adopter_has_no_cat(self):
        adopter = make_adopter()
        dog = make_dog(good_with_cats = "yes")

        score, warning, label = cat_compatibility(adopter, dog)
        assert score == 1.0
        assert warning is None
        assert label == "not_weighed"

    def test_adopter_has_cat_dog_good_with_cats(self):
        adopter = make_adopter(current_pet_type = ["cat"])
        dog = make_dog(good_with_cats = "yes")

        score, warning, label = cat_compatibility(adopter, dog)
        assert score == 1.0
        assert warning is None
        assert label == "known_compatible"

    def test_adopter_has_cat_dog_unknown(self):
        adopter = make_adopter(current_pet_type = ["cat"])
        dog = make_dog(good_with_cats = "unknown")

        score, warning, label = cat_compatibility(adopter, dog)
        assert score == 0.5
        assert warning == "Unknown whether this dog is good with cats"
        assert label == "unknown"

    def test_adopter_has_cat_dog_not_good_with_cats(self):
        adopter = make_adopter(current_pet_type = ["cat"])
        dog = make_dog(good_with_cats = "no")

        score, warning, label = cat_compatibility(adopter, dog)
        assert score == 0.0
        assert warning is None
        assert label == "not_compatible"