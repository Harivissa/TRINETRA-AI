import { useEffect, useState } from "react";
import { Shield, ArrowRight, Activity, Globe, Eye } from "lucide-react";

interface EntryExperienceProps {
  onComplete: () => void;
}

export default function EntryExperience({ onComplete }: EntryExperienceProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Check if user previously entered this session
    if (sessionStorage.getItem("trinetra_entered") === "true") {
      onComplete();
    }
  }, [onComplete]);

  const handleEnter = () => {
    try {
      sessionStorage.setItem("trinetra_entered", "true");
    } catch {
      // ignore storage error
    }
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070707] text-neutral-200 overflow-hidden px-6">
      {/* Background Grid Accent */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#ff9933 1px, transparent 1px), radial-gradient(#262626 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0, 20px 20px",
        }}
      />

      {/* Atmospheric Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-gradient-to-tr from-trinetra-saffron/10 via-trinetra-saffron/5 to-transparent blur-3xl pointer-events-none" />

      {/* Main Terminal Overlay */}
      <div className="relative z-10 max-w-2xl w-full border border-trinetra-border bg-[#0f0f0f]/90 p-8 md:p-12 rounded-lg shadow-2xl backdrop-blur text-center">
        <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-trinetra-saffron border border-trinetra-saffron/30 px-3 py-1 rounded bg-trinetra-saffron/10 mb-6 uppercase">
          <Eye className="size-3 animate-pulse" />
          Strategic Terminal Initialization
        </div>

        <h1 className="font-display text-4xl sm:text-5xl text-neutral-100 mb-3 tracking-wide">
          TRINETRA AI
        </h1>
        <p className="font-display italic text-lg sm:text-xl text-trinetra-saffron mb-6">
          "Strategic Intelligence Beyond the Battlefield"
        </p>

        <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto mb-8 leading-relaxed">
          Comprehensive multi-domain intelligence synthesis: economic resilience, military strength, chokepoints, supply chain vulnerabilities, and geopolitical alliance dynamics.
        </p>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10 text-left">
          <div className="p-3 border border-trinetra-border/80 bg-black/40 rounded">
            <Globe className="size-4 text-trinetra-saffron mb-2" />
            <div className="text-xs font-semibold text-neutral-200">22+ State Profiles</div>
            <div className="text-[11px] text-neutral-500">Economy, Energy, Defence</div>
          </div>
          <div className="p-3 border border-trinetra-border/80 bg-black/40 rounded">
            <Shield className="size-4 text-trinetra-saffron mb-2" />
            <div className="text-xs font-semibold text-neutral-200">Bilateral Engine</div>
            <div className="text-[11px] text-neutral-500">Cross-domain rivalry metrics</div>
          </div>
          <div className="p-3 border border-trinetra-border/80 bg-black/40 rounded">
            <Activity className="size-4 text-trinetra-saffron mb-2" />
            <div className="text-xs font-semibold text-neutral-200">Zero-Mock Principle</div>
            <div className="text-[11px] text-neutral-500">Strictly verified evidence</div>
          </div>
        </div>

        {/* Launch Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleEnter}
            className="w-full sm:w-auto px-8 py-3.5 rounded bg-trinetra-saffron text-black font-semibold text-sm hover:bg-[#ffaa4d] transition-all flex items-center justify-center gap-2 group shadow-lg shadow-trinetra-saffron/20 cursor-pointer"
          >
            <span>Enter Intelligence Platform</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="mt-8 font-mono text-[10px] text-neutral-600 tracking-wider uppercase">
          Autonomous Strategic Intelligence Architecture • Version 1.0
        </div>
      </div>
    </div>
  );
}
