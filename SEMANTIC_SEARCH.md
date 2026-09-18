# SEMANTIC_SEARCH.md

## What it does

`backend/analysis/semantic_search.py` builds an in-memory semantic index
over the **real, migrated database content** — not a separate document
store, not fabricated text. Three sources are indexed:

1. **Country profiles** — chunked by section (strengths, vulnerabilities,
   dependencies, strategic_priorities, overview) so a search for
   "energy vulnerability" can match specifically the vulnerabilities
   section of a country, not the whole profile as one blob
2. **Relationships** — strategic issues, escalation/de-escalation
   factors, dominant leverage text
3. **History events** — from `country_modules` where `module == "history"`

Every chunk carries its origin back to a real database row: which
country/entity it came from, what type of record it is, and the
`source`/`confidence` fields already present in that record.

## API

```
POST /api/search
{ "query": "India's dependence on China for critical technology", "top_k": 5 }
```

Response — every result is a real record, never a generated answer:

```json
{
  "query": "...",
  "results": [
    {
      "record_id": "IND:dependencies",
      "record_type": "country.dependencies",
      "entity": "IND",
      "relevance": 0.62,
      "source": null,
      "confidence": "low-demo",
      "text_excerpt": "..."
    }
  ]
}
```

## Model choice

`all-MiniLM-L6-v2` via `sentence-transformers` — small (~90MB), fast,
runs entirely locally with no API key. Chosen because Trinetra's AI
layer (`backend/ai/`) already calls out to the Anthropic API for
narrative summaries; adding a second paid API dependency just for
search embeddings would be an unnecessary cost and latency hit for a
task a small local model handles well.

## Index strategy: in-memory, not a vector database

At the current data volume — roughly 100-150 text chunks across 21
countries — an in-memory list with numpy cosine similarity is the
right-sized choice: sub-second search, zero infra, nothing to run
alongside SQLite. `build_index()` is called once (lazily, on first
search, or explicitly at startup) and rebuilds from whatever is
currently in the database.

**When this stops being sufficient:** if the country/relationship count
grows by an order of magnitude, or if Phase 3 (document ingestion) adds
hundreds of news articles, move to a proper vector index —
`sqlite-vec` (stays in SQLite, minimal migration) or `pgvector` (if also
moving to Postgres) are the natural next steps, both compatible with
keeping the same `search()` function signature.

## Honest limitation hit during this build — please read

**I could not download the embedding model in this sandbox.**
`sentence-transformers` fetches `all-MiniLM-L6-v2` from
`huggingface.co` on first use, and that domain is not in this sandbox's
allowed network list. This means:

- The **code path, chunk extraction, and ranking logic** were verified
  directly — a test run with a stubbed embedding function confirmed 109
  real chunks are correctly extracted from the database and ranked with
  all required fields (`record_id`, `record_type`, `entity`,
  `relevance`, `source`, `confidence`, `text_excerpt`) present
- The **actual semantic quality** (does "energy vulnerability" really
  rank China's Malacca dependency highly) was **not verified end-to-end**
  in this environment, because the real model never loaded here

**On your machine, this should just work**: `pip install
sentence-transformers` will download the model automatically the first
time `/api/search` is called (needs internet access to huggingface.co,
which your machine has and this sandbox didn't). Please run a few real
queries after starting the backend and confirm the results look
sensible — that's the one piece of this phase I'm flagging as
"implemented and logic-tested, but not fully verified" rather than
claiming full end-to-end confidence.

## Tests

`tests/test_api.py::TestSemanticSearchEndpoint` covers the `/api/search`
endpoint's request validation and response shape, using a stubbed
embedding model for the same network-access reason described above.
