import { useEffect, useState } from "react";
import { getCountryFlag } from "../../utils/flags";

const PROGRESSIVE_STAGES = [
  "Loading country profiles",
  "Validating available datasets",
  "Normalizing country information",
  "Checking data completeness",
  "Comparing political systems",
  "Comparing economic indicators",
  "Comparing defence and security",
  "Comparing diplomatic relations",
  "Comparing geopolitical position",
  "Comparing strategic history",
  "Building comparative intelligence brief",
  "Finalizing analysis",
];

interface Props {
  countryA: string;
  countryB: string;
  nameA?: string;
  nameB?: string;
  durationMs?: number;
  onComplete: () => void;
}

export default function LoadingEngine({ countryA, countryB, nameA, nameB, durationMs = 4500, onComplete }: Props) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepDelay = durationMs / PROGRESSIVE_STAGES.length;
    const lineTimers = PROGRESSIVE_STAGES.map((_, i) => setTimeout(() => setVisibleLines(i), i * stepDelay));
    const progressStart = Date.now();
    const progressTimer = setInterval(() => {
      const pct = Math.min(100, ((Date.now() - progressStart) / durationMs) * 100);
      setProgress(pct);
    }, 40);
    const doneTimer = setTimeout(() => {
      setVisibleLines(PROGRESSIVE_STAGES.length);
      setProgress(100);
      onComplete();
    }, durationMs);
    return () => {
      lineTimers.forEach(clearTimeout);
      clearInterval(progressTimer);
      clearTimeout(doneTimer);
    };
  }, [durationMs, onComplete]);

  const flagA = getCountryFlag(countryA);
  const flagB = getCountryFlag(countryB);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-trinetra-bg" role="status" aria-live="polite">
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: "repeating-linear-gradient(0deg, #ff9933 0px, transparent 1px, transparent 3px)" }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 40%, rgba(255,153,51,0.10), transparent 60%)" }} />
      <div className="comparison-loader-orbit comparison-loader-orbit--one" />
      <div className="comparison-loader-orbit comparison-loader-orbit--two" />

      <div className="relative w-full max-w-2xl px-6">
        <div className="mb-9 text-center">
          <div className="mb-3 text-xs tracking-[0.3em] text-trinetra-saffron uppercase">
            INITIALIZING COMPARISON ENGINE
          </div>
          <p className="font-mono text-xs text-neutral-400 mb-2">Preparing:</p>
          <div className="font-display text-4xl text-white md:text-5xl flex items-center justify-center gap-3">
            <span>{flagA} {nameA || countryA}</span>
            <span className="text-trinetra-saffron font-serif italic text-3xl">vs</span>
            <span>{flagB} {nameB || countryB}</span>
          </div>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.22em] text-neutral-500">
            {countryA} · {countryB} · Multi-domain intelligence evaluation
          </p>
        </div>

        <div className="mb-7 h-1 overflow-hidden rounded-full bg-trinetra-border">
          <div className="h-full bg-trinetra-saffron transition-[width] duration-75 ease-linear" style={{ width: `${progress}%`, boxShadow: "0 0 16px #ff9933" }} />
        </div>

        <div className="h-72 overflow-hidden font-mono text-xs space-y-1.5">
          {PROGRESSIVE_STAGES.map((stage, i) => {
            const isCompleted = i < visibleLines;
            const isCurrent = i === visibleLines;
            return (
              <div
                key={stage}
                className={`flex items-center gap-2.5 transition-colors duration-200 ${
                  isCompleted
                    ? "text-neutral-300"
                    : isCurrent
                    ? "text-trinetra-saffron"
                    : "text-neutral-600"
                }`}
              >
                <span className="w-4 text-center">
                  {isCompleted ? (
                    <span className="text-emerald-400 font-bold">✓</span>
                  ) : isCurrent ? (
                    <span className="inline-block animate-spin text-trinetra-saffron">⟳</span>
                  ) : (
                    <span className="text-neutral-700">○</span>
                  )}
                </span>
                <span className={isCurrent ? "font-semibold text-white" : ""}>
                  {stage}
                </span>
                {isCurrent && <span className="animate-pulse text-trinetra-saffron">▊</span>}
              </div>
            );
          })}
        </div>
        <div className="mt-7 text-center font-mono text-[10px] tracking-[0.18em] text-neutral-600">{Math.round(progress)}% · ANALYSIS REQUEST IN FLIGHT</div>
      </div>
    </div>
  );
}
