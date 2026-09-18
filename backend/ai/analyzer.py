"""AI explanation layer. Receives already-computed scores/data and explains
them in natural language — never recalculates statistics itself."""
import json
from backend.ai import prompts, client


def explain_rivalry(analysis: dict) -> str:
    system_prompt = prompts.load_prompt("strategic_analysis")
    user_content = (
        "Here is the structured analytical data for this rivalry:\n\n"
        + json.dumps(analysis, indent=2)
    )
    return client.complete(system_prompt, user_content)
