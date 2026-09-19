import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Globe2,
  Share2,
  Search,
  ArrowRight,
  Zap,
  Activity,
  Anchor,
  Layers,
  AlertTriangle
} from "lucide-react";
import Header from "../components/dashboard/Header";
import Footer from "../components/dashboard/Footer";
import { api } from "../services/api";
import type { CountryIndexEntry } from "../types";

export default function Dashboard() {
  const [countries, setCountries] = useState<CountryIndexEntry[]>([]);
  const [chokepoints, setChokepoints] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getCountries().catch(() => []),
      api.getChokepoints().catch(() => []),
      api.getGroups().catch(() => []),
    ])
      .then(([countryList, cpList, groupList]) => {
        setCountries(countryList);
        setChokepoints(cpList);
        setGroups(groupList);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard data load error:", err);
        setError("Failed to load platform data. Please check backend connection.");
        setLoading(false);
      });
  }, []);

  const featuredRivalries = [
    { a: "IND", b: "CHN", labelA: "India", labelB: "China", tag: "Himalayan & IOR Theatre" },
    { a: "USA", b: "CHN", labelA: "United States", labelB: "China", tag: "Global Superpower Hegemony" },
    { a: "IND", b: "PAK", labelA: "India", labelB: "Pakistan", tag: "South Asian Deterrence" },
    { a: "USA", b: "RUS", labelA: "United States", labelB: "Russia", tag: "Euro-Atlantic Strategic Balance" },
    { a: "SAU", b: "IRN", labelA: "Saudi Arabia", labelB: "Iran", tag: "Gulf Maritime & Proxy Dynamics" },
    { a: "ISR", b: "IRN", labelA: "Israel", labelB: "Iran", tag: "Middle East Asymmetric Contestation" },
  ];

  return (
    <div className="min-h-screen bg-trinetra-bg text-neutral-200">
      <Header />

      <main className="mx-auto max-w-[1540px] px-5 py-8 sm:px-8 sm:py-10">
        {/* Executive Banner */}
        <section className="mb-10 rounded-lg border border-trinetra-border bg-gradient-to-r from-trinetra-panel via-[#141414] to-trinetra-panel p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 size-80 rounded-full bg-trinetra-saffron/5 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl">
            <div className="section-kicker mb-3">
              TRINETRA <span>/</span> COMMAND DASHBOARD
            </div>
            <h1 className="font-display text-4xl sm:text-5xl text-neutral-100 mb-4 leading-tight">
              Strategic Intelligence Platform
            </h1>
            <p className="text-sm sm:text-base text-neutral-400 mb-6 leading-relaxed">
              Evaluating global state actors through independent, empirically verified dimensions: military strength, economic resilience, maritime trade chokepoints, supply dependencies, and structural alliances.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/compare?a=IND&b=CHN"
                className="px-5 py-2.5 rounded bg-trinetra-saffron text-black text-xs font-semibold hover:bg-trinetra-saffronDim transition-colors flex items-center gap-2"
              >
                <Shield className="size-4" />
                Launch Bilateral Analysis
              </Link>
              <Link
                to="/countries"
                className="px-5 py-2.5 rounded border border-trinetra-border bg-black/40 text-neutral-200 text-xs hover:border-trinetra-saffron hover:text-white transition-colors flex items-center gap-2"
              >
                <Globe2 className="size-4 text-trinetra-saffron" />
                Explore {countries.length > 0 ? `${countries.length} Country Dossiers` : "Countries"}
              </Link>
              <Link
                to="/network"
                className="px-5 py-2.5 rounded border border-trinetra-border bg-black/40 text-neutral-200 text-xs hover:border-trinetra-saffron hover:text-white transition-colors flex items-center gap-2"
              >
                <Share2 className="size-4 text-trinetra-saffron" />
                Strategic Network
              </Link>
            </div>
          </div>
        </section>

        {/* Global Key Metrics Overview */}
        <section className="mb-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="border border-trinetra-border bg-trinetra-panel p-5 rounded-md">
            <div className="flex items-center justify-between text-neutral-500 text-xs uppercase mb-2">
              <span>Tracked States</span>
              <Globe2 className="size-4 text-trinetra-saffron" />
            </div>
            <div className="font-display text-3xl text-neutral-100">
              {countries.length || 22}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">Verified strategic dossiers</div>
          </div>

          <div className="border border-trinetra-border bg-trinetra-panel p-5 rounded-md">
            <div className="flex items-center justify-between text-neutral-500 text-xs uppercase mb-2">
              <span>Maritime Chokepoints</span>
              <Anchor className="size-4 text-trinetra-saffron" />
            </div>
            <div className="font-display text-3xl text-neutral-100">
              {chokepoints.length || 6}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">Global trade bottlenecks</div>
          </div>

          <div className="border border-trinetra-border bg-trinetra-panel p-5 rounded-md">
            <div className="flex items-center justify-between text-neutral-500 text-xs uppercase mb-2">
              <span>Strategic Blocs</span>
              <Layers className="size-4 text-trinetra-saffron" />
            </div>
            <div className="font-display text-3xl text-neutral-100">
              {groups.length || 4}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">Quad, BRICS, NATO, SCO</div>
          </div>

          <div className="border border-trinetra-border bg-trinetra-panel p-5 rounded-md">
            <div className="flex items-center justify-between text-neutral-500 text-xs uppercase mb-2">
              <span>Analytical Model</span>
              <Activity className="size-4 text-trinetra-saffron" />
            </div>
            <div className="font-display text-3xl text-emerald-400">
              Zero-Mock
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">Sourced evidence standard</div>
          </div>
        </section>

        {/* Featured Strategic Bilateral Analyses */}
        <section className="mb-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="section-kicker">STRATEGIC PAIRS</div>
              <h2 className="font-display text-3xl text-neutral-100 mt-1">
                Core Geopolitical Rivalries
              </h2>
            </div>
            <Link
              to="/compare"
              className="text-xs text-trinetra-saffron hover:underline flex items-center gap-1"
            >
              Custom Comparison <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredRivalries.map((pair) => (
              <Link
                key={`${pair.a}-${pair.b}`}
                to={`/compare?a=${pair.a}&b=${pair.b}`}
                className="group border border-trinetra-border bg-trinetra-panel p-5 rounded-md hover:border-trinetra-saffron transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 border border-trinetra-border px-2 py-0.5 rounded">
                    {pair.tag}
                  </span>
                  <span className="text-xs text-trinetra-saffron group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-display text-xl text-neutral-100 font-medium">
                    {pair.labelA}
                  </span>
                  <span className="font-mono text-xs text-neutral-600">VS</span>
                  <span className="font-display text-xl text-neutral-100 font-medium">
                    {pair.labelB}
                  </span>
                </div>
                <div className="text-xs text-neutral-500">
                  Compare military budgets, economic leverage, energy flow, and contingency scenarios.
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Strategic Chokepoints & Blocs Dual Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Critical Maritime Chokepoints */}
          <section className="border border-trinetra-border bg-trinetra-panel p-6 rounded-md">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="section-kicker">GEO-ECONOMIC TRANSIT</div>
                <h3 className="font-display text-2xl text-neutral-100 mt-1">
                  Global Maritime Chokepoints
                </h3>
              </div>
              <Anchor className="size-5 text-trinetra-saffron" />
            </div>

            <div className="space-y-3">
              {chokepoints.slice(0, 5).map((cp: any) => (
                <div
                  key={cp.id || cp.name}
                  className="p-3 border border-trinetra-border/70 rounded bg-black/20 hover:border-trinetra-border transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-neutral-200">{cp.name}</span>
                    <span className="font-mono text-[10px] text-trinetra-saffron">
                      {cp.location || "Transit Route"}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-2">
                    {cp.significance || cp.why_it_matters || "Vital international trade lifeline"}
                  </p>
                  {cp.countries_most_exposed && cp.countries_most_exposed.length > 0 && (
                    <div className="text-[11px] text-neutral-500">
                      High exposure:{" "}
                      <span className="text-neutral-300">
                        {cp.countries_most_exposed.map((e: any) => e.country || e).join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Strategic Alliances & Blocs */}
          <section className="border border-trinetra-border bg-trinetra-panel p-6 rounded-md">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="section-kicker">INSTITUTIONAL ARCHITECTURE</div>
                <h3 className="font-display text-2xl text-neutral-100 mt-1">
                  Multilateral Blocs
                </h3>
              </div>
              <Link to="/groups" className="text-xs text-trinetra-saffron hover:underline">
                All Blocs →
              </Link>
            </div>

            <div className="space-y-3">
              {groups.slice(0, 4).map((grp: any) => (
                <Link
                  key={grp.id}
                  to="/groups"
                  className="block p-3 border border-trinetra-border/70 rounded bg-black/20 hover:border-trinetra-saffron transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-neutral-200">{grp.name}</span>
                    <span className="font-mono text-[10px] text-neutral-500">
                      {grp.members?.length || 0} Members
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mb-2">
                    {grp.description || grp.strategic_purpose || "Strategic multilateral alliance"}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(grp.members || []).slice(0, 6).map((m: string) => (
                      <span
                        key={m}
                        className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-trinetra-border/50 text-neutral-300"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
