import { Link } from "react-router-dom";
import { Eye, Network, Radar, ArrowRight, Shield, Globe2, Compass, Share2 } from "lucide-react";

export default function ThreeEyes() {
  const pillars = [
    {
      id: "observe",
      eyeNumber: "FIRST EYE",
      sanskrit: "प्रत्यक्ष (PRATYAKSHA)",
      title: "OBSERVE",
      summary: "Discover what is happening across sovereign actors, leaders, and maritime lifelines.",
      details:
        "Comprehensive sovereign profiles, factual military inventories, economic statistics, and trade chokepoints verified against open-source intelligence and official records.",
      capabilities: [
        "22+ In-Depth Country Dossiers",
        "Key Political & Military Decision-Makers",
        "Critical Maritime Chokepoint Registry",
        "Natural Language Semantic Search",
      ],
      primaryLink: "/countries",
      primaryLabel: "Browse Country Dossiers",
      secondaryLink: "/search",
      secondaryLabel: "Semantic Query",
      accentColor: "text-amber-400",
      borderColor: "hover:border-amber-400/60",
      badgeColor: "border-amber-400/40 bg-amber-400/10 text-amber-300",
      icon: Eye,
    },
    {
      id: "connect",
      eyeNumber: "SECOND EYE",
      sanskrit: "सम्बन्ध (SAMBANDHA)",
      title: "CONNECT",
      summary: "Understand relationships, multilateral coalitions, and supply chain dependencies.",
      details:
        "Mapping bilateral treaties, regional security pacts (Quad, BRICS, NATO, SCO), and asymmetric trade dependencies to reveal the hidden architecture of global influence.",
      capabilities: [
        "Bilateral Treaty & Alliance Graph",
        "Multilateral Blocs & Coalitions Explorer",
        "Cross-Border Supply Chain Dependencies",
        "Adversarial & Alignment Topology",
      ],
      primaryLink: "/network",
      primaryLabel: "Open Strategic Network",
      secondaryLink: "/groups",
      secondaryLabel: "Multilateral Blocs",
      accentColor: "text-trinetra-saffron",
      borderColor: "hover:border-trinetra-saffron/60",
      badgeColor: "border-trinetra-saffron/40 bg-trinetra-saffron/10 text-trinetra-saffron",
      icon: Network,
    },
    {
      id: "anticipate",
      eyeNumber: "THIRD EYE",
      sanskrit: "भविष्य (BHAVISHYA)",
      title: "ANTICIPATE",
      summary: "Evaluate strategic implications, deterrence balance, and potential flashpoints.",
      details:
        "Synthesizing force posture, economic leverage, geography, and historical friction into multi-dimensional comparative vectors to forecast contingency friction points.",
      capabilities: [
        "Vector-Based Bilateral Rivalry Matrix",
        "Escalation Scenario Assessment",
        "Chokepoint Interdiction Exposure",
        "AI-Assisted Strategic Synthesis",
      ],
      primaryLink: "/compare?a=IND&b=CHN",
      primaryLabel: "Run Rivalry Matrix",
      secondaryLink: "/modules",
      secondaryLabel: "Domain Modules",
      accentColor: "text-emerald-400",
      borderColor: "hover:border-emerald-400/60",
      badgeColor: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
      icon: Radar,
    },
  ];

  return (
    <section className="mb-14">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <div className="section-kicker">THE TRINETRA ARCHITECTURE</div>
          <h2 className="font-display text-3xl sm:text-4xl text-neutral-100 font-light mt-1">
            Three Eyes of Geopolitical Intelligence
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-lg font-light">
          Inspired by the concept of the all-seeing third eye, Trinetra transforms disconnected international reports into structured, observable, and anticipatory strategic intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.id}
              className={`rounded-xl border border-trinetra-border bg-[#0a0c10] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${pillar.borderColor} group hover:-translate-y-1 hover:shadow-xl hover:shadow-black/60`}
            >
              <div>
                {/* Pillar Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded border ${pillar.badgeColor}`}>
                    {pillar.eyeNumber}
                  </span>
                  <span className="font-mono text-[10px] text-neutral-500">
                    {pillar.sanskrit}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg border border-white/10 bg-black/40 ${pillar.accentColor}`}>
                    <Icon className="size-5" />
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl text-neutral-100 font-normal tracking-wide">
                    {pillar.title}
                  </h3>
                </div>

                <p className="font-mono text-xs text-neutral-300 mb-4 leading-relaxed font-medium">
                  {pillar.summary}
                </p>

                <p className="text-xs text-neutral-400 leading-relaxed mb-6 font-light">
                  {pillar.details}
                </p>

                {/* Capabilities list */}
                <div className="border-t border-white/5 pt-4 mb-6 space-y-2">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 mb-2">
                    Verified Capabilities
                  </div>
                  {pillar.capabilities.map((cap, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-neutral-300">
                      <span className="text-neutral-500 font-mono mt-0.5">•</span>
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Links */}
              <div className="pt-4 border-t border-white/10 space-y-2.5">
                <Link
                  to={pillar.primaryLink}
                  className="w-full py-2.5 px-4 rounded bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-xs font-mono text-neutral-200 hover:text-white flex items-center justify-between transition-all group-hover:border-trinetra-saffron/40"
                >
                  <span>{pillar.primaryLabel}</span>
                  <ArrowRight className="size-3 text-trinetra-saffron transition-transform group-hover:translate-x-0.5" />
                </Link>

                <Link
                  to={pillar.secondaryLink}
                  className="block text-center text-[11px] font-mono text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  {pillar.secondaryLabel} →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
