"""Factual energy-dependence fields from canonical country records."""


def analyze(country_a: dict, country_b: dict) -> dict:
    def build(country: dict) -> dict:
        energy = country.get("energy", {})
        return {"id": country["id"], "net_import_dependence_ratio": energy.get("net_import_dependence_ratio"), "note": energy.get("note"), "meta": country.get("_meta", {})}

    return {"country_a": build(country_a), "country_b": build(country_b), "note": "Dependence is shown as stored; no vulnerability score is inferred."}
