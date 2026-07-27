from tests.helpers import make_adopter, make_dog
from fuzzy_variables.home_type_compatibility import (
    home_type_compatibility_batch
)

class TestHomeTypeCompatibilityBatchScalarCases:
    def test_high_activity_detached(self):
        adopter = make_adopter(home_type = "detached")
        dog = make_dog(activity_level = "high")

        scores, warnings, labels = home_type_compatibility_batch(adopter, [dog])
        assert scores[0] == 1.0
        assert warnings[0] is None
        assert labels[0] == "ideal"

    def test_high_activity_semi_detached(self):
        adopter = make_adopter(home_type = "semi-detached")
        dog = make_dog(activity_level = "high")

        scores, warnings, labels = home_type_compatibility_batch(adopter, [dog])
        assert scores[0] == 0.75
        assert warnings[0] is None
        assert labels[0] == "acceptable"

    def test_high_activity_apartment(self):
        adopter = make_adopter(home_type = "apartment")
        dog = make_dog(activity_level = "high")

        scores, warnings, labels = home_type_compatibility_batch(adopter, [dog])
        assert scores[0] == 0.0
        assert warnings[0] is None
        assert labels[0] == "not_acceptable"

    def test_medium_size_detached(self):
        adopter = make_adopter(home_type = "detached")
        dog = make_dog(size = "medium")

        scores, warnings, labels = home_type_compatibility_batch(adopter, [dog])
        assert scores[0] == 1.0
        assert warnings[0] is None
        assert labels[0] == "ideal"

    def test_medium_size_semi_detached(self):
        adopter = make_adopter(home_type = "semi-detached")
        dog = make_dog(size = "medium")

        scores, warnings, labels = home_type_compatibility_batch(adopter, [dog])
        assert scores[0] == 1.0
        assert warnings[0] is None
        assert labels[0] == "ideal"

    def test_medium_size_apartment(self):
        adopter = make_adopter(home_type = "apartment")
        dog = make_dog(size = "medium")

        scores, warnings, labels = home_type_compatibility_batch(adopter, [dog])
        assert scores[0] == 0.5
        assert warnings[0] is None
        assert labels[0] == "poor"

    def test_small_size_low_activity(self):
        adopter = make_adopter(home_type = "apartment")
        dog = make_dog(size = "small", activity_level = "low")

        scores, warnings, labels = home_type_compatibility_batch(adopter, [dog])
        assert scores[0] == 1.0
        assert warnings[0] is None
        assert labels[0] == "ideal"

    def test_small_size_high_activity_apartment(self):
        adopter = make_adopter(home_type = "apartment")
        dog = make_dog(size = "small", activity_level = "high")

        scores, warnings, labels = home_type_compatibility_batch(adopter, [dog])
        assert scores[0] == 0.0
        assert warnings[0] is None
        assert labels[0] == "not_acceptable"

class TestHomeTypeCompatibilityBatch:
    def test_preserves_dog_order_across_tiers(self):
        adopter = make_adopter(home_type="semi-detached")
        dogs = [
            make_dog(activity_level="very_high", size="medium"),  
            make_dog(activity_level="medium", size="small"),      
            make_dog(activity_level="low", size="small"),         
        ]

        scores, warnings, labels = home_type_compatibility_batch(adopter, dogs)

        assert scores.tolist() == [0.75, 1.0, 1.0]
        assert labels == ["acceptable", "ideal", "ideal"]
        assert warnings == [None, None, None]

    def test_high_demand_dog_all_home_types(self):
        dog = make_dog(activity_level="high", size="small")

        detached_scores, _, detached_labels = home_type_compatibility_batch(
            make_adopter(home_type="detached"), [dog]
        )
        semi_scores, _, semi_labels = home_type_compatibility_batch(
            make_adopter(home_type="semi-detached"), [dog]
        )
        apartment_scores, _, apartment_labels = home_type_compatibility_batch(
            make_adopter(home_type="apartment"), [dog]
        )

        assert detached_scores.tolist() == [1.0] and detached_labels == ["ideal"]
        assert semi_scores.tolist() == [0.75] and semi_labels == ["acceptable"]
        assert apartment_scores.tolist() == [0.0] and apartment_labels == ["not_acceptable"]

    def test_high_demand_by_size_alone(self):
        adopter = make_adopter(home_type="apartment")
        dog = make_dog(activity_level="low", size="giant")

        scores, warnings, labels = home_type_compatibility_batch(adopter, [dog])

        assert scores.tolist() == [0.0]
        assert labels == ["not_acceptable"]

    def test_empty_dog_list(self):
        adopter = make_adopter(home_type="detached")

        scores, warnings, labels = home_type_compatibility_batch(adopter, [])

        assert len(scores) == 0
        assert warnings == []
        assert labels == []