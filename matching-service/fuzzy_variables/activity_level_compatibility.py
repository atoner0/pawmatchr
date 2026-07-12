from schemas import Adopter, Dog
from membership_functions import trapezoidal

#activity level being converted to minutes
ACTIVITY_LEVEL_MINS = {
    "low": 30,
    "medium" : 60,
    "moderate": 90,
    "high": 120,
    "very_high": 150
}

def activity_level_compatibility(adopter: Adopter, dog: Dog) -> tuple[float, str | None]:
    """
    Activity level bands converted to minutes (upper bound of each range)

    Gap calulated as adopter's minutes - dog's minutes
    Gap <= -60: adopter far less active than dog, score 0
    -60 to -30: rising compatibility
    -30 to 30: ideal range, score 1
    30 to 120: falling compatibility (adopter more active than dog, penalised less harshly)
    Gap >= 120: score 0
    """
    adopter_mins = ACTIVITY_LEVEL_MINS[adopter.activity_level]
    dog_mins = ACTIVITY_LEVEL_MINS[dog.activity_level]

    gap = adopter_mins - dog_mins
    
    score = trapezoidal(gap, a = -60, b = -30, c = 30, d = 120)
    return score, None