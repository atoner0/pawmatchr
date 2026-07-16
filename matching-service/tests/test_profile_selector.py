from tests.helpers import make_adopter

from weighting.profile_selector import select_profile

class TestSelectProfile:
    def test_first_time_owner_no_pets(self):
        adopter = make_adopter(first_time_owner=True, current_pets=False)

        assert select_profile(adopter) == "first_time_no_pets"

    def test_first_time_owner_has_pets(self):
        adopter = make_adopter(first_time_owner=True, current_pets=True, current_pet_type = ["dog"])

        assert select_profile(adopter) == "first_time_multi_pet"

    def test_experienced_owner_no_pets(self):
        adopter = make_adopter(first_time_owner=False, current_pets=False)

        assert select_profile(adopter) == "experienced_no_pets"

    def test_experienced_owner_has_pets(self):
        adopter = make_adopter(first_time_owner=False, current_pets=True, current_pet_type = ["dog"])

        assert select_profile(adopter) == "experienced_multi_pet"   

