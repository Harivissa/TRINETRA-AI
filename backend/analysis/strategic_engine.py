"""Top-level orchestrator. Combines all engines — contains no country-specific
logic itself, only composition."""
import json
import os
from backend.analysis import (
    military_engine,
    economic_engine,
    energy_engine,
    infrastructure_engine,
    geopolitical_engine,
    scenario_engine,
    resilience_engine,
    consequence_chain_engine,
    chokepoint_engine,
    dependency_engine,
)

DEEP_DIVE_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data", "relationships", "strategic")


def _load_deep_dive_analyses(country_a: dict, country_b: dict) -> list[dict]:
    """Attach the fully-worked FACT/ASSESSMENT/SCENARIO analysis objects
    (currently built for the India-China-Russia-USA system) when they're
    relevant to this pair. Falls back to an empty list for any pair that
    doesn't have a dedicated deep-dive yet — never invents one."""
    ids = {country_a["id"], country_b["id"]}
    if not ids >= {"IND", "CHN"}:
        return []
    analyses = []
    for fname in ["analysis-russia-india-china-dilemma.json", "analysis-usa-india-china-position.json"]:
        path = os.path.join(DEEP_DIVE_DIR, fname)
        if os.path.exists(path):
            with open(path) as f:
                analyses.append(json.load(f))
    return analyses


def run_rivalry_analysis(country_a: dict, country_b: dict, relationship: dict | None) -> dict:
    military = military_engine.analyze(country_a, country_b)
    economic = economic_engine.analyze(country_a, country_b)
    energy = energy_engine.analyze(country_a, country_b)
    infrastructure = infrastructure_engine.analyze(country_a, country_b)
    geopolitical = geopolitical_engine.analyze(country_a, country_b, relationship)
    scenarios = scenario_engine.analyze(country_a, country_b, relationship)
    resilience_profile = resilience_engine.build_profile(military, economic, energy, infrastructure)
    consequence_chain = consequence_chain_engine.build_chain(country_a, country_b, relationship)
    chokepoints = chokepoint_engine.analyze(country_a, country_b)
    dependencies = dependency_engine.analyze(country_a, country_b)
    deep_dive_analyses = _load_deep_dive_analyses(country_a, country_b)

    return {
        "country_a": {"id": country_a["id"], "name": country_a["name"]},
        "country_b": {"id": country_b["id"], "name": country_b["name"]},
        "military": military,
        "economic": economic,
        "energy": energy,
        "infrastructure": infrastructure,
        "geopolitical": geopolitical,
        "scenarios": scenarios,
        "resilience_profile": resilience_profile,
        "consequence_chain": consequence_chain,
        "chokepoints": chokepoints,
        "dependencies": dependencies,
        "deep_dive_analyses": deep_dive_analyses,
    }
