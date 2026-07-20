from schemas import Adopter, Dog, MatchResult, ScoringFactor
from weighting.profile_selector import select_profile
from fuzzy_variables.aggregator import aggregate_fuzzy_score_batch
from semantic.comparison import calculate_semantic_score_batch
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
    Scalar wrapper around score_dogs_batch, scoring a single adopter/dog pair.

    Temporary scaffolding for the batch migration
    """
    results, factors = score_dogs_batch(
        adopter, [dog], adopter_embedding, dog_embedding.reshape(1, -1)
    )
    return results[0], factors[0]

def score_dogs_batch(
        adopter: Adopter,
        dogs: list[Dog],
        adopter_embedding: np.ndarray,
        dog_embeddings: np.ndarray
) -> tuple[list[MatchResult], list[list[ScoringFactor]]]:
    """
    Combines the fuzzy score and semantic score into a single blended score per dog, using the 70/30 split (may be adjusted in tuning stage). Explanation generation handled elsewhere.

    Profile selection depends only on the adopter, so it's computed once and reused across every dog in the batch, rather than reselected per dog.

    Dogs are scored positionally: dogs[i] corresponds to results[i] and
    factors[i] in the returned tuple, and dog_embeddings[i] must be the
    embedding for dogs[i]. Callers must not reorder dogs between calling
    this function and consuming its output, and must keep dogs and
    dog_embeddings in matching order when building the call.
    """
    profile = select_profile(adopter)

    fuzzy_scores, warnings, factors = aggregate_fuzzy_score_batch(adopter, dogs, profile)
    semantic_scores = calculate_semantic_score_batch(dog_embeddings, adopter_embedding)

    final_scores = (fuzzy_scores * FUZZY_SPLIT) + (semantic_scores * SEMANTIC_SPLIT)

    results = [
        MatchResult(
            dog_id = dogs[i].dog_id,
            overall_score = float(final_scores[i]),
            fuzzy_score = float(fuzzy_scores[i]),
            semantic_score = float(semantic_scores[i]),
            warnings=warnings[i],
            explanation=None,
        )
        for i in range(len(dogs))
    ]

    return results, factors