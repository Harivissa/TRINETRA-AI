"""Strategic Resilience Profile.

Deliberately does NOT produce a single 'Country X = 171, Country Y = 63'
score. Instead shows each dimension side by side with a short explanation,
so a reader can see WHERE an edge comes from rather than trusting one
number. If a per-dimension edge exists it's noted, but the overall picture
is left as a multi-factor comparison, not a verdict.
"""


def build_profile(military: dict, economic: dict, energy: dict, infrastructure: dict) -> dict:
    dimensions = []

    dimensions.append({
        "dimension": "Military capability",
        "country_a_value": military["country_a"]["composite_score"],
        "country_b_value": military["country_b"]["composite_score"],
        "edge": military["edge"],
        "explains": "Combines active troop numbers, defence budget, and nuclear-weapons status.",
    })

    dimensions.append({
        "dimension": "Economic resilience",
        "country_a_value": economic["country_a"]["economic_resilience_score"],
        "country_b_value": economic["country_b"]["economic_resilience_score"],
        "edge": economic["edge"],
        "explains": "Combines the size of the economy (GDP) with how fast it's currently growing — a rough proxy for how much economic pressure a country can absorb.",
    })

    lower_energy_vuln = (
        energy["country_a"]["id"]
        if energy["country_a"]["energy_vulnerability_score"] < energy["country_b"]["energy_vulnerability_score"]
        else energy["country_b"]["id"]
    )
    dimensions.append({
        "dimension": "Energy resilience",
        "country_a_value": 100 - energy["country_a"]["energy_vulnerability_score"],
        "country_b_value": 100 - energy["country_b"]["energy_vulnerability_score"],
        "edge": lower_energy_vuln,
        "explains": "Higher means less exposed to an external energy-supply disruption (based on net import dependence).",
    })

    dimensions.append({
        "dimension": "Infrastructure data coverage",
        "country_a_value": len(infrastructure["country_a"].get("categories_tracked", [])),
        "country_b_value": len(infrastructure["country_b"].get("categories_tracked", [])),
        "edge": None,
        "explains": "Infrastructure resilience data is not yet populated for these countries — this only reflects how many categories are tracked, not actual resilience. Populate data/infrastructure/<country>.json to replace this placeholder.",
    })

    return {
        "dimensions": dimensions,
        "note": (
            "This is a multi-factor comparison, not a single composite 'who would win' score. "
            "Each dimension measures something different and should be read on its own terms — "
            "a country can lead on military capability while trailing on energy resilience, for example."
        ),
    }
