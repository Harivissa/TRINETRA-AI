import { Link } from "react-router-dom";
import { ArrowRight, Shield, Swords, Activity, Zap, ExternalLink } from "lucide-react";
import { GEOPOLITICAL_IMAGES } from "../../data/geopoliticalMedia";

interface RivalryItem {
  a: string;
  b: string;
  labelA: string;
  labelB: string;
  theatre: string;
  summary: string;
  tensionLevel: "HIGH" | "ELEVATED" | "CRITICAL";
  keyArena: string;
  imageKey: string;
}

const FEATURED_RIVALRIES: RivalryItem[] = [
  {
    a: "IND",
    b: "CHN",
    labelA: "India",
    labelB: "China",
    theatre: "Himalayan LAC & Indo-Pacific Maritime",
    summary: "Disputed 3,488 km border, Malacca chokepoint transit vulnerability, and competing Indian Ocean naval infrastructure.",
    tensionLevel: "HIGH",
    keyArena: "Himalayan LAC & Malacca Strait",
    imageKey: "himalayan_lac",
  },
  {
    a: "USA",
    b: "CHN",
    labelA: "United States",
    labelB: "China",
    theatre: "Global Superpower Hegemony",
    summary: "Semiconductor supply chain sovereignty, Taiwan Strait contingency, and First Island Chain naval deterrence.",
    tensionLevel: "HIGH",
    keyArena: "First Island Chain & Tech Controls",
    imageKey: "taiwan_strait",
  },
  {
    a: "IND",
    b: "PAK",
    labelA: "India",
    labelB: "Pakistan",
    theatre: "South Asian Nuclear Deterrence",
    summary: "Active Line of Control, cross-border proxy dynamics, and asymmetric rapid escalation doctrines.",
    tensionLevel: "ELEVATED",
    keyArena: "Line of Control & Indus Waters",
    imageKey: "himalayan_lac",
  },
  {
    a: "USA",
    b: "RUS",
    labelA: "United States",
    labelB: "Russia",
    theatre: "Euro-Atlantic Strategic Balance",
    summary: "NATO eastern flank deployment, Arctic operational presence, and strategic nuclear arms control erosion.",
    tensionLevel: "CRITICAL",
    keyArena: "Baltic & Black Sea NATO Flanks",
    imageKey: "euro_atlantic",
  },
  {
    a: "SAU",
    b: "IRN",
    labelA: "Saudi Arabia",
    labelB: "Iran",
    theatre: "Persian Gulf & Maritime Chokepoints",
    summary: "Strait of Hormuz leverage, Bab el-Mandeb maritime security, and competing regional security architectures.",
    tensionLevel: "HIGH",
    keyArena: "Strait of Hormuz & Red Sea",
    imageKey: "hormuz",
  },
  {
    a: "ISR",
    b: "IRN",
    labelA: "Israel",
    labelB: "Iran",
    theatre: "Levant & Asymmetric Missile Contestation",
    summary: "Nuclear threshold breakout deterrence, multi-layered missile defense, and regional asymmetric proxy networks.",
    tensionLevel: "CRITICAL",
    keyArena: "Ballistic Missiles & Air Superiority",
    imageKey: "red_sea",
  },
];

export default function GlobalRivalryMonitor() {
  return (
    <section id="rivalry-monitor" className="py-12 sm:py-14 border-b border-neutral-800/70 scroll-mt-20">
      {/* Section Header matching screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-[11px] font-mono font-semibold tracking-wider text-[#FF7A00] uppercase mb-1 flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-[#FF7A00]" />
            <span>ACTIVE INTELLIGENCE</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal tracking-tight">
            Global Rivalry Monitor
          </h2>
        </div>

        <Link
          to="/compare"
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-neutral-700 hover:border-[#FF7A00] text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900/60 transition-all self-start sm:self-auto"
        >
          <span>View All Rivalries</span>
          <ArrowRight className="size-3 text-[#FF7A00]" />
        </Link>
      </div>

      {/* Grid of Rivalry Dossier Cards with Real Imagery */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURED_RIVALRIES.map((pair) => {
          const visualAsset = GEOPOLITICAL_IMAGES[pair.imageKey] || GEOPOLITICAL_IMAGES.malacca;

          return (
            <Link
              key={`${pair.a}-${pair.b}`}
              to={`/compare?a=${pair.a}&b=${pair.b}`}
              className="group relative flex flex-col justify-between rounded-xl border border-neutral-800 bg-[#0d0d0d] hover:border-[#FF7A00]/70 hover:bg-[#121212] transition-all duration-300 overflow-hidden shadow-lg"
            >
              {/* Visual Reconnaissance Image Header */}
              <div className="relative h-36 w-full overflow-hidden">
                <img
                  src={visualAsset.imageUrl}
                  alt={visualAsset.title}
                  className="w-full h-full object-cover filter brightness-60 contrast-110 group-hover:scale-105 group-hover:brightness-75 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/40 to-transparent" />
                <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-300 bg-black/80 px-2 py-0.5 rounded border border-white/10 backdrop-blur-xs">
                    {pair.theatre}
                  </span>
                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded backdrop-blur-xs ${
                      pair.tensionLevel === "CRITICAL"
                        ? "text-red-400 bg-red-950/80 border border-red-500/40"
                        : "text-amber-400 bg-amber-950/80 border border-amber-500/40"
                    }`}
                  >
                    {pair.tensionLevel}
                  </span>
                </div>
                <div className="absolute bottom-1.5 left-3">
                  <span className="text-[10px] font-mono text-trinetra-saffron/90 uppercase tracking-wider">
                    THEATRE: {pair.keyArena}
                  </span>
                </div>
              </div>

              <div className="p-5 pt-3 flex-1 flex flex-col justify-between">
                <div>
                  {/* State Actors Bilateral */}
                  <div className="flex items-center justify-between py-2.5 border-y border-neutral-800/60 my-2">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-xl sm:text-2xl text-white font-medium group-hover:text-[#FF8811] transition-colors">
                        {pair.labelA}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">
                        {pair.a}
                      </span>
                    </div>

                    <span className="font-mono text-xs font-bold text-[#FF7A00] group-hover:scale-110 transition-transform">
                      VS
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">
                        {pair.b}
                      </span>
                      <span className="font-serif text-xl sm:text-2xl text-white font-medium group-hover:text-[#FF8811] transition-colors">
                        {pair.labelB}
                      </span>
                    </div>
                  </div>

                  {/* Summary Description */}
                  <p className="text-xs text-neutral-400 leading-relaxed mt-2.5 mb-4 font-light">
                    {pair.summary}
                  </p>
                </div>

                {/* Bottom Actions Row */}
                <div className="flex items-center justify-between pt-3 border-t border-neutral-800/60 text-xs">
                  <span className="font-mono text-[10px] text-neutral-500">
                    Bilateral Vector Telemetry
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[#FF8811] text-xs font-semibold group-hover:translate-x-1 transition-transform">
                    <span>Analyze Rivalry</span>
                    <ArrowRight className="size-3" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

