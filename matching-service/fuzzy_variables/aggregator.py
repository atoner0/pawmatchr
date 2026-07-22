from schemas import Adopter, Dog, ScoringFactor
from weighting.profiles import WEIGHT_PROFILES
from weighting.weight_adjustments import (
    adjust_cat_compatibility_weight,
    adjust_child_compatibility_weight,
    adjust_dog_compatibility_weight,
    adjust_home_location_weight_batch,
    adjust_home_type_weight_batch,
    adjust_training_level_weight,
    adjust_outdoor_space_weight_batch
)
from fuzzy_variables.activity_level_compatibility import activity_level_compatibility_batch
from fuzzy_variables.age_compatibility import age_compatibility_batch
from fuzzy_variables.alone_tolerance_compatibility import alone_tolerance_compatibility_batch
from fuzzy_variables.cat_compatibility import cat_compatibility_batch
from fuzzy_variables.children_compatibility import children_compatibility_batch
from fuzzy_variables.home_location_compatibility import home_location_compatibility_batch
from fuzzy_variables.home_type_compatibility import home_type_compatibility_batch
from fuzzy_variables.other_dog_compatibility import other_dog_compatibility_batch
from fuzzy_variables.outdoor_space_compatibility import outdoor_space_compatibility_batch
from fuzzy_variables.shedding_level_compatibility import shedding_level_compatibility_batch
from fuzzy_variables.size_compatibility import size_compatibility_batch
from fuzzy_variables.training_level_compatibility import training_level_compatibility_batch

import numpy as np

def aggregate_fuzzy_score(
    adopter: Adopter, dog: Dog, profile_name: str
) -> tuple[float, list[str], list[ScoringFactor]]:
    """
    Scalar wrapper around aggregate_fuzzy_score_batch, scoring a single adopter/dog pair.

    Temporary scaffolding for the batch migration
    """
    scores, warnings, factors = aggregate_fuzzy_score_batch(adopter, [dog], profile_name)
    return float(scores[0]), warnings[0], factors[0]

def aggregate_fuzzy_score_batch(
        adopter: Adopter, dogs: list[Dog], profile_name: str
) -> tuple[np.ndarray, list[list[str], list[ScoringFactor]]]:
    """
    Runs all 12 fuzzy variable functions against an adopter/dog pair, applies conditional weight adjustments, and collapses the results into a single weighted-average fuzzy score per dog

    Score/weight computation is fully vectorised across all dogs at once.
    Per-dog ScoringFactor lists are built via a lightweight Python loop after the numeric work is done, since the variables included vary per dog

    Variables with a weight of 0 are excluded entirely from the weighted average

    Dogs are scored positionally: dogs[i] corresponds to scores[i],
    warnings[i], and factors[i] in the returned tuple. Callers must not
    reorder dogs between calling this function and consuming its output.
    """
    n_dogs = len(dogs)
    weights = WEIGHT_PROFILES[profile_name]

    #constant across the batch, adopter-only weight adjustments (computed once)
    dog_compat_weight = adjust_dog_compatibility_weight(weights["good_with_dogs"], adopter)
    cat_compat_weight = adjust_cat_compatibility_weight(weights["good_with_cats"], adopter)
    child_compat_weight = adjust_child_compatibility_weight(weights["good_with_children"], adopter)
    training_weight = adjust_training_level_weight(weights["training_level"], adopter)

    #variable_name -> scores, warnings, labels, weight
    #weight is either scalar constant across all dogs or an np.ndarray (per dog)
    variable_results: dict[str, tuple] = {}

    scores, warnings, labels = age_compatibility_batch(adopter, dogs)
    variable_results["age"] = (scores, warnings, labels, weights["age"])

    scores, warnings, labels = size_compatibility_batch(adopter, dogs)
    variable_results["size"] = (scores, warnings, labels, weights["size"])

    scores, warnings, labels = alone_tolerance_compatibility_batch(adopter, dogs)
    variable_results["alone_tolerance"] = (scores, warnings, labels, weights["alone_tolerance"])

    scores, warnings, labels = activity_level_compatibility_batch(adopter, dogs)
    variable_results["activity_level"] = (scores, warnings, labels, weights["activity_level"])

    scores, warnings, labels = shedding_level_compatibility_batch(adopter, dogs)
    variable_results["shedding_level"] = (scores, warnings, labels, weights["shedding_level"])

    scores, warnings, labels = other_dog_compatibility_batch(adopter, dogs)
    variable_results["good_with_dogs"] = (scores, warnings, labels, dog_compat_weight)

    scores, warnings, labels = cat_compatibility_batch(adopter, dogs)
    variable_results["good_with_cats"] = (scores, warnings, labels, cat_compat_weight)

    scores, warnings, labels = children_compatibility_batch(adopter, dogs)
    variable_results["good_with_children"] = (scores, warnings, labels, child_compat_weight)

    scores, warnings, labels = training_level_compatibility_batch(adopter, dogs)
    variable_results["training_level"] = (scores, warnings, labels, training_weight)

    scores, warnings, labels = outdoor_space_compatibility_batch(adopter, dogs)
    outdoor_weight = adjust_outdoor_space_weight_batch(weights["outdoor_space"], dogs)
    variable_results["outdoor_space"] = (scores, warnings, labels, outdoor_weight)

    scores, warnings, labels = home_type_compatibility_batch(adopter, dogs)
    home_type_weight = adjust_home_type_weight_batch(weights["home_type"], dogs)
    variable_results["home_type"] = (scores, warnings, labels, home_type_weight)

    scores, warnings, labels = home_location_compatibility_batch(adopter, dogs)
    home_location_weight = adjust_home_location_weight_batch(weights["home_location"], adopter, dogs)
    variable_results["home_location"] = (scores, warnings, labels, home_location_weight)

    # build matrices, broadcast scalar weights to full arrays
    # every variable's weight row has the same shape regardless of if shape was constant or per dog
    score_rows = []
    weight_rows = []
    for scores, warnings, labels, weight in variable_results.values():
        score_rows.append(scores)
        weight_rows.append(
            #float vs array inconsistency gets resolved
            #turns everything into an array
            weight if isinstance(weight, np.ndarray) else np.full(n_dogs, weight, dtype=float)
        )

    score_matrix = np.vstack(score_rows) #stacks the 12 arrays on top of each other into one 2D array shape
    weight_matrix = np.vstack(weight_rows)

    weighted_sum = np.sum(score_matrix * weight_matrix, axis=0)
    total_weight = np.sum(weight_matrix, axis=0)

    fuzzy_scores = np.where(total_weight > 0, weighted_sum / total_weight, 0.0) #guard against dividing by 0
    fuzzy_scores = np.round(fuzzy_scores, 3)

    #per dog factors/warnings, not worth vectorising
    all_warnings: list[list[str]] = [[] for _ in range(n_dogs)]
    all_factors: list[list[ScoringFactor]] = [[] for _ in range(n_dogs)]

    #section that isn't vectorised to account for per-dog variations
    for variable_name, (scores, warnings, labels, weight) in variable_results.items():
        weight_array = weight if isinstance(weight, np.ndarray) else np.full(n_dogs, weight, dtype=float)

        for i in range(n_dogs):
            if weight_array[i] == 0: #skip this variable entirely if it doesn't apply (e.g. cat when adopter has no cat)
                continue

            all_factors[i].append(
                ScoringFactor(
                    variable = variable_name,
                    score = float(scores[i]),
                    weight = float(weight_array[i]),
                    warning = warnings[i],
                    label = labels[i]
                )
            )

            if warnings[i]:
                all_warnings[i].append(warnings[i])

    return fuzzy_scores, all_warnings, all_factors