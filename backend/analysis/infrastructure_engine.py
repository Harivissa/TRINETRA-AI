"""Critical infrastructure resilience — strategic-importance analysis only,
never exploitable operational detail."""


def analyze(country_a: dict, country_b: dict) -> dict:
    def build(c):
        infra = c.get("infrastructure", {})
        return {
            "id": c["id"],
            "categories_tracked": list(infra.keys()) or ["power", "ports", "rail", "telecom", "data_centers"],
            "note": "Populate data/infrastructure/<country>.json with per-category resilience data.",
        }

    return {"country_a": build(country_a), "country_b": build(country_b)}
