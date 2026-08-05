from openai import AsyncOpenAI
from config import settings

client = AsyncOpenAI(api_key=settings.openai_api_key)

async def summary_explanation(top_bullets: str, warning_bullets: str) -> tuple[str, str]:
    """
    Attempts to rewrite the templated bullet text explanations into more natural prose via OpenAI API (gpt-4.1-nano)
    Falls back to original templated text on any failure, so function always returns usable text regardless of outcome

    Warnings returned untouched in every case
    """
    try:
        response = await client.chat.completions.create(
            model = "gpt-4.1-nano",
            max_tokens = 200,
            messages=[{
                "role": "user",
                "content": (
                    "Rewrite the following compatibility notes as clear, natural, conversational prose, 3-4 sentences. Use UK spelling and terminology (e.g. garden not yard). Avoid sales-style adjectives. Do not add any facts not listed below. Do not invent numbers. Do not generalise or rephrase a specific statement into a broader claim, keep notes framed around an adopter's home or space that way rather than a general statement. Preserve the exact meaning and direction of every comparison, if a note says tge adopter is more active than the dog needs, the rewritten sentence must still say the adopter is more active, not the dog\n\n"f"{top_bullets}"
                ),
            }],
        )
        summary = response.choices[0].message.content

        if not summary:
            return top_bullets, warning_bullets
        
        return summary, warning_bullets
    except Exception:
        return top_bullets, warning_bullets


