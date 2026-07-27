import numpy as np
from schemas import Adopter, Dog

def home_type_compatibility_batch(
        adopter: Adopter, dogs: list[Dog]
) -> tuple[np.ndarray, list[None], list[str]]:
    """
    Batch version of home_type_compatibility, scoring one adopter against many dogs in a single call

    Dog's activity level and size both determine how demanding a home type is required.

    If dog activity level is high/very high OR dog size is large/giant:
        Detached = 1.0, Semi-detached = 0.75, Apartment = 0.0

    If dog activity level is medium/moderate OR dog size is medium:
        Detached = 1.0, Semi-detached = 1.0, Apartment = 0.5

    If dog activity level is low AND dog size is small:
        All home types = 1.0

    Dogs are scored positionally: dogs[i] corresponds to scores[i],
    warnings[i], and labels[i] in the returned tuple. Callers must not
    reorder dogs between calling this function and consuming its output.
    """
    activity_level = np.array([dog.activity_level for dog in dogs])
    size = np.array([dog.size for dog in dogs])

    high_demand = np.isin(activity_level, ["high", "very_high"]) | np.isin(size, ["large", "giant"])
    medium_demand = ~high_demand & np.isin(activity_level, ["medium", "moderate"]) | (size == "medium") #~ is numpy's not operator

    if adopter.home_type == "detached":
        high_score, high_label = 1.0, "ideal"
    elif adopter.home_type == "semi-detached":
        high_score, high_label = 0.75, "acceptable"
    else:
        high_score, high_label = 0.0, "not_acceptable"
    
    if adopter.home_type in ("detached", "semi-detached"):
        medium_score, medium_label = 1.0, "ideal"
    else:
        medium_score, medium_label = 0.5, "poor"

    conditions = [high_demand, medium_demand]

    scores = np.select(conditions, [high_score, medium_score], default = 1.0)
    labels = np.select(conditions, [high_label, medium_label], default="ideal").tolist()
    warnings = [None] * len(dogs)

    return scores, warnings, labels