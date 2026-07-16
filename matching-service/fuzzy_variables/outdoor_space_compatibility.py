from schemas import Adopter, Dog
from fuzzy_variables.constants import OUTDOOR_SPACE_SCORE, OUTDOOR_SPACE_LABEL

def outdoor_space_compatibility(adopter: Adopter, dog: Dog) -> tuple[float, str | None, str]:
    """
    Adopter's outdoor space maps directly to a fixed score
    """
    return OUTDOOR_SPACE_SCORE[adopter.outdoor_space], None, OUTDOOR_SPACE_LABEL[adopter.outdoor_space]