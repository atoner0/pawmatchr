from tests.helpers import make_adopter, make_dog
from fuzzy_variables.home_type_compatibility import home_type_compatibility

class TestHomeTypeCompatibility:
    def test_high_activity_detached(self):
        adopter = make_adopter(home_type = "detached")
        dog = make_dog(activity_level = "high")

        score, warning = home_type_compatibility(adopter, dog)
        assert score == 1.0
        assert warning is None

    def test_high_activity_semi_detached(self):
        adopter = make_adopter(home_type = "semi-detached")
        dog = make_dog(activity_level = "high")

        score, warning = home_type_compatibility(adopter, dog)
        assert score == 0.75
        assert warning is None

    def test_high_activity_apartment(self):
        adopter = make_adopter(home_type = "apartment")
        dog = make_dog(activity_level = "high")

        score, warning = home_type_compatibility(adopter, dog)
        assert score == 0.0
        assert warning is None

    def test_medium_size_detached(self):
        adopter = make_adopter(home_type = "detached")
        dog = make_dog(size = "medium")

        score, warning = home_type_compatibility(adopter, dog)
        assert score == 1.0
        assert warning is None

    def test_medium_size_semi_detached(self):
        adopter = make_adopter(home_type = "semi-detached")
        dog = make_dog(size = "medium")

        score, warning = home_type_compatibility(adopter, dog)
        assert score == 1.0
        assert warning is None

    def test_medium_size_apartment(self):
        adopter = make_adopter(home_type = "apartment")
        dog = make_dog(size = "medium")

        score, warning = home_type_compatibility(adopter, dog)
        assert score == 0.5
        assert warning is None

    def test_small_size_low_activity(self):
        adopter = make_adopter(home_type = "apartment")
        dog = make_dog(size = "small", activity_level = "low")

        score, warning = home_type_compatibility(adopter, dog)
        assert score == 1.0
        assert warning is None

    def test_small_size_high_activity_apartment(self):
        adopter = make_adopter(home_type = "apartment")
        dog = make_dog(size = "small", activity_level = "high")

        score, warning = home_type_compatibility(adopter, dog)
        assert score == 0.0
        assert warning is None