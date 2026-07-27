import numpy as np
import pytest

from tests.tuning.csv_conversion import load_test_cases, load_adopters, load_dogs
from tests.helpers import make_adopter, make_dog
from filters.hard_filters import apply_hard_filters
from scorer import score_dogs_batch
from semantic.embeddings import get_embedding

BANDS = {
    "very_high": (0.85, 1.0),
    "high": (0.70, 0.849),
    "moderate": (0.50, 0.699),
    "low": (0.30, 0.499),
    "very_low": (0.0, 0.299)
}

def classify_band(score: float) -> str:
    for band, (low, high) in BANDS.items():
        if low <= score <= high:
            return band
    return "out_of_range"

def _load_cases():
    adopters = load_adopters("tests/tuning/adopters.csv")
    dogs = load_dogs("tests/tuning/dogs.csv")
    return load_test_cases("tests/tuning/test_cases.csv", adopters, dogs)

TEST_CASES = _load_cases()

@pytest.mark.parametrize("case", TEST_CASES, ids=[c.test_id for c in TEST_CASES])
def test_hard_filter_result(case):
    adopter = make_adopter(**case.adopter_overrides)
    dog = make_dog(**case.dog_overrides)

    eligible = apply_hard_filters(adopter, [dog])
    excluded = len(eligible) == 0

    expected_excluded = case.expected_hard_filter_result == "fail"

    assert excluded == expected_excluded, (
        f"{case.test_id} [{case.category}]: expected "
        f"{'exclusion' if expected_excluded else 'pass'}, got "
        f"{'exclusion' if excluded else 'pass'}"
    )

@pytest.mark.parametrize(
    "case",
    [c for c in TEST_CASES if c.expected_hard_filter_result != "fail"],
    ids=[c.test_id for c in TEST_CASES if c.expected_hard_filter_result != "fail"],
)
def test_score_band(case):
    adopter = make_adopter(**case.adopter_overrides)
    dog = make_dog(**case.dog_overrides)

    eligible = apply_hard_filters(adopter, [dog])
    assert len(eligible) == 1, (
        f"{case.test_id}: expected this pairing to pass hard filters, but it was excluded"
    )

    adopter_embedding = get_embedding(adopter.pref_notes)
    dog_embeddings = np.array([get_embedding(eligible[0].description)])


    results, factors = score_dogs_batch(adopter, [dog], adopter_embedding, dog_embeddings)
    result = results[0]

    band = classify_band(result.overall_score)

    assert band == case.expected_final_score_band, (
        f"{case.test_id} [{case.category}]: expected band "
        f"'{case.expected_final_score_band}', got '{band}' "
        f"(fuzzy={result.fuzzy_score:.3f}, semantic={result.semantic_score:.3f}, "
        f"overall={result.overall_score:.3f})"
    )