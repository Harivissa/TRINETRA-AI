"""Top-level orchestrator. Combines all engines - contains no country-specific
logic itself, only composition.

Phase 1 update: deep-dive analysis lookup now goes through the
repository/DB layer instead of reading JSON files directly.
"""
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
)
from backend.data import repository


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
    deep_dive_analyses = repository.get_deep_dive_analyses(country_a["id"], country_b["id"])

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
        "deep_dive_analyses": deep_dive_analyses,
    }
