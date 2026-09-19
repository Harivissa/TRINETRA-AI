import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, ArrowRight, Shield, AlertCircle, FileText, CheckCircle2 } from "lucide-react";
import Header from "../components/dashboard/Header";
import Footer from "../components/dashboard/Footer";
import { api } from "../services/api";

interface SearchResultItem {
  record_id: string;
  record_type: string;
  entity: string;
  source: string;
  confidence: string;
  text: string;
  score: number;
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const suggestedQueries = [
    "Hormuz chokepoint oil vulnerability",
    "India Russia defence ties",
    "Taiwan Strait semiconductor trade",
    "Nuclear deterrence doctrine",
    "Quad naval cooperation",
    "China energy dependencies",
  ];

  const executeSearch = async (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setSearched(true);
    setSearchParams({ q: trimmed });

    try {
      const response = await api.search(trimmed, 15);
      setResults(response.results || []);
    } catch (err: any) {
      console.error("Search failure:", err);
      setError("Search request failed. Confirm the TRINETRA search service is reachable.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  useEffect(() => {
    if (initialQuery) {
      executeSearch(initialQuery);
    }
  }, []);

  return (
    <div className="min-h-screen bg-trinetra-bg text-neutral-200">
      <Header />

      <main className="mx-auto max-w-[1540px] px-5 py-8 sm:px-8 sm:py-10">
        <div className="max-w-3xl mb-10">
          <div className="section-kicker">SEMANTIC CORPUS / RETRIEVAL</div>
          <h1 className="font-display text-4xl sm:text-5xl text-neutral-100 mt-1">
            Strategic Intelligence Search
          </h1>
          <p className="text-sm text-neutral-400 mt-2">
            Search verified records across state military doctrines, energy reliance metrics, historical flashpoints, and multilateral treaties.
          </p>
        </div>

        {/* Search Input Box */}
        <form onSubmit={handleSubmit} className="mb-6 max-w-4xl">
          <div className="flex items-center gap-2 border border-trinetra-border bg-trinetra-panel rounded-lg p-2 focus-within:border-trinetra-saffron transition-colors">
            <Search className="size-5 text-neutral-500 ml-2 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search concepts, weapons systems, corridors, or strategic dependencies..."
              className="w-full bg-transparent px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-5 py-2 rounded bg-trinetra-saffron text-black text-xs font-semibold hover:bg-trinetra-saffronDim transition-colors disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {/* Query Suggestions */}
        <div className="mb-10 flex flex-wrap items-center gap-2 max-w-4xl">
          <span className="text-xs text-neutral-500 font-mono">Suggested:</span>
          {suggestedQueries.map((suggested) => (
            <button
              key={suggested}
              onClick={() => {
                setQuery(suggested);
                executeSearch(suggested);
              }}
              className="text-xs px-2.5 py-1 rounded bg-black/40 border border-trinetra-border text-neutral-300 hover:border-trinetra-saffron hover:text-white transition-colors"
            >
              {suggested}
            </button>
          ))}
        </div>

        {/* Errors */}
        {error && (
          <div className="border border-red-500/40 bg-red-950/20 p-4 rounded-md mb-8 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Results List */}
        {loading && (
          <div className="space-y-4 max-w-4xl">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 animate-pulse bg-trinetra-panel rounded border border-trinetra-border" />
            ))}
          </div>
        )}

        {!loading && searched && results.length === 0 && !error && (
          <div className="border border-trinetra-border bg-trinetra-panel p-12 text-center rounded-lg max-w-4xl">
            <AlertCircle className="size-8 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-base text-neutral-300 font-medium">No intelligence records match this query</h3>
            <p className="text-xs text-neutral-500 mt-1">
              Try adjusting query terms or searching for broader state names, maritime straits, or strategic doctrines.
            </p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-4 max-w-4xl">
            <div className="text-xs font-mono text-neutral-500 mb-2">
              Found {results.length} verified intelligence records
            </div>

            {results.map((item, idx) => (
              <article
                key={`${item.record_id}-${idx}`}
                className="border border-trinetra-border bg-trinetra-panel p-5 rounded-lg hover:border-trinetra-border/80 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-trinetra-saffron/10 text-trinetra-saffron border border-trinetra-saffron/30">
                      {item.record_type || "FACT"}
                    </span>
                    {item.entity && (
                      <Link
                        to={`/country?id=${item.entity}`}
                        className="font-mono text-xs text-neutral-300 hover:text-trinetra-saffron hover:underline"
                      >
                        {item.entity}
                      </Link>
                    )}
                  </div>

                  {item.confidence && (
                    <span className="font-mono text-[10px] text-neutral-500">
                      Confidence: {item.confidence}
                    </span>
                  )}
                </div>

                <p className="text-sm text-neutral-200 leading-relaxed mb-3">
                  {item.text}
                </p>

                <div className="flex items-center justify-between text-xs text-neutral-500 border-t border-trinetra-border/60 pt-3">
                  <span className="truncate max-w-md">Source: {item.source || "Canonical Dataset"}</span>
                  {item.entity && (
                    <Link
                      to={`/country?id=${item.entity}`}
                      className="text-trinetra-saffron hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
                    >
                      Inspect {item.entity} Dossier <ArrowRight className="size-3" />
                    </Link>
                  )}
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
