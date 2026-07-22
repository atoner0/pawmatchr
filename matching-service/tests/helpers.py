from schemas import Adopter, Dog, ScoringFactor

def make_adopter(**overrides) -> Adopter:
    defaults = dict(
        home_type = "semi-detached",
        home_location = "suburban",
        outdoor_space = "medium",

        current_pets = False,
        current_pet_type = [],
        current_pet_count = None,

        children = False,
        youngest_child_age = None,

        hours_alone = "2_4",
        activity_level = "medium",

        first_time_owner = False,
        multi_pet_exp = False,
        multi_pet_exp_level = None,

        age_pref = ["none"],
        size_pref = ["none"],      
        shedding_pref = "none",    
        training_commitment = "moderate",
        pref_notes = "Looking for a friendly dog",
    )
    return Adopter(**{**defaults, **overrides})

def make_dog(**overrides) -> Dog:
    defaults = dict(
        dog_id = 1,
        name = "Buddy",
        age = "3_5",
        size = "medium",

        good_with_dogs = "unknown",
        good_with_cats = "unknown",
        good_with_children = "unknown",
        children_age = None,

        alone_tolerance = "4_6",
        activity_level = "medium",
        training_level = "basic",
        shedding_level = "medium",

        behavioural_flags = [],
        known_triggers = [],
        description = "Friendly, easygoing dog looking for a loving home",
    )
    return Dog(**{**defaults, **overrides})

def make_factor(variable = "age", score = 1.0, weight = 0.1, warning = None, label = "match") -> ScoringFactor:
    return ScoringFactor(variable=variable, score=score, weight=weight, warning=warning, label=label)

# model_dump() converts the pydantic instance into a python dict, needed for integration tests
def make_adopter_payload(**overrides) -> dict:
    return make_adopter(**overrides).model_dump()

def make_dog_payload(**overrides) -> dict:
    return make_dog(**overrides).model_dump()