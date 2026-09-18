"""Relationship + external-actor analysis.

External actors are derived from the whole relationship network around
country A and country B (data/geopolitics/*.json), not a fixed alliance
bloc — a country can be a supporter of one side, an energy supplier to
the other, and a potential mediator, all at once. No permanent-alliance
assumption is made.
"""
from backend.data import repository


def _third_party_ties(country_id: str, exclude: set[str]) -> list[dict]:
    """All relationships this country has with anyone other than the
    two countries in the current comparison."""
    ties = []
    for rel in repository.get_relationships_for(country_id):
        other = rel["country_b"] if rel["country_a"] == country_id else rel["country_a"]
        if other in exclude:
            continue
        ties.append({**rel, "_other": other})
    return ties


def _classify_role(ties_to_a: list[dict], ties_to_b: list[dict]) -> dict:
    """Given a third country's ties to A and to B, infer its likely role
    and explain why."""
    cat_a = [t.get("classification", {}).get("category", t.get("relationship_type")) for t in ties_to_a]
    cat_b = [t.get("classification", {}).get("category", t.get("relationship_type")) for t in ties_to_b]

    strong = {"strategic_ally", "strategic_partner", "defence_partner"}
    has_strong_a = any(c in strong for c in cat_a)
    has_strong_b = any(c in strong for c in cat_b)

    if has_strong_a and has_strong_b:
        return {
            "role": "Potential mediator / strategic balancer",
            "reason": (
                "This country holds strong ties to both sides. Maintaining both "
                "relationships is usually more valuable to it than picking a side, "
                "giving it an incentive to encourage de-escalation rather than "
                "let the rivalry force a choice."
            ),
        }
    if has_strong_a and not has_strong_b:
        return {
            "role": "Likely supporter of Country A",
            "reason": "This country has a strategic-ally or strategic-partner tie to Country A and no comparable tie to Country B.",
        }
    if has_strong_b and not has_strong_a:
        return {
            "role": "Likely supporter of Country B",
            "reason": "This country has a strategic-ally or strategic-partner tie to Country B and no comparable tie to Country A.",
        }
    if cat_a or cat_b:
        return {
            "role": "Economically exposed, likely to stay neutral",
            "reason": "This country has some economic or diplomatic ties to one or both sides, but nothing strong enough to indicate it would take sides.",
        }
    return {
        "role": "Not directly connected",
        "reason": "No recorded relationship to either country in the current dataset.",
    }


def analyze(country_a: dict, country_b: dict, relationship: dict | None) -> dict:
    a_id, b_id = country_a["id"], country_b["id"]
    exclude = {a_id, b_id}

    ties_a = _third_party_ties(a_id, exclude)
    ties_b = _third_party_ties(b_id, exclude)

    third_parties = sorted({t["_other"] for t in ties_a} | {t["_other"] for t in ties_b})

    external_actors = []
    for country_id in third_parties:
        a_side = [t for t in ties_a if t["_other"] == country_id]
        b_side = [t for t in ties_b if t["_other"] == country_id]
        classification = _classify_role(a_side, b_side)
        external_actors.append({
            "country": country_id,
            "role": classification["role"],
            "reason": classification["reason"],
            "tie_to_a": a_side[0].get("classification", {}).get("category") if a_side else None,
            "tie_to_b": b_side[0].get("classification", {}).get("category") if b_side else None,
        })

    # Fall back to alliance/rival lists on the country files themselves,
    # for any actor not covered by a dedicated relationship file yet.
    allies_a = set(country_a.get("alliances", []))
    allies_b = set(country_b.get("alliances", []))
    covered = {e["country"] for e in external_actors}
    for extra in sorted((allies_a | allies_b) - covered - exclude):
        in_a, in_b = extra in allies_a, extra in allies_b
        if in_a and in_b:
            role, reason = "Potential mediator / strategic balancer", "Declared as an ally in both countries' data files, based on alliance lists rather than a dedicated relationship file."
        elif in_a:
            role, reason = "Likely supporter of Country A", "Declared as an ally of Country A in its country data file."
        else:
            role, reason = "Likely supporter of Country B", "Declared as an ally of Country B in its country data file."
        external_actors.append({"country": extra, "role": role, "reason": reason, "tie_to_a": None, "tie_to_b": None})

    return {
        "relationship": relationship or {"note": "No dedicated relationship file found for this pair — treating as neutral/undefined."},
        "external_actors": external_actors,
        "note": (
            "Roles are inferred from declared relationship data and are analytical judgments, "
            "not predictions of what any government will actually do."
        ),
    }
