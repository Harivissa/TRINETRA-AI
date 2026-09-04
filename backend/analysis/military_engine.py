"""Factual military comparison fields from the canonical country records."""


def analyze(country_a: dict, country_b: dict) -> dict:
    def build(country: dict) -> dict:
        military = country.get("military", {})
        return {
            "id": country["id"],
            "active_troops": military.get("active_troops"),
            "defence_spending_usd_billion": military.get("defence_spending_usd_billion"),
            "defence_spending_pct_gdp": military.get("defence_spending_pct_gdp"),
            "nuclear_state": country.get("nuclear", {}).get("weapons_state"),
            "strengths": country.get("strengths", []),
            "vulnerabilities": country.get("vulnerabilities", []),
            "meta": country.get("_meta", {}),
        }

    return {"country_a": build(country_a), "country_b": build(country_b), "note": "Factual fields from canonical country profiles; no composite score."}
