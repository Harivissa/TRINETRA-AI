import { useEffect, useState } from "react";
import Header from "../components/dashboard/Header";
import Footer from "../components/dashboard/Footer";
import GlobalMap from "../components/network/GlobalMap";
import { api } from "../services/api";

export default function NetworkView() {
  const [data, setData] = useState<{ nodes: any[]; edges: any[] } | null>(null);

  useEffect(() => {
    api.getNetwork().then(setData);
  }, []);

  return (
    <div className="min-h-screen bg-trinetra-bg text-neutral-200">
      <Header />
      <main className="max-w-[1400px] mx-auto px-8 py-16">
        <h1 className="font-display text-4xl text-trinetra-saffron mb-2">Global Map</h1>
        <p className="text-neutral-400 mb-10">
          Alliance and rivalry network, built automatically from each country's own
          data file — no relationship is hardcoded into the interface. Hover a nation
          to see just its ties.
        </p>

        {data && (
          <div className="border border-trinetra-border rounded p-6 bg-trinetra-panel">
            <div className="text-sm text-neutral-500 mb-6">{data.nodes.length} nations · {data.edges.length} declared ties</div>
            <GlobalMap nodes={data.nodes} edges={data.edges} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
