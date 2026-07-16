from schemas import Adopter, Dog

def children_compatibility(adopter: Adopter, dog: Dog) -> tuple[float, str | None, str]:
    """
    If adopter has children and dog is good with children:
        If dog is good with any age, score 1
        If dog is good with age that matches adopter's youngest child age, score 1
        If dog's good with age range is unknown, score 0.75 with warning flag
        If dog is not good with age of adopter's youngest child, excluded by hard filter and not scored
    
    If adopter has children and dog is unknown with children, score 0.5 and warning flag (no age check)
    If adopter has children and dog is not good with children, excluded by hard filter and not scored
    """
    if not adopter.children:
        return 1.0, None, "not_weighed" #doesn't matter, weight will be 0

    if adopter.children and dog.good_with_children == "yes":
        if dog.children_age == "any":
            return 1.0, None, "known_compatible"
        elif dog.children_age == adopter.youngest_child_age:
            return 1.0, None, "known_compatible"
        elif dog.children_age == "unknown":
            return 0.75, "Unknown what exact age range dog is comfortable with", "age_unknown"
        else:
            return 0.0, None, "not_compatible"
        
    if adopter.children and dog.good_with_children == "unknown":
        return 0.5, "Unknown whether this dog is good with children", "unknown"
    
    return 0.0, None, "not_compatible" #"no" defensive fallback, hard filter should exclude this

    