from schemas import Adopter, Dog
from fuzzy_variables.constants import SHEDDING_RANK

def shedding_level_compatibility(adopter: Adopter, dog: Dog) -> tuple[float, str | None, str]:
    """
    Adopter selects the maximum shedding level they can tolerate
    If adopter's rank >= dog's shedding rank, adopter can tolerate that much (or more), score 1
    Otherwise, score 0
    """
    dog_rank = SHEDDING_RANK[dog.shedding_level]
    adopter_rank = SHEDDING_RANK[adopter.shedding_pref]

    if adopter_rank >= dog_rank:
        return 1.0, None, "match"
    return 0.0, None, "no_match"
    