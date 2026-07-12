from schemas import Adopter, Dog
from membership_functions import triangular
from fuzzy_variables.constants import HOURS_UPPER_BOUND

def alone_tolerance_compatibility(adopter: Adopter, dog: Dog) -> tuple[float, str | None]:
    """
    Hourly bands converted to upper band, treating time left alone as the maximum for each case

    Gap calculated as the adopter upper bound - dog upper bound
    Gap <= 0, score 1
    Gap >= 1, score 0
    Score will be linear in between

    A negative gap will always score 1
    """
    adopter_hours = HOURS_UPPER_BOUND[adopter.hours_alone]
    dog_hours = HOURS_UPPER_BOUND[dog.alone_tolerance]

    gap = adopter_hours - dog_hours
    gap = max(gap, 0.0) #negative gap gets clamped to score 1

    score = triangular(gap, a = 0, b = 0, c = 1)
    return score, None
