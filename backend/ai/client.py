"""Thin wrapper around the Anthropic API. Isolated so the SDK/model can be
swapped without touching analyzer.py."""
import os
import anthropic

_client = None


def get_client() -> anthropic.Anthropic:
    global _client
    if _client is None:
        _client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
    return _client


def complete(system_prompt: str, user_content: str, model: str = "claude-sonnet-4-6", max_tokens: int = 1500) -> str:
    client = get_client()
    response = client.messages.create(
        model=model,
        max_tokens=max_tokens,
        system=system_prompt,
        messages=[{"role": "user", "content": user_content}],
    )
    return "".join(block.text for block in response.content if block.type == "text")
