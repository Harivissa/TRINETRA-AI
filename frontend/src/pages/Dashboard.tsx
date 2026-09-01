import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowUpRight, ChevronRight, Network, RefreshCw } from "lucide-react";
import Header from "../components/dashboard/Header";
import Footer from "../components/dashboard/Footer";
import GlobalMap from "../components/network/GlobalMap";
import { api } from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [network, setNetwork] = useState<{ nodes: any[]; edges: any[] } | null>(null);
  const [error, setError] = useState(false);
  const load = () => { setError(false); api.getNetwork().then(setNetwork).catch(() => setError(true)); };
  useEffect(load, []);
  return <div className="min-h-screen bg-trinetra-bg text-neutral-200"><Header /><main className="mx-auto max-w-[1800px] px-5 py-8 lg:px-8 lg:py-10">
    <section className="flex flex-col justify-between gap-6 border-b workspace-rule pb-8 md:flex-row md:items-end"><div><p className="section-kicker mb-3">Global situation / 01 September 2026</p><h1 className="max-w-3xl font-display text-5xl leading-[.98] text-white md:text-7xl">Strategic intelligence<br /><span className="text-trinetra-saffron">for a changing world.</span></h1><p className="mt-5 max-w-xl text-sm leading-6 text-neutral-400">Trace the relationships, pressures, and dependencies shaping the international system.</p></div><button onClick={() => navigate("/analyze")} className="flex w-fit items-center gap-2 rounded-sm bg-trinetra-saffron px-4 py-3 text-sm font-semibold text-black hover:bg-trinetra-saffronDim">Ask Trinetra <ArrowUpRight data-icon="inline-end" /></button></section>
    <section className="mt-8" aria-labelledby="situation-title"><div className="mb-4 flex items-end justify-between"><div><p className="section-kicker">Primary view</p><h2 id="situation-title" className="mt-1 font-display text-3xl text-white">Global situation</h2></div><span className="data-meta">Structured relationship data</span></div>{error ? <div className="flex items-center justify-between border border-trinetra-border px-4 py-5 text-sm"><div><p className="font-medium text-white">TRINETRA data service unavailable</p><p className="mt-1 text-neutral-500">The network could not be retrieved. Your workspace remains available.</p></div><button onClick={load} className="flex items-center gap-2 text-xs text-trinetra-saffron hover:text-white"><RefreshCw data-icon="inline-start" /> Retry</button></div> : network ? <GlobalMap nodes={network.nodes} edges={network.edges} /> : <div className="flex min-h-[360px] items-center justify-center border border-trinetra-border text-sm text-neutral-500">Building relationship network…</div>}</section>
    <section className="mt-12 border-t workspace-rule pt-6"><div className="flex items-end justify-between"><div><p className="section-kicker">Continue analysis</p><h2 className="mt-1 font-display text-3xl text-white">Explore the system</h2></div></div><div className="mt-5 grid border-y border-trinetra-border md:grid-cols-3">{[{title:"Nations",copy:"Review country intelligence profiles.",to:"/countries"},{title:"Network",copy:"Inspect strategic relationships.",to:"/network"},{title:"Compare",copy:"Frame a focused rivalry analysis.",to:"/analyze"}].map((item) => <button key={item.title} onClick={() => navigate(item.to)} className="group flex items-center justify-between border-b border-trinetra-border px-1 py-5 text-left last:border-0 md:border-b-0 md:border-r md:px-5 md:first:pl-0 md:last:border-r-0"><span><span className="block font-display text-2xl text-white group-hover:text-trinetra-saffron">{item.title}</span><span className="mt-1 block text-sm text-neutral-500">{item.copy}</span></span><ChevronRight className="text-neutral-600 group-hover:text-trinetra-saffron" /></button>)}</div></section>
    <div className="mt-8 flex items-center gap-2 text-xs text-neutral-500"><Network data-icon="inline-start" /> Data is presented as structured intelligence; verify source context before drawing conclusions.</div>
  </main><Footer /></div>;
}
