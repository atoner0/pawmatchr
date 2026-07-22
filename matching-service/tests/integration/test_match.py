from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
from app import app
from tests.helpers import make_dog_payload, make_adopter_payload

client = TestClient(app)

class TestMatchEndpoint:
    @patch("app.generate_explanation", new_callable=AsyncMock)
    def test_returns_ranked_results_excluding_hard_filtered_dog(self, mock_explain):
        mock_explain.return_value = "Placeholder explanation"

        adopter = make_adopter_payload(current_pet_type = ["cat"])

        dogs = [
            make_dog_payload(dog_id = 1, good_with_cats = "yes"),
            make_dog_payload(dog_id = 2, good_with_cats = "no"),
            make_dog_payload(dog_id = 3, good_with_cats = "unknown")
        ]

        response = client.post("/match", json={"adopter": adopter, "dogs": dogs})

        assert response.status_code == 200
        results = response.json()["results"]

        returned_ids = [r["dog_id"] for r in results]
        assert 2 not in returned_ids
        assert set(returned_ids) == {1, 3}

        scores = [r["overall_score"] for r in results]
        assert scores == sorted(scores, reverse=True)

        assert "Unknown whether this dog is good with cats" in results[1]["warnings"]

    def test_empty_dog_list_returns_empty_results(self, mock_explain):
        mock_explain.return_value = "Placeholder explanation"

        adopter = make_adopter_payload(current_pet_type = ["cat"])

        dogs = []

        response = client.post("/match", json={"adopter": adopter, "dogs": dogs})

        assert response.status_code == 200
        assert response.json()["results"] == []

    def test_all_dogs_hard_filtered_returns_empty_results(self, mock_explain):
        mock_explain.return_value = "Placeholder explanation"

        adopter = make_adopter_payload(current_pet_type = ["cat"])

        dogs = [
            make_dog_payload(dog_id = 1, good_with_cats = "no"),
            make_dog_payload(dog_id = 2, good_with_cats = "no"),
            make_dog_payload(dog_id = 3, good_with_cats = "no")
        ]

        response = client.post("/match", json={"adopter": adopter, "dogs": dogs})

        assert response.status_code == 200
        assert response.json()["results"] == []

    def test_malformed_adopter_returns_422(self):
        response = client.post("/match", json={"adopter": {}, "dogs": []})

        assert response.status_code == 422

