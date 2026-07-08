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

from fastapi import FastAPI, HTTPException

from config import settings
from schemas import MatchRequest, MatchResponse


def create_app() -> FastAPI:
    app = FastAPI(title="Pawmatchr Matching Service")

    @app.get("/health")
    def health() -> dict:
        return {"status": "ok"}

    @app.post("/match", response_model=MatchResponse)
    def match(payload: MatchRequest) -> MatchResponse:
        # TODO: implemented across #24-#27 (structured scoring, fuzzy rules,
        # semantic scoring, blending). Scaffold only validates the request
        # shape for now.
        raise HTTPException(
            status_code=501,
            detail="/match scoring pipeline not yet implemented - see #24-#27",
        )

    return app


app = create_app()

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=settings.port, reload=settings.debug)
