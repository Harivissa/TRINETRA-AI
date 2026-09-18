"""
SQLAlchemy models for TRINETRA's SQLite database layer.

Design principle: every existing JSON record is heterogeneous, nested,
hand-curated data — collapsing it into fully normalized SQL columns
would mean re-interpreting (and risking silently changing) the data.
Instead, each table stores:

  - a small set of QUERYABLE columns extracted verbatim from the source
    JSON (id, names, country pairing, etc.) for indexing/filtering
  - a `payload` JSON column holding the COMPLETE original record,
    byte-for-byte equivalent in content to the source JSON file
  - provenance columns (source, confidence, verification_status) —
    extracted from the record's own _meta/confidence fields where
    present, or set to a conservative default that is never invented
    per-field content
  - created_at / updated_at / version for change history

Nothing in the payload is rewritten, reworded, or "corrected" during
migration — see DATA_MIGRATION.md for the one exception (a value the
user explicitly asked to be corrected in a prior session) which is
out of scope for this repo snapshot and therefore not touched here.
"""
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Integer, Text, DateTime, JSON, UniqueConstraint,
)
from sqlalchemy.orm import declarative_base

Base = declarative_base()


def _now():
    return datetime.now(timezone.utc)


class Country(Base):
    __tablename__ = "countries"

    id = Column(String(8), primary_key=True)  # ISO-style country id, e.g. "IND"
    name = Column(String(128), nullable=False)
    source_file = Column(String(128))  # original filename, e.g. "india.json"
    payload = Column(JSON, nullable=False)  # full original country JSON, verbatim

    source = Column(Text)  # extracted from payload._meta.source / core_data_source if present
    confidence = Column(String(64))  # extracted from payload._meta.confidence if present
    verification_status = Column(String(32), default="reported", nullable=False)

    version = Column(Integer, default=1, nullable=False)
    created_at = Column(DateTime, default=_now, nullable=False)
    updated_at = Column(DateTime, default=_now, onupdate=_now, nullable=False)


class CountryModule(Base):
    """Deep-dive per-country modules: history, politics, foreign_policy,
    sources — e.g. data/countries/india/history.json."""
    __tablename__ = "country_modules"
    __table_args__ = (UniqueConstraint("country_id", "module", name="uq_country_module"),)

    id = Column(Integer, primary_key=True, autoincrement=True)
    country_id = Column(String(8), nullable=False, index=True)
    module = Column(String(64), nullable=False)  # "history" | "politics" | "foreign_policy" | "sources"
    source_file = Column(String(256))
    payload = Column(JSON, nullable=False)

    source = Column(Text)
    confidence = Column(String(64))
    verification_status = Column(String(32), default="reported", nullable=False)

    version = Column(Integer, default=1, nullable=False)
    created_at = Column(DateTime, default=_now, nullable=False)
    updated_at = Column(DateTime, default=_now, onupdate=_now, nullable=False)


class Relationship(Base):
    """Bilateral relationship records — data/geopolitics/*.json with
    country_a/country_b fields, and data/relationships/strategic/*.json
    deep-dive analysis objects."""
    __tablename__ = "relationships"

    id = Column(Integer, primary_key=True, autoincrement=True)
    country_a = Column(String(8), index=True)
    country_b = Column(String(8), index=True)
    relationship_type = Column(String(64))
    source_file = Column(String(256), nullable=False)
    payload = Column(JSON, nullable=False)

    source = Column(Text)
    confidence = Column(String(64))
    verification_status = Column(String(32), default="reported", nullable=False)

    version = Column(Integer, default=1, nullable=False)
    created_at = Column(DateTime, default=_now, nullable=False)
    updated_at = Column(DateTime, default=_now, onupdate=_now, nullable=False)


class Chokepoint(Base):
    __tablename__ = "chokepoints"

    id = Column(String(64), primary_key=True)  # e.g. "CHOKEPOINT_MALACCA"
    name = Column(String(128))
    payload = Column(JSON, nullable=False)

    source = Column(Text)
    confidence = Column(String(64))
    verification_status = Column(String(32), default="reported", nullable=False)

    version = Column(Integer, default=1, nullable=False)
    created_at = Column(DateTime, default=_now, nullable=False)
    updated_at = Column(DateTime, default=_now, onupdate=_now, nullable=False)


class Entity(Base):
    """data/entities/ — countries-as-entities, people, organisations."""
    __tablename__ = "entities"

    id = Column(String(64), primary_key=True)  # e.g. "PERSON_IND_PM_001", "ORG_QUAD"
    entity_type = Column(String(32), nullable=False)  # "country" | "person" | "organisation"
    name = Column(String(128))
    source_file = Column(String(256))
    payload = Column(JSON, nullable=False)

    source = Column(Text)
    confidence = Column(String(64))
    verification_status = Column(String(32), default="reported", nullable=False)

    version = Column(Integer, default=1, nullable=False)
    created_at = Column(DateTime, default=_now, nullable=False)
    updated_at = Column(DateTime, default=_now, onupdate=_now, nullable=False)


class RecordHistory(Base):
    """Append-only change log — satisfies the 'version/history fields'
    requirement without overengineering a full event-sourcing system.
    One row per migration/update event per record."""
    __tablename__ = "record_history"

    id = Column(Integer, primary_key=True, autoincrement=True)
    table_name = Column(String(64), nullable=False)
    record_id = Column(String(128), nullable=False)
    version = Column(Integer, nullable=False)
    change_type = Column(String(32), nullable=False)  # "migrated" | "updated" | "corrected"
    note = Column(Text)
    changed_at = Column(DateTime, default=_now, nullable=False)


class MigrationLog(Base):
    """One row per migration run — durable record of the exact report
    requested (countries found, duplicates, records migrated/failed)."""
    __tablename__ = "migration_log"

    id = Column(Integer, primary_key=True, autoincrement=True)
    run_at = Column(DateTime, default=_now, nullable=False)
    report_json = Column(JSON, nullable=False)
