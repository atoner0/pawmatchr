from fastapi.testclient import TestClient

from app import app
from helpers import make_adopter

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_match_rejects_invalid_payload():
    response = client.post("/match", json={"adopter": {}, "dogs": []})
    assert response.status_code == 422

def test_match_stub_returns_not_implemented():
    adopter_dict = make_adopter().model_dump()
    response = client.post("/match", json={"adopter": adopter_dict, "dogs": []})
    assert response.status_code == 501


def test_match_rejects_malformed_body():
    # "dogs" must be a list per MatchRequest - FastAPI/Pydantic should 422
    # before the route body even runs, proving request validation is wired up.
    response = client.post("/match", json={"adopter": {}, "dogs": "not-a-list"})
    assert response.status_code == 422
