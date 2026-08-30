"""Chokepoint leverage engine.

Answers: given these two countries, which strategic maritime/energy
chokepoints matter, who is exposed, and who has geographic leverage over
whom. This is what turns 'China has the edge' into 'China has the edge on
paper, but is structurally exposed at the Malacca Strait, where India has
a real — though limited — geographic leverage point.'
"""
import json
import os

CHOKEPOINTS_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "data", "geopolitics", "chokepoints.json")


def _load_chokepoints() -> list[dict]:
    if not os.path.exists(CHOKEPOINTS_PATH):
        return []
    with open(CHOKEPOINTS_PATH) as f:
        return json.load(f).get("chokepoints", [])


def analyze(country_a: dict, country_b: dict) -> dict:
    a_id, b_id = country_a["id"], country_b["id"]
    relevant = []

    for cp in _load_chokepoints():
        exposed_ids = {e["country"] for e in cp.get("countries_most_exposed", [])}
        leverage_ids = {e["country"] for e in cp.get("countries_with_leverage", [])}

        if not ({a_id, b_id} & (exposed_ids | leverage_ids)):
            continue

        a_exposure = next((e for e in cp["countries_most_exposed"] if e["country"] == a_id), None)
        b_exposure = next((e for e in cp["countries_most_exposed"] if e["country"] == b_id), None)
        a_leverage = next((e for e in cp["countries_with_leverage"] if e["country"] == a_id), None)
        b_leverage = next((e for e in cp["countries_with_leverage"] if e["country"] == b_id), None)

        relevant.append({
            "chokepoint": cp["name"],
            "why_it_matters": cp["why_it_matters"],
            "country_a_exposure": a_exposure,
            "country_b_exposure": b_exposure,
            "country_a_leverage": a_leverage,
            "country_b_leverage": b_leverage,
        })

    return {
        "relevant_chokepoints": relevant,
        "note": (
            "Geographic leverage over a chokepoint is not the same as the ability to unilaterally close it — "
            "most chokepoints are bordered by multiple sovereign states and used by global shipping, not just "
            "the two countries being compared. Treat 'leverage' here as a real but bounded strategic asset, "
            "not a guaranteed blockade capability."
        ),
    }
