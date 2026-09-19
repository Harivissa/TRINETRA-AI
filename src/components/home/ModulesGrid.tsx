import { Link } from "react-router-dom";
import {
  Globe2,
  Shield,
  Share2,
  Layers,
  Anchor,
  Search,
  ArrowRight,
} from "lucide-react";

export default function ModulesGrid() {
  const modules = [
    {
      code: "MOD // 01",
      title: "Sovereign Intelligence Dossiers",
      icon: Globe2,
      category: "ACTOR PROFILING",
      description:
        "Comprehensive sovereign profiles detailing military force structure, economic reserves, energy dependencies, key leaders, and declared strategic doctrines across 22+ nations.",
      metrics: ["Demographics & GDP", "Defence Inventories", "Doctrine & Foreign Policy"],
      linkTo: "/countries",
      linkText: "Explore Dossiers",
      accent: "text-amber-400",
    },
    {
      code: "MOD // 02",
      title: "Bilateral Rivalry Matrix",
      icon: Shield,
      category: "CONTESTATION ENGINE",
      description:
        "Multi-dimensional bilateral vector comparison analyzing military deterrence balance, trade dependencies, historical border friction, and contingency escalation scenarios.",
      metrics: ["Escalation Pathways", "Strategic Chokepoint Levers", "SIPRI & WDI Grounding"],
      linkTo: "/compare?a=IND&b=CHN",
      linkText: "Launch Matrix",
      accent: "text-trinetra-saffron",
    },
    {
      code: "MOD // 03",
      title: "Strategic Network Graph",
      icon: Share2,
      category: "SYSTEMIC TOPOLOGY",
      description:
        "Interactive relationship graph mapping formal sovereign defense alliances, strategic partnerships, and adversarial rivalries across international systems.",
      metrics: ["Alliance & Rivalry Ties", "Node Degree Centrality", "Alliance Clustering"],
      linkTo: "/network",
      linkText: "View Network",
      accent: "text-emerald-400",
    },
    {
      code: "MOD // 04",
      title: "Multilateral Coalitions & Blocs",
      icon: Layers,
      category: "INSTITUTIONAL ARCHITECTURE",
      description:
        "In-depth analysis of multilateral strategic alignments including the Quad, BRICS+, NATO, and the Shanghai Cooperation Organisation (SCO), tracking member commitments.",
      metrics: ["Treaty Obligations", "Joint Military Exercises", "Geopolitical Alignment"],
      linkTo: "/groups",
      linkText: "Inspect Blocs",
      accent: "text-blue-400",
    },
    {
      code: "MOD // 05",
      title: "Maritime Chokepoint Registry",
      icon: Anchor,
      category: "CRITICAL VULNERABILITY",
      description:
        "Strategic maritime transit bottlenecks—Strait of Malacca, Hormuz, Bab el-Mandeb, and Suez Canal—evaluating sovereign exposure levels and interdiction risks.",
      metrics: ["Hydrocarbon Transit Flows", "Sovereign Exposure Ratios", "Naval Forward Leverage"],
      linkTo: "/compare?a=IND&b=CHN",
      linkText: "Review Bottlenecks",
      accent: "text-cyan-400",
    },
    {
      code: "MOD // 06",
      title: "Semantic Intelligence Search",
      icon: Search,
      category: "NEURAL RETRIEVAL",
      description:
        "High-performance natural language search engine cross-referencing sovereign actors, heads of state, treaties, commodities, and intelligence reports across Trinetra's unified repository.",
      metrics: ["Entity Disambiguation", "Keyword & Vector Search", "Cross-Domain Indexing"],
      linkTo: "/search",
      linkText: "Search Platform",
      accent: "text-purple-400",
    },
  ];

  return (
    <section className="mb-14">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <div className="section-kicker">CAPABILITY SUITE</div>
          <h2 className="font-display text-3xl sm:text-4xl text-neutral-100 font-light mt-1">
            Operational Intelligence Modules
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-md font-light">
          Each module functions as an integrated analytical instrument, drawing from real factual records, treaty texts, and sovereign inventories.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <div
              key={mod.code}
              className="rounded-xl border border-trinetra-border bg-[#0a0c10] p-6 flex flex-col justify-between hover:border-neutral-700 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[10px] text-neutral-400 tracking-wider">
                    {mod.code}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border border-white/10 text-neutral-400 bg-white/5">
                    {mod.category}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg border border-white/10 bg-black/50 ${mod.accent}`}>
                    <Icon className="size-4" />
                  </div>
                  <h3 className="font-display text-xl text-neutral-100 font-medium group-hover:text-white transition-colors">
                    {mod.title}
                  </h3>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed mb-5 font-light">
                  {mod.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {mod.metrics.map((m, i) => (
                    <span
                      key={i}
                      className="font-mono text-[10px] px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <Link
                  to={mod.linkTo}
                  className="inline-flex items-center gap-2 text-xs font-mono text-neutral-300 hover:text-trinetra-saffron transition-colors group-hover:translate-x-1 duration-200"
                >
                  <span>{mod.linkText}</span>
                  <ArrowRight className="size-3 text-trinetra-saffron" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
