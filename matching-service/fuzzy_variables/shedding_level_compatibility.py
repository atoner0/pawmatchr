import numpy as np
from schemas import Adopter, Dog
from fuzzy_variables.constants import SHEDDING_RANK

def shedding_level_compatibility_batch(
        adopter: Adopter, dogs: list[Dog]
) -> tuple[np.ndarray, list[None], list[str]]:
    """
    Adopter selects the maximum shedding level they can tolerate
    If adopter's rank >= dog's shedding rank, adopter can tolerate that much (or more), score 1
    Otherwise, score 0

    Dogs are scored positionally: dogs[i] corresponds to scores[i],
    warnings[i], and labels[i] in the returned tuple. Callers must not
    reorder dogs between calling this function and consuming its output.

    This variable never produces a warning, so warnings is always a list
    of None matching the length of dogs.
    """
    adopter_rank = SHEDDING_RANK[adopter.shedding_pref]
    dog_ranks = np.array([SHEDDING_RANK[dog.shedding_level] for dog in dogs])

    matches = adopter_rank >= dog_ranks
    scores = matches.astype(float)
    labels = np.where(matches, "match", "no_match").tolist()

    warnings = [None] * len(dogs)

    return scores, warnings, labels