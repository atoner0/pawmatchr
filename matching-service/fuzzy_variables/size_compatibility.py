from schemas import Adopter, Dog

def size_compatibility(adopter: Adopter, dog: Dog) -> tuple[float, str | None]:
    """
    If an adopter has no size preference, score 1
    If dog's size is within adopter's selected preferences, score 1
    Otherwise, score 0
    """
    if "none" in adopter.size_pref:
        return 1.0, None
    elif dog.size in adopter.size_pref:
        return 1.0, None
    else: 
        return 0.0, None