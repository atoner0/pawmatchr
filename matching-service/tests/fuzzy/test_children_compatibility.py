from tests.helpers import make_adopter, make_dog
from fuzzy_variables.children_compatibility import children_compatibility

class TestChildrenCompatibility:
    def test_if_adopter_has_no_children(self):
        adopter = make_adopter()
        dog = make_dog(good_with_children = "yes")

        score, warning, label = children_compatibility(adopter, dog)
        assert score == 1.0
        assert warning is None
        assert label == "not_weighed"

    def test_if_adopter_has_children_and_dog_good_with_children(self):
        adopter = make_adopter(children = True, youngest_child_age = "5_12")
        dog = make_dog(good_with_children = "yes", children_age = "any")

        score, warning, label = children_compatibility(adopter, dog)
        assert score == 1.0
        assert warning is None
        assert label == "known_compatible"

    def test_if_adopter_has_children_and_dog_good_with_children_age_match(self):
        adopter = make_adopter(children = True, youngest_child_age = "5_12")
        dog = make_dog(good_with_children = "yes", children_age = "5_12")

        score, warning, label = children_compatibility(adopter, dog)
        assert score == 1.0
        assert warning is None
        assert label == "known_compatible"

    def test_if_adopter_has_children_and_dog_children_age_doesnt_match(self):
        adopter = make_adopter(children = True, youngest_child_age = "5_12")
        dog = make_dog(good_with_children = "yes", children_age = "13_plus")

        score, warning, label = children_compatibility(adopter, dog)
        assert score == 0.0
        assert warning is None
        assert label == "not_compatible"

    def test_if_adopter_has_children_and_dog_children_age_unknown(self):
        adopter = make_adopter(children = True, youngest_child_age = "5_12")
        dog = make_dog(good_with_children = "yes", children_age = "unknown")

        score, warning, label = children_compatibility(adopter, dog)
        assert score == 0.75
        assert warning == "Unknown what exact age range dog is comfortable with"
        assert label == "age_unknown"

    def test_if_adopter_has_children_and_dog_unknown_with_children(self):
        adopter = make_adopter(children = True, youngest_child_age = "5_12")
        dog = make_dog(good_with_children = "unknown")

        score, warning, label = children_compatibility(adopter, dog)
        assert score == 0.5
        assert warning == "Unknown whether this dog is good with children"
        assert label == "unknown"

    def test_if_adopter_has_children_and_dog_not_good_with_children(self):
        adopter = make_adopter(children = True, youngest_child_age = "5_12")
        dog = make_dog(good_with_children = "no")

        score, warning, label = children_compatibility(adopter, dog)
        assert score == 0.0
        assert warning is None
        assert label == "not_compatible"