from schemas import Adopter, Dog, MatchResult, ScoringFactor
from weighting.profile_selector import select_profile
from fuzzy_variables.aggregator import aggregate_fuzzy_score
from semantic.comparison import calculate_semantic_score
import numpy as np

FUZZY_SPLIT = 0.7
SEMANTIC_SPLIT = 0.3

def score_dog(
        adopter: Adopter, 
        dog: Dog,
        adopter_embedding: np.ndarray,
        dog_embedding: np.ndarray,

        ) -> tuple[MatchResult, list[ScoringFactor]]:
    """
    Combines the fuzzy score and semantic score into a single blended score per dog, using the 70/30 split (may be adjusted in tuning stage)
    Explanation generation handled elsewhere

    Returns the MatchResult + per-variable ScoringFactor list, for use in explanation generation
    """
    profile = select_profile(adopter)
    fuzzy_score, warnings, factors = aggregate_fuzzy_score(adopter, dog, profile)

    semantic_score = calculate_semantic_score(dog_embedding, adopter_embedding)

    final_score = (fuzzy_score * FUZZY_SPLIT) + (semantic_score * SEMANTIC_SPLIT)

    result =  MatchResult(
        dog_id = dog.dog_id,
        overall_score = final_score,
        fuzzy_score = fuzzy_score,
        semantic_score = semantic_score,
        warnings = warnings,
        explanation = None
    )

    return result, factors
