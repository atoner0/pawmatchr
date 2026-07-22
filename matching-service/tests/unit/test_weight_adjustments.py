from tests.helpers import make_adopter, make_dog

from weighting.weight_adjustments import (
    adjust_dog_compatibility_weight,
    adjust_cat_compatibility_weight,
    adjust_child_compatibility_weight,
    adjust_training_level_weight,
    adjust_outdoor_space_weight,
    adjust_home_type_weight,
    adjust_home_location_weight,
    EXTENSIVE_MULTI_PET_MODIFIER,
    SEVERAL_MULTI_PET_MODIFIER,
    ONCE_TWICE_MULTI_PET_MODIFIER,
    FIRST_TIME_MULTI_PET_MODIFIER,
    FIRST_TIME_OWNER_MODIFIER,
    EXPERIENCED_OWNER_MODIFIER,
    OUTDOOR_HIGH_ACTIVITY_MODIFIER,
    OUTDOOR_LOW_ACTIVITY_MODIFIER,
    OUTDOOR_LARGE_SIZE_MODIFIER,
    HOME_LARGE_SIZE_MODIFIER,
    HOME_HIGH_ACTIVITY_MODIFIER,
    HOME_LOW_ACTIVITY_MODIFIER,
)

class TestDogCompatibilityAdjustment:
    def test_no_weight_when_adopter_has_no_dog(self):
        adopter = make_adopter(current_pet_type=[])

        assert adjust_dog_compatibility_weight(1.0, adopter) == 0.0

    def test_first_time_multi_pet_weight_adjustment(self):
        adopter = make_adopter(current_pet_type=["dog"],  multi_pet_exp=False)

        assert adjust_dog_compatibility_weight(1.0, adopter) == FIRST_TIME_MULTI_PET_MODIFIER

    def test_multi_pet_extensive_exp_weight_adjustment(self):
        adopter = make_adopter(current_pet_type=["dog"], multi_pet_exp=True, multi_pet_exp_level="extensive")

        assert adjust_dog_compatibility_weight(1.0, adopter) == EXTENSIVE_MULTI_PET_MODIFIER

    def test_multi_pet_several_exp_weight_adjustment(self):
        adopter = make_adopter(current_pet_type=["dog"], multi_pet_exp=True, multi_pet_exp_level="several")

        assert adjust_dog_compatibility_weight(1.0, adopter) == SEVERAL_MULTI_PET_MODIFIER

    def test_multi_pet_once_twice_exp_weight_adjustment(self):
        adopter = make_adopter(current_pet_type=["dog"], multi_pet_exp=True, multi_pet_exp_level="once_twice")

        assert adjust_dog_compatibility_weight(1.0, adopter) == ONCE_TWICE_MULTI_PET_MODIFIER

    def test_case_of_level_missing(self):
        adopter = make_adopter(current_pet_type=["dog"], multi_pet_exp=True, multi_pet_exp_level=None)

        assert adjust_dog_compatibility_weight(1.0, adopter) == 1.0

class TestCatCompatibilityAdjustment:
    def test_no_weight_when_adopter_has_no_cat(self):
        adopter = make_adopter(current_pet_type=[])

        assert adjust_cat_compatibility_weight(1.0, adopter) == 0.0

    def test_first_time_multi_pet_weight_adjustment(self):
        adopter = make_adopter(current_pet_type=["cat"],  multi_pet_exp=False)

        assert adjust_cat_compatibility_weight(1.0, adopter) == FIRST_TIME_MULTI_PET_MODIFIER

    def test_multi_pet_extensive_exp_weight_adjustment(self):
        adopter = make_adopter(current_pet_type=["cat"], multi_pet_exp=True, multi_pet_exp_level="extensive")

        assert adjust_cat_compatibility_weight(1.0, adopter) == EXTENSIVE_MULTI_PET_MODIFIER

    def test_multi_pet_several_exp_weight_adjustment(self):
        adopter = make_adopter(current_pet_type=["cat"], multi_pet_exp=True, multi_pet_exp_level="several")

        assert adjust_cat_compatibility_weight(1.0, adopter) == SEVERAL_MULTI_PET_MODIFIER

    def test_multi_pet_once_twice_exp_weight_adjustment(self):
        adopter = make_adopter(current_pet_type=["cat"], multi_pet_exp=True, multi_pet_exp_level="once_twice")

        assert adjust_cat_compatibility_weight(1.0, adopter) == ONCE_TWICE_MULTI_PET_MODIFIER

    def test_case_of_level_missing(self):
        adopter = make_adopter(current_pet_type=["cat"], multi_pet_exp=True, multi_pet_exp_level=None)

        assert adjust_cat_compatibility_weight(1.0, adopter) == 1.0

class TestChildCompatibilityAdjustment:
    def test_no_weight_when_adopter_has_no_children(self):
        adopter = make_adopter(children=False)

        assert adjust_child_compatibility_weight(1.0, adopter) == 0.0

    def test_no_adjustment_when_adopter_has_children(self):
        adopter = make_adopter(children=True)

        assert adjust_child_compatibility_weight(1.0, adopter) == 1.0

class TestTrainingLevelAdjustment:
    def test_first_time_owner_weight_adjustment(self):
        adopter = make_adopter(first_time_owner=True)

        assert adjust_training_level_weight(1.0, adopter) == FIRST_TIME_OWNER_MODIFIER

    def test_experienced_owner_no_adjustment(self):
        adopter = make_adopter(first_time_owner=False)

        assert adjust_training_level_weight(1.0, adopter) == 1.0

class TestOutdoorSpaceAdjustment:
    def test_high_dog_activity_weight_adjustment(self):
        dog = make_dog(activity_level="high", size="medium")

        assert adjust_outdoor_space_weight(1.0, dog) == OUTDOOR_HIGH_ACTIVITY_MODIFIER

    def test_low_dog_activity_weight_adjustment(self):
        dog = make_dog(activity_level="low", size="medium")

        assert adjust_outdoor_space_weight(1.0, dog) == OUTDOOR_LOW_ACTIVITY_MODIFIER

    def test_no_weight_adjustment(self):
        dog = make_dog(activity_level="medium", size="medium")

        assert adjust_outdoor_space_weight(1.0, dog) == 1.0

    def test_large_dog_size_weight_adjustment(self):
        dog = make_dog(activity_level="medium", size="large")

        assert adjust_outdoor_space_weight(1.0, dog) == OUTDOOR_LARGE_SIZE_MODIFIER

    def test_large_size_high_activity_dog_weight_adjustment(self):
        dog = make_dog(activity_level="low", size="large")

        assert adjust_outdoor_space_weight(1.0, dog) == OUTDOOR_LOW_ACTIVITY_MODIFIER * OUTDOOR_LARGE_SIZE_MODIFIER

    def test_large_size_low_activity_dog_weight_adjustment(self):
        dog = make_dog(activity_level="high", size="large")

        assert adjust_outdoor_space_weight(1.0, dog) == OUTDOOR_HIGH_ACTIVITY_MODIFIER * OUTDOOR_LARGE_SIZE_MODIFIER

class TestHomeTypeAdjustment:
    def test_high_dog_activity_weight_adjustment(self):
        dog = make_dog(activity_level="high", size="medium")

        assert adjust_home_type_weight(1.0, dog) == HOME_HIGH_ACTIVITY_MODIFIER

    def test_low_dog_activity_weight_adjustment(self):
        dog = make_dog(activity_level="low", size="medium")

        assert adjust_home_type_weight(1.0, dog) == HOME_LOW_ACTIVITY_MODIFIER

    def test_no_weight_adjustment(self):
        dog = make_dog(activity_level="medium", size="medium")

        assert adjust_home_type_weight(1.0, dog) == 1.0

    def test_large_dog_size_weight_adjustment(self):
        dog = make_dog(activity_level="medium", size="large")

        assert adjust_home_type_weight(1.0, dog) == HOME_LARGE_SIZE_MODIFIER

    def test_large_size_high_activity_dog_weight_adjustment(self):
        dog = make_dog(activity_level="high", size="large")

        assert adjust_home_type_weight(1.0, dog) == HOME_LARGE_SIZE_MODIFIER * HOME_HIGH_ACTIVITY_MODIFIER

    def test_large_size_low_activity_dog_weight_adjustment(self):
        dog = make_dog(activity_level="low", size="large")

        assert adjust_home_type_weight(1.0, dog) == HOME_LARGE_SIZE_MODIFIER * HOME_LOW_ACTIVITY_MODIFIER

class TestHomeLocationAdjustment:
    def test_no_weight_when_no_flags(self):
        dog = make_dog(behavioural_flags=[], known_triggers=[])
        adopter = make_adopter()

        assert adjust_home_location_weight(1.0, adopter, dog) == 0.0

    def test_experienced_owner_intensive_training_weight_adjustment(self):
        dog = make_dog(behavioural_flags=["Excessive barking"], known_triggers=[])
        adopter = make_adopter(first_time_owner=False, training_commitment="intensive")

        assert adjust_home_location_weight(1.0, adopter, dog) == EXPERIENCED_OWNER_MODIFIER

    def test_first_time_owner_weight_adjustment(self):
        dog = make_dog(behavioural_flags=["Excessive barking"], known_triggers=[])
        adopter = make_adopter(first_time_owner=True)

        assert adjust_home_location_weight(1.0, adopter, dog) == FIRST_TIME_OWNER_MODIFIER

    def test_no_weight_when_flags_not_location_related(self):
        dog = make_dog(behavioural_flags=["Pulls on lead"], known_triggers=["Fast movement"])
        adopter = make_adopter()

        assert adjust_home_location_weight(1.0, adopter, dog) == 0.0

    def test_no_weight_adjustment_flag(self):
        dog = make_dog(behavioural_flags=["Excessive barking"], known_triggers=[])
        adopter = make_adopter(first_time_owner=False, training_commitment="basic")

        assert adjust_home_location_weight(1.0, adopter, dog) == 1.0

    def test_no_weight_adjustment_trigger(self):
        dog = make_dog(behavioural_flags=[], known_triggers=["Loud noises"])
        adopter = make_adopter(first_time_owner=False, training_commitment="basic")

        assert adjust_home_location_weight(1.0, adopter, dog) == 1.0
    