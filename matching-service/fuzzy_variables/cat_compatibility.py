import numpy as np
from schemas import Adopter, Dog

def cat_compatibility_batch(
        adopter: Adopter, dogs: list[Dog]
) -> tuple[np.ndarray, list[str | None], list[str]]:
    """
    If an adopter has cat as existing pet and dog is good with cats, score 1
    If an adopter has cat as existing pet and dog is unknown with cats, score 0.5 with warning flag
    Dog not good with cats is excluded by hard filter and therefore not scored

    If the adopter has no cat, every dog scores 1 with label "not_weighed" regardless of that dog's good_with_cats value, since the weight for this variable will be 0 in that case

    Dogs are scored positionally: dogs[i] corresponds to scores[i],
    warnings[i], and labels[i] in the returned tuple. Callers must not
    reorder dogs between calling this function and consuming its output.
    """
    ### AI-assisted (Claude) - Vectorisation from scalar cat_compatibility function 
    ### Format learned here used across rest of compatibility functions (dog + children) without AI assistance ###
    if "cat" not in adopter.current_pet_type:
        scores = np.ones(len(dogs))
        labels = ["not_weighed"] * len(dogs)
        warnings = [None] * len(dogs)
        return scores, warnings, labels
    
    good_with_cats = np.array([dog.good_with_cats for dog in dogs])

    conditions = [
        good_with_cats == "yes",
        good_with_cats == "unknown",
    ]

    scores = np.select(conditions, [1.0, 0.5], default=0.0)
    labels = np.select(
        conditions, ["known_compatible", "unknown"], default = "not_compatible"
    ).tolist()

    warnings = [
        "Unknown whether this dog is good with cats" if status == "unknown" else None
        for status in good_with_cats
    ]

    return scores, warnings, labels