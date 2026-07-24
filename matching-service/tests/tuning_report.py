import numpy as np

from tests.csv_conversion import load_test_cases, load_adopters, load_dogs
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

def run_report():
    adopters = load_adopters("tests/adopters.csv")
    dogs = load_dogs("tests/dogs.csv")
    cases = load_test_cases("tests/test_cases.csv", adopters, dogs)

    for case in cases:
        adopter = make_adopter(**case.adopter_overrides)
        dog = make_dog(**case.dog_overrides)

        eligible = apply_hard_filters(adopter, [dog])
        excluded = len(eligible) == 0

        if case.expected_hard_filter_result == "fail":
            status = "OK" if excluded else "MISMATCH - expected exclusion"
            print(f"{case.test_id} [{case.category}]: excluded={excluded}    {status}")
            continue

        if excluded:
            print(f"{case.test_id} [{case.category}]: excluded=True    "
                  f"MISMATCH - expected pass")
            continue

        adopter_embedding = get_embedding(adopter.pref_notes)
        dog_embeddings = np.array([get_embedding(dog.description)])

        results, factors = score_dogs_batch(adopter, [dog], adopter_embedding, dog_embeddings)
        result = results[0]

        band = classify_band(result.overall_score)
        flag = "" if band == case.expected_final_score_band else " <-- check"

        print(
            f"{case.test_id} [{case.category}]: "
            f"fuzzy={result.fuzzy_score:.3f} semantic={result.semantic_score:.3f} "
            f"overall={result.overall_score:.3f} "
            f"({band}, expected {case.expected_final_score_band}){flag}"
        )

if __name__ == "__main__":
    run_report()

