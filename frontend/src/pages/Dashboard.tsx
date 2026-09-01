import { useCallback, useEffect, useState } from "react";
import { ArrowUpRight, ChevronRight, Network, RefreshCw } from "lucide-react";
import Header from "../components/dashboard/Header";
import Footer from "../components/dashboard/Footer";
import GlobalMap from "../components/network/GlobalMap";
import { api } from "../services/api";

interface NetworkData {
  nodes: { id: string; label: string }[];
  edges: { source: string; target: string; type: string }[];
}

const pathways = [
  { title: "Nations", copy: "Country profiles and strategic context.", to: "/countries" },
  { title: "Network", copy: "Declared relationships across the system.", to: "/network" },
  { title: "Compare", copy: "Frame a focused rivalry analysis.", to: "/analyze" },
];

export default function Dashboard() {
  const [network, setNetwork] = useState<NetworkData | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setError(false);
    api.getNetwork().then(setNetwork).catch(() => setError(true));
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="min-h-screen bg-trinetra-bg text-neutral-200">
      <Header />
      <main className="mx-auto max-w-[1800px] px-5 py-7 lg:px-8 lg:py-9">
        <section className="flex flex-col gap-5 border-b workspace-rule pb-7 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-kicker mb-3">Overview / 01 September 2026</p>
            <h1 className="max-w-2xl font-display text-4xl leading-[1.02] text-white md:text-6xl">Strategic intelligence for a changing world.</h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-neutral-400">Trace the relationships, pressures, and dependencies shaping the international system.</p>
          </div>
          <button onClick={() => window.location.assign("/analyze")} className="flex w-fit items-center gap-2 rounded-sm bg-trinetra-saffron px-4 py-3 text-sm font-semibold text-black transition-colors hover:bg-trinetra-saffronDim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trinetra-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-trinetra-bg">
            Ask Trinetra <ArrowUpRight data-icon="inline-end" />
          </button>
        </section>

        <section className="mt-8" aria-labelledby="situation-title">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="section-kicker">Primary view</p><h2 id="situation-title" className="mt-1 font-display text-3xl text-white">Global situation</h2></div>
            <p className="data-meta">Relationship dataset · select a nation to focus</p>
          </div>
          {error ? (
            <div className="flex flex-col gap-4 border border-trinetra-border px-4 py-5 sm:flex-row sm:items-center sm:justify-between" role="alert">
              <div><p className="font-medium text-white">TRINETRA data service unavailable</p><p className="mt-1 text-sm text-neutral-500">The relationship network could not be retrieved. Try again when the service is available.</p></div>
              <button onClick={load} className="flex items-center gap-2 text-xs font-medium text-trinetra-saffron hover:text-white"><RefreshCw data-icon="inline-start" /> Retry</button>
            </div>
          ) : network ? <GlobalMap nodes={network.nodes} edges={network.edges} /> : (
            <div className="flex min-h-[360px] items-center justify-center border border-trinetra-border text-sm text-neutral-500" role="status">Building relationship network…</div>
          )}
        </section>

        <section className="mt-12 border-t workspace-rule pt-6" aria-labelledby="explore-title">
          <div><p className="section-kicker">Continue analysis</p><h2 id="explore-title" className="mt-1 font-display text-3xl text-white">Explore the system</h2></div>
          <div className="mt-5 grid border-y border-trinetra-border md:grid-cols-3">
            {pathways.map((item) => <a key={item.title} href={item.to} className="group flex items-center justify-between border-b border-trinetra-border px-1 py-5 last:border-0 md:border-b-0 md:border-r md:px-5 md:first:pl-0 md:last:border-r-0"><span><span className="block font-display text-2xl text-white transition-colors group-hover:text-trinetra-saffron">{item.title}</span><span className="mt-1 block text-sm text-neutral-500">{item.copy}</span></span><ChevronRight className="text-neutral-600 transition-colors group-hover:text-trinetra-saffron" /></a>)}
          </div>
        </section>
        <p className="mt-8 flex items-center gap-2 text-xs text-neutral-500"><Network data-icon="inline-start" /> Structured intelligence, not a live operational feed. Verify source context before drawing conclusions.</p>
      </main>
      <Footer />
    </div>
  );
}
