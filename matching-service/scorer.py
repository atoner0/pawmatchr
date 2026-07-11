"""
Combines the fuzzy score and semantic score into a single blended score per
dog, using fuzzy_weight / semantic_weight, and generates the
plain-language explanation shown to the adopter.

"""
from schemas import Adopter, Dog, MatchResult

def score_dog(adopter: Adopter, dog: Dog) -> MatchResult:
    raise NotImplementedError("Scoring pipeline not yet implemented")
