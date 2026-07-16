from schemas import ScoringFactor

def select_factors_for_explanation(
        factors: list[ScoringFactor], top_n: int = 5) -> tuple[list[ScoringFactor], list[ScoringFactor]]:
    """
    Selects which fuzzy variable factors are worth surfacing in a match explanation

    Factors carrying a warning are excluded from ranking and returned separately in full, since a warning is a stronger signal than a ranked impact score

    Remaining factors are ranked by weight * |score - 1| descending
        -> how much this variable both mattered to this adopter's profile and diverged from a perfect match

    The top 'top_n' are returned as the ranked selection

    Factors with weight = 0 never reach this function, since the aggregator already excludes them before building the factors list
    """
    def rank_key(factor: ScoringFactor) -> tuple[float, float]:
        # weight key breaks ties deterministically when both keys are equal
        return (factor.weight * abs(factor.score - 1), factor.weight)
    
    non_warning_factors = [f for f in factors if not f.warning]
    warning_factors = [f for f in factors if f.warning]
    
    ranked = sorted(non_warning_factors, key = rank_key, reverse = True)
    top_factors = ranked[:top_n]


    return top_factors, warning_factors
    
