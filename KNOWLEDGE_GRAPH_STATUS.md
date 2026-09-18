# Knowledge Graph Layer — Status

This tracks the entity-relationship knowledge-graph rebuild (`data/entities/`,
`data/relationships/`, `data/events/`, `data/schemas/`), which is **separate
from and does not replace** the working app's existing data
(`data/countries/*.json`, `data/geopolitics/*.json`) or its Flask API. The
running app is unaffected by anything in this document — verified after
every change in this phase.

## What actually exists right now

**Schema (Phase 1 — done):**
- `data/schemas/ENTITY_SCHEMA.md` — entity ID conventions, relationship
  object shape, FACT/ASSESSMENT/SCENARIO record types, confidence levels

**Entities (Phase 2 — done for 4 of 20 countries):**
- Country entities: `IND`, `CHN`, `USA`, `RUS` only
- People: 1 each for those 4 countries (current head of state/government —
  Modi, Xi Jinping, Trump, Putin — verified via web search for current
  status as of Aug 2026)
- Organisations: `ORG_QUAD`, `ORG_BRICS`, `ORG_SCO`, `ORG_NATO`

**Relationships (Phase 3 — partial):**
- Time-aware relationship objects (the `history` array format the spec
  asks for) built for: India-Russia, China-Russia
- Two full worked "third-party reasoning" objects, with explicit
  FACT / ANALYTICAL_ASSESSMENT / SCENARIO separation:
  - Russia's dilemma in an India-China crisis
  - USA's position in an India-China crisis
  - These are the reference examples for how every other such object in
    the dataset should be structured going forward.

## What does NOT exist yet (said plainly, not glossed over)

- Entities/relationships for the other 16 countries (Phase 4)
- Political party, military branch, infrastructure, resource, and company
  entities — the folders exist (`data/entities/companies/`,
  `/infrastructure/`, `/resources/`, `/military/`) but are empty
- Event entities in the new `EVENT_<NAME>_<YEAR>` ID format (India's
  existing `data/countries/india/history.json` has this content in the
  old per-country format, not yet migrated to graph-style event entities)
- Trade network, financial intelligence, technology dependency data (Parts
  13-15 of the spec)
- Source registry (`SRC_...` IDs referenced in `_meta.sources` fields
  above are placeholders pointing at real sources already cited in prose
  elsewhere in the project — a proper `data/sources/*.json` registry with
  full bibliographic fields per spec Part 22 has not been built)
- No API layer or frontend UI reads any of this yet — it is pure data,
  not yet queryable through the app

## Honest scope note

The full spec (20 countries × people × parties × military × infrastructure
× resources × companies × events × trade × finance × tech, all
time-versioned and sourced) is a multi-week research undertaking for a
real team, not something one session can complete. This phase intentionally
built the schema plus one fully-worked example system (India-China-Russia-
USA) rather than spreading thin across all 20 countries with shallow
placeholder data — per the spec's own phased approach (Phase 1-3 before
Phase 4).

## Suggested next step

Phase 4: replicate this same depth for the remaining 16 countries, OR
Phase 7 (wiring): build the API layer so this graph data is actually
queryable, before adding more country depth to data nothing can read yet.
