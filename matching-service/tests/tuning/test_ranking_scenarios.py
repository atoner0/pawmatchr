import numpy as np
import pytest

from tests.tuning.csv_conversion import load_ranking_test_cases, load_adopters, load_dogs
from tests.helpers import make_adopter, make_dog
from filters.hard_filters import apply_hard_filters
from scorer import score_dogs_batch
from semantic.embeddings import get_embedding

def _load_ranking_cases():
    adopters = load_adopters("tests/tuning/adopters.csv")
    dogs = load_dogs("tests/tuning/dogs.csv")
    return load_ranking_test_cases("tests/tuning/ranking_test_cases.csv", adopters, dogs)

RANKING_CASES = _load_ranking_cases()

@pytest.mark.parametrize(
    "case", RANKING_CASES, ids=[c.ranking_test_id for c in RANKING_CASES]
)
def test_exclusion(case):
    adopter = make_adopter(**case.adopter_overrides)
    dogs_list = [make_dog(**overrides) for overrides in case.dog_overrides_list]

    eligible = apply_hard_filters(adopter, dogs_list)

    dogs_list_ids = set(dog.dog_id for dog in dogs_list)
    eligible_ids = set(dog.dog_id for dog in eligible)
    actually_excluded = dogs_list_ids - eligible_ids

    assert actually_excluded == set(case.expected_excluded), (
        f"{case.ranking_test_id}: expected excluded {set(case.expected_excluded)}, got {actually_excluded}"
    )


@pytest.mark.parametrize(
    "case", RANKING_CASES, ids=[c.ranking_test_id for c in RANKING_CASES]
)
def test_rank_order(case):
    adopter = make_adopter(**case.adopter_overrides)
    dogs_list = [make_dog(**overrides) for overrides in case.dog_overrides_list]

    eligible = apply_hard_filters(adopter, dogs_list)
    if not eligible:
        pytest.skip(f"{case.ranking_test_id}: no eligible dogs, nothing to rank")

    adopter_embedding = get_embedding(adopter.pref_notes)
    dog_embeddings = np.array([get_embedding(dog.description) for dog in eligible])

    results, _factors = score_dogs_batch(adopter, eligible, adopter_embedding, dog_embeddings)
    results.sort(key=lambda r: r.overall_score, reverse=True)
    actual_order = [r.dog_id for r in results]

    order_mismatches = []
    comparison_counter = 0

    for i, dog_a in enumerate(case.expected_rank_order[:-1]):
        dog_b = case.expected_rank_order[i + 1]

        if dog_a not in actual_order or dog_b not in actual_order:
            continue

        comparison_counter += 1

        if not (actual_order.index(dog_a) < actual_order.index(dog_b)):
            order_mismatches.append((dog_a, dog_b))

    assert not order_mismatches, (
        f"{case.ranking_test_id}: order mismatches {order_mismatches} "
        f"(actual order: {actual_order}, expected: {case.expected_rank_order}, "
        f"{comparison_counter - len(order_mismatches)}/{comparison_counter} pairs correct)"
    )