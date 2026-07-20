import numpy as np
from schemas import Adopter, Dog
from weighting.weight_adjustments import LOCATION_FLAGS, LOCATION_TRIGGERS

def home_location_compatibility(adopter: Adopter, dog: Dog) -> tuple[float, str | None, str]:
    """
    Scalar wrapper around home_location_compatibility_batch, scoring a single adopter/dog pair.

    Temporary scaffolding for the batch migration
    """
    scores, warnings, labels = home_location_compatibility_batch(adopter, [dog])
    return float(scores[0]), warnings[0], labels[0]
    
def home_location_compatibility_batch(
        adopter: Adopter, dogs: list[Dog]
) -> tuple[np.ndarray, list[str | None], list[str]]:
    """
    Batch version of home_location_compatibility, scoring one adopter against many dogs in a single call

    Checks if dog has any location-relevant behavioural flags/known triggers

    If none present, all locations score 1.0
    If one or more present, score depends on home location
        Rural, score 1
        Suburban, score 0.75 with warning flag
        Urban, score 0.25 with warning flag

    Behavioural_flags/known_triggers are variable-length lists per dog, so the flag/trigger membership check is done per-dog via list comprehension rather than a vectorised array op
        only the resulting boolean per dog is converted to an array.

    Dogs are scored positionally: dogs[i] corresponds to scores[i],
    warnings[i], and labels[i] in the returned tuple. Callers must not
    reorder dogs between calling this function and consuming its output.
    """
    has_relevant = np.array([
        any(f in LOCATION_FLAGS for f in dog.behavioural_flags)
        or any(t in LOCATION_TRIGGERS for t in dog.known_triggers)
        for dog in dogs
    ])

    if adopter.home_location == "rural":
        location_score, location_warning, location_label = 1.0, None, "low_risk"
    elif adopter.home_location == "suburban":
        location_score, location_warning, location_label = 0.75, "Dog has behavioural traits that may be affected by a suburban environment", "manageable"
    else:
        location_score, location_warning, location_label = 0.25, "Dog has behavioural traits that may be challenging in an urban environment", "high_risk"

    scores = np.where(has_relevant, location_score, 1.0)
    labels = np.where(has_relevant, location_label, "low_risk").tolist()
    warnings = [location_warning if relevant else None for relevant in has_relevant]

    return scores, warnings, labels