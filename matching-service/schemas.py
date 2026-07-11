"""
Request/response shapes for the internal API contract with the Node backend

"""

from pydantic import BaseModel
from typing import Literal

class Adopter(BaseModel):
    home_type: Literal["apartment", "semi-detached", "detached"]
    home_location: Literal["urban", "suburban", "rural"]
    outdoor_space: Literal["large", "medium", "small", "none"]

    current_pets: bool
    current_pet_type: list[Literal["dog", "cat", "hamster", "horse", "other"]] = []
    current_pet_count: int | None = None
    children: bool
    youngest_child_age: Literal["under_5", "5_12", "13_plus"] | None = None

    hours_alone: Literal["0_2", "2_4", "4_6", "6_8", "8_plus"]
    activity_level: Literal["low", "medium", "moderate", "high", "very_high"]
    first_time_owner: bool
    multi_pet_exp: bool
    multi_pet_exp_level: Literal["once_twice", "several", "extensive"] | None = None

    age_pref: list[Literal["0_2", "3_5", "6_8", "8_plus", "none"]]
    size_pref: Literal["small", "medium", "large", "giant", "none"]
    shedding_pref: Literal["none", "low", "medium", "high"]
    training_commitment: Literal["none", "basic", "moderate", "intensive"]
    pref_notes: str | None = None

class Dog(BaseModel):
    dog_id: int
    name: str
    age: Literal["0_2", "3_5", "6_8", "8_plus", "unknown"]
    size: Literal["small", "medium", "large", "giant"]

    good_with_dogs: Literal["yes", "no", "unknown"]
    good_with_cats: Literal["yes", "no", "unknown"]
    good_with_children: Literal["yes", "no", "unknown"]
    children_age: Literal["any", "5_12", "13_plus", "unknown"] | None = None

    alone_tolerance: Literal["0_2", "2_4", "4_6", "6_8", "8_plus"]
    activity_level: Literal["low", "medium", "moderate", "high", "very_high"]
    training_level: Literal["none", "basic", "moderate", "experienced_only"]
    shedding_level: Literal["low", "medium", "high"]

    behavioural_flags: list[Literal[
        "Pulls on lead",
        "Jumps at people", 
        "Separation anxiety",
        "Reactive to dogs",
        "Resource guarding",
        "Not recall trained",
        "Excessive barking",
        "Destructive when alone"
        ]] = []
    known_triggers: list[Literal[
        "Loud noises",
        "Strangers",
        "Other dogs",
        "Cats",
        "Children",
        "Fast movement",
        "Cars"
        ]] = []
    description: str | None = None


class MatchRequest(BaseModel):
    adopter: Adopter
    dogs: list[Dog]


class MatchResult(BaseModel):
    dog_id: int
    overall_score: float
    fuzzy_score: float
    semantic_score: float
    explanation: str | None = None


class MatchResponse(BaseModel):
    results: list[MatchResult]
