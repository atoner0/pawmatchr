import numpy as np
from schemas import Adopter, Dog
from membership_functions.triangular import triangular_batch
from fuzzy_variables.constants import HOURS_UPPER_BOUND

def alone_tolerance_compatibility(
        adopter: Adopter, dog: Dog
    ) -> tuple[float, str | None, str]:
    """
    Scalar wrapper around alone_tolerance_compatibility_batch, scoring a single adopter/dog pair

    Temporary scaffolding for the batch migration
    """
    
    scores, warnings, labels = alone_tolerance_compatibility_batch(adopter, [dog])
    return float(scores[0]), warnings[0], labels[0]

def alone_tolerance_compatibility_batch(
        adopter: Adopter, dogs: list[Dog]
) -> tuple[np.ndarray, list[None], list[str]]:
    """
    Batch version of alone_tolerance_compatibility, scoring one adopter
    against many dogs in a single call.

    Hourly bands converted to upper band, treating time left alone as the
    maximum for each case.

    Gap calculated as the adopter upper bound - dog upper bound
    Gap <= 0, score 1
    Gap >= 1, score 0
    A negative gap will always score 1

    Note: given band spacing (minimum 2-hour steps) is wider than c=1, this
    behaves as a hard cutoff rather than a graduated score in practice -
    intentional, since exceeding a dog's alone-tolerance limit is treated
    as a welfare concern rather than a soft mismatch.

    Dogs are scored positionally: dogs[i] corresponds to scores[i],
    warnings[i], and labels[i] in the returned tuple. Callers must not
    reorder dogs between calling this function and consuming its output.

    This variable never produces a warning, so warnings is always a list
    of None matching the length of dogs - kept in the return signature for
    consistency with other fuzzy variables that do produce warnings.
    """
    adopter_hours = HOURS_UPPER_BOUND[adopter.hours_alone]
    dog_hours = np.array(
        [HOURS_UPPER_BOUND[dog.alone_tolerance] for dog in dogs], dtype=float
    )

    gap = adopter_hours - dog_hours
    gap = np.maximum(gap, 0.0) #negative gap gets clamped to score 1

    scores = triangular_batch(gap, a = 0, b = 0, c = 1)

    labels = np.where(gap <= 0, "within_tolerance", "exceeds_tolerance").tolist()
    warnings = [None] * len(dogs)

    return scores, warnings, labels
