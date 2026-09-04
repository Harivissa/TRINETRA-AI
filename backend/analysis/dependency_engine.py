"""Strategic dependency engine.

Answers: given these two countries, which supply-chain dependencies
involve either of them — as the exposed/dependent side or as the
supplier holding leverage.
"""
import json
import os

DEPENDENCIES_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "data", "geopolitics", "dependencies.json")


def _load_dependencies() -> list[dict]:
    if not os.path.exists(DEPENDENCIES_PATH):
        return []
    with open(DEPENDENCIES_PATH) as f:
        return json.load(f).get("dependencies", [])


def _as_list(v) -> list[str]:
    return v if isinstance(v, list) else [v]


def analyze(country_a: dict, country_b: dict) -> dict:
    a_id, b_id = country_a["id"], country_b["id"]
    relevant = []

    for dep in _load_dependencies():
        dependents = _as_list(dep["dependent"])
        suppliers = _as_list(dep["supplier"])
        involved = set(dependents) | set(suppliers)

        if not ({a_id, b_id} & involved):
            continue

        relevant.append({
            "id": dep["id"],
            "category": dep["category"],
            "commodity": dep["commodity"],
            "country_a_role": "dependent" if a_id in dependents else ("supplier" if a_id in suppliers else None),
            "country_b_role": "dependent" if b_id in dependents else ("supplier" if b_id in suppliers else None),
            "exposure": dep["exposure"],
            "alternatives": dep["alternatives"],
            "confidence": dep.get("confidence"),
            "record_type": dep.get("record_type"),
        })

    return {
        "relevant_dependencies": relevant,
        "note": (
            "A supply-chain dependency is leverage only in the sense that disrupting it is costly and slow to "
            "route around — most of these take months to years to meaningfully substitute, not an instant lever "
            "either side can pull without also damaging their own economy or industrial base."
        ),
    }
