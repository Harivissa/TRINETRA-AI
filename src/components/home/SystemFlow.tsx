import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Globe2,
  Users,
  Building2,
  Calendar,
  TrendingUp,
  Shield,
  FileCheck2,
  Compass,
  ArrowRight,
  ExternalLink
} from "lucide-react";

interface SystemDomain {
  id: string;
  name: string;
  short: string;
  icon: any;
  definition: string;
  realWorldExample: string;
  linkTo: string;
  linkText: string;
  connectedTo: string[];
}

export default function SystemFlow() {
  const domains: SystemDomain[] = [
    {
      id: "countries",
      name: "Sovereign Countries",
      short: "COUNTRIES",
      icon: Globe2,
      definition: "Autonomous state actors with sovereign borders, constitutional authorities, and geographic realities.",
      realWorldExample: "India, China, United States, Russia with dedicated intelligence profiles and strategic doctrines.",
      linkTo: "/countries",
      linkText: "Explore 22+ Dossiers",
      connectedTo: ["PEOPLE", "ORGANIZATIONS", "ECONOMIES", "MILITARY"],
    },
    {
      id: "people",
      name: "Strategic Leaders",
      short: "PEOPLE",
      icon: Users,
      definition: "Heads of state, military commanders, and diplomats whose decisions steer sovereign policy.",
      realWorldExample: "Narendra Modi (IND), Xi Jinping (CHN), Joe Biden (USA), Vladimir Putin (RUS) profiles in entity registry.",
      linkTo: "/search?q=leader",
      linkText: "Search Leadership",
      connectedTo: ["COUNTRIES", "ORGANIZATIONS", "DIPLOMACY"],
    },
    {
      id: "organizations",
      name: "Multilateral Treaties & Blocs",
      short: "ORGANIZATIONS",
      icon: Building2,
      definition: "Institutional alliances, trade compacts, and security arrangements binding multiple sovereign states.",
      realWorldExample: "The Quad (security dialogue), BRICS+ (geo-economic coalition), NATO (collective defense), SCO.",
      linkTo: "/groups",
      linkText: "View Strategic Blocs",
      connectedTo: ["COUNTRIES", "DIPLOMACY", "STRATEGIC INTERESTS"],
    },
    {
      id: "events",
      name: "Geopolitical Events",
      short: "EVENTS",
      icon: Calendar,
      definition: "Border skirmishes, diplomatic summits, elections, trade sanctions, and flashpoint triggers.",
      realWorldExample: "Galwan Valley friction, 2024 Taiwan Strait drills, Red Sea maritime interdictions.",
      linkTo: "/compare",
      linkText: "Review Conflict Vectors",
      connectedTo: ["COUNTRIES", "MILITARY", "DIPLOMACY"],
    },
    {
      id: "economies",
      name: "Supply Chains & Economies",
      short: "ECONOMIES",
      icon: TrendingUp,
      definition: "GDP capacity, foreign exchange reserves, energy dependencies, and critical mineral supply pipelines.",
      realWorldExample: "China's 70%+ iron ore reliance on Australia, Western reliance on Chinese rare-earth processing.",
      linkTo: "/modules",
      linkText: "Examine Dependencies",
      connectedTo: ["COUNTRIES", "STRATEGIC INTERESTS"],
    },
    {
      id: "military",
      name: "Military Force Posture",
      short: "MILITARY",
      icon: Shield,
      definition: "Active troop strengths, carrier battle groups, nuclear deterrence triad, and defense industrial base.",
      realWorldExample: "S-400 air defense, indigenous nuclear subs, high-altitude mountain warfare corps.",
      linkTo: "/compare?a=IND&b=CHN",
      linkText: "Compare Forces",
      connectedTo: ["COUNTRIES", "EVENTS", "STRATEGIC INTERESTS"],
    },
    {
      id: "diplomacy",
      name: "Diplomatic Accords",
      short: "DIPLOMACY",
      icon: FileCheck2,
      definition: "Bilateral peace protocols, border agreements, free-trade negotiations, and strategic communications.",
      realWorldExample: "1993/1996 India-China Border Peace Protocols, US-India iCET technology framework.",
      linkTo: "/network",
      linkText: "Inspect Treaties",
      connectedTo: ["COUNTRIES", "ORGANIZATIONS", "PEOPLE"],
    },
    {
      id: "interests",
      name: "Strategic Interests",
      short: "STRATEGIC INTERESTS",
      icon: Compass,
      definition: "Core national survival imperatives: territorial integrity, trade passage, energy security, and regional hegemony.",
      realWorldExample: "India's strategic autonomy, China's Malacca Dilemma mitigation, US freedom of navigation.",
      linkTo: "/compare",
      linkText: "Analyze Imperatives",
      connectedTo: ["COUNTRIES", "ECONOMIES", "MILITARY"],
    },
  ];

  const [selectedDomainId, setSelectedDomainId] = useState<string>("countries");
  const selectedDomain = domains.find((d) => d.id === selectedDomainId) || domains[0];

  return (
    <section className="mb-14 rounded-xl border border-trinetra-border bg-[#0a0c10] p-6 sm:p-10">
      <div className="max-w-3xl mb-8">
        <div className="section-kicker mb-2">SYSTEMIC GEOPOLITICAL FRAMEWORK</div>
        <h2 className="font-display text-3xl sm:text-4xl text-neutral-100 font-light leading-tight">
          Understand the world as a <span className="font-normal text-white">system</span>.
        </h2>
        <p className="text-sm text-neutral-400 mt-3 leading-relaxed">
          Geopolitical events are rarely isolated occurrences. A border flare-up or supply disruption is the outward symptom of structural interdependencies across states, decision-makers, multilateral pacts, military deterrence, and geo-economic leverage.
        </p>
      </div>

      {/* Interactive Horizontal Flow Bar */}
      <div className="mb-8 overflow-x-auto pb-3">
        <div className="flex items-center min-w-[760px] justify-between relative">
          {/* Background Connecting Line */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-neutral-800 -z-0" />

          {domains.map((d, index) => {
            const isSelected = d.id === selectedDomainId;
            const Icon = d.icon;
            return (
              <button
                key={d.id}
                onClick={() => setSelectedDomainId(d.id)}
                className={`relative z-10 flex flex-col items-center gap-2 group cursor-pointer transition-all ${
                  isSelected ? "scale-105" : "hover:scale-105"
                }`}
              >
                <div
                  className={`size-11 rounded-lg border flex items-center justify-center transition-all ${
                    isSelected
                      ? "border-trinetra-saffron bg-trinetra-saffron/20 text-trinetra-saffron shadow-lg shadow-trinetra-saffron/20"
                      : "border-neutral-800 bg-[#0d1017] text-neutral-400 group-hover:border-neutral-600 group-hover:text-neutral-200"
                  }`}
                >
                  <Icon className="size-5" />
                </div>
                <div className="text-center">
                  <div
                    className={`font-mono text-[9px] uppercase tracking-wider ${
                      isSelected ? "text-trinetra-saffron font-bold" : "text-neutral-500"
                    }`}
                  >
                    {d.short}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Domain Focus Panel */}
      <div className="rounded-lg border border-white/10 bg-black/40 p-6 sm:p-8 backdrop-blur">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] text-trinetra-saffron border border-trinetra-saffron/40 px-2 py-0.5 rounded uppercase">
                ACTIVE DOMAIN LAYER
              </span>
              <span className="text-neutral-500 text-xs font-mono">•</span>
              <span className="font-mono text-xs text-neutral-400">
                LAYER {domains.findIndex((d) => d.id === selectedDomainId) + 1} OF 8
              </span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl text-neutral-100 font-light">
              {selectedDomain.name}
            </h3>

            <p className="text-sm text-neutral-300 leading-relaxed max-w-2xl font-light">
              {selectedDomain.definition}
            </p>

            <div className="p-3.5 rounded border border-white/10 bg-neutral-950/60 font-mono text-xs text-neutral-400">
              <span className="text-trinetra-saffron font-bold">EMPIRICAL INSTANCE: </span>
              {selectedDomain.realWorldExample}
            </div>
          </div>

          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6 space-y-4">
            <div>
              <div className="font-mono text-[10px] uppercase text-neutral-500 tracking-wider mb-2">
                Structural Interlinks
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedDomain.connectedTo.map((target) => (
                  <span
                    key={target}
                    className="font-mono text-[10px] px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300"
                  >
                    ↔ {target}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Link
                to={selectedDomain.linkTo}
                className="inline-flex items-center gap-2 px-4 py-2 rounded bg-neutral-900 border border-trinetra-border hover:border-trinetra-saffron text-xs font-mono text-neutral-200 hover:text-white transition-all"
              >
                <span>{selectedDomain.linkText}</span>
                <ArrowRight className="size-3 text-trinetra-saffron" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
