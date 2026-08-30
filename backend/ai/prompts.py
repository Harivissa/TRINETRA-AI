"""Loads prompt text from config/prompts/ — never hardcode prompt strings
in application code."""
import os

PROMPT_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "config", "prompts")


def load_prompt(name: str) -> str:
    path = os.path.join(PROMPT_DIR, f"{name}.txt")
    with open(path, "r") as f:
        return f.read()
