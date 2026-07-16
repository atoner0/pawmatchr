from schemas import Adopter, Dog
from membership_functions.trapezoidal import trapezoidal
from fuzzy_variables.constants import ACTIVITY_LEVEL_MINS

def activity_level_compatibility(adopter: Adopter, dog: Dog) -> tuple[float, str | None, str]:
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

    if score >= 0.75:
        label = "aligned"
    elif gap < 0:
        label = "adopter_less_active"
    else:
        label = "adopter_more_active"
    
    return score, None, label