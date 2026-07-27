import numpy as np
from schemas import Adopter, Dog
from fuzzy_variables.constants import OUTDOOR_SPACE_SCORE, OUTDOOR_SPACE_LABEL

def outdoor_space_compatibility_batch(
        adopter: Adopter, dogs: list[Dog]
) -> tuple[np.ndarray, list[None], list[str]]:
    """
    Batch version of outdoor_space_compatibility, scoring one adopter against many dogs in a single call

    Adopter's outdoor space maps directly to a fixed score. List of dogs used to determine batch length.

    Dog activity level/size do affect this variable's weight, but this is handled in weight_adjustments.py

    Dogs are scored positionally: dogs[i] corresponds to scores[i],
    warnings[i], and labels[i] in the returned tuple. Callers must not
    reorder dogs between calling this function and consuming its output
    """
    score = OUTDOOR_SPACE_SCORE[adopter.outdoor_space]
    label = OUTDOOR_SPACE_LABEL[adopter.outdoor_space]

    scores = np.full(len(dogs), score, dtype=float)
    labels = [label] * len(dogs)
    warnings = [None] * len(dogs)

    return scores, warnings, labels