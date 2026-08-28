import numpy as np
from schemas import Adopter, Dog

def age_compatibility_batch(
        adopter: Adopter, dogs: list[Dog]
) -> tuple[np.ndarray, list[None], list[str]]:
    """
    If an adopter has no age preference, score 1
    If dog's age band is within adopter's selected preferences, score 1
    Otherwise, score 0

    Dogs are scored positionally: dogs[i] corresponds to scores[i],
    warnings[i], and labels[i] in the returned tuple. Callers must not
    reorder dogs between calling this function and consuming its output.

    This variable never produces a warning, so warnings is always a list
    of None matching the length of dogs.
    """
    ### AI-assisted (Claude) - Vectorisation from scalar age_compatibility function 
    ### Format learned here used across rest of binary functions without AI assistance ###
    if "none" in adopter.age_pref:
        scores = np.ones(len(dogs))
        labels = ["match"] * len(dogs)
    else:
        dog_ages = np.array([dog.age for dog in dogs])
        matches = np.isin(dog_ages, adopter.age_pref)
        scores = matches.astype(float)
        labels = np.where(matches, "match", "no_match").tolist()

    warnings = [None] * len(dogs)

    return scores, warnings, labels