import numpy as np
from datetime import datetime

from tests.tuning.csv_conversion import load_ranking_test_cases, load_adopters, load_dogs
from tests.helpers import make_adopter, make_dog
from filters.hard_filters import apply_hard_filters
from scorer import score_dogs_batch
from semantic.embeddings import get_embedding
from semantic.comparison import cosine_similarity_batch, calculate_semantic_score_batch


def run_report(output_path: str = "tests/tuning/ranking_report.txt"):
    adopters = load_adopters("tests/tuning/adopters.csv")
    dogs = load_dogs("tests/tuning/dogs.csv")
    cases = load_ranking_test_cases("tests/tuning/ranking_test_cases.csv", adopters, dogs)

    ### AI-assisted (Claude) - ###

    lines = [f"Ranking test report - generated {datetime.now().isoformat(timespec='seconds')}\n"]

    for case in cases:
        adopter = make_adopter(**case.adopter_overrides)
        dogs_list = [make_dog(**overrides) for overrides in case.dog_overrides_list]

        eligible = apply_hard_filters(adopter, dogs_list)

        dogs_list_ids = set(dog.dog_id for dog in dogs_list)
        eligible_ids = set(dog.dog_id for dog in eligible)

        actually_excluded = dogs_list_ids - eligible_ids

        adopter_embedding = get_embedding(adopter.pref_notes)
        dog_embeddings = np.array([get_embedding(dog.description) for dog in eligible])

        raw_semantic_scores = cosine_similarity_batch(dog_embeddings, adopter_embedding)
        scaled_semantic_scores = calculate_semantic_score_batch(dog_embeddings, adopter_embedding)

        results, factors = score_dogs_batch(adopter, eligible, adopter_embedding, dog_embeddings)

        paired = sorted(zip(results, factors), key = lambda pair: pair[0].overall_score, reverse = True)
        results = [r for r, _ in paired]
        factors = [f for _, f in paired]

        actual_order = [result.dog_id for result in results]

        order_mismatches = []
        comparison_counter = 0

        for i, dog_a in enumerate(case.expected_rank_order[:-1]):
            dog_b = case.expected_rank_order[i+1]

            if dog_a not in actual_order or dog_b not in actual_order:
                continue

            comparison_counter += 1

            if actual_order.index(dog_a) < actual_order.index(dog_b):
                pass
            else:
                order_mismatches.append((dog_a, dog_b))

        correct_count = comparison_counter - len(order_mismatches)


        exclusion_match = actually_excluded == set(case.expected_excluded)


        lines.append(
            f"\n{case.ranking_test_id}: \n"
            f"actual order = {', '.join([f'{r.dog_id}({r.overall_score:.3f})' for r in results])}  \n"
            f"expected order = {case.expected_rank_order} \n"
            f"{correct_count}/{comparison_counter} pairs correct {order_mismatches if len(order_mismatches) != 0 else ''} \n"
            f"excluded = {actually_excluded} | expected excluded = {set(case.expected_excluded)} | match = {exclusion_match} \n"
        )

        ## If want to see how each factor was scored/ranked, uncomment below:

        # for result, factor_list in zip(results, factors):
        #     lines.append(
        #         f"\t{result.dog_id} - overall: {result.overall_score:.3f}, "
        #         f"fuzzy: {result.fuzzy_score:.3f}, semantic: {result.semantic_score:.3f}"
        #     )
        #     for f in factor_list:
        #         warning_str = f", warning={f.warning}" if f.warning else ""
        #         lines.append(f"\t{f.variable}: score={f.score}, weight={f.weight}, label={f.label}{warning_str}\n")

    with open(output_path, "w") as f:
        f.write("\n".join(lines))

    print(f"Report written to {output_path}")

if __name__ == "__main__":
    run_report()

