import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowUpRight, CircleAlert, Eye, RefreshCw } from "lucide-react";
import Header from "../components/dashboard/Header";
import Footer from "../components/dashboard/Footer";
import GlobalMap from "../components/network/GlobalMap";
import { api } from "../services/api";

interface NetworkData {
  nodes: { id: string; label: string }[];
  edges: { source: string; target: string; type: string }[];
}

const perspective = [
  ["01", "See", "Geography", "Where power exists."],
  ["02", "Understand", "Capability", "What a state can do."],
  ["03", "Anticipate", "Relationships", "Who affects whom."],
];

function Coverage({ network }: { network: NetworkData | null }) {
  const types = useMemo(() => [...new Set(network?.edges.map((edge) => edge.type) ?? [])], [network]);
  if (!network) return <p className="text-sm text-neutral-500">Awaiting verified network data.</p>;
  return <dl className="grid grid-cols-3 divide-x divide-trinetra-border">
    <div className="px-4 first:pl-0"><dt className="data-meta">Countries</dt><dd className="mt-1 font-display text-2xl text-white">{network.nodes.length}</dd></div>
    <div className="px-4"><dt className="data-meta">Relationships</dt><dd className="mt-1 font-display text-2xl text-white">{network.edges.length}</dd></div>
    <div className="px-4 last:pr-0"><dt className="data-meta">Types</dt><dd className="mt-1 font-display text-2xl text-white">{types.length}</dd></div>
  </dl>;
}

export default function Dashboard() {
  const [network, setNetwork] = useState<NetworkData | null>(null);
  const [error, setError] = useState(false);
  const load = useCallback(() => { setError(false); api.getNetwork().then(setNetwork).catch(() => setError(true)); }, []);
  useEffect(() => { load(); }, [load]);

  return <div className="min-h-screen bg-trinetra-bg text-neutral-200"><Header /><main className="mx-auto w-full max-w-[1920px] px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
    <section className="border-b border-trinetra-border pb-5" aria-labelledby="situation-title">
      <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="section-kicker mb-2">TRINETRA / Global intelligence</p><h1 id="situation-title" className="font-display text-4xl leading-none text-white md:text-5xl">Global strategic situation</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-400">A live analytical view of geopolitical power, relationships, dependencies, strategic assets and pressure points.</p></div><a href="/analyze" className="flex items-center gap-2 rounded-sm bg-trinetra-saffron px-4 py-2.5 text-xs font-semibold text-black hover:bg-trinetra-saffronDim">Ask Trinetra <ArrowUpRight data-icon="inline-end" /></a></div>
      <div className="mt-5 grid border-t border-trinetra-border pt-4 sm:grid-cols-3">{perspective.map(([number, title, domain, detail]) => <div key={number} className="flex gap-3 border-b border-trinetra-border py-3 last:border-0 sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-0"><span className="font-mono text-[10px] text-trinetra-saffron">EYE {number}</span><div><p className="text-sm font-medium capitalize text-white">{title}</p><p className="mt-0.5 text-xs text-trinetra-saffron">{domain}</p><p className="mt-1 text-xs text-neutral-500">{detail}</p></div></div>)}</div>
    </section>

    <section className="mt-6" aria-labelledby="map-title"><div className="mb-3 flex flex-wrap items-end justify-between gap-3"><div><p className="section-kicker">Eye 01 / See</p><h2 id="map-title" className="mt-1 font-display text-3xl text-white">Global geographic picture</h2></div><p className="data-meta">Power · military · energy · trade · chokepoints</p></div>{error ? <div className="flex flex-col gap-4 border border-trinetra-border px-4 py-5 sm:flex-row sm:items-center sm:justify-between" role="alert"><div className="flex items-start gap-3"><CircleAlert className="mt-0.5 text-trinetra-saffron" /><div><p className="font-medium text-white">TRINETRA data service unavailable</p><p className="mt-1 text-sm text-neutral-500">The relationship overlay could not be retrieved. The surrounding workspace remains available.</p></div></div><button onClick={load} className="flex items-center gap-2 text-xs text-trinetra-saffron hover:text-white"><RefreshCw data-icon="inline-start" /> Retry</button></div> : network ? <GlobalMap nodes={network.nodes} edges={network.edges} /> : <div className="flex min-h-[430px] items-center justify-center border border-trinetra-border text-sm text-neutral-500" role="status">Preparing geographic analysis…</div>}</section>

    <section className="mt-8 grid border-y border-trinetra-border lg:grid-cols-[1.15fr_.85fr]" aria-labelledby="understand-title"><div className="py-5 lg:border-r lg:border-trinetra-border lg:pr-7"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="section-kicker">Eye 02 / Understand</p><h2 id="understand-title" className="mt-1 font-display text-3xl text-white">Strategic relationships</h2></div><a href="/network" className="text-xs text-trinetra-saffron hover:text-white">Open network <ArrowUpRight className="ml-1 inline" /></a></div><p className="mt-3 max-w-xl text-sm leading-6 text-neutral-500">Trace the ties, rivalries and dependencies that turn geographic position into strategic leverage.</p><div className="mt-5"><Coverage network={network} /></div></div><div className="py-5 lg:pl-7"><p className="section-kicker">Strategic signals</p><div className="mt-4 border-t border-trinetra-border py-5"><p className="font-display text-2xl text-neutral-300">No verified signals</p><p className="mt-2 text-sm leading-6 text-neutral-500">Event-level intelligence is not available from the connected dataset. TRINETRA will not fill this view with unsourced developments.</p></div></div></section>

    <section className="mt-8 border-b border-trinetra-border pb-8" aria-labelledby="anticipate-title"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="section-kicker">Eye 03 / Anticipate</p><h2 id="anticipate-title" className="mt-1 font-display text-3xl text-white">Strategic pressure points</h2></div><span className="data-meta">Assessment · not prediction</span></div><div className="mt-5 grid gap-5 md:grid-cols-2"><div className="border-t border-trinetra-border pt-4"><p className="text-sm font-medium text-white">Where is the leverage?</p><p className="mt-2 text-sm leading-6 text-neutral-500">Inspect chokepoints, dependencies and strategic assets through the available relationship and country data.</p></div><div className="border-t border-trinetra-border pt-4"><p className="text-sm font-medium text-white">What could change?</p><p className="mt-2 text-sm leading-6 text-neutral-500">Scenario-level assessments require verified event and pressure-point data. No unsupported projection is shown here.</p></div></div></section>

    <section className="py-8" aria-labelledby="model-title"><div className="flex items-start gap-3"><Eye className="mt-1 text-trinetra-saffron" /><div><p className="section-kicker">Analytical model</p><h2 id="model-title" className="mt-1 font-display text-3xl text-white">How Trinetra sees power</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-500">Power is not determined by one number. Trinetra examines geography, capabilities, relationships, dependencies and constraints together.</p></div></div><div className="mt-6 grid gap-2 text-center text-xs uppercase tracking-[.14em] text-neutral-400 sm:grid-cols-5 sm:items-center"><span className="border border-trinetra-border px-3 py-3">Geography</span><span className="hidden text-trinetra-saffron sm:block">+</span><span className="border border-trinetra-border px-3 py-3">Capability</span><span className="hidden text-trinetra-saffron sm:block">+</span><span className="border border-trinetra-border px-3 py-3">Relationships</span></div><div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs text-trinetra-saffron"><span>↓ Strategic leverage</span><span>↓ Constraints</span><span>↓ Possible consequences</span></div></section>
  </main><Footer /></div>;
}
