from schemas import Adopter, Dog

def other_dog_compatibility(adopter: Adopter, dog: Dog) -> tuple[float, str | None]:
    """
    If an adopter has dog as existing pet and dog is good with dogs, score 1
    If an adopter has dog as existing pet and dog is unknown with dogs, score 0.5 with warning flag
    Dog not good with dogs is excluded by hard filter and therefore not scored
    """
    if "dog" not in adopter.current_pet_type:
        return 1.0, None #doesn't matter, weight will be 0
    if dog.good_with_dogs == "yes":
        return 1.0, None
    if dog.good_with_dogs == "unknown":
        return 0.5, "Unknown whether this dog is good with other dogs"
    
    return 0.0, None #"no" defensive fallback, hard filter should exclude this