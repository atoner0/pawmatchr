from schemas import Adopter, Dog

OUTDOOR_SPACE_SCORE = {
    "large": 1.0,
    "medium": 0.75,
    "small": 0.25,
    "none": 0.0,
}

def outdoor_space_compatibility(adopter: Adopter, dog: Dog) -> tuple[float, str | None]:
    """
    Adopter's outdoor space maps directly to a fixed score
    """
    return OUTDOOR_SPACE_SCORE[adopter.outdoor_space], None