from schemas import Adopter, Dog

def age_compatibility(adopter: Adopter, dog: Dog) -> tuple[float, str | None]:
    """
    If an adopter has no age preference, score 1
    If dog's age band is within adopter's selected preferences, score 1
    Otherwise, score 0
    """
    if "none" in adopter.age_pref:
        return 1.0, None
    elif dog.age in adopter.age_pref:
        return 1.0, None
    else:
        return 0.0, None