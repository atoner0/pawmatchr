from schemas import Adopter, Dog
import numpy as np

#constants that will be adjusted in tuning stage
EXTENSIVE_MULTI_PET_MODIFIER = 0.85
SEVERAL_MULTI_PET_MODIFIER = 0.9
ONCE_TWICE_MULTI_PET_MODIFIER = 0.95
FIRST_TIME_MULTI_PET_MODIFIER = 1.15

FIRST_TIME_OWNER_MODIFIER = 1.10
EXPERIENCED_OWNER_MODIFIER = 0.9

##outdoor space: activity dominant, size secondary
OUTDOOR_HIGH_ACTIVITY_MODIFIER = 1.20
OUTDOOR_LOW_ACTIVITY_MODIFIER = 0.85
OUTDOOR_LARGE_SIZE_MODIFIER = 1.10

##home type: size dominant, activity secondary
HOME_LARGE_SIZE_MODIFIER = 1.20
HOME_HIGH_ACTIVITY_MODIFIER = 1.10
HOME_LOW_ACTIVITY_MODIFIER = 0.9

LOCATION_FLAGS = {"Reactive to dogs", "Excessive barking"}
LOCATION_TRIGGERS = {"Loud noises", "Strangers", "Cats", "Other dogs"}


def adjust_dog_compatibility_weight(base_weight: float, adopter: Adopter) -> float:
    """
    If adopter doesn't have a dog as current pet, this variable doesn't apply, so weight is 0
    If adopter does have a dog, weight will be adjusted based on their experience

    First time multi-pet owner weight is increased, as they represent a higher integration risk
    Experienced multi-pet owner weighting will be decreased based on their experience level
    """
    if "dog" not in adopter.current_pet_type:
        return 0.0
    
    if not adopter.multi_pet_exp:
        return base_weight * FIRST_TIME_MULTI_PET_MODIFIER
    
    match adopter.multi_pet_exp_level:
        case "extensive":
            return base_weight * EXTENSIVE_MULTI_PET_MODIFIER
        case "several":
            return base_weight * SEVERAL_MULTI_PET_MODIFIER
        case "once_twice":
            return base_weight * ONCE_TWICE_MULTI_PET_MODIFIER
        case _:
            #in case of level being missing, which shouldn't happen if backend validation is correct
            #ensures doesn't return None silently in case of a backend error
            return base_weight
    
def adjust_cat_compatibility_weight(base_weight: float, adopter: Adopter) -> float:
    """
    If adopter doesn't have a cat as current pet, this variable doesn't apply, so weight is 0
    If adopter does have a cat, weight will be adjusted based on their experience
    
    First time multi-pet owner weight is increased, as they represent a higher integration risk
    Experienced multi-pet owner weighting will be decreased based on their experience level
    """
    if "cat" not in adopter.current_pet_type:
        return 0.0
    
    if not adopter.multi_pet_exp:
        return base_weight * FIRST_TIME_MULTI_PET_MODIFIER
    
    match adopter.multi_pet_exp_level:
        case "extensive":
            return base_weight * EXTENSIVE_MULTI_PET_MODIFIER
        case "several":
            return base_weight * SEVERAL_MULTI_PET_MODIFIER
        case "once_twice":
            return base_weight * ONCE_TWICE_MULTI_PET_MODIFIER
        case _:
            #in case of level being missing, which shouldn't happen if backend validation is correct
            #ensures doesn't return None silently in case of a backend error
            return base_weight
        
def adjust_child_compatibility_weight(base_weight: float, adopter: Adopter) -> float:
    """
    If adopter has no children, this variable doesn't apply, so weight is 0
    """
    if not adopter.children:
        return 0.0
    
    return base_weight
        
def adjust_training_level_weight(base_weight: float, adopter: Adopter) -> float:
    """
    If first time owner, weight increases as a first time owner understanding training requirements is a key relinquishment factor
    """
    if adopter.first_time_owner:
        return base_weight * FIRST_TIME_OWNER_MODIFIER
    
    return base_weight


def adjust_outdoor_space_weight(base_weight: float, dog: Dog) -> float:
    """
    Adjusts outdoor space weighting based on dog's activity level and size

    Activity level is dominant factor, as dog's need for outdoor space is driven more by this than their size
    High/very high activity increases weight, low activity reduces it

    Large/giant size adds a secondary weight increase, applied independently of the activity adjustment
    """
    if dog.activity_level in ("high", "very_high"):
        base_weight *= OUTDOOR_HIGH_ACTIVITY_MODIFIER
    elif dog.activity_level == "low":
        base_weight *= OUTDOOR_LOW_ACTIVITY_MODIFIER

    if dog.size in ("large", "giant"):
        base_weight *= OUTDOOR_LARGE_SIZE_MODIFIER

    return base_weight

def adjust_outdoor_space_weight_batch(base_weight: float, dogs: list[Dog]) -> np.ndarray:
    """
    Batch version of adjust_outdoor_space_weight, scoring one base_weight against many dogs' activity_level/size

    Adjusts outdoor space weighting based on dog's activity level and size

    Activity level is dominant factor, as dog's need for outdoor space is driven more by this than their size
    High/very high activity increases weight, low activity reduces it

    Large/giant size adds a secondary weight increase, applied independently of the activity adjustment
    """
    activity = np.array([dog.activity_level for dog in dogs])
    size = np.array([dog.size for dog in dogs])

    activity_multiplier = np.select(
        [np.isin(activity, ["high", "very_high"]), activity == "low"],
        [OUTDOOR_HIGH_ACTIVITY_MODIFIER, OUTDOOR_LOW_ACTIVITY_MODIFIER],
        default=1.0
    )

    size_multiplier = np.select(
        [np.isin(size, ["large", "giant"]), OUTDOOR_LARGE_SIZE_MODIFIER, 1.0]
    )

    return base_weight * activity_multiplier * size_multiplier

def adjust_home_type_weight(base_weight: float, dog: Dog) -> float:
    """
    Adjusts home type weighting based on dog's activity level and size

    Size is dominant factor, as housing type is primarily a physical space constraint (e.g. giant dog in an apartment)
    Large/giant size increases the weighting

    Activity level adds a secondary weight adjustment, applied independently of the size adjustment
    """
    if dog.size in ("large", "giant"):
        base_weight *= HOME_LARGE_SIZE_MODIFIER
    
    if dog.activity_level in ("high", "very_high"):
        base_weight *= HOME_HIGH_ACTIVITY_MODIFIER
    elif dog.activity_level == "low":
        base_weight *= HOME_LOW_ACTIVITY_MODIFIER

    return base_weight

def adjust_home_type_weight_batch(base_weight: float, dogs: list[Dog]) -> np.ndarray:
    """
    Batch version of adjust_home_type_weight

    Adjusts home type weighting based on dog's activity level and size

    Size is dominant factor, as housing type is primarily a physical space constraint (e.g. giant dog in an apartment)
    Large/giant size increases the weighting

    Activity level adds a secondary weight adjustment, applied independently of the size adjustment
    """
    size = np.array([dog.size for dog in dogs])
    activity = np.array([dog.activity_level for dog in dogs])

    size_multiplier = np.select(
        [np.isin(size, ["large", "giant"]), HOME_LARGE_SIZE_MODIFIER, 1.0]
    )
    
    activity_multiplier = np.select(
        [np.isin(activity, ["high", "very_high"]), activity == "low"],
        [HOME_HIGH_ACTIVITY_MODIFIER, HOME_LOW_ACTIVITY_MODIFIER],
        default=1.0
    )

    return base_weight * activity_multiplier * size_multiplier

def adjust_home_location_weight(base_weight: float, adopter: Adopter, dog: Dog) -> float:
    """
    If a dog has no location related behavioural flags/triggers, this variable doesn't apply, so weight is 0

    If adopter is not a first time owner and their training commitment is moderate/intensive, reduce weight, as their experience outweighs the flags/triggers
    If adopter is first time owner and dog has location flags/triggers, increase weight, as an inexperienced owner in a challenging environment is a higher risk
    """
    has_relevant_flag = any(f in LOCATION_FLAGS for f in dog.behavioural_flags)
    has_relevant_trigger = any(t in LOCATION_TRIGGERS for t in dog.known_triggers)

    if not has_relevant_flag and not has_relevant_trigger:
        return 0.0
    
    if not adopter.first_time_owner and adopter.training_commitment in ("intensive", "moderate"):
        return base_weight * EXPERIENCED_OWNER_MODIFIER

    if adopter.first_time_owner:
        return base_weight * FIRST_TIME_OWNER_MODIFIER

    return base_weight

def adjust_home_location_weight_batch(base_weight: float, adopter: Adopter, dogs: list[Dog]) -> np.ndarray:
    """
    Batch version of adjust_home_location_weight

    If a dog has no location related behavioural flags/triggers, this variable doesn't apply, so weight is 0

    If adopter is not a first time owner and their training commitment is moderate/intensive, reduce weight, as their experience outweighs the flags/triggers
    If adopter is first time owner and dog has location flags/triggers, increase weight, as an inexperienced owner in a challenging environment is a higher risk
    """
    has_relevant = np.array([
        any(f in LOCATION_FLAGS for f in dog.behavioural_flags)
        or any(t in LOCATION_TRIGGERS for t in dog.known_triggers)
        for dog in dogs
    ])
    
    if not adopter.first_time_owner and adopter.training_commitment in ("intensive", "moderate"):
        adjusted = base_weight * EXPERIENCED_OWNER_MODIFIER
    elif adopter.first_time_owner:
        adjusted = base_weight * FIRST_TIME_OWNER_MODIFIER
    else:
        adjusted = base_weight

    return np.where(has_relevant, adjusted, 0.0)