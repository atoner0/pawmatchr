from tests.helpers import make_adopter, make_dog
from fuzzy_variables.home_location_compatibility import (
    home_location_compatibility_batch
)

class TestHomeLocationCompatibilityBatchScalarCases:
    def test_no_flags_or_triggers_present(self):
        adopter = make_adopter()
        dog = make_dog()

        scores, warnings, labels = home_location_compatibility_batch(adopter, [dog])
        assert scores[0] == 1.0
        assert warnings[0] is None
        assert labels[0] == "low_risk"

    def test_relevant_flags_adopter_rural(self):
        adopter = make_adopter(home_location = "rural")
        dog = make_dog(behavioural_flags = ["Excessive barking"])

        scores, warnings, labels = home_location_compatibility_batch(adopter, [dog])
        assert scores[0] == 1.0
        assert warnings[0] is None
        assert labels[0] == "low_risk"

    def test_relevant_flags_adopter_suburban(self):
        adopter = make_adopter(home_location = "suburban")
        dog = make_dog(behavioural_flags = ["Excessive barking"])

        scores, warnings, labels = home_location_compatibility_batch(adopter, [dog])
        assert scores[0] == 0.75
        assert warnings[0] == "Dog has behavioural traits that may be affected by a suburban environment"
        assert labels[0] == "manageable"

    def test_relevant_flags_adopter_urban(self):
        adopter = make_adopter(home_location = "urban")
        dog = make_dog(behavioural_flags = ["Excessive barking"])

        scores, warnings, labels = home_location_compatibility_batch(adopter, [dog])
        assert scores[0] == 0.25
        assert warnings[0] == "Dog has behavioural traits that may be challenging in an urban environment"
        assert labels[0] == "high_risk"

    def test_relevant_flags_and_triggers_adopter_urban(self):
        adopter = make_adopter(home_location = "urban")
        dog = make_dog(behavioural_flags = ["Excessive barking"], known_triggers = ["Strangers"])

        scores, warnings, labels = home_location_compatibility_batch(adopter, [dog])
        assert scores[0] == 0.25
        assert warnings[0] == "Dog has behavioural traits that may be challenging in an urban environment"
        assert labels[0] == "high_risk"

class TestHomeLocationCompatibilityBatch:
    def test_preserves_dog_order(self):
        adopter = make_adopter(home_location="urban")
        dogs = [
            make_dog(),  
            make_dog(behavioural_flags=["Excessive barking"]),  
            make_dog(known_triggers=["Strangers"]),  
        ]

        scores, warnings, labels = home_location_compatibility_batch(adopter, dogs)

        assert scores.tolist() == [1.0, 0.25, 0.25]
        assert labels == ["low_risk", "high_risk", "high_risk"]
        assert warnings == [
            None,
            "Dog has behavioural traits that may be challenging in an urban environment",
            "Dog has behavioural traits that may be challenging in an urban environment",
        ]

    def test_same_dog_different_adopter_locations(self):
        dog_with_flag = make_dog(behavioural_flags=["Excessive barking"])

        rural_scores, rural_warnings, rural_labels = home_location_compatibility_batch(
            make_adopter(home_location="rural"), [dog_with_flag]
        )
        suburban_scores, suburban_warnings, suburban_labels = home_location_compatibility_batch(
            make_adopter(home_location="suburban"), [dog_with_flag]
        )
        urban_scores, urban_warnings, urban_labels = home_location_compatibility_batch(
            make_adopter(home_location="urban"), [dog_with_flag]
        )

        assert rural_scores.tolist() == [1.0]
        assert rural_labels == ["low_risk"]

        assert suburban_scores.tolist() == [0.75]
        assert suburban_labels == ["manageable"]

        assert urban_scores.tolist() == [0.25]
        assert urban_labels == ["high_risk"]

    def test_empty_dog_list(self):
        adopter = make_adopter(home_location="urban")

        scores, warnings, labels = home_location_compatibility_batch(adopter, [])

        assert len(scores) == 0
        assert warnings == []
        assert labels == []