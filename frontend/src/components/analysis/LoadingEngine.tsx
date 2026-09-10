import { useEffect, useState } from "react";

const LOG_LINES = [
  "INITIALIZING TRINETRA INTELLIGENCE ENGINE...",
  "AUTHENTICATING SESSION...",
  "LOADING COUNTRY PROFILE — SOURCE A...",
  "LOADING COUNTRY PROFILE — SOURCE B...",
  "CROSS-REFERENCING RELATIONSHIP GRAPH...",
  "SCANNING EXTERNAL ACTOR NETWORK...",
  "VERIFYING SOURCE-BACKED METRICS...",
  "CROSS-CHECKING ECONOMIC AND MILITARY DATA...",
  "REVIEWING ENERGY, TRADE AND INFRASTRUCTURE DEPENDENCIES...",
  "MAPPING STRATEGIC CHOKEPOINTS...",
  "TRACING CONSEQUENCE CHAIN...",
  "COMPILING STRATEGIC RESILIENCE PROFILE...",
  "FINALIZING INTELLIGENCE BRIEFING...",
];

interface Props {
  countryA: string;
  countryB: string;
  durationMs?: number;
  onComplete: () => void;
}

export default function LoadingEngine({ countryA, countryB, durationMs = 5000, onComplete }: Props) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepDelay = durationMs / LOG_LINES.length;
    const lineTimers = LOG_LINES.map((_, i) => setTimeout(() => setVisibleLines(i + 1), i * stepDelay));
    const progressStart = Date.now();
    const progressTimer = setInterval(() => {
      const pct = Math.min(100, ((Date.now() - progressStart) / durationMs) * 100);
      setProgress(pct);
    }, 40);
    const doneTimer = setTimeout(() => {
      setProgress(100);
      onComplete();
    }, durationMs);
    return () => {
      lineTimers.forEach(clearTimeout);
      clearInterval(progressTimer);
      clearTimeout(doneTimer);
    };
  }, [durationMs, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-trinetra-bg" role="status" aria-live="polite">
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: "repeating-linear-gradient(0deg, #ff9933 0px, transparent 1px, transparent 3px)" }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 40%, rgba(255,153,51,0.10), transparent 60%)" }} />
      <div className="comparison-loader-orbit comparison-loader-orbit--one" />
      <div className="comparison-loader-orbit comparison-loader-orbit--two" />

      <div className="relative w-full max-w-2xl px-6">
        <div className="mb-9 text-center">
          <div className="mb-3 text-xs tracking-[0.3em] text-trinetra-saffron">TRINETRA AI · CLASSIFIED PROCESSING</div>
          <div className="font-display text-4xl text-white md:text-5xl">{countryA} <span className="text-trinetra-saffron">vs</span> {countryB}</div>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.22em] text-neutral-500">Ladies and Gentlemen — you're not ready for this.</p>
        </div>

        <div className="mb-7 h-1 overflow-hidden rounded-full bg-trinetra-border">
          <div className="h-full bg-trinetra-saffron transition-[width] duration-75 ease-linear" style={{ width: `${progress}%`, boxShadow: "0 0 16px #ff9933" }} />
        </div>

        <div className="h-56 overflow-hidden font-mono text-xs space-y-1.5">
          {LOG_LINES.slice(0, visibleLines).map((line, i) => (
            <div key={line} className={i === visibleLines - 1 ? "text-trinetra-saffron" : "text-neutral-600"}>
              <span className="text-neutral-700">[{String(i + 1).padStart(2, "0")}]</span> {line}
              {i === visibleLines - 1 && <span className="animate-pulse">▊</span>}
            </div>
          ))}
        </div>
        <div className="mt-7 text-center font-mono text-[10px] tracking-[0.18em] text-neutral-600">{Math.round(progress)}% · ANALYSIS REQUEST IN FLIGHT</div>
      </div>
    </div>
  );
}
