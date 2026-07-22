"""
Entry point for the matching microservice.

This service:
- receives an adopter profile + array of available dogs from the Node backend
- runs fuzzy + semantic scoring, blends them, generates an explanation
- returns a ranked array of results
- never reads from or writes to the database itself

Scoring logic is intentionally not implemented here. This file just wires up the app so 
later issues have somewhere to plug in.
"""

import asyncio
from fastapi import FastAPI

from config import settings
from schemas import MatchRequest, MatchResponse
from filters.hard_filters import apply_hard_filters
from semantic.embeddings import get_embedding
from scorer import score_dogs_batch
from explanation.generate import generate_explanation
import numpy as np


def create_app() -> FastAPI:
    app = FastAPI(title="Pawmatchr Matching Service")

    @app.get("/health")
    def health() -> dict:
        return {"status": "ok"}

    @app.post("/match", response_model=MatchResponse)
    async def match(payload: MatchRequest) -> MatchResponse:
        adopter = payload.adopter
        eligible_dogs = apply_hard_filters(adopter, payload.dogs)

        if not eligible_dogs:
            return MatchResponse(results=[])
        
        adopter_embedding = get_embedding(adopter.pref_notes)
        dog_embeddings = np.array([get_embedding(dog.description) for dog in eligible_dogs])

        results, factors = score_dogs_batch(adopter, eligible_dogs, adopter_embedding, dog_embeddings)

        explanations = await asyncio.gather(
            *[generate_explanation(f) for f in factors]
        )

        for i, result in enumerate(results):
            result.explanation = explanations[i]

        results.sort(key = lambda r: r.overall_score, reverse = True)

        return MatchResponse(results=results)
    
    return app


app = create_app()

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=settings.port, reload=settings.debug)
