import { useCallback, useRef, useState } from "react";
import { Search as SearchIcon, RefreshCw } from "lucide-react";
import Header from "../components/dashboard/Header";
import Footer from "../components/dashboard/Footer";
import { api } from "../services/api";

interface SearchResult {
  record_id: string;
  record_type: string;
  entity: string;
  relevance: number;
  source: string | null;
  confidence: string | null;
  text_excerpt: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const requestRef = useRef<AbortController | null>(null);

  const runSearch = useCallback(async () => {
    if (!query.trim()) return;
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setLoading(true);
    setError(null);
    setUnavailable(false);
    setResults(null);
    try {
      const res = await api.search(query.trim(), 8, controller.signal);
      if (!controller.signal.aborted) setResults(res.results);
    } catch (err) {
      if (controller.signal.aborted) return;
      const message = err instanceof Error ? err.message : "";
      if (message.includes("503") || message.toLowerCase().includes("unavailable")) {
        setUnavailable(true);
      } else {
        setError("Search service unavailable. Confirm the TRINETRA data service is running, then retry.");
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-trinetra-bg text-neutral-200">
      <Header />
      <main className="mx-auto max-w-[1100px] px-5 py-10 md:px-8 md:py-14">
        <p className="eyebrow mb-4">SEARCH / SEMANTIC RETRIEVAL</p>
        <h1 className="font-display text-4xl text-neutral-100 md:text-5xl">Search the intelligence base</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-400">
          Searches real, migrated Trinetra records — country profiles, bilateral relationships, and
          historical events. Every result traces back to a specific record, its type, and its source.
          This is not a generated answer.
        </p>

        <form
          onSubmit={(e) => { e.preventDefault(); runSearch(); }}
          className="mt-8 flex gap-3 border-b border-trinetra-border pb-8"
        >
          <div className="flex flex-1 items-center gap-3 border border-trinetra-border bg-trinetra-panel px-4 py-3">
            <SearchIcon size={16} className="text-neutral-500" aria-hidden="true" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. India's dependence on China for critical technology"
              className="flex-1 bg-transparent text-sm text-neutral-100 outline-none placeholder:text-neutral-600"
              aria-label="Search query"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="rounded-sm bg-trinetra-saffron px-5 text-sm font-semibold text-black transition-colors hover:bg-trinetra-saffronDim disabled:cursor-wait disabled:opacity-50"
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </form>

        {unavailable && (
          <div role="status" className="mt-8 border border-trinetra-border bg-trinetra-panel p-5">
            <p className="text-sm font-semibold text-neutral-200">SEMANTIC SEARCH MODEL UNAVAILABLE</p>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              The embedding model could not be loaded on the server (typically because it has no network
              access to download it on first use). This is a truthful system state — Trinetra does not
              fall back to fake or generated results when the model isn't available.
            </p>
          </div>
        )}

        {error && (
          <div role="alert" className="mt-8 flex flex-col gap-4 border border-red-900/60 bg-red-950/20 p-5 md:flex-row md:items-center md:justify-between">
            <div><p className="text-sm font-semibold text-red-300">SEARCH SERVICE UNAVAILABLE</p><p className="mt-1 text-sm text-neutral-400">{error}</p></div>
            <button onClick={runSearch} className="inline-flex items-center gap-2 self-start text-sm font-semibold text-trinetra-saffron hover:underline">
              <RefreshCw size={15} aria-hidden="true" /> Retry
            </button>
          </div>
        )}

        {results && results.length === 0 && (
          <p className="mt-8 text-sm text-neutral-500">No matching records found for this query.</p>
        )}

        {results && results.length > 0 && (
          <div className="mt-8 flex flex-col gap-4">
            {results.map((r) => (
              <article key={r.record_id} className="border border-trinetra-border bg-trinetra-panel p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-trinetra-saffron">{r.record_type}</span>
                    <span className="text-xs text-neutral-500">{r.entity}</span>
                  </div>
                  <span className="font-mono text-[10px] text-neutral-600">relevance {r.relevance.toFixed(3)}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-neutral-300">{r.text_excerpt}</p>
                <div className="mt-3 flex flex-wrap gap-4 text-[10px] uppercase tracking-wider text-neutral-600">
                  <span>Source: {r.source || "Not recorded"}</span>
                  <span>Confidence: {r.confidence || "Not recorded"}</span>
                  <span className="font-mono">{r.record_id}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
