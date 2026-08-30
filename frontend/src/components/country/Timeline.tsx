import { useState } from "react";

interface TimelineEvent {
  year: number;
  title: string;
  what_happened: string;
  why_it_happened: string;
  key_actors: string[];
  consequences: string;
  long_term_significance: string;
  type: string;
  confidence: string;
}

export default function Timeline({ events }: { events: TimelineEvent[] }) {
  const [openYear, setOpenYear] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {events.map((e) => {
        const open = openYear === e.year;
        return (
          <div key={e.year} className="border border-trinetra-border rounded overflow-hidden">
            <button
              onClick={() => setOpenYear(open ? null : e.year)}
              className="w-full flex items-center gap-4 p-4 text-left hover:bg-black/20 transition-colors"
            >
              <span className="font-display text-2xl text-trinetra-saffron w-16 shrink-0">{e.year}</span>
              <span className="text-neutral-200 font-semibold flex-1">{e.title}</span>
              <span className="text-xs text-neutral-500 uppercase">{open ? "−" : "+"}</span>
            </button>
            {open && (
              <div className="px-4 pb-5 pt-1 space-y-3 text-sm bg-black/10">
                <div>
                  <div className="text-trinetra-saffron text-xs uppercase tracking-wide mb-1">What happened</div>
                  <p className="text-neutral-300">{e.what_happened}</p>
                </div>
                <div>
                  <div className="text-trinetra-saffron text-xs uppercase tracking-wide mb-1">Why it happened</div>
                  <p className="text-neutral-300">{e.why_it_happened}</p>
                </div>
                <div>
                  <div className="text-trinetra-saffron text-xs uppercase tracking-wide mb-1">Key actors</div>
                  <p className="text-neutral-300">{e.key_actors.join(", ")}</p>
                </div>
                <div>
                  <div className="text-trinetra-saffron text-xs uppercase tracking-wide mb-1">Consequences</div>
                  <p className="text-neutral-300">{e.consequences}</p>
                </div>
                <div>
                  <div className="text-trinetra-saffron text-xs uppercase tracking-wide mb-1">Long-term significance</div>
                  <p className="text-neutral-300">{e.long_term_significance}</p>
                </div>
                <div className="text-xs text-neutral-600">{e.type} · confidence: {e.confidence}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
