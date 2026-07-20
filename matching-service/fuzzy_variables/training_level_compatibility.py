import numpy as np
from schemas import Adopter, Dog
from fuzzy_variables.constants import DOG_TRAINING_RANK, ADOPTER_COMMITMENT_RANK


def training_level_compatibility(adopter: Adopter, dog: Dog) -> tuple[float, str | None, str]:
    """
    Scalar wrapper around training_level_compatibility_batch, scoring a single adopter/dog pair.

    Temporary scaffolding for the batch migration
    """
    scores, warnings, labels = training_level_compatibility_batch(adopter, [dog])
    return float(scores[0]), warnings[0], labels[0]
    
def training_level_compatibility_batch(
        adopter: Adopter, dogs: list[Dog]
) -> tuple[np.ndarray, list[None], list[str]]:
    """
    Batch version of training_level_compatibility, scoring one adopter against many dogs in a single call

    Ordinal comparison between adopter's training commitment and dog's training requirement

    Adopter commitment meets/exceeds dog's requirement, score 1
    One level below, score 0.5
    Two/more levels below, score 0

    Dogs are scored positionally: dogs[i] corresponds to scores[i],
    warnings[i], and labels[i] in the returned tuple. Callers must not
    reorder dogs between calling this function and consuming its output.
    """
    adopter_rank = ADOPTER_COMMITMENT_RANK[adopter.training_commitment]
    dog_ranks = np.array([DOG_TRAINING_RANK[dog.training_level] for dog in dogs])

    gap = dog_ranks - adopter_rank

    conditions = [gap <= 0, gap == 1]
    scores = np.select(conditions, [1.0, 0.5], default=0.0)
    labels = np.select(
        conditions, ["meets_requirement", "one_level_below"], default="far_below"
    ).tolist()

    warnings = [None] * len(dogs)

    return scores, warnings, labels

