# TRINETRA Knowledge Graph — Entity & Relationship Schema

This is a supplementary data layer, separate from `data/countries/*.json`
(the app's current working country profiles) and `data/geopolitics/*.json`
(the app's current working relationship files). Nothing here is wired into
the running Flask/React app yet — this is Phase 1-2 of a knowledge-graph
rebuild, not a replacement of what's running. See `KNOWLEDGE_GRAPH_STATUS.md`
in the project root for what's built vs. not.

## Entity ID convention

Every entity gets a unique, stable, human-readable ID — never a bare name.

| Entity type | ID pattern | Example |
|---|---|---|
| Country | ISO 3166-1 alpha-3 | `IND`, `CHN`, `USA`, `RUS` |
| Person | `PERSON_<COUNTRY>_<ROLE>_<NUM>` | `PERSON_IND_PM_001` |
| Organisation | `ORG_<NAME>` | `ORG_QUAD`, `ORG_BRICS`, `ORG_SCO` |
| Political party | `PARTY_<COUNTRY>_<ABBR>` | `PARTY_IND_BJP` |
| Military branch | `MIL_<COUNTRY>_<BRANCH>` | `MIL_IND_ARMY` |
| Infrastructure | `<TYPE>_<NAME>` | `PORT_MUMBAI`, `PORT_GWADAR` |
| Resource/chokepoint | `<TYPE>_<NAME>` | `ENERGY_HORMUZ` |
| Event | `EVENT_<SHORTNAME>_<YEAR>` | `EVENT_GALWAN_2020` |

IDs are permanent once created — never reused or renumbered, even if the
entity's details change.

## Entity file, minimum fields

Every entity file (regardless of type) carries:

```
id             — the unique ID above
entity_type    — country | person | organisation | party | military | infrastructure | resource | event
name           — display name
_meta: { data_quality, confidence, last_updated, sources: [source_id, ...] }
```

Type-specific fields are layered on top (see each entity folder's own
files for examples — `data/entities/people/*.json` for the person schema
actually in use, etc.)

## Relationship object — the core unit (spec Part 4)

A relationship is never a one-line label. Every relationship is:

```json
{
  "id": "REL_<SOURCE>_<TARGET>_<DOMAIN>",
  "source": "IND",
  "target": "RUS",
  "relationship_type": "strategic_partnership",
  "domain": ["defence", "energy", "diplomacy", "nuclear"],
  "strength": 0.82,
  "direction": "mutual",
  "status": "active",
  "history": [
    { "period": "1950s-1960s", "state": "developing", "note": "..." },
    { "period": "1971", "state": "strong_strategic_cooperation", "note": "..." },
    { "period": "2022-2026", "state": "strategic_partnership_with_western_friction", "note": "..." }
  ],
  "evidence": ["source_id_1", "source_id_2"],
  "confidence": "high",
  "record_type": "ANALYTICAL_ASSESSMENT",
  "_meta": { "last_updated": "2026-08-22" }
}
```

`strength` is a rough analyst judgment on a 0-1 scale (documented per
relationship why that number, never presented as a precise measurement).

## Record type — never blur fact and judgment (spec Part 23)

Every relationship, event, and analytical claim carries a `record_type`:

- `FACT` — directly verifiable, not in dispute (e.g. a treaty was signed on a date)
- `HISTORICAL_FACT` — same, but about the past
- `OFFICIAL_CLAIM` — a government/official said this; may or may not be independently verified
- `ESTIMATE` — a numeric figure from a recognized source, with normal estimation uncertainty
- `ANALYTICAL_ASSESSMENT` — our own reasoning from the evidence, clearly not a fact
- `SCENARIO` — a hypothetical, explicitly not a prediction
- `PREDICTION` — avoided almost entirely on this platform; if ever used, must carry low/medium confidence and a reason

## Confidence (spec Part 24)

`HIGH` / `MEDIUM` / `LOW`, always with a one-line reason. Confidence
describes how sure we are the record is correct — not how important it is.

## Data quality honesty (spec Part 27)

Never invent a number. Use `null`, `"unknown"`, or `"not_available"` for
anything not backed by a real source. If sources disagree, record the
disagreement (see `data/relationships/*/india-russia.json` for a worked
example of a `history` array vs. a single static label).
