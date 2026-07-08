"""
Combines the fuzzy score and semantic score into a single blended score per
dog, using config.settings.fuzzy_weight / semantic_weight, and generates the
plain-language explanation shown to the adopter.

"""


def score_dog(adopter_profile: dict, dog: dict) -> dict:
    raise NotImplementedError("Scoring pipeline not yet implemented - see #24-#28")
