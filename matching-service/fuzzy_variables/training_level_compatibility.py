from schemas import Adopter, Dog

DOG_TRAINING_RANK = {
    "none": 0,
    "basic": 1,
    "moderate": 2,
    "experienced_only": 3,
}

ADOPTER_COMMITMENT_RANK = {
    "none": 0,
    "basic": 1,
    "moderate": 2,
    "intensive": 3,
}

def training_level_compatibility(adopter: Adopter, dog: Dog) -> tuple[float, str | None]:
    """
    Ordinal comparison between adopter's training commitment and dog's training requirement

    Adopter commitment meets/exceeds dog's requirement, score 1
    One level below, score 0.5
    Two/more levels below, score 0
    """
    dog_rank = DOG_TRAINING_RANK[dog.training_level]
    adopter_rank = ADOPTER_COMMITMENT_RANK[adopter.training_commitment]

    gap = dog_rank - adopter_rank

    if gap <= 0:
        return 1.0, None
    elif gap == 1:
        return 0.5, None
    else:
        return 0.0, None


