from schemas import Adopter, Dog

def fails_dog_filter(adopter: Adopter, dog: Dog) -> bool:
    """
    Hard filter: adopter owns a dog AND dog is not good with other dogs.
    Returns True if the pairing should be excluded
    """
    if "dog" not in adopter.current_pet_type:
        return False
    
    return dog.good_with_dogs == "no"

def fails_cat_filter(adopter: Adopter, dog: Dog) -> bool:
    """
    Hard filter: adopter owns a cat AND dog is not good with cats.
    Returns True if the pairing should be excluded
    """
    if "cat" not in adopter.current_pet_type:
        return False
    
    return dog.good_with_cats == "no"

def fails_children_filter(adopter: Adopter, dog: Dog) -> bool:
    """
    Hard filter: adopter has children AND dog is not good with children.
    Returns True if the pairing should be excluded
    """
    if not adopter.children:
        return False
    
    return dog.good_with_children == "no"

def fails_children_age_filter(adopter: Adopter, dog: Dog) -> bool:
    """
    Hard filter: dog is good with children, but the specific age range doesn't match the adopter's youngest child age
    """
    if not adopter.children:
        return False
    
    if dog.good_with_children != "yes":
        return False
    
    if dog.children_age in ("any", "unknown"):
        return False
    
    return dog.children_age != adopter.youngest_child_age


def apply_hard_filters(adopter: Adopter, dogs: list[Dog]) -> list[Dog]:
    filters = [
        fails_dog_filter,
        fails_cat_filter,
        fails_children_filter,
        fails_children_age_filter
    ]

    return [dog for dog in dogs if not any(f(adopter, dog) for f in filters)]
    
