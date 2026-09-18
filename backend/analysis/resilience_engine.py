"""Non-scored resilience comparison metadata."""


def build_profile(military: dict, economic: dict, energy: dict, infrastructure: dict) -> dict:
    return {
        "dimensions": [
            {"dimension": "Military capability", "country_a_value": None, "country_b_value": None, "edge": None, "explains": "Compare the source-backed military fields above; no composite score is calculated."},
            {"dimension": "Economic position", "country_a_value": None, "country_b_value": None, "edge": None, "explains": "GDP and growth are shown as separate source-backed metrics; no resilience score is calculated."},
            {"dimension": "Energy dependence", "country_a_value": energy["country_a"].get("net_import_dependence_ratio"), "country_b_value": energy["country_b"].get("net_import_dependence_ratio"), "edge": None, "explains": "Stored net import dependence ratio; interpretation remains source-dependent."},
        ],
        "note": "TRINETRA does not assign a single country score or winner. Read each factual metric with its source and reference context.",
    }
