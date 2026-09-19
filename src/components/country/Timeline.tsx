interface TimelineEvent {
  year?: string | number;
  title?: string;
  what_happened?: string;
  description?: string;
  why_it_happened?: string;
  key_actors?: string[];
  consequences?: string;
  long_term_significance?: string;
  type?: string;
  confidence?: string;
}

interface TimelineProps {
  events?: TimelineEvent[];
}

export default function Timeline({ events = [] }: TimelineProps) {
  if (!events || events.length === 0) {
    return <div className="text-sm text-neutral-500 py-4">No historical records populated for this country yet.</div>;
  }

  return (
    <div className="relative pl-6 border-l border-trinetra-border/80 space-y-8 my-2">
      {events.map((ev, index) => {
        const text = ev.what_happened || ev.description || "";
        return (
          <div key={index} className="relative group">
            {/* Timeline node */}
            <div className="absolute -left-[31px] top-1 size-3 rounded-full bg-trinetra-saffron ring-4 ring-[#0a0a0a]" />

            <div className="flex flex-wrap items-baseline gap-2 mb-1">
              <span className="font-mono text-xs font-semibold text-trinetra-saffron bg-trinetra-saffron/10 px-2 py-0.5 rounded">
                {ev.year ?? "Date N/A"}
              </span>
              <h4 className="font-display text-lg text-neutral-100 font-medium">
                {ev.title || "Historical Milestone"}
              </h4>
              {ev.confidence && (
                <span className="font-mono text-[10px] uppercase text-neutral-500 border border-trinetra-border px-1.5 py-0.2 rounded">
                  {ev.confidence} confidence
                </span>
              )}
            </div>

            {text && <p className="text-sm text-neutral-300 leading-relaxed mb-2">{text}</p>}

            {ev.consequences && (
              <div className="text-xs text-neutral-400 mt-1 pl-3 border-l border-neutral-700">
                <span className="text-neutral-500 uppercase font-mono tracking-wider text-[10px] block">Consequences:</span>
                {ev.consequences}
              </div>
            )}

            {ev.long_term_significance && (
              <div className="text-xs text-neutral-400 mt-1 pl-3 border-l border-trinetra-saffron/40">
                <span className="text-trinetra-saffron uppercase font-mono tracking-wider text-[10px] block">Strategic Significance:</span>
                {ev.long_term_significance}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
