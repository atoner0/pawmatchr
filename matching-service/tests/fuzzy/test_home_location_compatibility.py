from tests.helpers import make_adopter, make_dog
from fuzzy_variables.home_location_compatibility import home_location_compatibility

class TestHomeLocationCompatibility:
    def test_no_flags_or_triggers_present(self):
        adopter = make_adopter()
        dog = make_dog()

        score, warning = home_location_compatibility(adopter, dog)
        assert score == 1.0
        assert warning is None

    def test_relevant_flags_adopter_rural(self):
        adopter = make_adopter(home_location = "rural")
        dog = make_dog(behavioural_flags = ["Excessive barking"])

        score, warning = home_location_compatibility(adopter, dog)
        assert score == 1.0
        assert warning is None

    def test_relevant_flags_adopter_suburban(self):
        adopter = make_adopter(home_location = "suburban")
        dog = make_dog(behavioural_flags = ["Excessive barking"])

        score, warning = home_location_compatibility(adopter, dog)
        assert score == 0.75
        assert warning == "Dog has behavioural traits that may be affected by a suburban environment"

    def test_relevant_flags_adopter_urban(self):
        adopter = make_adopter(home_location = "urban")
        dog = make_dog(behavioural_flags = ["Excessive barking"])

        score, warning = home_location_compatibility(adopter, dog)
        assert score == 0.25
        assert warning == "Dog has behavioural traits that may be challenging in an urban environment"

    def test_relevant_flags_and_triggers_adopter_urban(self):
        adopter = make_adopter(home_location = "urban")
        dog = make_dog(behavioural_flags = ["Excessive barking"], known_triggers = ["Strangers"])

        score, warning = home_location_compatibility(adopter, dog)
        assert score == 0.25
        assert warning == "Dog has behavioural traits that may be challenging in an urban environment"