from tests.helpers import make_factor
from explanation.selection import select_factors_for_explanation

class TestSelectFactorsForExplanation:
    def test_empty_list_returns_empty_tuples(self):
        top_factors, warning_factors = select_factors_for_explanation([])

        assert top_factors == []
        assert warning_factors == []

    def test_fewer_factors_than_top_n(self):

        factor = make_factor()

        top_factors, warning_factors = select_factors_for_explanation([factor])

        assert top_factors == [factor]
        assert warning_factors == []

    def test_truncates_to_top_n_when_more_factors_than_top_n(self):
        factors = [
            make_factor(variable = "a", weight = 0.16, score = 0.0),
            make_factor(variable = "b", weight = 0.10, score = 0.0),
            make_factor(variable = "c", weight = 0.06, score = 0.0)
        ]

        top_factors, warning_factors = select_factors_for_explanation(factors, top_n = 2)

        assert len(top_factors) == 2
        assert [f.variable for f in top_factors] == ["a", "b"]


    def test_ranks_by_weight_times_score_deviation(self):
        factors = [
            make_factor(variable = "a", weight = 0.16, score = 0.0),
            make_factor(variable = "b", weight = 0.10, score = 0.5),
            make_factor(variable = "c", weight = 0.06, score = 0.75)
        ]
        

        top_factors, warning_factors = select_factors_for_explanation(factors)

        assert [f.variable for f in top_factors] == ["a", "b", "c"]

    def test_ties_broken_by_weight(self):
        factors = [
            make_factor(variable = "a", weight = 0.10, score = 0.0), #0.1
            make_factor(variable = "b", weight = 0.16, score = 0.375) #0.1
        ]
        
        top_factors, warning_factors = select_factors_for_explanation(factors)

        assert [f.variable for f in top_factors] == ["b", "a"]

    def test_all_factors_have_warnings_returns_empty_top_factors(self):

        factors = [
            make_factor(variable = "a", warning = "Unknown if dog is good with cats"),
            make_factor(variable = "b", warning = "Unknown if dog is good with other dogs"),
            make_factor(variable = "c", warning = "Unknown if dog is good with children")
        ]

        top_factors, warning_factors = select_factors_for_explanation(factors)

        assert top_factors == []
        assert [f.variable for f in warning_factors] == ["a", "b", "c"]

    def test_warning_factor_not_included_in_top(self):
        warning_factor = make_factor(
            variable = "cat", weight = 0.20, score = 0.0, warning = "Unknown whether this dog is good with cats"
        )

        normal_factor = make_factor(weight = 0.05, score = 0.5)

        top_factors, warning_factors = select_factors_for_explanation([warning_factor, normal_factor])

        assert warning_factor not in top_factors
        assert warning_factor in warning_factors
        assert normal_factor in top_factors

