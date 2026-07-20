import numpy as np
from schemas import Adopter, Dog

def size_compatibility(adopter: Adopter, dog: Dog) -> tuple[float, str | None, str]:
    """
    Scalar wrapper around size_compatibility_batch, scoring a single adopter/dog pair

    Temporary scaffolding for the batch migration
    """
    scores, warnings, labels = size_compatibility_batch(adopter, [dog])
    return float(scores[0]), warnings[0], labels[0]
    
def size_compatibility_batch(
        adopter: Adopter, dogs: list[Dog]
) -> tuple[np.ndarray, list[None], list[str]]:
    """
    Batch version of size_compatibility, scoring one adopter against many dogs in a single call

    If an adopter has no size preference, score 1
    If dog's size is within adopter's selected preferences, score 1
    Otherwise, score 0

    Dogs are scored positionally: dogs[i] corresponds to scores[i],
    warnings[i], and labels[i] in the returned tuple. Callers must not
    reorder dogs between calling this function and consuming its output.

    This variable never produces a warning, so warnings is always a list
    of None matching the length of dogs.
    """
    if "none" in adopter.size_pref:
        scores = np.ones(len(dogs))
        labels = ["match"] * len(dogs)
    else:
        dog_sizes = np.array([dog.size for dog in dogs])
        matches = np.isin(dog_sizes, adopter.size_pref)
        scores = matches.astype(float)
        labels = np.where(matches, "match", "no_match").tolist()

    warnings = [None] * len(dogs)

    return scores, warnings, labels