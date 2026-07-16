from schemas import Adopter, Dog, ScoringFactor
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
) -> tuple[float, list[str], list[ScoringFactor]]:
    """
    Runs all 12 fuzzy variable functions against an adopter/dog pair, applies conditional weight adjustments, and collapses the results into a single weighted-average fuzzy score

    Variables with a weight of 0 are excluded entirely from the weighted average
    """
    weights = WEIGHT_PROFILES[profile_name]
    factors: list[ScoringFactor] = []
    weighted_sum = 0.0
    total_weight = 0.0

    def accumulate(
        variable_name: str,
        score: float, 
        warning: str | None, 
        label: str,
        weight: float,
    ) -> None:
        nonlocal weighted_sum, total_weight

        if weight == 0:
            return
        
        weighted_sum += score * weight
        total_weight += weight
        
        factors.append(
            ScoringFactor(
                variable = variable_name,
                score = score,
                weight = weight,
                warning = warning,
                label = label,
            )
        )

    ## no weight adjustment, always scored ##
    score, warning, label = age_compatibility(adopter, dog)
    accumulate("age", score, warning, label, weights["age"])

    score, warning, label = size_compatibility(adopter, dog)
    accumulate("size", score, warning, label, weights["size"])

    score, warning, label = alone_tolerance_compatibility(adopter, dog)
    accumulate("alone_tolerance", score, warning, label, weights["alone_tolerance"])

    score, warning, label = activity_level_compatibility(adopter, dog)
    accumulate("activity_level", score, warning, label, weights["activity_level"])

    score, warning, label = shedding_level_compatibility(adopter, dog)
    accumulate("shedding_level", score, warning, label, weights["shedding_level"])

    ## adjusted weights ##
    score, warning, label = other_dog_compatibility(adopter, dog)
    accumulate("other_dog", score, warning, label, adjust_dog_compatibility_weight(weights["good_with_dogs"], adopter))

    score, warning, label = cat_compatibility(adopter, dog)
    accumulate("cat", score, warning, label, adjust_cat_compatibility_weight(weights["good_with_cats"], adopter))

    score, warning, label = children_compatibility(adopter, dog)
    accumulate("children", score, warning, label, adjust_child_compatibility_weight(weights["good_with_children"], adopter))

    score, warning, label = training_level_compatibility(adopter, dog)
    accumulate("training_level", score, warning, label, adjust_training_level_weight(weights["training_level"], adopter))

    score, warning, label = outdoor_space_compatibility(adopter, dog)
    accumulate("outdoor_space", score, warning, label, adjust_outdoor_space_weight(weights["outdoor_space"], dog))

    score, warning, label = home_type_compatibility(adopter, dog)
    accumulate("home_type", score, warning, label, adjust_home_type_weight(weights["home_type"], dog))

    score, warning, label = home_location_compatibility(adopter, dog)
    accumulate("home_location", score, warning, label, adjust_home_location_weight(weights["home_location"], adopter, dog))

    fuzzy_score = round(weighted_sum / total_weight, 3) if total_weight else 0.0 #guarding against division by 0
    warnings = [f.warning for f in factors if f.warning]

    return fuzzy_score, warnings, factors