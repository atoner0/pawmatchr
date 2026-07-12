from schemas import Adopter, Dog
from fuzzy_variables.constants import OUTDOOR_SPACE_SCORE

def outdoor_space_compatibility(adopter: Adopter, dog: Dog) -> tuple[float, str | None]:
    """
    Adopter's outdoor space maps directly to a fixed score
    """
    return OUTDOOR_SPACE_SCORE[adopter.outdoor_space], None