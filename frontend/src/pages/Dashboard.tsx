import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowUpRight, ChevronRight, Globe2, Radio, ShieldAlert, Waves } from "lucide-react";
import Header from "../components/dashboard/Header";
import Footer from "../components/dashboard/Footer";
import { api } from "../services/api";

const signals = [
  { icon: ShieldAlert, label: "Strategic pressure", value: "Elevated", note: "Cross-domain activity across 6 regions", tone: "text-trinetra-saffron" },
  { icon: Waves, label: "Energy corridors", value: "14 active ties", note: "Chokepoints requiring review", tone: "text-orange-300" },
  { icon: Radio, label: "Recent movement", value: "8 signals", note: "Updated from current data files", tone: "text-neutral-200" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [countryCount, setCountryCount] = useState<number | null>(null);
  useEffect(() => { api.getCountries().then((c) => setCountryCount(c.length)).catch(() => setCountryCount(null)); }, []);
  const count = countryCount ?? 20;

  return <div className="min-h-screen bg-trinetra-bg text-neutral-200"><Header />
    <main className="mx-auto max-w-[1800px] px-5 py-8 lg:px-8 lg:py-12">
      <div className="mb-8 flex flex-col justify-between gap-5 border-b border-trinetra-border pb-8 md:flex-row md:items-end">
        <div><p className="mb-3 font-mono text-[11px] uppercase tracking-[0.24em] text-trinetra-saffron">Strategic overview / 01 September 2026</p><h1 className="max-w-3xl font-display text-5xl leading-[0.95] text-white md:text-7xl">See the pressure<br /><span className="text-trinetra-saffron">behind the headlines.</span></h1><p className="mt-5 max-w-2xl text-sm leading-6 text-neutral-400">A structured view of geopolitical competition across military, economic, energy, infrastructure, and diplomatic systems.</p></div>
        <div className="flex shrink-0 gap-3"><button onClick={() => navigate("/analyze")} className="flex items-center gap-2 rounded bg-trinetra-saffron px-4 py-3 text-sm font-semibold text-black transition-colors hover:bg-trinetra-saffronDim">Run comparison <ArrowUpRight /></button><button onClick={() => navigate("/network")} className="rounded border border-trinetra-border px-4 py-3 text-sm text-neutral-300 transition-colors hover:border-trinetra-saffron hover:text-trinetra-saffron">Open network</button></div>
      </div>

      <section className="grid gap-4 md:grid-cols-3" aria-label="Strategic signals">{signals.map(({ icon: Icon, label, value, note, tone }) => <article key={label} className="rounded border border-trinetra-border bg-trinetra-panel p-5"><div className="mb-7 flex items-center justify-between"><Icon className="text-trinetra-saffron" /><span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Live signal</span></div><p className="text-xs uppercase tracking-widest text-neutral-500">{label}</p><p className={`mt-2 font-display text-3xl ${tone}`}>{value}</p><p className="mt-2 text-xs text-neutral-400">{note}</p></article>)}</section>

      <section className="mt-10 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <article className="rounded border border-trinetra-border bg-trinetra-panel p-5 md:p-7"><div className="mb-6 flex items-start justify-between"><div><p className="font-mono text-[10px] uppercase tracking-widest text-trinetra-saffron">Intelligence map</p><h2 className="mt-2 font-display text-3xl text-white">Global relationship network</h2></div><button onClick={() => navigate("/network")} className="text-neutral-400 hover:text-trinetra-saffron" aria-label="Open global network"><ChevronRight /></button></div><div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded border border-trinetra-border bg-trinetra-bg"><div className="network-ring size-44 rounded-full border border-trinetra-saffron/30 md:size-64" /><div className="network-ring network-ring-delayed size-28 rounded-full border border-trinetra-saffron/20 md:size-40" /><div className="absolute flex size-16 items-center justify-center rounded-full bg-trinetra-saffron text-xs font-bold text-black">WORLD</div><span className="absolute left-[18%] top-[28%] size-2 rounded-full bg-trinetra-saffron" /><span className="absolute right-[20%] top-[35%] size-2 rounded-full bg-orange-300" /><span className="absolute bottom-[22%] left-[34%] size-2 rounded-full bg-neutral-200" /><span className="absolute bottom-5 left-5 font-mono text-[10px] uppercase tracking-widest text-neutral-500">{count} nodes / network view</span></div></article>
        <article className="rounded border border-trinetra-border bg-trinetra-panel p-5 md:p-7"><div className="mb-6 flex items-center justify-between"><div><p className="font-mono text-[10px] uppercase tracking-widest text-trinetra-saffron">Priority queue</p><h2 className="mt-2 font-display text-3xl text-white">Active developments</h2></div><Globe2 className="text-neutral-500" /></div><div className="flex flex-col gap-5">{["Maritime access and corridor control", "Security alignment in the Indo-Pacific", "Economic leverage through energy trade"].map((item, i) => <button key={item} onClick={() => navigate("/analyze")} className="group flex items-start gap-3 border-b border-trinetra-border pb-5 text-left last:border-0 last:pb-0"><span className="font-mono text-xs text-trinetra-saffron">0{i + 1}</span><span className="text-sm leading-5 text-neutral-300 group-hover:text-white">{item}<span className="mt-1 block text-xs text-neutral-500">Compare actors and trace second-order effects <ChevronRight className="ml-1 inline size-3" /></span></span></button>)}</div></article>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3"><div className="rounded border border-trinetra-border bg-trinetra-panel p-5"><p className="text-xs uppercase tracking-widest text-neutral-500">Coverage</p><p className="mt-2 font-display text-4xl text-trinetra-saffron">{count}</p><p className="mt-1 text-sm text-neutral-400">nations in the intelligence layer</p></div><div className="rounded border border-trinetra-border bg-trinetra-panel p-5"><p className="text-xs uppercase tracking-widest text-neutral-500">Analytical depth</p><p className="mt-2 font-display text-4xl text-white">08</p><p className="mt-1 text-sm text-neutral-400">modules across every country profile</p></div><div className="rounded border border-trinetra-border bg-trinetra-panel p-5"><p className="text-xs uppercase tracking-widest text-neutral-500">Evidence status</p><p className="mt-2 font-display text-4xl text-white">DEMO</p><p className="mt-1 text-sm text-neutral-400">structured data, clearly marked</p></div></section>
    </main><Footer /></div>;
}
