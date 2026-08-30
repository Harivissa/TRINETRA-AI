"""Generic scenario engine. No per-pair hardcoded logic — every scenario
is derived from country data + relationship data passed in."""

SCENARIO_TEMPLATES = [
    "Diplomatic crisis",
    "Limited conflict",
    "Economic confrontation",
    "Energy disruption",
    "Infrastructure disruption",
    "Regional escalation",
    "Large-scale conventional conflict",
    "De-escalation",
]


def analyze(country_a: dict, country_b: dict, relationship: dict | None) -> list[dict]:
    escalation_factors = (relationship or {}).get("escalation_factors", [])
    deescalation_factors = (relationship or {}).get("deescalation_factors", [])
    disputes = (relationship or {}).get("major_disputes", [])

    scenarios = []
    for name in SCENARIO_TEMPLATES:
        if name == "De-escalation":
            probability = "elevated" if deescalation_factors else "low"
            triggers = deescalation_factors or ["Sustained diplomatic engagement"]
        else:
            probability = "elevated" if escalation_factors else "low"
            triggers = escalation_factors or disputes or ["Underlying strategic competition"]

        scenarios.append({
            "scenario": name,
            "actors": [country_a["id"], country_b["id"]],
            "trigger_factors": triggers,
            "probability_estimate": probability,
            "probability_note": "Analytical estimate only, not a forecast.",
            "off_ramps": deescalation_factors or ["Third-party mediation", "Track-two diplomacy"],
        })
    return scenarios
