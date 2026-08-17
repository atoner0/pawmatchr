import csv
from dataclasses import dataclass

BOOL_FIELDS = {"current_pets", "children", "first_time_owner", "multi_pet_exp"}
LIST_FIELDS = {"current_pet_type", "age_pref", "size_pref", "behavioural_flags", "known_triggers", "dog_ids", "expected_rank_order", "expected_excluded"}

def _convert_value(field_name, raw_value):
    raw_value = raw_value.strip()
    if raw_value == "":
        return None
    if field_name in BOOL_FIELDS:
        return raw_value.lower() == "yes"
    if field_name in LIST_FIELDS:
        return [v.strip() for v in raw_value.split(",")]
    return raw_value

# csv.DictReader usage and building of custom classes from CSV data based on Labex.io tutorial:
# How to convert CSV data into Python instances
# Available at: https://labex.io/tutorials/python-how-to-convert-csv-data-into-python-instances-397962

def load_adopters(csv_path):
    adopters = {}
    with open(csv_path, newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            adopter_id = row.pop("adopter_id")
            overrides = {
                k: _convert_value(k, v)
                for k, v in row.items()
                if _convert_value(k, v) is not None
            }
            adopters[adopter_id] = overrides
    return adopters

def load_dogs(csv_path):
    dogs = {}
    with open(csv_path, newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            dog_id = int(row.pop("dog_id"))
            overrides = {
                k: _convert_value(k, v)
                for k, v in row.items()
                if _convert_value(k, v) is not None
            }
            overrides["dog_id"] = dog_id
            dogs[dog_id] = overrides
    return dogs

@dataclass
class TestCase:
    test_id: str
    adopter_overrides: dict
    dog_overrides: dict
    category: str
    expected_hard_filter_result: str
    expected_weight_profile: str
    expected_final_score_band: str

def load_test_cases(csv_path, adopters, dogs):
    cases = []
    with open(csv_path, newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            cases.append(TestCase (
                test_id=row["test_id"],
                adopter_overrides=adopters[row["adopter_id"]],
                dog_overrides=dogs[int(row["dog_id"])],
                category=row["category"],
                expected_hard_filter_result=row["expected_hard_filter_result"],
                expected_weight_profile=row["expected_weight_profile"],
                expected_final_score_band=row["expected_final_score_band"]
            ))
    return cases

@dataclass
class RankingTestCase:
    ranking_test_id: str
    adopter_overrides: dict
    dog_overrides_list: list
    expected_rank_order: list
    expected_excluded: list

def load_ranking_test_cases(csv_path, adopters, dogs):
    cases = []
    with open(csv_path, newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            dog_ids = [int(d) for d in (_convert_value("dog_ids", row["dog_ids"]) or [])]
            expected_rank_order = [int(d) for d in (_convert_value("expected_rank_order", row["expected_rank_order"]) or [])]
            expected_excluded = [int(d) for d in (_convert_value("expected_excluded", row["expected_excluded"]) or [])]

            cases.append(RankingTestCase (
                ranking_test_id=row["ranking_test_id"],
                adopter_overrides=adopters[row["adopter_id"]],
                dog_overrides_list=[dogs[dog_id] for dog_id in dog_ids],
                expected_rank_order=expected_rank_order,
                expected_excluded=expected_excluded
            ))
    return cases
