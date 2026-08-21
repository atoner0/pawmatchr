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
            model = "gpt-4.1-mini",
            max_tokens = 200,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Rewrite compatibility notes as clear, natural, conversational prose, 3-4 sentences. Use UK spelling and terminology (e.g. garden not yard). Avoid sales-style adjectives. Every claim in your rewrite must be directly stated in the notes provided - do not add, infer, or elaborate on any fact, number, comparison, direction, or degree that is not explicitly present."
                    ),
                },
                {
                    "role": "user",
                    "content": top_bullets
                }
            ],
        )
        summary = response.choices[0].message.content

        if not summary:
            return top_bullets, warning_bullets
        
        return summary, warning_bullets
    except Exception:
        return top_bullets, warning_bullets


