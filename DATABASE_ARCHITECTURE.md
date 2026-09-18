# DATABASE_ARCHITECTURE.md

## Why SQLite, why this schema shape

TRINETRA's data is heterogeneous, nested, and hand-curated — a country
record has 15+ top-level sections with different internal shapes, and
relationship records vary depending on which research pass produced
them. Forcing this into fully normalized SQL columns would mean
re-interpreting the data during migration, which risks silently
changing meaning. Instead, each table uses a hybrid shape:

- A handful of **queryable columns** extracted verbatim from fields the
  record already has (id, name, country pairing, source, confidence)
- A **`payload` JSON column** holding the complete original record,
  unchanged in content from the source JSON file
- **Provenance columns** (`source`, `confidence`, `verification_status`)
  populated from the record's own `_meta`/`confidence`/`record_type`
  fields where present — never invented per-record content
- **`created_at` / `updated_at` / `version`** for change tracking

SQLite was chosen because: zero configuration, a single file, and more
than sufficient for the current volume (21 countries, ~50 total
records). Nothing in the repository layer above it assumes SQLite
specifically — swapping `DATABASE_URL` in `backend/db/database.py` to a
Postgres connection string is the only change needed to migrate later,
since the code goes through SQLAlchemy's engine abstraction.

## Tables

| Table | Purpose | Key fields |
|---|---|---|
| `countries` | One row per nation | `id` (PK, e.g. "IND"), `name`, `source_file`, `payload` |
| `country_modules` | Deep-dive per-country data (history, politics, foreign_policy, sources) | `country_id`, `module`, `payload` |
| `relationships` | Bilateral relationship records + deep-dive analysis objects | `country_a`, `country_b`, `relationship_type`, `source_file`, `payload` |
| `chokepoints` | Strategic maritime/energy chokepoints | `id` (e.g. "CHOKEPOINT_MALACCA"), `payload` |
| `entities` | Knowledge-graph entities (countries-as-entities, people, orgs) | `id`, `entity_type`, `payload` |
| `record_history` | Append-only change log — one row per migration/update event | `table_name`, `record_id`, `version`, `change_type` |
| `migration_log` | One row per migration run, storing the full report | `run_at`, `report_json` |

## How provenance fields are populated

`backend/db/migrate.py`'s `_extract_provenance()` function reads, in
priority order: `payload._meta.source` → `payload._meta.core_data_source`
→ `payload.source`. Same pattern for `confidence`. `verification_status`
is derived from the record's own `record_type` field if present
(FACT → "officially confirmed", ASSESSMENT/ESTIMATE → "analyst
assessment", SCENARIO → "unverified"), and falls back to `"reported"`
for records that don't declare a `record_type` — an explicit, documented
default, not an invented claim about any specific record's truth.

## Repository layer contract

`backend/data/repository.py` keeps the **exact same function
signatures** it had when reading from JSON files directly:

```
get_country_index() -> list[dict]
get_country(country_id) -> dict | None
get_country_module(country_id, module) -> dict | None
get_country_modules_available(country_id) -> list[str]
get_relationship(country_a, country_b) -> dict | None
get_relationships_for(country_id) -> list[dict]
get_chokepoints() -> list[dict]
get_deep_dive_analyses(country_a, country_b) -> list[dict]
clear_cache()
```

Every analysis engine and every Flask route calls only these functions
— none of them read JSON or SQL directly (two engines,
`chokepoint_engine.py` and `strategic_engine.py`, previously bypassed
the repository and opened JSON files themselves; both were fixed as
part of this migration to go through `repository.get_chokepoints()` and
`repository.get_deep_dive_analyses()` respectively). This means the
entire API surface works identically whether the data underneath is
JSON files or SQLite — verified by the full test suite passing with
zero changes to `backend/app.py`'s route logic.

## What did NOT change

- Every JSON file under `data/` — still there, still the human-editable
  source of truth. See DATA_MIGRATION.md for the sync workflow.
- Every API endpoint's URL, request shape, and response shape
- Every analysis engine's public interface (`analyze(...)` functions)
- The frontend — untouched, not even inspected, per your instruction
