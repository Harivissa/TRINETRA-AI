"""
Phase 1 migration: JSON files -> SQLite.

Run: python3 -m backend.db.migrate

Reads every existing JSON record under data/, validates it, and inserts
it into the database defined in backend/db/models.py. Source JSON files
are never modified or deleted — this script only reads them.

Produces the exact report requested:
  - countries found
  - country IDs
  - duplicate IDs, if any
  - unexpected countries, if any
  - records migrated
  - records that failed validation

Also writes the report to the migration_log table and appends one
record_history row per migrated record (change_type="migrated").
"""
import json
import os
from datetime import datetime, timezone

from backend.db.database import init_db, get_session, DB_PATH
from backend.db.models import (
    Country, CountryModule, Relationship, Chokepoint, Entity,
    RecordHistory, MigrationLog,
)

DATA_ROOT = os.path.join(os.path.dirname(__file__), "..", "..", "data")

EXPECTED_20 = {
    "IND", "CHN", "USA", "RUS", "JPN", "DEU", "GBR", "FRA", "KOR", "TUR",
    "SAU", "IRN", "ISR", "PAK", "AUS", "CAN", "BRA", "IDN", "ITA", "ARE",
}


def _load(path):
    with open(path) as f:
        return json.load(f)


def _extract_provenance(payload: dict) -> tuple[str | None, str | None, str]:
    """Pull source/confidence/verification_status from a record's own
    _meta or top-level fields — never invents new content, only reads
    what the record already states. Falls back to a documented default
    (see DATA_MIGRATION.md) when the record has no such field at all."""
    meta = payload.get("_meta", {}) if isinstance(payload, dict) else {}

    source = (
        meta.get("source")
        or meta.get("core_data_source")
        or payload.get("source")
        or None
    )
    confidence = (
        meta.get("confidence")
        or payload.get("confidence")
        or None
    )
    record_type = payload.get("record_type")
    if record_type in ("FACT", "HISTORICAL_FACT"):
        verification_status = "officially confirmed" if record_type == "FACT" else "reported"
    elif record_type in ("ESTIMATE", "ASSESSMENT", "ANALYTICAL_ASSESSMENT"):
        verification_status = "analyst assessment"
    elif record_type == "SCENARIO":
        verification_status = "unverified"
    else:
        # Documented default per DATA_MIGRATION.md — not an invented
        # claim about the record's truth, just the conservative starting
        # category for records that didn't already declare one.
        verification_status = "reported"

    return source, confidence, verification_status


def migrate():
    init_db()
    session = get_session()

    report = {
        "run_at": datetime.now(timezone.utc).isoformat(),
        "countries_found": 0,
        "country_ids": [],
        "duplicate_ids": [],
        "unexpected_countries": [],
        "records_migrated": {"countries": 0, "country_modules": 0, "relationships": 0, "chokepoints": 0, "entities": 0},
        "records_failed": [],
    }

    def log_history(table_name, record_id, version, note):
        session.add(RecordHistory(table_name=table_name, record_id=record_id, version=version, change_type="migrated", note=note))

    # ---------- COUNTRIES ----------
    index_path = os.path.join(DATA_ROOT, "countries", "index.json")
    if not os.path.exists(index_path):
        report["records_failed"].append({"file": "data/countries/index.json", "reason": "index file not found"})
    else:
        index = _load(index_path)
        entries = index.get("countries", [])
        report["countries_found"] = len(entries)

        seen_ids = {}
        for entry in entries:
            cid = entry.get("id")
            fname = entry.get("file")
            report["country_ids"].append(cid)

            if cid in seen_ids:
                report["duplicate_ids"].append({"id": cid, "files": [seen_ids[cid], fname]})
            seen_ids[cid] = fname

            if cid not in EXPECTED_20 and cid != "BGD":
                report["unexpected_countries"].append(cid)

            path = os.path.join(DATA_ROOT, "countries", fname) if fname else None
            if not path or not os.path.exists(path):
                report["records_failed"].append({"file": fname, "reason": "file listed in index.json but not found on disk"})
                continue

            try:
                payload = _load(path)
            except json.JSONDecodeError as e:
                report["records_failed"].append({"file": fname, "reason": f"invalid JSON: {e}"})
                continue

            if payload.get("id") != cid:
                report["records_failed"].append({"file": fname, "reason": f"internal id '{payload.get('id')}' does not match index.json id '{cid}'"})
                continue

            source, confidence, verification_status = _extract_provenance(payload)
            row = Country(
                id=cid,
                name=payload.get("name", entry.get("name", cid)),
                source_file=fname,
                payload=payload,
                source=source,
                confidence=confidence,
                verification_status=verification_status,
            )
            session.merge(row)
            log_history("countries", cid, 1, f"migrated from data/countries/{fname}")
            report["records_migrated"]["countries"] += 1

            # ---------- COUNTRY MODULES (history/politics/foreign_policy/sources) ----------
            slug = fname.rsplit(".", 1)[0]
            module_dir = os.path.join(DATA_ROOT, "countries", slug)
            if os.path.isdir(module_dir):
                for mod_file in sorted(os.listdir(module_dir)):
                    if not mod_file.endswith(".json"):
                        continue
                    module_name = mod_file.rsplit(".", 1)[0]
                    mod_path = os.path.join(module_dir, mod_file)
                    try:
                        mod_payload = _load(mod_path)
                    except json.JSONDecodeError as e:
                        report["records_failed"].append({"file": f"{slug}/{mod_file}", "reason": f"invalid JSON: {e}"})
                        continue
                    m_source, m_confidence, m_verif = _extract_provenance(mod_payload)
                    existing = session.query(CountryModule).filter_by(country_id=cid, module=module_name).first()
                    if existing:
                        existing.payload = mod_payload
                        existing.source_file = f"{slug}/{mod_file}"
                        existing.source = m_source
                        existing.confidence = m_confidence
                        existing.verification_status = m_verif
                    else:
                        session.add(CountryModule(
                            country_id=cid, module=module_name, source_file=f"{slug}/{mod_file}",
                            payload=mod_payload, source=m_source, confidence=m_confidence,
                            verification_status=m_verif,
                        ))
                    log_history("country_modules", f"{cid}:{module_name}", 1, f"migrated from data/countries/{slug}/{mod_file}")
                    report["records_migrated"]["country_modules"] += 1

    # ---------- RELATIONSHIPS (data/geopolitics/*.json + data/relationships/strategic/*.json) ----------
    rel_dirs = [
        os.path.join(DATA_ROOT, "geopolitics"),
        os.path.join(DATA_ROOT, "relationships", "strategic"),
    ]
    for rel_dir in rel_dirs:
        if not os.path.isdir(rel_dir):
            continue
        for fname in sorted(os.listdir(rel_dir)):
            if not fname.endswith(".json") or fname == "chokepoints.json":
                continue
            path = os.path.join(rel_dir, fname)
            try:
                payload = _load(path)
            except json.JSONDecodeError as e:
                report["records_failed"].append({"file": fname, "reason": f"invalid JSON: {e}"})
                continue

            rel_source, rel_confidence, rel_verif = _extract_provenance(payload)
            existing = session.query(Relationship).filter_by(source_file=fname).first()
            row_kwargs = dict(
                country_a=payload.get("country_a"),
                country_b=payload.get("country_b"),
                relationship_type=payload.get("relationship_type") or payload.get("subject"),
                source_file=fname,
                payload=payload,
                source=rel_source,
                confidence=rel_confidence,
                verification_status=rel_verif,
            )
            if existing:
                for k, v in row_kwargs.items():
                    setattr(existing, k, v)
            else:
                session.add(Relationship(**row_kwargs))
            log_history("relationships", fname, 1, f"migrated from {rel_dir}/{fname}")
            report["records_migrated"]["relationships"] += 1

    # ---------- CHOKEPOINTS ----------
    chokepoints_path = os.path.join(DATA_ROOT, "geopolitics", "chokepoints.json")
    if os.path.exists(chokepoints_path):
        try:
            payload = _load(chokepoints_path)
            cps = payload.get("chokepoints", []) if isinstance(payload, dict) else payload
            for cp in cps:
                cp_source, cp_confidence, cp_verif = _extract_provenance(cp)
                row = Chokepoint(
                    id=cp["id"], name=cp.get("name"), payload=cp,
                    source=cp_source, confidence=cp_confidence, verification_status=cp_verif,
                )
                session.merge(row)
                log_history("chokepoints", cp["id"], 1, "migrated from data/geopolitics/chokepoints.json")
                report["records_migrated"]["chokepoints"] += 1
        except (json.JSONDecodeError, KeyError) as e:
            report["records_failed"].append({"file": "chokepoints.json", "reason": str(e)})

    # ---------- ENTITIES (data/entities/countries|people|organisations) ----------
    entities_root = os.path.join(DATA_ROOT, "entities")
    if os.path.isdir(entities_root):
        for subfolder in sorted(os.listdir(entities_root)):
            sub_path = os.path.join(entities_root, subfolder)
            if not os.path.isdir(sub_path):
                continue
            for fname in sorted(os.listdir(sub_path)):
                if not fname.endswith(".json"):
                    continue
                path = os.path.join(sub_path, fname)
                try:
                    payload = _load(path)
                except json.JSONDecodeError as e:
                    report["records_failed"].append({"file": f"entities/{subfolder}/{fname}", "reason": f"invalid JSON: {e}"})
                    continue
                ent_source, ent_confidence, ent_verif = _extract_provenance(payload)
                row = Entity(
                    id=payload.get("id", fname.rsplit(".", 1)[0]),
                    entity_type=payload.get("entity_type", subfolder.rstrip("s")),
                    name=payload.get("name"),
                    source_file=f"entities/{subfolder}/{fname}",
                    payload=payload,
                    source=ent_source,
                    confidence=ent_confidence,
                    verification_status=ent_verif,
                )
                session.merge(row)
                log_history("entities", row.id, 1, f"migrated from data/entities/{subfolder}/{fname}")
                report["records_migrated"]["entities"] += 1

    session.add(MigrationLog(report_json=report))
    session.commit()
    session.close()
    return report


def print_report(report: dict):
    print("=" * 70)
    print("TRINETRA PHASE 1 MIGRATION REPORT")
    print("=" * 70)
    print(f"Run at: {report['run_at']}")
    print()
    print(f"Countries found (in index.json): {report['countries_found']}")
    print(f"Country IDs: {sorted(report['country_ids'])}")
    print()
    print(f"Duplicate IDs: {report['duplicate_ids'] or 'NONE'}")
    print(f"Unexpected countries (not in the original 20 + Bangladesh): {report['unexpected_countries'] or 'NONE'}")
    print()
    print("Records migrated:")
    for k, v in report["records_migrated"].items():
        print(f"  {k}: {v}")
    total_migrated = sum(report["records_migrated"].values())
    print(f"  TOTAL: {total_migrated}")
    print()
    print(f"Records that failed validation: {len(report['records_failed'])}")
    for f in report["records_failed"]:
        print(f"  - {f}")
    print("=" * 70)
    print(f"Database file: {DB_PATH}")


if __name__ == "__main__":
    report = migrate()
    print_report(report)
