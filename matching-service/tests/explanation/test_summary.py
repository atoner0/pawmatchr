import pytest
from explanation.summary import summary_explanation
from unittest.mock import patch, MagicMock, AsyncMock

class TestSummaryExplanation:
    @pytest.mark.asyncio
    @patch("explanation.summary.client.chat.completions.create", new_callable=AsyncMock)
    async def test_success_path(self, mock_create):
        mock_response = MagicMock()
        mock_response.choices[0].message.content = "Rewritten prose here"
        mock_create.return_value = mock_response

        top_bullets = "- This dog is good with children"
        warning_bullets = "- Unknown whether this dog is good with cats"

        result_top, result_warnings = await summary_explanation(top_bullets, warning_bullets)

        assert result_top == "Rewritten prose here"
        assert result_warnings == warning_bullets

    @pytest.mark.asyncio    
    @patch("explanation.summary.client.chat.completions.create", new_callable=AsyncMock)
    async def test_empty_content_falls_back(self, mock_create):
        mock_response = MagicMock()
        mock_response.choices[0].message.content = ""
        mock_create.return_value = mock_response

        top_bullets = "- This dog is good with children"
        warning_bullets = "- Unknown whether this dog is good with cats"

        result_top, result_warnings = await summary_explanation(top_bullets, warning_bullets)

        assert result_top == top_bullets
        assert result_warnings == warning_bullets

    @pytest.mark.asyncio 
    @patch("explanation.summary.client.chat.completions.create", new_callable=AsyncMock)
    async def test_api_exception_falls_back(self, mock_create):
        mock_create.side_effect = Exception("API error")

        top_bullets = "- This dog is good with children"
        warning_bullets = "- Unknown whether this dog is good with cats"

        result_top, result_warnings = await summary_explanation(top_bullets, warning_bullets)

        assert result_top == top_bullets
        assert result_warnings == warning_bullets
