"""Economic comparison and resilience scoring."""


def analyze(country_a: dict, country_b: dict) -> dict:
    def resilience(c):
        e = c.get("economy", {})
        gdp = e.get("gdp_usd_trillion", 0)
        growth = e.get("gdp_growth_pct", 0)
        # larger economy + healthier growth = more resilient to sustained pressure
        raw = (gdp * 5) + (growth * 2)
        return round(raw, 1)

    def build(c):
        e = c.get("economy", {})
        return {
            "id": c["id"],
            "gdp_usd_trillion": e.get("gdp_usd_trillion"),
            "gdp_growth_pct": e.get("gdp_growth_pct"),
            "economic_resilience_score": resilience(c),
        }

    a, b = build(country_a), build(country_b)
    edge = country_a["id"] if a["economic_resilience_score"] > b["economic_resilience_score"] else country_b["id"]
    return {"country_a": a, "country_b": b, "edge": edge}
