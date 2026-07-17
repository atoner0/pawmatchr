from explanation.templates import TEMPLATES
from schemas import ScoringFactor

def render_explanation(
        top_factors: list[ScoringFactor], 
        warning_factors: list[ScoringFactor]
        ) -> tuple[str, str]:
    """
    Renders the selected top factors and warning factors as bullet-list strings.

    Top factors are rendered via TEMPLATES, keyed by (variable, label).
    Warning factors use the warning string already set on the warning_factor itself

    """
    top_lines = [
        TEMPLATES[factor.variable][factor.label]
        for factor in top_factors
    ]

    top_bullets = "\n".join(f"- {line}" for line in top_lines)
    
    warning_lines = [factor.warning for factor in warning_factors]

    warning_bullets = "\n".join(f"- {line}" for line in warning_lines)

    if top_lines == []:
        return "No detailed compatibility notes available", warning_bullets
    # no check for warning_lines == [], mobile app just wont show if it is empty
    else:
        return top_bullets, warning_bullets
        