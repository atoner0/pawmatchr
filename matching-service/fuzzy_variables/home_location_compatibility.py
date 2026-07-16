from schemas import Adopter, Dog
from weighting.weight_adjustments import LOCATION_FLAGS, LOCATION_TRIGGERS

def home_location_compatibility(adopter: Adopter, dog: Dog) -> tuple[float, str | None, str]:
    """
    Checks if dog has any location-relevant behavioural flags/known triggers

    If none present, all locations score 1.0
    If one or more present, score depends on home location
        Rural, score 1
        Suburban, score 0.75 with warning flag
        Urban, score 0.25 with warning flag
    """
    has_relevant_flag = any(f in LOCATION_FLAGS for f in dog.behavioural_flags)
    has_relevant_trigger = any(t in LOCATION_TRIGGERS for t in dog.known_triggers)

    if not has_relevant_flag and not has_relevant_trigger:
        return 1.0, None, "low_risk"
    
    if adopter.home_location == "rural":
        return 1.0, None, "low_risk"
    elif adopter.home_location == "suburban":
        return 0.75, "Dog has behavioural traits that may be affected by a suburban environment", "manageable"
    else:
        return 0.25, "Dog has behavioural traits that may be challenging in an urban environment", "high_risk"