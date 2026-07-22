from unittest.mock import patch, AsyncMock
from explanation.generate import generate_explanation
from tests.helpers import make_factor

class TestGenerateExplanation:
    @patch("explanation.generate.summary_explanation", new_callable=AsyncMock)
    @patch("explanation.generate.render_explanation")
    @patch("explanation.generate.select_factors_for_explanation")
    async def test_pipeline_calls_each_stage_in_order(
        self, mock_select, mock_render, mock_summary
    ):
        factors = [make_factor()]
        mock_select.return_value = (["top"], ["warning"])
        mock_render.return_value = ("rendered top", "rendered warning")
        mock_summary.return_value = ("summarised top", "rendered warning")

        top_text = await generate_explanation(factors)

        mock_select.assert_called_once_with(factors)
        mock_render.assert_called_once_with(["top"], ["warning"])
        mock_summary.assert_called_once_with("rendered top", "rendered warning")

        assert top_text == "summarised top"