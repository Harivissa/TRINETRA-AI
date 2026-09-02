import { Link, useLocation } from "react-router-dom";
import { Menu, Search, X, Map, Network, GitCompare, Globe2, Route, Shield, Activity, BookOpen } from "lucide-react";
import { useState } from "react";

const NAV = [
  { label: "Command center", to: "/", icon: Globe2 },
  { label: "Countries", to: "/countries", icon: Map },
  { label: "Relationships", to: "/network", icon: Network },
  { label: "Comparison", to: "/analyze", icon: GitCompare },
];
const SECONDARY = [
  { label: "Chokepoints", to: "/network", icon: Route },
  { label: "Strategic assets", to: "/modules", icon: Shield },
  { label: "Timeline", to: "/", icon: Activity },
  { label: "Sources", to: "/about", icon: BookOpen },
];

export default function Header() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const active = (to: string) => to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
  const itemClass = (to: string) => `group flex items-center gap-3 border-l-2 px-4 py-2 text-[12px] transition-colors ${active(to) ? "border-trinetra-saffron bg-trinetra-saffron/10 text-white" : "border-transparent text-neutral-500 hover:border-neutral-600 hover:bg-white/[.03] hover:text-neutral-200"}`;
  return <>
    <aside className="trinetra-sidebar" aria-label="Intelligence modules">
      <Link to="/" className="flex items-center gap-3 border-b border-trinetra-border px-5 py-5" aria-label="TRINETRA command center">
        <span className="flex size-8 items-center justify-center rounded-sm bg-trinetra-saffron text-xs font-bold text-black">TN</span>
        <span><span className="block font-display text-xl leading-none text-white">TRINETRA</span><span className="mt-1 block font-mono text-[8px] uppercase tracking-[.14em] text-neutral-600">Strategic intelligence</span></span>
      </Link>
      <div className="px-3 py-5"><p className="section-kicker px-4 pb-3">Command</p><nav className="flex flex-col gap-1">{NAV.map(({ label, to, icon: Icon }) => <Link key={label} to={to} className={itemClass(to)}><Icon size={15} aria-hidden="true" />{label}</Link>)}</nav><p className="section-kicker px-4 pb-3 pt-8">Intelligence</p><nav className="flex flex-col gap-1">{SECONDARY.map(({ label, to, icon: Icon }) => <Link key={label} to={to} className={itemClass(to)}><Icon size={15} aria-hidden="true" />{label}</Link>)}</nav></div>
      <div className="mt-auto border-t border-trinetra-border px-7 py-5"><p className="data-meta">System status</p><p className="mt-2 flex items-center gap-2 text-xs text-neutral-400"><span className="status-dot" />Operational interface</p><p className="mt-4 data-meta">Data last verified</p><p className="mt-1 text-xs text-neutral-500">01 September 2026</p></div>
    </aside>
    <header className="trinetra-topbar sticky top-0 z-20 border-b border-trinetra-border bg-trinetra-bg/95 backdrop-blur"><div className="mx-auto flex max-w-[1800px] items-center justify-between px-5 py-3 lg:px-8"><Link to="/" className="flex items-center gap-3 md:hidden" aria-label="TRINETRA overview"><span className="flex size-8 items-center justify-center rounded-sm bg-trinetra-saffron text-xs font-bold text-black">TN</span><span className="font-display text-xl text-white">TRINETRA</span></Link><nav className="hidden items-center gap-6 md:flex" aria-label="Primary navigation">{NAV.slice(0, 4).map((item) => <Link key={item.to} to={item.to} className={`border-b-2 py-2 text-sm transition-colors ${active(item.to) ? "border-trinetra-saffron text-white" : "border-transparent text-neutral-400 hover:text-white"}`}>{item.label.replace("Command center", "Overview")}</Link>)}</nav><div className="flex items-center gap-3"><Link to="/country" className="hidden items-center gap-2 text-xs text-neutral-400 hover:text-trinetra-saffron lg:flex"><Search size={16} aria-hidden="true" /> Search intelligence</Link><Link to="/analyze" className="rounded-sm bg-trinetra-saffron px-3 py-2 text-xs font-semibold text-black hover:bg-trinetra-saffronDim">Ask Trinetra</Link><button className="rounded-sm border border-trinetra-border p-2 text-neutral-300 md:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open}>{open ? <X size={18} /> : <Menu size={18} />}</button></div></div>{open && <nav className="flex flex-col gap-1 border-t border-trinetra-border px-5 py-3 md:hidden" aria-label="Mobile navigation">{[...NAV, ...SECONDARY].map(({ label, to }) => <Link key={label} onClick={() => setOpen(false)} to={to} className={itemClass(to)}>{label}</Link>)}</nav>}</header>
  </>;
}
