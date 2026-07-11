from helpers import make_adopter, make_dog

from filters.hard_filters import (
    fails_dog_filter,
    fails_cat_filter,
    fails_children_filter,
    fails_children_age_filter,
    apply_hard_filters
)

class TestFailsDogFilter:
    def test_excludes_when_adopter_has_dog_and_dog_not_good_with_dogs(self):
        adopter = make_adopter(current_pet_type=["dog"])
        dog = make_dog(good_with_dogs="no")

        assert fails_dog_filter(adopter, dog) is True

    def test_passes_when_adopter_has_dog_and_dog_good_with_dogs(self):
        adopter = make_adopter(current_pet_type=["dog"])
        dog = make_dog(good_with_dogs="yes")

        assert fails_dog_filter(adopter, dog) is False

    def test_passes_when_adopter_has_dog_and_compatibility_unknown(self):
        adopter = make_adopter(current_pet_type=["dog"])
        dog = make_dog(good_with_dogs="unknown")

        assert fails_dog_filter(adopter, dog) is False

    def test_passes_when_adopter_has_no_dog(self):
        adopter = make_adopter(current_pet_type=[])
        dog = make_dog(good_with_dogs="no")

        assert fails_dog_filter(adopter, dog) is False

class TestFailsCatFilter:
    def test_excludes_when_adopter_has_cat_and_dog_not_good_with_cats(self):
        adopter = make_adopter(current_pet_type=["cat"])
        dog = make_dog(good_with_cats="no")

        assert fails_cat_filter(adopter, dog) is True

    def test_passes_when_adopter_has_cat_and_dog_good_with_cats(self):
        adopter = make_adopter(current_pet_type=["cat"])
        dog = make_dog(good_with_cats="yes")

        assert fails_cat_filter(adopter, dog) is False

    def test_passes_when_adopter_has_cat_and_compatibility_unknown(self):
        adopter = make_adopter(current_pet_type=["cat"])
        dog = make_dog(good_with_cats="unknown")

        assert fails_cat_filter(adopter, dog) is False

    def test_passes_when_adopter_has_no_cat(self):
        adopter = make_adopter(current_pet_type=[])
        dog = make_dog(good_with_cats="no")

        assert fails_cat_filter(adopter, dog) is False

class TestFailsChildrenFilter:
    def test_excludes_when_adopter_has_children_and_dog_not_good_with_children(self):
        adopter = make_adopter(children=True)
        dog = make_dog(good_with_children="no")

        assert fails_children_filter(adopter, dog) is True

    def test_passes_when_adopter_has_children_and_dog_good_with_children(self):
        adopter = make_adopter(children=True)
        dog = make_dog(good_with_children="yes")

        assert fails_children_filter(adopter, dog) is False

    def test_passes_when_adopter_has_children_and_compatibility_unknown(self):
        adopter = make_adopter(children=True)
        dog = make_dog(good_with_children="unknown")

        assert fails_children_filter(adopter, dog) is False

    def test_passes_when_adopter_has_no_children(self):
        adopter = make_adopter(children=False)
        dog = make_dog(good_with_children="no")

        assert fails_children_filter(adopter, dog) is False

class TestFailsChildrenAgeFilter:
    def test_excludes_when_ages_dont_match(self):
        adopter = make_adopter(children=True, youngest_child_age="5_12")
        dog = make_dog(good_with_children="yes", children_age="13_plus")

        assert fails_children_age_filter(adopter, dog) is True

    def test_passes_when_ages_match(self):
        adopter = make_adopter(children=True, youngest_child_age="13_plus")
        dog = make_dog(good_with_children="yes", children_age="13_plus")

        assert fails_children_age_filter(adopter, dog) is False

    def test_passes_when_dog_accepts_any_age(self):
        adopter = make_adopter(children=True, youngest_child_age="5_12")
        dog = make_dog(good_with_children="yes", children_age="any")

        assert fails_children_age_filter(adopter, dog) is False

    def test_passes_when_dog_children_age_unknown(self):
        adopter = make_adopter(children=True, youngest_child_age="5_12")
        dog = make_dog(good_with_children="yes", children_age="unknown")

        assert fails_children_age_filter(adopter, dog) is False

    def test_passes_when_adopter_has_no_children(self):
        adopter = make_adopter(children=False)
        dog = make_dog(good_with_children="yes", children_age="any")

        assert fails_children_age_filter(adopter, dog) is False

class TestApplyHardFilters:
    def test_excludes_dog_that_fails_a_rule(self):
        adopter = make_adopter(current_pet_type=["dog"])
        incompatible_dog = make_dog(dog_id=1, good_with_dogs="no")
        compatible_dog = make_dog(dog_id=2, good_with_dogs="yes")

        result = apply_hard_filters(adopter, [incompatible_dog, compatible_dog])

        assert incompatible_dog not in result
        assert compatible_dog in result

    def test_returns_empty_list_when_dogs_fail(self):
        adopter = make_adopter(current_pet_type=["dog"])
        dogs = [make_dog(dog_id=1, good_with_dogs="no"), make_dog(dog_id=2, good_with_dogs="no")]

        assert apply_hard_filters(adopter, dogs) == []

    def test_returns_all_dogs_when_none_fail(self):
        adopter = make_adopter(current_pet_type=["dog"])
        dogs = [make_dog(dog_id=1, good_with_dogs="yes"), make_dog(dog_id=2, good_with_dogs="yes")]

        assert apply_hard_filters(adopter, dogs) == dogs