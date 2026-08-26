import numpy as np
from schemas import Adopter, Dog
from membership_functions.trapezoidal import trapezoidal_batch
from fuzzy_variables.constants import ACTIVITY_LEVEL_MINS

def activity_level_compatibility_batch(
        adopter: Adopter, dogs: list[Dog]
) -> tuple[np.ndarray, list[None], list[str]]:
    """
    Activity level bands converted to minutes (upper bound of each range)

    Gap calculated as adopter's minutes - dog's minutes
    Gap <= -60: adopter far less active than dog, score 0
    -60 to -30: rising compatibility
    -30 to 30: ideal range, score 1
    30 to 120: falling compatibility (adopter more active than dog, penalised less harshly)
    Gap >= 120: score 0

    Dogs are scored positionally: dogs[i] corresponds to scores[i],
    warnings[i], and labels[i] in the returned tuple. Callers must not
    reorder dogs between calling this function and consuming its output.

    This variable never produces a warning, so warnings is always a list
    of None matching the length of dogs.
    """
    adopter_mins = ACTIVITY_LEVEL_MINS[adopter.activity_level]
    dog_mins = np.array(
        [ACTIVITY_LEVEL_MINS[dog.activity_level] for dog in dogs], dtype=float
    )

    gap = adopter_mins - dog_mins
    
    scores = trapezoidal_batch(gap, a = -60, b = -30, c = 30, d = 120)

    labels = np.where(
        scores >= 0.75,
        "aligned",
        np.where(gap < 0, "adopter_less_active", "adopter_more_active"),
    ).tolist()

    warnings = [None] * len(dogs)

    return scores, warnings, labels