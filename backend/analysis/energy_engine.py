"""Energy Resilience / Dependence / Vulnerability scoring.

Strategic-consequence analysis only — this module never produces
operational guidance for targeting energy infrastructure.
"""


def _scores(c: dict) -> dict:
    dep_ratio = c.get("energy", {}).get("net_import_dependence_ratio", 0)
    # dep_ratio: positive = net importer (more vulnerable), negative = net exporter (more resilient)
    dependence = max(0, min(100, round(50 + dep_ratio * 40)))
    resilience = 100 - dependence
    vulnerability = round(dependence * 0.8, 1)
    return {
        "net_import_dependence_ratio": dep_ratio,
        "energy_dependence_score": dependence,
        "energy_resilience_score": resilience,
        "energy_vulnerability_score": vulnerability,
    }


def analyze(country_a: dict, country_b: dict) -> dict:
    a = {"id": country_a["id"], **_scores(country_a)}
    b = {"id": country_b["id"], **_scores(country_b)}
    more_exposed = a["id"] if a["energy_vulnerability_score"] > b["energy_vulnerability_score"] else b["id"]
    return {"country_a": a, "country_b": b, "more_exposed_to_energy_pressure": more_exposed}
