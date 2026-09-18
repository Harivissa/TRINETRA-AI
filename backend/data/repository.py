"""
Data repository — single abstraction over the data source.

Phase 1 update: this now reads from the SQLite database (backend/db/)
instead of JSON files directly. Every function signature and return
shape is UNCHANGED from the JSON-backed version, so nothing above this
layer (analysis engines, API routes, AI layer) needed to change.

The original JSON files under data/ remain the human-editable source
of truth — re-run `python3 -m backend.db.migrate` after editing them
to sync the database. See DATABASE_ARCHITECTURE.md.
"""
from functools import lru_cache

from backend.db.database import get_session
from backend.db.models import Country, CountryModule, Relationship, Chokepoint


@lru_cache(maxsize=1)
def get_country_index() -> list[dict]:
    session = get_session()
    try:
        rows = session.query(Country).all()
        return [
            {"id": r.id, "name": r.name, "file": r.source_file}
            for r in rows
        ]
    finally:
        session.close()


def get_country(country_id: str) -> dict | None:
    session = get_session()
    try:
        row = session.query(Country).filter(Country.id == country_id.upper()).first()
        return row.payload if row else None
    finally:
        session.close()


def _slug_for(country_id: str) -> str | None:
    """Derive the folder-name slug for a country from its stored source
    filename (e.g. 'india.json' -> 'india'). Used to match CountryModule
    rows, which were migrated from data/countries/<slug>/<module>.json."""
    session = get_session()
    try:
        row = session.query(Country).filter(Country.id == country_id.upper()).first()
        if not row or not row.source_file:
            return None
        return row.source_file.rsplit(".", 1)[0]
    finally:
        session.close()


def get_country_module(country_id: str, module: str) -> dict | None:
    """Look up an optional deep-dive module (history, politics, foreign_policy,
    sources, ...) for a country. Returns None if not populated — callers
    should treat None as 'Not enough reliable data', not an error."""
    session = get_session()
    try:
        row = session.query(CountryModule).filter(
            CountryModule.country_id == country_id.upper(),
            CountryModule.module == module,
        ).first()
        return row.payload if row else None
    finally:
        session.close()


def get_country_modules_available(country_id: str) -> list[str]:
    session = get_session()
    try:
        rows = session.query(CountryModule.module).filter(
            CountryModule.country_id == country_id.upper()
        ).all()
        return sorted(r[0] for r in rows)
    finally:
        session.close()


def get_relationship(country_a: str, country_b: str) -> dict | None:
    """Relationships are undirected — try both orderings. Only searches
    data/geopolitics/-sourced records (the ones with country_a/country_b
    fields), matching the original JSON-backed behaviour."""
    a, b = country_a.upper(), country_b.upper()
    session = get_session()
    try:
        row = session.query(Relationship).filter(
            ((Relationship.country_a == a) & (Relationship.country_b == b))
            | ((Relationship.country_a == b) & (Relationship.country_b == a))
        ).first()
        return row.payload if row else None
    finally:
        session.close()


@lru_cache(maxsize=1)
def get_all_relationships() -> tuple:
    """Load every relationship record that has both country_a and
    country_b set. Returns a tuple (immutable, for lru_cache)."""
    session = get_session()
    try:
        rows = session.query(Relationship).filter(
            Relationship.country_a.isnot(None),
            Relationship.country_b.isnot(None),
        ).all()
        return tuple(r.payload for r in rows)
    finally:
        session.close()


def get_relationships_for(country_id: str) -> list[dict]:
    """All relationships that mention this country as either party."""
    cid = country_id.upper()
    return [r for r in get_all_relationships() if r.get("country_a") == cid or r.get("country_b") == cid]


def get_chokepoints() -> list[dict]:
    session = get_session()
    try:
        rows = session.query(Chokepoint).all()
        return [r.payload for r in rows]
    finally:
        session.close()


def get_modules_for_pair(country_a: str, country_b: str) -> list[dict]:
    """Return only relationship records whose declared pair matches the
    requested pair exactly."""
    wanted = {country_a.upper(), country_b.upper()}
    modules = []
    for rel in get_all_relationships():
        parties = {rel.get("country_a", "").upper(), rel.get("country_b", "").upper()}
        if parties == wanted:
            modules.append(rel)
    return modules


def get_external_actor_records(country_a: str, country_b: str) -> list[dict]:
    wanted = {country_a.upper(), country_b.upper()}
    return [
        r for r in get_all_relationships()
        if {r.get("country_a", "").upper(), r.get("country_b", "").upper()} & wanted
    ]


def get_deep_dive_analyses(country_a: str, country_b: str) -> list[dict]:
    """Fully-worked FACT/ASSESSMENT/SCENARIO analysis objects (currently
    built for the India-China-Russia-USA system). Matches the original
    behaviour: only attached when the pair is IND+CHN, since that's the
    only system these deep-dives currently cover — never invents a
    deep-dive for a pair that doesn't have one."""
    ids = {country_a.upper(), country_b.upper()}
    if not ids >= {"IND", "CHN"}:
        return []
    session = get_session()
    try:
        rows = session.query(Relationship).filter(
            Relationship.source_file.like("analysis-%")
        ).all()
        return [r.payload for r in rows]
    finally:
        session.close()


def clear_cache():
    get_country_index.cache_clear()
    get_all_relationships.cache_clear()
