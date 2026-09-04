"""Factual economic comparison fields from canonical country records."""


def analyze(country_a: dict, country_b: dict) -> dict:
    def build(country: dict) -> dict:
        economy = country.get("economy", {})
        return {
            "id": country["id"],
            "gdp_usd_trillion": economy.get("gdp_usd_trillion"),
            "gdp_growth_pct": economy.get("gdp_growth_pct"),
            "notes": economy.get("notes"),
            "meta": country.get("_meta", {}),
        }

    return {"country_a": build(country_a), "country_b": build(country_b), "note": "Factual fields from canonical country profiles; no resilience score."}
