TEMPLATES = {
    "age": {
        "match": "This dog's age fits within your preferred range",
        "no_match": "This dog's age falls outside your preferred range"
    },
    "size": {
        "match": "This dog's size fits within your selected preference",
        "no_match": "This dog's size is not within your selected preference"
    },
    "shedding_level": {
        "match": "This dog's shedding level fits within your selected preference",
        "no_match": "This dog's shedding level is not within your selected preference"
    },
    "alone_tolerance": {
        "within_tolerance": "This dog can be left alone for the hours you stated",
        "exceeds_tolerance": "This dog cannot be left alone for the hours you stated"
    },
    "activity_level": {
        "aligned": "This dog has a similar activity level to you",
        "adopter_less_active": "You are less active than the dog requires",
        "adopter_more_active": "You are more active than the dog requires",
    },
    "training_level": {
        "meets_requirement": "You meet the training commitment level that this dog needs",
        "one_level_below": "You are one commitment step below the training level this dog needs",
        "far_below": "Your stated training commitment is well below what this dog needs"
    },
    "good_with_children": {
        "known_compatible": "This dog is good with children",
        "unknown": "It is unknown if this dog is good with children",
        "not_compatible": "This dog is not good with children", # unreachable, defensive fallback in case of logic change
        "age_unknown": "It is unknown what age range this dog is comfortable with",
        "not_weighed": "Not applicable, as you don't currently have children" # unreachable, defensive fallback in case of logic change
    },
    "good_with_dogs": {
        "known_compatible": "This dog is good with other dogs",
        "unknown": "It is unknown if this dog is good with other dogs",
        "not_compatible": "This dog is not good with other dogs", # unreachable, defensive fallback in case of logic change
        "not_weighed": "Not applicable, as you don't currently own another dog" # unreachable, defensive fallback in case of logic change
    },
    "good_with_cats": {
        "known_compatible": "This dog is good with cats",
        "unknown": "It is unknown if this dog is good with cats",
        "not_compatible": "This dog is not good with cats", # unreachable, defensive fallback in case of logic change
        "not_weighed": "Not applicable, as you don't currently own a cat" # unreachable, defensive fallback in case of logic change
    },
    "outdoor_space": {
        "ideal": "Your outdoor space is ideal for this dog",
        "acceptable": "Your outdoor space is acceptable for this dog",
        "poor": "Your outdoor space is limited for this dog",
        "not_acceptable": "You don't have outdoor space available for this dog"
    },
    "home_location": {
        "low_risk": "Your home location is low risk for this dog's behaviour",
        "manageable": "Your home location is manageable for this dog's behaviour",
        "high_risk": "Your home location is high risk for this dog's behaviour"
    },
    "home_type": {
        "ideal": "Your home type is ideal for this dog",
        "acceptable": "Your home type is acceptable for this dog",
        "poor": "Your home type is poor for this dog",
        "not_acceptable": "Your home type does not suit this dog"
    }
}