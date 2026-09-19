import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Flame, Globe2, AlertTriangle, ArrowRight, ExternalLink, Shield, MapPin, Eye } from "lucide-react";
import { MAP_ACTIVE_EVENTS, type MapEvent, resolveMapEntityImage } from "../../data/liveMapData";

interface Props {
  selectedEventId: string | null;
  onSelectEvent: (event: MapEvent) => void;
  onOpenAnalysis?: (event: MapEvent) => void;
}

export default function GlobalSituationPanel({
  selectedEventId,
  onSelectEvent,
}: Props) {
  const [activeTab, setActiveTab] = useState<"events" | "regions" | "alerts">("events");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = useMemo(() => {
    let list = MAP_ACTIVE_EVENTS;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (ev) =>
          ev.title.toLowerCase().includes(q) ||
          ev.region.toLowerCase().includes(q) ||
          ev.summary.toLowerCase().includes(q) ||
          ev.actors.some((a) => a.toLowerCase().includes(q))
      );
    }
    return list;
  }, [searchQuery]);

  // Group events by region for the "Key Regions" tab
  const regionsSummary = useMemo(() => {
    const map: Record<string, { count: number; critical: number; events: MapEvent[] }> = {};
    MAP_ACTIVE_EVENTS.forEach((ev) => {
      if (!map[ev.region]) {
        map[ev.region] = { count: 0, critical: 0, events: [] };
      }
      map[ev.region].count++;
      if (ev.severity === "CRITICAL") map[ev.region].critical++;
      map[ev.region].events.push(ev);
    });
    return Object.entries(map).map(([name, data]) => ({ name, ...data }));
  }, []);

  const criticalCount = useMemo(
    () => MAP_ACTIVE_EVENTS.filter((e) => e.severity === "CRITICAL").length,
    []
  );

  return (
    <aside
      id="global-situation-panel"
      className="w-full lg:w-[380px] xl:w-[420px] bg-[#07090d] border border-white/10 rounded-xl flex flex-col overflow-hidden shadow-2xl shrink-0"
    >
      {/* Panel Header (Matching Reference Image) */}
      <div className="p-4 sm:p-5 border-b border-white/10 bg-[#090b10]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-white uppercase font-mono flex items-center gap-2">
              <span className="size-2 rounded-full bg-red-500 animate-pulse" />
              GLOBAL SITUATION
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Live Intelligence Overview
            </p>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30">
            {criticalCount} CRITICAL
          </span>
        </div>

        {/* Tab Controls (Matching Reference Image) */}
        <div className="flex items-center gap-1.5 mt-4 p-1 rounded-lg bg-black/60 border border-white/5">
          <button
            type="button"
            id="tab-active-events"
            onClick={() => setActiveTab("events")}
            className={`flex-1 py-1.5 px-3 rounded text-xs font-medium transition-all text-center ${
              activeTab === "events"
                ? "bg-[#FF7A00] text-black font-semibold shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Active Events
          </button>
          <button
            type="button"
            id="tab-key-regions"
            onClick={() => setActiveTab("regions")}
            className={`flex-1 py-1.5 px-3 rounded text-xs font-medium transition-all text-center ${
              activeTab === "regions"
                ? "bg-[#FF7A00] text-black font-semibold shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Key Regions
          </button>
          <button
            type="button"
            id="tab-alerts"
            onClick={() => setActiveTab("alerts")}
            className={`flex-1 py-1.5 px-3 rounded text-xs font-medium transition-all text-center ${
              activeTab === "alerts"
                ? "bg-[#FF7A00] text-black font-semibold shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Alerts
          </button>
        </div>

        {/* Filter / Search Bar */}
        <div className="relative mt-3">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-neutral-500" />
          <input
            type="text"
            placeholder="Filter active flashpoints, actors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md bg-black/50 border border-white/10 pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#FF7A00]/70"
          />
        </div>
      </div>

      {/* Panel Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 max-h-[580px] divide-y divide-white/5">
        {activeTab === "events" && (
          <>
            {filteredEvents.map((event) => {
              const img = resolveMapEntityImage(event.imageKey);
              const isSelected = selectedEventId === event.id;

              return (
                <div
                  key={event.id}
                  id={`event-card-${event.id}`}
                  onClick={() => onSelectEvent(event)}
                  className={`pt-2.5 first:pt-0 cursor-pointer group transition-all rounded-lg p-2.5 ${
                    isSelected
                      ? "bg-white/10 border border-[#FF7A00]/60 ring-1 ring-[#FF7A00]/40"
                      : "hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Thumbnail photo (Authentic reconnaissance image) */}
                    <div className="relative size-14 sm:size-16 rounded-md overflow-hidden shrink-0 border border-white/10 bg-black">
                      <img
                        src={img.url}
                        alt={event.title}
                        className="size-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-1 right-1">
                        <span
                          className={`size-2 rounded-full inline-block ${
                            event.severity === "CRITICAL"
                              ? "bg-red-500 shadow-sm shadow-red-500"
                              : "bg-amber-400 shadow-sm shadow-amber-400"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <div className="flex items-center gap-1.5 truncate">
                          <span
                            className={`size-1.5 rounded-full shrink-0 ${
                              event.severity === "CRITICAL" ? "bg-red-500" : "bg-amber-400"
                            }`}
                          />
                          <h3 className="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-[#FF7A00] transition-colors">
                            {event.title}
                          </h3>
                        </div>
                        <span
                          className={`px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded shrink-0 ${
                            event.severity === "CRITICAL"
                              ? "bg-red-950/80 text-red-400 border border-red-600/40"
                              : "bg-amber-950/80 text-amber-400 border border-amber-600/40"
                          }`}
                        >
                          {event.severity}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-neutral-400 mb-1">
                        <span className="truncate">{event.region}</span>
                        <span className="text-neutral-600">·</span>
                        <span className="text-neutral-500 font-mono text-[10px]">{event.timeAgo}</span>
                      </div>

                      <p className="text-[11px] text-neutral-300 line-clamp-2 leading-relaxed">
                        {event.summary}
                      </p>

                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/5">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-neutral-500 font-mono">Actors:</span>
                          <span className="text-[10px] text-neutral-300 truncate max-w-[150px]">
                            {event.actors.slice(0, 2).join(", ")}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#FF7A00] font-mono flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          Inspect <Eye className="size-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {activeTab === "regions" && (
          <div className="space-y-3 pt-1">
            {regionsSummary.map((reg) => (
              <div
                key={reg.name}
                className="p-3 rounded-lg border border-white/10 bg-black/40 hover:border-white/20 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-white font-mono uppercase">{reg.name}</span>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono">
                    <span className="text-neutral-400">{reg.count} Events</span>
                    {reg.critical > 0 && (
                      <span className="px-1.5 py-0.2 rounded bg-red-950 text-red-400 border border-red-800/40">
                        {reg.critical} Critical
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-1 mt-2">
                  {reg.events.map((ev) => (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={() => onSelectEvent(ev)}
                      className="w-full text-left flex items-center justify-between py-1 px-2 rounded hover:bg-white/5 text-[11px] text-neutral-300 group"
                    >
                      <span className="truncate group-hover:text-[#FF7A00]">{ev.title}</span>
                      <ArrowRight className="size-3 text-neutral-500 group-hover:text-white shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "alerts" && (
          <div className="space-y-2.5 pt-1">
            <div className="p-3 rounded-lg border border-red-500/30 bg-red-950/20">
              <div className="flex items-center gap-2 text-red-400 font-mono text-xs font-bold mb-1">
                <AlertTriangle className="size-3.5 shrink-0" />
                MARITIME CHOKEPOINT ALERT: BAB EL-MANDEB
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                Asymmetric anti-ship missile interdictions continue along the southern Red Sea corridor. Over 60% of East-West container tonnage diverted around the Cape of Good Hope.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-950/20">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold mb-1">
                <Shield className="size-3.5 shrink-0" />
                TAIWAN STRAIT SURVEILLANCE
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                Persistent PLA naval task group deployments across the median line. Carrier strike group freedom of navigation monitoring active along the First Island Chain.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-sky-500/30 bg-sky-950/20">
              <div className="flex items-center gap-2 text-sky-400 font-mono text-xs font-bold mb-1">
                <Globe2 className="size-3.5 shrink-0" />
                NATO EASTERN FLANK DETERRENCE
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                Enhanced forward air policing and multinational battle groups on 24-hour high alert across Poland, the Baltics, and Black Sea airspace.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Panel Footer (Matching Reference Image "View All Events ->") */}
      <div className="p-3 border-t border-white/10 bg-[#090b10] flex items-center justify-between">
        <span className="text-[11px] text-neutral-400 font-mono">
          {MAP_ACTIVE_EVENTS.length} Monitored Theatres
        </span>
        <Link
          to="/compare"
          id="btn-view-all-events"
          className="text-xs font-medium text-[#FF7A00] hover:text-[#ff9933] flex items-center gap-1.5 transition-colors group"
        >
          <span>View All Events</span>
          <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </aside>
  );
}
