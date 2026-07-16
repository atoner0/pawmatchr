import pytest
from pydantic import ValidationError
from schemas import Adopter, Dog
from tests.helpers import make_adopter, make_dog

class TestAdopterSchema:
    def test_valid_adopter(self):
        adopter = make_adopter()

        assert adopter.home_type == "semi-detached"

    def test_invalid_home_type_raises(self):
        with pytest.raises(ValidationError):
            make_adopter(home_type="mansion")

    def test_optional_fields_can_be_none(self):
        adopter = make_adopter(multi_pet_exp_level=None)
        
        assert adopter.multi_pet_exp_level is None

    def test_invalid_current_pet_type_value_raises(self):
        with pytest.raises(ValidationError):
            make_adopter(current_pet_type=["dog", "dragon"])

class TestDogSchema:
    def test_valid_dog(self):
        dog = make_dog()

        assert dog.size == "medium"

    def test_invalid_dog_size_raises(self):
        with pytest.raises(ValidationError):
            make_dog(size="tiny")
    
    def test_children_age_can_be_none(self):
        dog = make_dog(children_age=None)

        assert dog.children_age is None

    def test_invalid_behavioural_flag_value_raises(self):
        with pytest.raises(ValidationError):
            make_dog(behavioural_flags=["Pulls on lead", "Breaths fire"])
