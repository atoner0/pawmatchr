from schemas import Adopter

MULTI_PET_TYPES = {"dog", "cat"}

def select_profile(adopter: Adopter) -> str:
    """
    Selects the weighting profile for an adopter based on prior dog ownership experience, and whether they currently have a dog or cat

    Adopters with other pet types (not dog/cat) are treated as "no pets" for profile purposes, since those pet types don't factor into the multi-pet weight adjustments
    """

    has_dog_or_cat = bool(MULTI_PET_TYPES & set(adopter.current_pet_type))

    if adopter.first_time_owner:
        return "first_time_multi_pet" if has_dog_or_cat else "first_time_no_pets" 
    return "experienced_multi_pet" if has_dog_or_cat else "experienced_no_pets"
        
