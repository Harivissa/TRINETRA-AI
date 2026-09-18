"""
Semantic search over TRINETRA's real, migrated data.

Every searchable "document" is derived directly from an existing DB
record (Country, Relationship, CountryModule history event) — nothing
is invented. Each result traces back to its record_id, record_type,
country/entity, and original source/confidence fields.

Uses sentence-transformers (all-MiniLM-L6-v2 — small, fast, no API key
needed, runs locally) for embeddings, and plain numpy cosine similarity
for the search itself. No vector database — at current data volume
(a few hundred chunks) an in-memory index is the honest, right-sized
choice; see SEMANTIC_SEARCH.md for when that would need to change.
"""
import numpy as np
from sentence_transformers import SentenceTransformer

from backend.db.database import get_session
from backend.db.models import Country, Relationship, CountryModule

_model = None
_index = None  # list of dicts: {embedding, text, record_id, record_type, entity, source, confidence}


def _get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model


def _country_chunks(row: Country) -> list[dict]:
    """One chunk per meaningful text section of a country profile —
    keeps results specific (e.g. matching just the vulnerabilities
    section) rather than one giant blob per country."""
    p = row.payload
    chunks = []

    def add(section, text_parts):
        text = " ".join(t for t in text_parts if t)
        if text.strip():
            chunks.append({
                "text": text,
                "record_id": f"{row.id}:{section}",
                "record_type": f"country.{section}",
                "entity": row.id,
                "source": row.source,
                "confidence": row.confidence,
            })

    add("strengths", p.get("strengths", []))
    add("vulnerabilities", p.get("vulnerabilities", []))
    add("dependencies", p.get("dependencies", []))
    add("strategic_priorities", p.get("strategic_priorities", []))
    add("overview", [
        row.name,
        p.get("region"),
        p.get("strategic_autonomy_profile"),
        str(p.get("energy", {}).get("status_2025", "")),
    ])
    return chunks


def _relationship_chunks(row: Relationship) -> list[dict]:
    p = row.payload
    text_parts = [
        p.get("relationship_type") or p.get("subject") or "",
        " ".join(p.get("strategic_issues", [])),
        " ".join(p.get("escalation_factors", [])),
        " ".join(p.get("deescalation_factors", [])),
        p.get("dominant_leverage", ""),
    ]
    text = " ".join(t for t in text_parts if t)
    if not text.strip():
        return []
    entity = f"{row.country_a}-{row.country_b}" if row.country_a else row.source_file
    return [{
        "text": text,
        "record_id": row.source_file,
        "record_type": "relationship",
        "entity": entity,
        "source": row.source,
        "confidence": row.confidence,
    }]


def _history_chunks(row: CountryModule) -> list[dict]:
    if row.module != "history":
        return []
    chunks = []
    for event in row.payload.get("events", []):
        text = " ".join(filter(None, [
            event.get("title"), event.get("what_happened"),
            event.get("why_it_happened"), event.get("long_term_significance"),
        ]))
        if text.strip():
            chunks.append({
                "text": text,
                "record_id": f"{row.country_id}:history:{event.get('year')}",
                "record_type": "history_event",
                "entity": row.country_id,
                "source": row.source,
                "confidence": event.get("confidence", row.confidence),
            })
    return chunks


def build_index():
    """Builds (or rebuilds) the in-memory semantic index from the
    current database contents. Call this once at startup, and again
    any time the database changes (e.g. after re-running migrate.py)."""
    global _index
    session = get_session()
    try:
        chunks = []
        for row in session.query(Country).all():
            chunks.extend(_country_chunks(row))
        for row in session.query(Relationship).all():
            chunks.extend(_relationship_chunks(row))
        for row in session.query(CountryModule).all():
            chunks.extend(_history_chunks(row))
    finally:
        session.close()

    if not chunks:
        _index = []
        return 0

    model = _get_model()
    texts = [c["text"] for c in chunks]
    embeddings = model.encode(texts, convert_to_numpy=True, show_progress_bar=False)

    for chunk, emb in zip(chunks, embeddings):
        chunk["embedding"] = emb

    _index = chunks
    return len(_index)


def search(query: str, top_k: int = 5) -> list[dict]:
    """Returns up to top_k real records matching the query semantically.
    Each result includes record_id, record_type, entity, relevance
    (cosine similarity, 0-1), source, and confidence — never a bare
    generated-sounding answer."""
    global _index
    if _index is None:
        build_index()
    if not _index:
        return []

    model = _get_model()
    query_emb = model.encode([query], convert_to_numpy=True)[0]

    sims = []
    for chunk in _index:
        emb = chunk["embedding"]
        denom = (np.linalg.norm(query_emb) * np.linalg.norm(emb))
        sim = float(np.dot(query_emb, emb) / denom) if denom else 0.0
        sims.append(sim)

    ranked = sorted(zip(_index, sims), key=lambda x: x[1], reverse=True)[:top_k]

    return [
        {
            "record_id": chunk["record_id"],
            "record_type": chunk["record_type"],
            "entity": chunk["entity"],
            "relevance": round(sim, 4),
            "source": chunk["source"],
            "confidence": chunk["confidence"],
            "text_excerpt": chunk["text"][:280] + ("..." if len(chunk["text"]) > 280 else ""),
        }
        for chunk, sim in ranked
    ]
