import numpy as np
from schemas import Adopter, Dog

def children_compatibility_batch(
        adopter: Adopter, dogs: list[Dog]
) -> tuple[np.ndarray, list[str | None], list[str]]:
    """
    Batch version of children_compatibility, scoring one adopter against many dogs in a single call

    If adopter has children and dog is good with children:
        If dog is good with any age, score 1
        If dog is good with age that matches adopter's youngest child age, score 1
        If dog's good with age range is unknown, score 0.75 with warning flag
        If dog is not good with age of adopter's youngest child, excluded by hard filter and not scored
    
    If adopter has children and dog is unknown with children, score 0.5 and warning flag (no age check)
    If adopter has children and dog is not good with children, excluded by hard filter and not scored

    If the adopter has no children, every dog scores 1 with label "not_weighed" regardless of that dog's 
    good_with_children value, since the weight for this variable will be 0 in that case

    Dogs are scored positionally: dogs[i] corresponds to scores[i],
    warnings[i], and labels[i] in the returned tuple. Callers must not
    reorder dogs between calling this function and consuming its output.
    """
    if not adopter.children:
        scores = np.ones(len(dogs))
        labels = ["not_weighed"] * len(dogs)
        warnings = [None] * len(dogs)
        return scores, warnings, labels
    
    good_with_children = np.array([dog.good_with_children for dog in dogs])
    children_age = np.array([dog.children_age for dog in dogs])

    is_good = good_with_children == "yes"

    conditions = [
        is_good & (children_age == "any"),
        is_good & (children_age == adopter.youngest_child_age),
        is_good & (children_age == "unknown"),
        good_with_children == "unknown"
    ]
    
    scores = np.select(conditions, [1.0, 1.0, 0.75, 0.5], default=0.0)
    labels = np.select(
        conditions, ["known_compatible", "known_compatible", "age_unknown", "unknown"], default = "not_compatible"
    ).tolist()

    warnings = [
        "Unknown what exact age range dog is comfortable with" if label == "age_unknown"
        else "Unknown whether this dog is good with children" if label == "unknown"
        else None
        for label in labels
    ]

    return scores, warnings, labels

    