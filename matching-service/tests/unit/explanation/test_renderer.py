from explanation.renderer import render_explanation
from tests.helpers import make_factor

class TestRenderExplanation:
    def test_empty_factors_returns_correctly(self):
        top_bullets, warning_bullets =  render_explanation([], [])

        assert top_bullets == "No detailed compatibility notes available"
        assert warning_bullets == ""

    def test_top_factors_renders_correct_bullets(self):
        factors = [
            make_factor(variable = "size", label = "match"),
            make_factor(variable = "age", label = "match")
        ]

        top_bullets, warning_bullets = render_explanation(factors, [])

        expected = (
            "- This dog's size fits within your selected preference\n"
            "- This dog's age fits within your preferred range") 
        
        assert top_bullets == expected
        assert warning_bullets == ""

    def test_warning_factors_render_correct_bullets(self):
        factors = [
            make_factor(variable = "good_with_cats", label = "unknown", warning = "Unknown whether this dog is good with cats"),
            make_factor(variable = "home_location", label = "high_risk", warning = "Testing text comes from factor not template")
        ]

        top_bullets, warning_bullets = render_explanation([], factors)

        expected = (
            "- Unknown whether this dog is good with cats\n"
            "- Testing text comes from factor not template"
        )

        assert warning_bullets == expected

