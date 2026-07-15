from schemas import Adopter, Dog, MatchResult
from weighting.profiles import WEIGHT_PROFILES
from weighting.weight_adjustments import (
    adjust_cat_compatibility_weight,
    adjust_child_compatibility_weight,
    adjust_dog_compatibility_weight,
    adjust_home_location_weight,
    adjust_home_type_weight,
    adjust_training_level_weight,
    adjust_outdoor_space_weight
)
from fuzzy_variables.activity_level_compatibility import activity_level_compatibility
from fuzzy_variables.age_compatibility import age_compatibility
from fuzzy_variables.alone_tolerance_compatibility import alone_tolerance_compatibility
from fuzzy_variables.cat_compatibility import cat_compatibility
from fuzzy_variables.children_compatibility import children_compatibility
from fuzzy_variables.home_location_compatibility import home_location_compatibility
from fuzzy_variables.home_type_compatibility import home_type_compatibility
from fuzzy_variables.other_dog_compatibility import other_dog_compatibility
from fuzzy_variables.outdoor_space_compatibility import outdoor_space_compatibility
from fuzzy_variables.shedding_level_compatibility import shedding_level_compatibility
from fuzzy_variables.size_compatibility import size_compatibility
from fuzzy_variables.training_level_compatibility import training_level_compatibility

def aggregate_fuzzy_score(
        adopter: Adopter, dog: Dog, profile_name: str
) -> tuple[float, list[str]]:
    """
    Runs all 12 fuzzy variable functions against an adopter/dog pair, applies conditional weight adjustments, and collapses the results into a single weighted-average fuzzy score

    Variables with a weight of 0 are excluded entirely from the weighted average
    """
    weights = WEIGHT_PROFILES[profile_name]
    warnings: list[str] = []
    weighted_sum = 0.0
    total_weight = 0.0

    def accumulate(score: float, warning: str | None, weight: float) -> None:
        nonlocal weighted_sum, total_weight

        if weight == 0:
            return
        
        weighted_sum += score * weight
        total_weight += weight
        if warning:
            warnings.append(warning)

    ## no weight adjustment, always scored ##
    score, warning = age_compatibility(adopter, dog)
    accumulate(score, warning, weights["age"])

    score, warning = size_compatibility(adopter, dog)
    accumulate(score, warning, weights["size"])

    score, warning = alone_tolerance_compatibility(adopter, dog)
    accumulate(score, warning, weights["alone_tolerance"])

    score, warning = activity_level_compatibility(adopter, dog)
    accumulate(score, warning, weights["activity_level"])

    score, warning = shedding_level_compatibility(adopter, dog)
    accumulate(score, warning, weights["shedding_level"])

    ## adjusted weights ##
    score, warning = other_dog_compatibility(adopter, dog)
    accumulate(score, warning, adjust_dog_compatibility_weight(weights["good_with_dogs"], adopter))

    score, warning = cat_compatibility(adopter, dog)
    accumulate(score, warning, adjust_cat_compatibility_weight(weights["good_with_cats"], adopter))

    score, warning = children_compatibility(adopter, dog)
    accumulate(score, warning, adjust_child_compatibility_weight(weights["good_with_children"], adopter))

    score, warning = training_level_compatibility(adopter, dog)
    accumulate(score, warning, adjust_training_level_weight(weights["training_level"], adopter))

    score, warning = outdoor_space_compatibility(adopter, dog)
    accumulate(score, warning, adjust_outdoor_space_weight(weights["outdoor_space"], adopter))

    score, warning = home_type_compatibility(adopter, dog)
    accumulate(score, warning, adjust_home_type_weight(weights["home_type"], adopter))

    score, warning = home_location_compatibility(adopter, dog)
    accumulate(score, warning, adjust_home_location_weight(weights["home_location"], adopter))

    fuzzy_score = round(weighted_sum / total_weight, 3) if total_weight else 0.0 #guarding against division by 0
    return fuzzy_score, warnings