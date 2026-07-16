from schemas import Adopter, Dog

def cat_compatibility(adopter: Adopter, dog: Dog) -> tuple[float, str | None, str]:
    """
    If an adopter has cat as existing pet and dog is good with cats, score 1
    If an adopter has cat as existing pet and dog is unknown with cats, score 0.5 with warning flag
    Dog not good with cats is excluded by hard filter and therefore not scored
    """
    if "cat" not in adopter.current_pet_type:
        return 1.0, None, "not_weighed" #doesn't matter, weight will be 0
    if dog.good_with_cats == "yes":
        return 1.0, None, "known_compatible"
    if dog.good_with_cats == "unknown":
        return 0.5, "Unknown whether this dog is good with cats", "unknown"
    
    return 0.0, None, "not_compatible" #"no" defensive fallback, hard filter should exclude this