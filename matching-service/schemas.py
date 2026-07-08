"""
Request/response shapes for the internal API contract with the Node backend

Kept loose (dict-typed adopter/dog objects) at scaffold stage since the full
field-by-field validation belongs to the endpoint + scoring work in
#24-#26, not here. Will be made into proper nested models once the fuzzy
variables and semantic scoring are in place 
"""

from pydantic import BaseModel


class MatchRequest(BaseModel):
    adopter: dict
    dogs: list[dict]


class MatchResult(BaseModel):
    dog_id: int
    overall_score: float
    fuzzy_score: float
    semantic_score: float
    explanation: str | None = None


class MatchResponse(BaseModel):
    results: list[MatchResult]
