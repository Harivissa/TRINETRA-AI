"""
Data repository — single abstraction over the data source.

Today this reads JSON files from /data. Later, swap the internals of
these functions for a Postgres/warehouse query and nothing above this
layer (engines, API routes, AI layer) has to change.
"""
import json
import os
from functools import lru_cache

DATA_ROOT = os.path.join(os.path.dirname(__file__), "..", "..", "data")


def _load_json(path: str) -> dict:
    with open(path, "r") as f:
        return json.load(f)


@lru_cache(maxsize=1)
def get_country_index() -> list[dict]:
    path = os.path.join(DATA_ROOT, "countries", "index.json")
    return _load_json(path)["countries"]


def get_country(country_id: str) -> dict | None:
    for entry in get_country_index():
        if entry["id"].upper() == country_id.upper():
            path = os.path.join(DATA_ROOT, "countries", entry["file"])
            if not os.path.exists(path):
                return None
            return _load_json(path)
    return None


def _slug_for(country_id: str) -> str | None:
    """Derive the folder-name slug for a country from its index 'file' entry
    (e.g. 'india.json' -> 'india'). Used to locate an optional deep-dive
    folder data/countries/<slug>/ for that country."""
    for entry in get_country_index():
        if entry["id"].upper() == country_id.upper():
            return entry["file"].rsplit(".", 1)[0]
    return None


def get_country_module(country_id: str, module: str) -> dict | None:
    """Look up an optional deep-dive module (history, politics, foreign_policy,
    sources, ...) for a country. Returns None if the country has no modular
    folder yet, or doesn't have this particular module populated — callers
    should treat None as 'Not enough reliable data' rather than an error,
    per the platform's no-fake-intelligence rule."""
    slug = _slug_for(country_id)
    if not slug:
        return None
    path = os.path.join(DATA_ROOT, "countries", slug, f"{module}.json")
    if not os.path.exists(path):
        return None
    return _load_json(path)


def get_country_modules_available(country_id: str) -> list[str]:
    """Which deep-dive modules exist for this country (e.g. ['history',
    'politics', 'foreign_policy', 'sources']). Empty list if the country
    has no modular folder yet — this is how the frontend knows which tabs
    to show instead of rendering empty ones."""
    slug = _slug_for(country_id)
    if not slug:
        return []
    folder = os.path.join(DATA_ROOT, "countries", slug)
    if not os.path.isdir(folder):
        return []
    return sorted(f.rsplit(".", 1)[0] for f in os.listdir(folder) if f.endswith(".json"))


def get_relationship(country_a: str, country_b: str) -> dict | None:
    """Relationship files are undirected — try both name orders."""
    candidates = [
        f"{country_a.lower()}-{country_b.lower()}.json",
        f"{country_b.lower()}-{country_a.lower()}.json",
    ]
    # Also try by matching country names used in filenames (e.g. india-china)
    a = get_country(country_a)
    b = get_country(country_b)
    if a and b:
        name_a = a["name"].lower().replace(" ", "-")
        name_b = b["name"].lower().replace(" ", "-")
        candidates += [f"{name_a}-{name_b}.json", f"{name_b}-{name_a}.json"]

    for fname in candidates:
        path = os.path.join(DATA_ROOT, "geopolitics", fname)
        if os.path.exists(path):
            return _load_json(path)
    return None


@lru_cache(maxsize=1)
def get_all_relationships() -> tuple:
    """Load every relationship file in data/geopolitics/. Returns a tuple
    (immutable, for lru_cache) of relationship dicts. Used for external-actor
    reasoning that needs to see the whole network, not just one pair."""
    geo_dir = os.path.join(DATA_ROOT, "geopolitics")
    if not os.path.isdir(geo_dir):
        return tuple()
    rels = []
    for fname in sorted(os.listdir(geo_dir)):
        if fname.endswith(".json"):
            rels.append(_load_json(os.path.join(geo_dir, fname)))
    return tuple(rels)


def get_relationships_for(country_id: str) -> list[dict]:
    """All relationship files that mention this country as either party."""
    cid = country_id.upper()
    return [r for r in get_all_relationships() if r.get("country_a") == cid or r.get("country_b") == cid]


def clear_cache():
    get_country_index.cache_clear()
    get_all_relationships.cache_clear()
