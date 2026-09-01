import { useCallback, useEffect, useState } from "react";
import Header from "../components/dashboard/Header";
import Footer from "../components/dashboard/Footer";
import GlobalMap from "../components/network/GlobalMap";
import { api } from "../services/api";

interface NetworkData { nodes: { id: string; label: string }[]; edges: { source: string; target: string; type: string }[]; }

export default function NetworkView() {
  const [data, setData] = useState<NetworkData | null>(null);
  const [error, setError] = useState(false);
  const load = useCallback(() => { setError(false); api.getNetwork().then(setData).catch(() => setError(true)); }, []);
  useEffect(() => { load(); }, [load]);

  return <div className="min-h-screen bg-trinetra-bg text-neutral-200"><Header /><main className="mx-auto max-w-[1800px] px-5 py-8 lg:px-8 lg:py-10">
    <div className="border-b workspace-rule pb-7"><p className="section-kicker mb-3">Network / Relationships</p><h1 className="font-display text-4xl text-white md:text-5xl">Relationship network</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-400">A structured view of declared relationships between countries. Select a nation to focus its ties; use the filters to reduce the field.</p></div>
    <section className="mt-8" aria-labelledby="network-title"><div className="mb-4 flex items-end justify-between"><h2 id="network-title" className="font-display text-2xl text-white">Global network</h2>{data && <p className="data-meta">{data.nodes.length} nations · {data.edges.length} declared ties</p>}</div>
      {error ? <div className="flex items-center justify-between border border-trinetra-border px-4 py-5" role="alert"><div><p className="font-medium text-white">TRINETRA data service unavailable</p><p className="mt-1 text-sm text-neutral-500">The relationship network could not be retrieved.</p></div><button onClick={load} className="flex items-center gap-2 text-xs text-trinetra-saffron hover:text-white">Retry</button></div> : data ? <GlobalMap nodes={data.nodes} edges={data.edges} /> : <div className="flex min-h-[360px] items-center justify-center border border-trinetra-border text-sm text-neutral-500" role="status">Building relationship network…</div>}
    </section>
  </main><Footer /></div>;
}
