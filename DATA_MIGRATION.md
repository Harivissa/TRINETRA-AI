# DATA_MIGRATION.md

## Migration report (from the actual run)

```
Countries found (in index.json): 21
Country IDs: ARE, AUS, BGD, BRA, CAN, CHN, DEU, FRA, GBR, IDN, IND,
             IRN, ISR, ITA, JPN, KOR, PAK, RUS, SAU, TUR, USA

Duplicate IDs: NONE
Unexpected countries: NONE

Records migrated:
  countries: 21
  country_modules: 4
  relationships: 11
  chokepoints: 2
  entities: 12
  TOTAL: 50

Records that failed validation: 0
```

## The "22 countries" question, resolved

There were never 22 countries. `data/countries/` contains 21 country
JSON files plus `index.json` itself — a directory listing of 22 `.json`
files total was being misread as 22 countries. Verified directly:
`index.json` lists exactly 21 entries, all 21 corresponding files exist
on disk, every file's internal `"id"` field matches what `index.json`
says it should be, and there are zero duplicate IDs. The 21 are the
original 20-country core set (India, China, USA, Russia, Japan,
Germany, UK, France, South Korea, Türkiye, Saudi Arabia, Iran, Israel,
Pakistan, Australia, Canada, Brazil, Indonesia, Italy, UAE) plus
Bangladesh, added later as a documented extension.

## What's actually in this repo snapshot (important context)

This GitHub repo is an **earlier snapshot** than the most fully-built
version from the working session — it has 21 countries, 2 chokepoints
(Malacca, Hormuz — not the later 7-chokepoint set), 8 `data/geopolitics/`
relationship files plus 2 India-Russia/China-Russia "deep dive" files in
`data/relationships/strategic/`, no `dependencies.json`, no
`dependency_engine.py`, and does not yet include the verified 2026 Iran
War update. This migration moved exactly what exists in **this** repo
into SQLite — it did not pull in newer data from elsewhere, since that
would go beyond "migrate the existing data" into silently adding new
content. If you want that later data folded in too, that's a separate,
explicit step — happy to do it, just flagging it's not part of this
migration.

## One pre-existing data quirk, surfaced (not fixed) by migration

`data/geopolitics/india-russia.json` and
`data/relationships/strategic/india-russia.json` are two different
files covering the same country pair with different schemas (the first
is the original relationship-file format, the second is the later
"time-aware history" format from the knowledge-graph phase). Both were
migrated as separate `relationships` rows — the migration doesn't merge
or pick a winner between them, since doing so would be interpreting the
data rather than just recording it. If you want one canonical version,
that's a data decision for you to make, not something the migration
should decide silently. Same situation exists for `china-russia.json`.

## How to re-run the migration (e.g. after editing a JSON file)

```
cd trinetra
python3 -m backend.db.migrate
```

This is safe to re-run — it uses `session.merge()` for
countries/chokepoints/entities (upsert by primary key) and explicit
find-or-update logic for country_modules/relationships (matched by
their unique source file), so re-running after editing
`data/countries/india.json` updates the existing `IND` row rather than
creating a duplicate. Each re-run also appends fresh rows to
`record_history` and `migration_log`, so you can see exactly when each
sync happened.

## What migration does NOT do

- It does not delete, modify, or touch any file under `data/` — it only
  reads them
- It does not invent, correct, or reinterpret any field's content
- It does not deduplicate the india-russia.json / china-russia.json
  situation described above
- It does not migrate `data/schemas/` (documentation about schema
  shape, not data) or `config/prompts/` (AI prompt text, not
  intelligence records)
