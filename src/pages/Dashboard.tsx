import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Anchor, ArrowRight, Shield } from "lucide-react";
import Header from "../components/dashboard/Header";
import Footer from "../components/dashboard/Footer";
import { api } from "../services/api";
import type { CountryIndexEntry } from "../types";

// Editorial Visual Modules (Matching Screenshot Reference)
import ConflictTicker from "../components/home/ConflictTicker";
import EditorialHero from "../components/home/EditorialHero";
import GlobalRivalryMonitor from "../components/home/GlobalRivalryMonitor";
import FloatingQuickAction from "../components/home/FloatingQuickAction";

// Authoritative Existing Core Intelligence Modules (Strictly Preserved)
import SystemFlow from "../components/home/SystemFlow";
import ThreeEyes from "../components/home/ThreeEyes";
import GlobalIntelligenceMap from "../components/home/GlobalIntelligenceMap";
import ModulesGrid from "../components/home/ModulesGrid";
import InvestigationWorkflow from "../components/home/InvestigationWorkflow";
import ComparisonLauncher from "../components/home/ComparisonLauncher";

interface DashboardProps {
  autoScrollToMap?: boolean;
}

export default function Dashboard({ autoScrollToMap = false }: DashboardProps) {
  const [countries, setCountries] = useState<CountryIndexEntry[]>([]);
  const [chokepoints, setChokepoints] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

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
        setLoading(false);
      });
  }, []);

  // Handle auto-scroll if navigating to #live-map or via /live-map
  useEffect(() => {
    if (autoScrollToMap || location.hash === "#live-map") {
      setTimeout(() => {
        const el = document.getElementById("live-map");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
    }
  }, [autoScrollToMap, location.hash]);

  const handleReplayIntro = () => {
    window.dispatchEvent(new CustomEvent("trinetra:replay-intro"));
  };

  return (
    <div className="min-h-screen bg-[#070707] text-neutral-200 selection:bg-[#FF7A00]/30 selection:text-white">
      {/* Primary Header */}
      <Header />

      {/* Geopolitical Crisis Ticker Bar (Directly below Header, matching Screenshot) */}
      <ConflictTicker />

      {/* Hero Section (Matching Screenshot's Editorial Composition & Typographic Scale) */}
      <EditorialHero
        countryCount={countries.length}
        chokepointCount={chokepoints.length}
        groupCount={groups.length}
        onReplayIntro={handleReplayIntro}
      />

      <main className="mx-auto max-w-[1540px] px-4 sm:px-8">
        {/* ACTIVE INTELLIGENCE: GLOBAL RIVALRY MONITOR (Directly below Hero, matching Screenshot) */}
        <GlobalRivalryMonitor />

        {/* SECTION D: INTERACTIVE GLOBAL INTELLIGENCE MAP (SOVEREIGNS & CHOKEPOINTS) */}
        <GlobalIntelligenceMap
          countries={countries}
          chokepoints={chokepoints}
        />

        {/* SECTION B: UNDERSTAND THE WORLD AS A SYSTEM (DOMAIN INTERDEPENDENCIES) */}
        <SystemFlow />

        {/* SECTION C: THE THREE EYES OF INTELLIGENCE (OBSERVE, CONNECT, ANTICIPATE) */}
        <ThreeEyes />

        {/* SECTION E: CORE OPERATIONAL INTELLIGENCE MODULES */}
        <ModulesGrid />

        {/* SECTION 5: INTELLIGENCE PREVIEW (INVESTIGATION WORKFLOW WALKTHROUGH) */}
        <InvestigationWorkflow />

        {/* SECTION 6: COMPARISON ENGINE ENTRY (FEATURED STRATEGIC RIVALRIES & QUICK LAUNCH) */}
        <ComparisonLauncher countries={countries} />

        {/* AUXILIARY REPOSITORIES: CHOKEPOINTS & BLOCS ARCHIVES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
          {/* Critical Maritime Chokepoints */}
          <section className="border border-neutral-800 bg-[#0d0d0d] p-6 rounded-xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-[10px] font-mono tracking-wider uppercase text-[#FF7A00]">
                  GEO-ECONOMIC TRANSIT
                </div>
                <h3 className="font-serif text-2xl text-neutral-100 mt-1">
                  Global Maritime Chokepoints
                </h3>
              </div>
              <Anchor className="size-5 text-[#FF7A00]" />
            </div>

            <div className="space-y-3">
              {chokepoints.slice(0, 4).map((cp: any) => (
                <div
                  key={cp.id || cp.name}
                  className="p-3.5 border border-neutral-800 rounded-lg bg-black/40 hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-neutral-200">{cp.name}</span>
                    <span className="font-mono text-[10px] text-[#FF7A00]">
                      {cp.location || "Transit Route"}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-2 font-light">
                    {cp.significance || cp.why_it_matters || "Vital international trade lifeline"}
                  </p>
                  {cp.countries_most_exposed && cp.countries_most_exposed.length > 0 && (
                    <div className="text-[11px] text-neutral-500 font-mono">
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
          <section className="border border-neutral-800 bg-[#0d0d0d] p-6 rounded-xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-[10px] font-mono tracking-wider uppercase text-[#FF7A00]">
                  INSTITUTIONAL ARCHITECTURE
                </div>
                <h3 className="font-serif text-2xl text-neutral-100 mt-1">
                  Multilateral Blocs
                </h3>
              </div>
              <Link to="/groups" className="text-xs text-[#FF7A00] hover:underline flex items-center gap-1 font-mono">
                <span>All Blocs</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {groups.slice(0, 4).map((grp: any) => (
                <Link
                  key={grp.id}
                  to="/groups"
                  className="block p-3.5 border border-neutral-800 rounded-lg bg-black/40 hover:border-[#FF7A00]/70 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-neutral-200 group-hover:text-[#FF7A00] transition-colors">
                      {grp.name}
                    </span>
                    <span className="font-mono text-[10px] text-neutral-500">
                      {grp.members?.length || 0} Members
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mb-2 font-light">
                    {grp.description || grp.strategic_purpose || "Strategic multilateral alliance"}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(grp.members || []).slice(0, 6).map((m: string) => (
                      <span
                        key={m}
                        className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300"
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

      {/* Floating Tactical Quick Action Button (Matching bottom right of screenshot) */}
      <FloatingQuickAction countries={countries} />

      <Footer />
    </div>
  );
}
