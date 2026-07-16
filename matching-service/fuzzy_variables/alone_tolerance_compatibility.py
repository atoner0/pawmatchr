from schemas import Adopter, Dog
from membership_functions.triangular import triangular
from fuzzy_variables.constants import HOURS_UPPER_BOUND

def alone_tolerance_compatibility(adopter: Adopter, dog: Dog) -> tuple[float, str | None, str]:
    """
    Hourly bands converted to upper band, treating time left alone as the maximum for each case

    Gap calculated as the adopter upper bound - dog upper bound
    Gap <= 0, score 1
    Gap >= 1, score 0
    A negative gap will always score 1

    Note: given band spacing (minimum 2-hour steps) is wider than c=1, this behaves as a hard cutoff rather than a graduated score in practice - intentional, since exceeding a dog's alone-tolerance limit is treated as a welfare concern rather than a soft mismatch.
    """
    adopter_hours = HOURS_UPPER_BOUND[adopter.hours_alone]
    dog_hours = HOURS_UPPER_BOUND[dog.alone_tolerance]

    gap = adopter_hours - dog_hours
    gap = max(gap, 0.0) #negative gap gets clamped to score 1

    score = triangular(gap, a = 0, b = 0, c = 1)

    if gap <= 0:
        label = "within_tolerance"
    else:
        label = "exceeds_tolerance"

    return score, None, label
