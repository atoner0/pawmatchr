"""
Central config for the matching service, loaded from environment variables
(see .env.example). Uses pydantic-settings so values are validated and typed
on startup rather than failing deep inside the scoring pipeline later.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import model_validator


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    port: int = 5001
    debug: bool = True

    semantic_model_name: str = "all-MiniLM-L6-v2"

    fuzzy_weight: float = 0.7
    semantic_weight: float = 0.3

    @model_validator(mode="after")
    def weights_must_sum_to_one(self) -> "Settings":
        total = self.fuzzy_weight + self.semantic_weight
        if abs(total - 1.0) > 1e-6:
            raise ValueError(
                f"fuzzy_weight + semantic_weight must sum to 1, got {total}"
            )
        return self


settings = Settings()
