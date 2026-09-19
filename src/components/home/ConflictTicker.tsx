import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Radio,
  Play,
  Pause,
  Anchor,
  Shield,
  Layers,
  Swords,
  ChevronRight,
  Gauge,
  ExternalLink,
} from "lucide-react";
import { api } from "../../services/api";
import type { CountryIndexEntry } from "../../types";

export interface IntelTickerItem {
  id: string;
  headline: string;
  summary: string;
  category: "CHOKEPOINT" | "RIVALRY" | "ALLIANCE" | "SOVEREIGN";
  level: "CRITICAL" | "HIGH" | "ELEVATED" | "STRATEGIC";
  link: string;
  metric?: string;
  theatre?: string;
}

// Authoritative Baseline Intelligence Dossiers (Ensures instantaneous, high-fidelity rendering)
const BASELINE_TICKER_ITEMS: IntelTickerItem[] = [
  {
    id: "malacca",
    headline: "Strait of Malacca",
    summary: "China Malacca Dilemma: ~80% crude oil imports and 25% global seaborne cargo transit this corridor.",
    category: "CHOKEPOINT",
    level: "HIGH",
    metric: "~80% Crude Transit",
    theatre: "Indo-Pacific",
    link: "/live-map",
  },
  {
    id: "hormuz",
    headline: "Strait of Hormuz",
    summary: "World's prime petroleum artery: ~20.5M bpd transits daily; Iranian littoral geographic leverage.",
    category: "CHOKEPOINT",
    level: "CRITICAL",
    metric: "~20.5M bpd Flow",
    theatre: "Persian Gulf",
    link: "/live-map",
  },
  {
    id: "taiwan-strait",
    headline: "US–China First Island Chain",
    summary: "Advanced semiconductor supply sovereignty, naval carrier deployment, and Taiwan Strait deterrence.",
    category: "RIVALRY",
    level: "CRITICAL",
    metric: "1st Island Chain",
    theatre: "East Asia",
    link: "/compare?a=USA&b=CHN",
  },
  {
    id: "himalayan-lac",
    headline: "India–China LAC Standoff",
    summary: "Disputed 3,488 km border with fortified high-altitude combat positions along Ladakh and Arunachal.",
    category: "RIVALRY",
    level: "HIGH",
    metric: "3,488 km Border",
    theatre: "Himalayas",
    link: "/compare?a=IND&b=CHN",
  },
  {
    id: "bab-el-mandeb",
    headline: "Bab el-Mandeb & Red Sea",
    summary: "Asymmetric anti-ship ballistic missile and drone interdiction constraining Suez Canal traffic.",
    category: "CHOKEPOINT",
    level: "CRITICAL",
    metric: "High Interdiction Risk",
    theatre: "Red Sea",
    link: "/live-map",
  },
  {
    id: "quad-coalition",
    headline: "QUAD Indo-Pacific Security",
    summary: "Quadrilateral maritime surveillance partnership between India, US, Japan, and Australia.",
    category: "ALLIANCE",
    level: "STRATEGIC",
    metric: "4 Partner Navies",
    theatre: "Indo-Pacific",
    link: "/groups",
  },
  {
    id: "euro-atlantic",
    headline: "NATO Eastern Flank Deployments",
    summary: "Multinational battlegroups on heightened operational readiness across Baltic and Black Sea sectors.",
    category: "RIVALRY",
    level: "CRITICAL",
    metric: "Eastern Flank Alert",
    theatre: "Europe",
    link: "/compare?a=USA&b=RUS",
  },
  {
    id: "india-naval",
    headline: "India IOR Strategic Autonomy",
    summary: "Tri-service command at Andaman & Nicobar commanding western approach to Malacca Strait.",
    category: "SOVEREIGN",
    level: "STRATEGIC",
    metric: "Andaman Command",
    theatre: "Indian Ocean",
    link: "/country?id=IND",
  },
  {
    id: "brics-plus",
    headline: "BRICS+ Multi-Polar Coalition",
    summary: "Cooperation grouping exploring non-dollar trade settlement mechanisms and development capital.",
    category: "ALLIANCE",
    level: "STRATEGIC",
    metric: "Alternative Rails",
    theatre: "Global South",
    link: "/groups",
  },
  {
    id: "suez-canal",
    headline: "Suez Canal Maritime Gateway",
    summary: "Vital transit handling ~12% global trade; alternative Cape of Good Hope adds 10-14 transit days.",
    category: "CHOKEPOINT",
    level: "HIGH",
    metric: "~12% World Trade",
    theatre: "Mediterranean-Red Sea",
    link: "/live-map",
  },
  {
    id: "loc-subcontinent",
    headline: "India–Pakistan Line of Control",
    summary: "Dual nuclear-armed tactical posture across Jammu & Kashmir with active cross-border surveillance.",
    category: "RIVALRY",
    level: "HIGH",
    metric: "Nuclear Deterrent",
    theatre: "South Asia",
    link: "/compare?a=IND&b=PAK",
  },
  {
    id: "persian-gulf-axis",
    headline: "Saudi Arabia–Iran Maritime Security",
    summary: "Direct diplomatic engagement amidst fragile proxy stabilization in Yemen and Gulf littoral waters.",
    category: "RIVALRY",
    level: "ELEVATED",
    metric: "Gulf Detente",
    theatre: "Middle East",
    link: "/compare?a=SAU&b=IRN",
  },
];

export default function ConflictTicker() {
  const [tickerItems, setTickerItems] = useState<IntelTickerItem[]>(BASELINE_TICKER_ITEMS);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speed, setSpeed] = useState<"normal" | "slow" | "fast">("normal");
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [dataLive, setDataLive] = useState<boolean>(false);

  // Pull dynamic summaries from existing authoritative backend services
  useEffect(() => {
    let isMounted = true;

    Promise.all([
      api.getChokepoints().catch(() => []),
      api.getGroups().catch(() => []),
      api.getCountries().catch(() => []),
    ])
      .then(([chokepoints, groups, countries]) => {
        if (!isMounted) return;

        const liveBulletins: IntelTickerItem[] = [];

        // 1. Dynamic Chokepoints Intelligence from Database
        if (Array.isArray(chokepoints) && chokepoints.length > 0) {
          chokepoints.forEach((cp: any) => {
            const rawMatters = cp.why_it_matters || cp.exposure_summary || "";
            const summarySnippet =
              rawMatters.length > 110 ? `${rawMatters.slice(0, 107)}...` : rawMatters;

            liveBulletins.push({
              id: `cp-${cp.id || cp.name}`,
              headline: cp.name || "Strategic Chokepoint",
              summary: summarySnippet || "Critical bottleneck for global energy and trade transit.",
              category: "CHOKEPOINT",
              level:
                cp.id?.includes("HORMUZ") || cp.id?.includes("BAB")
                  ? "CRITICAL"
                  : cp.id?.includes("MALACCA")
                  ? "HIGH"
                  : "ELEVATED",
              metric: cp.annual_traffic || cp.primary_users || "Arterial Transit",
              theatre: cp.location || "Maritime",
              link: "/live-map",
            });
          });
        }

        // 2. Dynamic Groups & Alliances from Database
        if (Array.isArray(groups) && groups.length > 0) {
          groups.forEach((grp: any) => {
            const membersList = Array.isArray(grp.members) ? grp.members.slice(0, 4).join(", ") : "";
            liveBulletins.push({
              id: `grp-${grp.id}`,
              headline: `${grp.name || grp.id.toUpperCase()} Coalition`,
              summary: grp.description ? `${grp.description.slice(0, 105)}...` : "Multilateral strategic partnership.",
              category: "ALLIANCE",
              level: "STRATEGIC",
              metric: membersList ? `${membersList}${grp.members?.length > 4 ? "..." : ""}` : "Multilateral Bloc",
              theatre: grp.focus_areas?.[0] || "Global Order",
              link: "/groups",
            });
          });
        }

        // 3. Sovereign Nuclear & Strategic States
        if (Array.isArray(countries) && countries.length > 0) {
          const nuclearStates = countries.filter((c: CountryIndexEntry) =>
            ["IND", "CHN", "USA", "RUS", "FRA", "GBR", "PAK", "ISR"].includes(c.id.toUpperCase())
          );
          nuclearStates.slice(0, 4).forEach((c: CountryIndexEntry) => {
            liveBulletins.push({
              id: `sov-${c.id}`,
              headline: `${c.name} (${c.id}) Strategic Seat`,
              summary: `${c.region} sovereign actor maintaining independent strategic defense posture.`,
              category: "SOVEREIGN",
              level: c.id === "IND" ? "STRATEGIC" : "HIGH",
              metric: "Sovereign Command",
              theatre: c.region,
              link: `/country?id=${c.id}`,
            });
          });
        }

        if (liveBulletins.length > 0) {
          // Merge baseline curated flashpoints with live dynamic feed for maximal depth
          const merged = [...liveBulletins, ...BASELINE_TICKER_ITEMS];
          // Deduplicate by headline
          const seen = new Set<string>();
          const deduped: IntelTickerItem[] = [];
          for (const item of merged) {
            if (!seen.has(item.headline.toLowerCase())) {
              seen.add(item.headline.toLowerCase());
              deduped.push(item);
            }
          }
          setTickerItems(deduped);
          setDataLive(true);
        }
      })
      .catch((err) => {
        console.warn("Ticker dynamic load warning, using baseline data:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter items by category if user clicks a filter
  const displayedItems = useMemo(() => {
    if (activeCategory === "ALL") return tickerItems;
    return tickerItems.filter((i) => i.category === activeCategory);
  }, [tickerItems, activeCategory]);

  // Determine marquee duration based on speed setting
  const durationStyle = useMemo(() => {
    switch (speed) {
      case "slow":
        return { "--ticker-duration": "150s" } as React.CSSProperties;
      case "fast":
        return { "--ticker-duration": "75s" } as React.CSSProperties;
      case "normal":
      default:
        return { "--ticker-duration": "110s" } as React.CSSProperties;
    }
  }, [speed]);

  const cycleSpeed = () => {
    if (speed === "normal") setSpeed("slow");
    else if (speed === "slow") setSpeed("fast");
    else setSpeed("normal");
  };

  return (
    <div
      id="geopolitical-intel-ticker"
      className="sticky top-[56px] sm:top-[57px] z-30 w-full border-b border-white/10 bg-[#050608]/95 backdrop-blur-md text-xs select-none shadow-xl overflow-hidden flex items-center"
      role="region"
      aria-label="Geopolitical Intelligence Ticker"
    >
      {/* Editorial Static Lead Badge */}
      <div className="shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#0a0d12] border-r border-white/10 z-20">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
          </span>
        </div>

        <span className="px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-rose-400 font-mono text-[9px] font-bold uppercase tracking-wider">
          LIVE
        </span>

        {dataLive && (
          <span className="hidden md:inline-flex items-center gap-1 text-[9px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-1.5 py-0.5 rounded">
            <Radio className="size-2.5 animate-pulse" />
            <span>SYNCED</span>
          </span>
        )}
      </div>

      {/* Marquee Stream with Lateral Fade Gradients */}
      <div className="flex-1 overflow-hidden relative group py-2">
        {/* Soft Lateral Fades */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-[#050608] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-[#050608] to-transparent z-10" />

        {/* Slow-moving Infinite Ticker Track */}
        <div
          className={`animate-ticker-continuous flex items-center gap-8 ${isPaused ? "is-paused" : ""}`}
          style={durationStyle}
        >
          {/* Render duplicated list for continuous infinite glide */}
          {[...displayedItems, ...displayedItems].map((item, idx) => {
            const isCritical = item.level === "CRITICAL";
            const isHigh = item.level === "HIGH";
            const isStrategic = item.level === "STRATEGIC";

            return (
              <Link
                key={`${item.id}-${idx}`}
                to={item.link}
                className="inline-flex items-center gap-2.5 text-neutral-300 hover:text-white transition-colors group/item shrink-0 pr-4"
              >
                {/* Status Dot */}
                <span
                  className={`size-2 rounded-full shrink-0 ${
                    isCritical
                      ? "bg-rose-500 shadow-xs shadow-rose-500/50"
                      : isHigh
                      ? "bg-amber-400"
                      : isStrategic
                      ? "bg-trinetra-saffron"
                      : "bg-cyan-400"
                  }`}
                />

                {/* Category Pill */}
                <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-neutral-400 group-hover/item:border-trinetra-saffron/40 group-hover/item:text-trinetra-saffron transition-colors">
                  {item.category}
                </span>

                {/* Headline */}
                <span className="text-[12px] font-medium text-neutral-100 group-hover/item:text-trinetra-saffron transition-colors">
                  {item.headline}
                </span>

                <span className="text-neutral-600">·</span>

                {/* Summary Snippet */}
                <span className="text-[11px] text-neutral-400 font-light max-w-[280px] sm:max-w-[340px] truncate">
                  {item.summary}
                </span>

                {/* Metric Badge if available */}
                {item.metric && (
                  <span className="hidden lg:inline-block text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
                    {item.metric}
                  </span>
                )}

                {/* Hover indicator */}
                <ChevronRight className="size-3 text-neutral-500 group-hover/item:text-trinetra-saffron group-hover/item:translate-x-0.5 transition-all opacity-0 group-hover/item:opacity-100" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Right Controls: Pause/Play, Speed, Filter */}
      <div className="shrink-0 hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#0a0d12] border-l border-white/10 z-20 text-[10px] font-mono">
        {/* Play/Pause Button */}
        <button
          onClick={() => setIsPaused(!isPaused)}
          className={`p-1.5 rounded transition-all cursor-pointer ${
            isPaused
              ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
              : "text-neutral-400 hover:text-white hover:bg-neutral-800"
          }`}
          title={isPaused ? "Resume Ticker Movement" : "Pause Ticker"}
          aria-label={isPaused ? "Resume Ticker Movement" : "Pause Ticker"}
        >
          {isPaused ? <Play className="size-3" /> : <Pause className="size-3" />}
        </button>

        {/* Category Filter Dropdown / Quick Cycle */}
        <select
          value={activeCategory}
          onChange={(e) => setActiveCategory(e.target.value)}
          className="bg-black border border-white/10 text-neutral-300 text-[10px] font-mono rounded px-1.5 py-1 focus:outline-none focus:border-trinetra-saffron/60 cursor-pointer"
          aria-label="Filter Ticker By Category"
        >
          <option value="ALL">ALL ({tickerItems.length})</option>
          <option value="CHOKEPOINT">CHOKEPOINTS</option>
          <option value="RIVALRY">RIVALRIES</option>
          <option value="ALLIANCE">ALLIANCES</option>
          <option value="SOVEREIGN">SOVEREIGNS</option>
        </select>
      </div>
    </div>
  );
}
