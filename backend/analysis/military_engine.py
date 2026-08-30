"""Military comparison — deterministic scoring, no country-specific logic."""


def analyze(country_a: dict, country_b: dict) -> dict:
    def score(c):
        m = c.get("military", {})
        troops = m.get("active_troops", 0)
        spend = m.get("defence_spending_usd_billion", 0)
        nuclear = c.get("nuclear", {}).get("weapons_state", False)
        # simple normalized composite — troops and spend weighted, nuclear as a flag bonus
        raw = (troops / 100000) * 0.4 + spend * 0.5 + (15 if nuclear else 0)
        return round(raw, 1)

    score_a, score_b = score(country_a), score(country_b)
    return {
        "country_a": {
            "id": country_a["id"],
            "active_troops": country_a.get("military", {}).get("active_troops"),
            "defence_spending_usd_billion": country_a.get("military", {}).get("defence_spending_usd_billion"),
            "nuclear_state": country_a.get("nuclear", {}).get("weapons_state"),
            "composite_score": score_a,
        },
        "country_b": {
            "id": country_b["id"],
            "active_troops": country_b.get("military", {}).get("active_troops"),
            "defence_spending_usd_billion": country_b.get("military", {}).get("defence_spending_usd_billion"),
            "nuclear_state": country_b.get("nuclear", {}).get("weapons_state"),
            "composite_score": score_b,
        },
        "edge": country_a["id"] if score_a > score_b else (country_b["id"] if score_b > score_a else "even"),
    }
