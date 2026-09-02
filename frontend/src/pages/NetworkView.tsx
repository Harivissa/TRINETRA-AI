import { useCallback, useEffect, useState } from "react";
import Header from "../components/dashboard/Header";
import Footer from "../components/dashboard/Footer";
import GlobalMap from "../components/network/GlobalMap";
import WorldMap from "../components/network/WorldMap";
import { api } from "../services/api";

interface NetworkData { nodes: { id: string; label: string }[]; edges: { source: string; target: string; type: string }[]; }

export default function NetworkView() {
  const [data, setData] = useState<NetworkData | null>(null); const [error, setError] = useState(false); const [view, setView] = useState<"map" | "network">("map"); const [selected, setSelected] = useState<string | null>(null);
  const load = useCallback(() => { setError(false); api.getNetwork().then(setData).catch(() => setError(true)); }, []);
  useEffect(() => { load(); }, [load]);
  return <div className="min-h-screen bg-trinetra-bg text-neutral-200"><Header /><main className="mx-auto max-w-[1800px] px-5 py-8 lg:px-8 lg:py-10"><div className="border-b workspace-rule pb-7"><p className="section-kicker mb-3">Network / Relationships</p><h1 className="font-display text-4xl text-white md:text-5xl">Relationship intelligence</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-400">Explore where strategic relationships sit in the world, then switch to the analytical network to understand why they matter.</p></div>
    <section className="mt-8" aria-labelledby="network-title"><div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><h2 id="network-title" className="font-display text-2xl text-white">{view === "map" ? "Global map" : "Relationship network"}</h2><p className="data-meta mt-2">{view === "map" ? "Geographic context and intelligence overlays" : data ? `${data.nodes.length} nations · ${data.edges.length} declared ties` : "Building relationship network…"}</p></div><div className="view-switch" role="tablist" aria-label="Network visualization"><button role="tab" aria-selected={view === "map"} onClick={() => setView("map")}>Map</button><button role="tab" aria-selected={view === "network"} onClick={() => setView("network")}>Network</button></div></div>
      {view === "map" ? <WorldMap nodes={data?.nodes ?? []} edges={data?.edges ?? []} onSelect={setSelected} /> : error ? <div className="flex items-center justify-between border border-trinetra-border px-4 py-5" role="alert"><div><p className="font-medium text-white">Relationship intelligence temporarily unavailable.</p><p className="mt-1 text-sm text-neutral-500">The geographic map remains available; retry to restore network overlays.</p></div><button onClick={load} className="text-xs text-trinetra-saffron hover:text-white">Retry</button></div> : data ? <GlobalMap nodes={data.nodes} edges={data.edges} /> : <div className="flex min-h-[360px] items-center justify-center border border-trinetra-border text-sm text-neutral-500" role="status">Building relationship network…</div>}
      {selected && view === "map" && <div className="mt-4 border-t border-trinetra-border pt-4"><p className="section-kicker">Selected country</p><p className="mt-1 font-display text-2xl text-white">{data?.nodes.find((node) => node.id === selected)?.label || selected}</p><p className="mt-1 text-sm text-neutral-500">Geographic focus applied. Switch to Network to inspect supported relationships.</p></div>}
    </section></main><Footer /></div>;
}
