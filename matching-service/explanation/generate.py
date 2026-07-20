from schemas import ScoringFactor
from explanation.selection import select_factors_for_explanation
from explanation.renderer import render_explanation
from explanation.summary import summary_explanation

async def generate_explanation(factors: list[ScoringFactor]) -> str:
    """
    Full explanation pipeline. Selects the most relevant factors, renders them into templated bullet text, then attempts to summarise the top bullets into more natural prose via the LLM summary layer.

    Returns the final explanation text. Warning text is intentionally not included as MatchResult.warnings already carries the raw warning strings
    """
    top_factors, warning_factors = select_factors_for_explanation(factors)
    top_bullets, warning_bullets = render_explanation(top_factors, warning_factors)
    top_text, _ = await summary_explanation(top_bullets, warning_bullets)

    return top_text