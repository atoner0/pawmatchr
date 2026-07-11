from schemas import Adopter

def select_profile(adopter: Adopter) -> str:
    if adopter.first_time_owner:
        return "first_time_multi_pet" if adopter.current_pets else "first_time_no_pets" 
    return "experienced_multi_pet" if adopter.current_pets else "experienced_no_pets"
        
