import { Link } from "react-router-dom";
import { ArrowRight, Globe2, Shield, Play } from "lucide-react";

interface EditorialHeroProps {
  countryCount: number;
  chokepointCount: number;
  groupCount: number;
  onReplayIntro?: () => void;
}

export default function EditorialHero({
  countryCount,
  chokepointCount,
  groupCount,
  onReplayIntro,
}: EditorialHeroProps) {
  const verifiedNations = countryCount || 22;
  const verifiedChokepoints = chokepointCount || 6;
  const verifiedGroups = groupCount || 5;

  return (
    <section className="relative w-full pt-8 pb-12 sm:pt-14 sm:pb-16 text-center overflow-hidden">
      {/* Background Subtle Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[650px] rounded-full bg-[#FF7A00]/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Top Eyebrow Badge matching screenshot */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-neutral-800 bg-[#111111]/80 text-neutral-300 font-mono text-[11px] tracking-wider uppercase mb-6 sm:mb-8 shadow-sm">
          <span className="size-1.5 rounded-full bg-[#FF7A00]" />
          <span>PUBLIC INTELLIGENCE PLATFORM · ACADEMIC &amp; RESEARCH USE</span>
        </div>

        {/* Monumental Headline: "The Third Eye of Global Intelligence" */}
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white leading-[1.08] mb-6">
          The <span className="text-[#FF8811] font-serif italic">Third Eye</span> of
          <br />
          Global Intelligence
        </h1>

        {/* Editorial Subtitle matching screenshot */}
        <p className="max-w-2xl mx-auto text-neutral-400 font-sans text-sm sm:text-base leading-relaxed mb-8 sm:mb-10 font-light">
          Real-time conflict monitoring, decision intelligence, alliance mapping, and geopolitical analysis — {verifiedNations} sovereign nations, 9,115 historical records, and 24 active global flashpoints.
        </p>

        {/* 3 Call-To-Action Buttons matching screenshot */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16">
          {/* 1. Live Conflict Map */}
          <a
            href="#live-map"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#FF7A00]/30 bg-neutral-950/80 text-neutral-100 hover:border-[#FF7A00] hover:bg-[#FF7A00]/10 text-xs sm:text-sm font-medium transition-all shadow-sm"
          >
            <span>🌏</span>
            <span>Live Conflict Map</span>
          </a>

          {/* 2. Run Analysis */}
          <Link
            to="/compare?a=IND&b=CHN"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FF7A00] hover:bg-[#FF8811] text-black text-xs sm:text-sm font-bold transition-all shadow-md shadow-orange-500/20 active:scale-95"
          >
            <span>▶</span>
            <span>Run Analysis</span>
          </Link>

          {/* 3. View Rivalries */}
          <a
            href="#rivalry-monitor"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-neutral-700/80 bg-neutral-900/60 text-neutral-300 hover:text-white hover:border-neutral-500 text-xs sm:text-sm font-medium transition-all"
          >
            <span>View Rivalries</span>
            <ArrowRight className="size-3.5" />
          </a>
        </div>

        {/* Numerical Stats Row matching screenshot */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-6 pt-6 pb-6 border-t border-neutral-800/60 max-w-3xl mx-auto">
          <div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-[#FF8811]">24</div>
            <div className="text-[11px] sm:text-xs text-neutral-500 mt-0.5">Active Conflicts</div>
          </div>
          <div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-[#FF8811]">6</div>
            <div className="text-[11px] sm:text-xs text-neutral-500 mt-0.5">Critical Chokepoints</div>
          </div>
          <div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-[#FF8811]">{verifiedNations}</div>
            <div className="text-[11px] sm:text-xs text-neutral-500 mt-0.5">Nations Covered</div>
          </div>
          <div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-[#FF8811]">9,115</div>
            <div className="text-[11px] sm:text-xs text-neutral-500 mt-0.5">HCED Battles</div>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <div className="font-serif text-2xl sm:text-3xl font-bold text-[#FF8811]">19</div>
            <div className="text-[11px] sm:text-xs text-neutral-500 mt-0.5">Strategic Sections</div>
          </div>
        </div>
      </div>

      {/* Live Intelligence Platform Info Bar matching screenshot */}
      <div className="w-full border-y border-neutral-800/80 bg-[#090909] py-2.5 px-4 mt-6">
        <div className="max-w-[1540px] mx-auto flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-neutral-400">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="text-neutral-500 tracking-wider">LIVE INTELLIGENCE PLATFORM</span>
            <span><strong className="text-[#FF8811] font-semibold">{verifiedNations}</strong> Nations Covered</span>
            <span><strong className="text-[#FF8811] font-semibold">19</strong> Active Rivalries</span>
            <span><strong className="text-[#FF8811] font-semibold">{verifiedGroups}</strong> Strategic Blocs</span>
          </div>

          <div className="flex items-center gap-4 text-neutral-500">
            <span>Data: SIPRI 2024 · IISS 2025 · IMF 2025</span>
            <span className="hidden md:inline">Last Updated: March 2025</span>
          </div>
        </div>
      </div>
    </section>
  );
}
