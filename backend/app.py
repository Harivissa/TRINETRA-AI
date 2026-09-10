"""
Trinetra AI — Flask backend.

Run: python3 -m backend.app
Endpoints mirror the original API design (countries, relationships,
rivalry analysis). Data is loaded through backend/data/repository.py so
JSON can later be swapped for Postgres without touching routes.
"""
import logging
import os

from flask import Flask, jsonify, request
from flask_cors import CORS
from pydantic import ValidationError

from backend.data import repository
from backend.schemas.country import CountrySchema
from backend.analysis import strategic_engine
from backend.ai import analyzer

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("trinetra")

app = Flask(__name__)
CORS(app)


@app.get("/api/countries")
def list_countries():
    return jsonify(repository.get_country_index())


@app.get("/api/countries/<country_id>")
def get_country(country_id: str):
    country = repository.get_country(country_id)
    if not country:
        return jsonify({"error": f"Country '{country_id}' not found"}), 404
    try:
        CountrySchema(**country)
    except ValidationError as e:
        logger.warning("Invalid country data for %s: %s", country_id, e)
        return jsonify({"error": "Invalid country data", "details": e.errors()}), 422
    return jsonify(country)


@app.get("/api/countries/<country_id>/energy")
def get_country_energy(country_id: str):
    country = repository.get_country(country_id)
    if not country:
        return jsonify({"error": f"Country '{country_id}' not found"}), 404
    return jsonify(country.get("energy", {}))


@app.get("/api/countries/<country_id>/infrastructure")
def get_country_infra(country_id: str):
    country = repository.get_country(country_id)
    if not country:
        return jsonify({"error": f"Country '{country_id}' not found"}), 404
    return jsonify(country.get("infrastructure", {}))


@app.get("/api/countries/<country_id>/modules")
def get_country_modules(country_id: str):
    """Which deep-dive modules (history, politics, foreign_policy, sources)
    exist for this country. Empty list if it only has the base profile."""
    country = repository.get_country(country_id)
    if not country:
        return jsonify({"error": f"Country '{country_id}' not found"}), 404
    return jsonify({"available_modules": repository.get_country_modules_available(country_id)})


@app.get("/api/countries/<country_id>/<module>")
def get_country_module_generic(country_id: str, module: str):
    """Generic deep-dive module route — covers history, politics,
    foreign_policy, sources, and any future module, without a new route
    per module. Returns 404 with a clear message (never invented data)
    if the module isn't populated for this country yet."""
    country = repository.get_country(country_id)
    if not country:
        return jsonify({"error": f"Country '{country_id}' not found"}), 404
    data = repository.get_country_module(country_id, module)
    if data is None:
        return jsonify({
            "error": "Not enough reliable data",
            "detail": f"No '{module}' module has been populated for {country['name']} yet.",
        }), 404
    return jsonify(data)


@app.get("/api/relationships/<country_a>/<country_b>")
def get_relationship(country_a: str, country_b: str):
    rel = repository.get_relationship(country_a, country_b)
    if not rel:
        return jsonify({"error": "No relationship data found for this pair"}), 404
    return jsonify(rel)


@app.post("/api/analysis/rivalry")
def run_rivalry():
    body = request.get_json(force=True, silent=True) or {}
    a_id, b_id = body.get("country_a"), body.get("country_b")
    if not a_id or not b_id:
        return jsonify({"error": "country_a and country_b are required"}), 400

    country_a = repository.get_country(a_id)
    country_b = repository.get_country(b_id)
    if not country_a or not country_b:
        return jsonify({"error": "One or both countries not found"}), 404

    relationship = repository.get_relationship(a_id, b_id)
    analysis = strategic_engine.run_rivalry_analysis(country_a, country_b, relationship)

    pair = {a_id.upper(), b_id.upper()}
    chokepoints = []
    for checkpoint in repository.get_chokepoints():
        exposed = {item.get("country") for item in checkpoint.get("countries_most_exposed", [])}
        leverage = {item.get("country") for item in checkpoint.get("countries_with_leverage", [])}
        if (exposed | leverage) & pair:
            chokepoints.append(checkpoint)
    modules = repository.get_modules_for_pair(a_id, b_id)
    analysis["country_a_profile"] = country_a
    analysis["country_b_profile"] = country_b
    analysis["source_relationship"] = relationship
    analysis["comparison_data"] = {
        "chokepoints": chokepoints,
        "pair_modules": modules,
        "external_actor_records": repository.get_external_actor_records(a_id, b_id),
        "availability": {
            "country_profiles": True,
            "bilateral_relationship": relationship is not None,
            "chokepoints": bool(chokepoints),
            "pair_modules": bool(modules),
            "source_metadata": bool(country_a.get("_meta") or country_b.get("_meta")),
            "external_actor_records": bool(repository.get_external_actor_records(a_id, b_id)),
        },
    }

    include_ai = body.get("include_ai_summary", False)
    if include_ai:
        try:
            analysis["ai_summary"] = analyzer.explain_rivalry(analysis)
        except Exception as e:
            logger.exception("AI summary failed")
            analysis["ai_summary_error"] = str(e)

    return jsonify(analysis)


@app.get("/api/network")
def get_network():
    """Nodes/edges for the strategic network view — built dynamically
    from country alliance/rival declarations, no hardcoded graph."""
    countries = repository.get_country_index()
    nodes = [{"id": c["id"], "label": c["name"], "type": "country"} for c in countries]
    edges = []
    for entry in countries:
        full = repository.get_country(entry["id"])
        if not full:
            continue
        for ally in full.get("alliances", []):
            edges.append({"source": entry["id"], "target": ally, "type": "alliance"})
        for rival in full.get("rivals", []):
            edges.append({"source": entry["id"], "target": rival, "type": "rivalry"})
    return jsonify({"nodes": nodes, "edges": edges})


@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "engine": "static+ai" if os.environ.get("ANTHROPIC_API_KEY") else "static"})


if __name__ == "__main__":
    app.run(debug=True, port=8000)
