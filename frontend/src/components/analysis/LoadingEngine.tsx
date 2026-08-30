import { useEffect, useState } from "react";

const LOG_LINES = [
  "INITIALIZING TRINETRA INTELLIGENCE ENGINE...",
  "AUTHENTICATING SESSION...",
  "LOADING COUNTRY PROFILE — SOURCE A...",
  "LOADING COUNTRY PROFILE — SOURCE B...",
  "CROSS-REFERENCING RELATIONSHIP GRAPH...",
  "SCANNING EXTERNAL ACTOR NETWORK...",
  "COMPUTING MILITARY COMPOSITE SCORE...",
  "COMPUTING ECONOMIC RESILIENCE INDEX...",
  "COMPUTING ENERGY VULNERABILITY MATRIX...",
  "MAPPING STRATEGIC CHOKEPOINTS...",
  "TRACING CONSEQUENCE CHAIN...",
  "RUNNING SCENARIO PROBABILITY MODEL...",
  "COMPILING STRATEGIC RESILIENCE PROFILE...",
  "FINALIZING INTELLIGENCE BRIEFING...",
];

interface Props {
  countryA: string;
  countryB: string;
  durationMs?: number;
  onComplete: () => void;
}

export default function LoadingEngine({ countryA, countryB, durationMs = 9000, onComplete }: Props) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepDelay = durationMs / LOG_LINES.length;
    const lineTimers = LOG_LINES.map((_, i) =>
      setTimeout(() => setVisibleLines(i + 1), i * stepDelay)
    );

    const progressStart = Date.now();
    const progressTimer = setInterval(() => {
      const pct = Math.min(100, ((Date.now() - progressStart) / durationMs) * 100);
      setProgress(pct);
    }, 60);

    const doneTimer = setTimeout(onComplete, durationMs + 400);

    return () => {
      lineTimers.forEach(clearTimeout);
      clearInterval(progressTimer);
      clearTimeout(doneTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-trinetra-bg flex flex-col items-center justify-center overflow-hidden">
      {/* scanline texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, #ff9933 0px, transparent 1px, transparent 3px)",
        }}
      />
      {/* radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(circle at 50% 40%, rgba(255,153,51,0.08), transparent 60%)",
      }} />

      <div className="relative w-full max-w-xl px-6">
        <div className="text-center mb-10">
          <div className="text-xs tracking-[0.3em] text-trinetra-saffron mb-3">TRINETRA AI · CLASSIFIED PROCESSING</div>
          <div className="font-display text-4xl text-white">
            {countryA} <span className="text-trinetra-saffron">vs</span> {countryB}
          </div>
        </div>

        <div className="h-1 bg-trinetra-border rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-trinetra-saffron transition-all duration-100 ease-linear"
            style={{ width: `${progress}%`, boxShadow: "0 0 12px #ff9933" }}
          />
        </div>

        <div className="font-mono text-xs space-y-1.5 h-64 overflow-hidden">
          {LOG_LINES.slice(0, visibleLines).map((line, i) => (
            <div
              key={i}
              className={i === visibleLines - 1 ? "text-trinetra-saffron" : "text-neutral-600"}
            >
              <span className="text-neutral-700">[{String(i + 1).padStart(2, "0")}]</span> {line}
              {i === visibleLines - 1 && <span className="animate-pulse">▊</span>}
            </div>
          ))}
        </div>

        <div className="text-center text-xs text-neutral-700 mt-8 tracking-wide">
          {Math.round(progress)}% COMPLETE
        </div>
      </div>
    </div>
  );
}
