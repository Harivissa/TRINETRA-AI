"""Strategic Consequence Chain engine.

Models how pressure moves across domains after a triggering event. This is
generic — it reasons from the SHAPE of the two countries' data (energy
import dependence, trade ties, etc.), not from hardcoded country logic.
Every chain is labeled as an analytical scenario, not a prediction.
"""


def _energy_importer(country: dict) -> bool:
    return country.get("energy", {}).get("net_import_dependence_ratio", 0) > 0.3


def build_chain(country_a: dict, country_b: dict, relationship: dict | None) -> dict:
    a_id, b_id = country_a["id"], country_b["id"]
    trade_notes = (relationship or {}).get("trade_dependencies", [])
    has_trade_link = bool(trade_notes)

    steps = [
        {
            "step": 1,
            "domain": "Diplomatic",
            "description": f"Diplomatic tension rises between {a_id} and {b_id}, following the disputes on file for this relationship.",
        },
        {
            "step": 2,
            "domain": "Military",
            "description": "Both sides raise military readiness / forward posture along contested areas.",
        },
        {
            "step": 3,
            "domain": "Trade",
            "description": (
                f"Trade between {a_id} and {b_id} comes under strain."
                if has_trade_link
                else f"{a_id} and {b_id} have limited direct trade on file, so this domain is less exposed for this pair specifically — but each side's trade with third parties may still be affected."
            ),
        },
        {
            "step": 4,
            "domain": "Shipping / supply chains",
            "description": "Shipping insurers and freight operators reassess risk on routes serving either country, which can raise costs even without a formal blockade.",
        },
        {
            "step": 5,
            "domain": "Energy markets",
            "description": (
                "Energy markets react with more sensitivity for the side more dependent on imports: "
                + ", ".join([c["id"] for c in (country_a, country_b) if _energy_importer(c)] or ["neither side shows high import dependence in the current data"])
                + "."
            ),
        },
        {
            "step": 6,
            "domain": "Inflation / economy",
            "description": "Higher shipping and energy costs feed into import costs and, with a lag, consumer inflation in both countries.",
        },
        {
            "step": 7,
            "domain": "External actors",
            "description": "Third countries with strong ties to either side (see External Actors) begin weighing whether to engage, mediate, or stay neutral.",
        },
        {
            "step": 8,
            "domain": "Global markets",
            "description": "Global equity and commodity markets price in elevated regional risk, particularly for sectors exposed to either economy.",
        },
        {
            "step": 9,
            "domain": "Off-ramp or escalation",
            "description": "The chain can break toward de-escalation (diplomatic engagement, third-party mediation) or continue toward the scenarios listed below — this branch point is where confidence is lowest.",
        },
    ]

    return {
        "chain_type": "Strategic Consequence Chain",
        "steps": steps,
        "note": (
            "This is an illustrative causal chain built from the two countries' data and their "
            "declared relationship, not a forecast of what will actually happen. Real crises can "
            "skip steps, stall indefinitely, or de-escalate at any point."
        ),
    }
