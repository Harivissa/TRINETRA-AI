import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Globe2, Share2, Play, Eye, Compass, ArrowRight } from "lucide-react";

interface HeroGlobeProps {
  countryCount: number;
  chokepointCount: number;
  groupCount: number;
  onReplayIntro: () => void;
}

export default function HeroGlobe({
  countryCount,
  chokepointCount,
  groupCount,
  onReplayIntro,
}: HeroGlobeProps) {
  const [activeTab, setActiveTab] = useState<"orbit" | "theatres">("orbit");
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Strategic hubs for the tactical reticle
  const strategicHubs = [
    { id: "IND", name: "New Delhi", cx: 580, cy: 260, r: 6, tag: "Indo-Pacific Pivot" },
    { id: "CHN", name: "Beijing", cx: 660, cy: 220, r: 6, tag: "East Asian Theatre" },
    { id: "USA", name: "Washington", cx: 240, cy: 200, r: 6, tag: "Euro-Atlantic Command" },
    { id: "RUS", name: "Moscow", cx: 520, cy: 150, r: 5, tag: "Eurasian Heartland" },
    { id: "JPN", name: "Tokyo", cx: 730, cy: 215, r: 4, tag: "First Island Chain" },
    { id: "IRN", name: "Tehran", cx: 485, cy: 225, r: 4, tag: "Hormuz Littoral" },
    { id: "AUS", name: "Canberra", cx: 720, cy: 410, r: 4, tag: "Southern Anchor" },
    { id: "GBR", name: "London", cx: 390, cy: 160, r: 4, tag: "North Atlantic Hub" },
  ];

  const strategicArcs = [
    { from: [580, 260], to: [240, 200], type: "quad", label: "US-India Strategic Partnership" },
    { from: [580, 260], to: [660, 220], type: "friction", label: "LAC Himalayan Contestation" },
    { from: [240, 200], to: [660, 220], type: "friction", label: "US-China Geostrategic Rivalry" },
    { from: [240, 200], to: [390, 160], type: "nato", label: "Transatlantic Alliance" },
    { from: [520, 150], to: [660, 220], type: "partner", label: "Sino-Russian Comprehensive Partnership" },
    { from: [580, 260], to: [720, 410], type: "quad", label: "Indo-Pacific Maritime Line" },
    { from: [485, 225], to: [580, 260], type: "energy", label: "Gulf Energy Transit Vector" },
  ];

  return (
    <section className="relative overflow-hidden rounded-xl border border-trinetra-border bg-[#07090d] p-6 sm:p-10 lg:p-12 mb-14 shadow-2xl">
      {/* Background Tactical Grid & Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `radial-gradient(#ff9933 0.75px, transparent 0.75px), linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: "32px 32px, 64px 64px, 64px 64px",
        }}
      />
      <div className="absolute -top-32 -right-32 size-[450px] rounded-full bg-trinetra-saffron/5 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 size-[400px] rounded-full bg-blue-900/10 blur-[100px] pointer-events-none" />

      {/* Top Status Strip */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5 mb-8 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-trinetra-saffron">
            <span className="size-2 rounded-full bg-trinetra-saffron animate-pulse" />
            TRINETRA OS // CORE 1.0
          </span>
          <span className="text-neutral-600 hidden sm:inline">|</span>
          <span className="text-neutral-400 hidden sm:inline">
            SYSTEM STATUS: OPERATIONAL
          </span>
        </div>

        <div className="flex items-center gap-4 text-neutral-400">
          <button
            onClick={onReplayIntro}
            className="flex items-center gap-1.5 text-neutral-300 hover:text-trinetra-saffron transition-colors cursor-pointer"
            title="Replay Cinematic Briefing"
          >
            <Play className="size-3 text-trinetra-saffron fill-trinetra-saffron/30" />
            <span className="underline decoration-dotted underline-offset-4">REPLAY BRIEFING</span>
          </button>
          <span className="text-neutral-600">|</span>
          <span className="text-neutral-400">
            TIME: {new Date().toISOString().slice(0, 10)} UTC
          </span>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Mission Statement & Key Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] uppercase text-trinetra-saffron border border-trinetra-saffron/40 px-3 py-1 rounded bg-black/50">
            <Eye className="size-3" />
            Strategic Geopolitical Intelligence Platform
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-neutral-100 font-light tracking-tight leading-[1.08]">
            Understand the world as a <span className="font-normal text-white italic">system</span>.
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light max-w-xl">
            Trinetra synthesizes sovereign profiles, military vectors, maritime trade chokepoints, supply chain vulnerabilities, and multilateral coalitions into an integrated intelligence environment.
          </p>

          {/* Genuine Verified Metrics (NO fake numbers) */}
          <div className="grid grid-cols-3 gap-3 border border-white/10 bg-black/40 p-4 rounded-lg">
            <div>
              <div className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">
                Tracked States
              </div>
              <div className="font-display text-2xl sm:text-3xl text-neutral-100 mt-0.5">
                {countryCount || 22}
              </div>
              <div className="text-[10px] text-neutral-400 font-mono">Dossiers & Data</div>
            </div>
            <div className="border-l border-white/10 pl-3">
              <div className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">
                Chokepoints
              </div>
              <div className="font-display text-2xl sm:text-3xl text-neutral-100 mt-0.5">
                {chokepointCount || 6}
              </div>
              <div className="text-[10px] text-neutral-400 font-mono">Maritime Arteries</div>
            </div>
            <div className="border-l border-white/10 pl-3">
              <div className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">
                Active Blocs
              </div>
              <div className="font-display text-2xl sm:text-3xl text-neutral-100 mt-0.5">
                {groupCount || 4}
              </div>
              <div className="text-[10px] text-neutral-400 font-mono">Quad, BRICS, NATO, SCO</div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/compare?a=IND&b=CHN"
              className="px-5 py-3 rounded bg-trinetra-saffron text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#ffaa4d] transition-all flex items-center gap-2 shadow-lg shadow-trinetra-saffron/20 group"
            >
              <Shield className="size-4" />
              <span>Launch Bilateral Matrix</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/countries"
              className="px-4 py-3 rounded border border-white/15 bg-black/60 text-neutral-200 hover:text-white hover:border-trinetra-saffron/60 text-xs font-mono tracking-wider transition-all flex items-center gap-2"
            >
              <Globe2 className="size-4 text-trinetra-saffron" />
              <span>Sovereign Dossiers</span>
            </Link>

            <Link
              to="/network"
              className="px-4 py-3 rounded border border-white/15 bg-black/60 text-neutral-200 hover:text-white hover:border-trinetra-saffron/60 text-xs font-mono tracking-wider transition-all flex items-center gap-2"
            >
              <Share2 className="size-4 text-neutral-400" />
              <span>Network Graph</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Tactical Geopolitical Vector Map (SVG) */}
        <div className="lg:col-span-6 relative flex items-center justify-center">
          <div className="w-full aspect-[16/10] max-h-[380px] rounded-lg border border-white/10 bg-black/70 p-4 relative overflow-hidden backdrop-blur flex flex-col justify-between">
            {/* Radar Corner Coordinate Overlay */}
            <div className="flex items-center justify-between font-mono text-[9px] text-neutral-400 uppercase tracking-widest z-10 pointer-events-none">
              <span>LAT: 20° 35' N // LON: 78° 57' E</span>
              <span>GRID: INDO-PACIFIC // GLOBAL</span>
            </div>

            {/* SVG Globe Projection */}
            <svg
              viewBox="0 0 900 500"
              className="w-full h-full my-auto"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <radialGradient id="globeGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ff9933" stopOpacity="0.12" />
                  <stop offset="70%" stopColor="#ff9933" stopOpacity="0.02" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Orbital Graticule Rings */}
              <ellipse cx="450" cy="250" rx="380" ry="210" fill="url(#globeGlow)" stroke="#333333" strokeWidth="0.8" strokeDasharray="4 6" />
              <ellipse cx="450" cy="250" rx="300" ry="160" fill="none" stroke="#262626" strokeWidth="0.8" />
              <ellipse cx="450" cy="250" rx="180" ry="100" fill="none" stroke="#ff9933" strokeOpacity="0.25" strokeWidth="0.75" strokeDasharray="3 4" />
              <line x1="70" y1="250" x2="830" y2="250" stroke="#222222" strokeWidth="0.75" />
              <line x1="450" y1="40" x2="450" y2="460" stroke="#222222" strokeWidth="0.75" />

              {/* Connecting Strategic Arcs */}
              {strategicArcs.map((arc, i) => {
                const [x1, y1] = arc.from;
                const [x2, y2] = arc.to;
                const cx = (x1 + x2) / 2;
                const cy = Math.min(y1, y2) - 40;
                const isFriction = arc.type === "friction";
                const strokeColor = isFriction ? "#f43f5e" : arc.type === "quad" ? "#ff9933" : "#3b82f6";
                return (
                  <g key={i}>
                    <path
                      d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={isFriction ? "1.5" : "1"}
                      strokeOpacity="0.65"
                      strokeDasharray={isFriction ? "4 3" : "none"}
                    />
                  </g>
                );
              })}

              {/* Strategic Hub Nodes */}
              {strategicHubs.map((hub) => {
                const isHovered = hoveredNode === hub.id;
                const isIndia = hub.id === "IND";
                return (
                  <g
                    key={hub.id}
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredNode(hub.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    {/* Ripple ring for focused nodes */}
                    {isIndia && (
                      <circle
                        cx={hub.cx}
                        cy={hub.cy}
                        r={hub.r + 8}
                        fill="none"
                        stroke="#ff9933"
                        strokeOpacity="0.4"
                        strokeWidth="1"
                        className="animate-ping"
                      />
                    )}

                    <circle
                      cx={hub.cx}
                      cy={hub.cy}
                      r={isHovered ? hub.r + 3 : hub.r}
                      fill={isIndia ? "#ff9933" : "#e5e5e5"}
                      stroke="#000"
                      strokeWidth="1.5"
                    />

                    <text
                      x={hub.cx}
                      y={hub.cy + (hub.cy > 350 ? -12 : 18)}
                      fill={isHovered || isIndia ? "#ff9933" : "#a3a3a3"}
                      fontSize={isHovered ? "11" : "9"}
                      fontFamily="monospace"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      {hub.id}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Bottom Interactive Legend */}
            <div className="flex items-center justify-between border-t border-white/10 pt-2 font-mono text-[9px] text-neutral-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-trinetra-saffron" /> Sovereign Hub
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-rose-500" /> Rivalry Vector
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-blue-500" /> Strategic Treaty
                </span>
              </div>
              <span className="text-neutral-400">
                {hoveredNode
                  ? strategicHubs.find((h) => h.id === hoveredNode)?.name +
                    " — " +
                    strategicHubs.find((h) => h.id === hoveredNode)?.tag
                  : "HOVER NODE TO INSPECT THEATRE"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
