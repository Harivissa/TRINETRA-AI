import { Link, useLocation } from "react-router-dom";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";

const NAV = [
  { label: "Overview", to: "/" },
  { label: "Nations", to: "/countries" },
  { label: "Network", to: "/network" },
  { label: "Compare", to: "/analyze" },
];

export default function Header() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const active = (to: string) => to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
  return <header className="sticky top-0 z-20 border-b border-trinetra-border bg-trinetra-bg/95 backdrop-blur">
    <div className="mx-auto flex max-w-[1800px] items-center justify-between px-5 py-3 lg:px-8">
      <Link to="/" className="flex items-center gap-3" aria-label="TRINETRA overview">
        <div className="flex size-9 items-center justify-center rounded-sm bg-trinetra-saffron font-body text-sm font-bold text-black">TN</div>
        <div><div className="font-display text-[22px] leading-none text-white">TRINETRA</div><div className="hidden text-[10px] uppercase tracking-[0.14em] text-neutral-500 sm:block">Strategic intelligence</div></div>
      </Link>
      <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary navigation">{NAV.map((item) => <Link key={item.to} to={item.to} className={`border-b-2 py-2 text-sm transition-colors ${active(item.to) ? "border-trinetra-saffron text-white" : "border-transparent text-neutral-400 hover:text-white"}`}>{item.label}</Link>)}</nav>
      <div className="flex items-center gap-4"><Link to="/country" className="hidden items-center gap-2 text-xs text-neutral-400 hover:text-trinetra-saffron md:flex" aria-label="Search country intelligence"><Search data-icon="inline-start" /> Country intel</Link><Link to="/analyze" className="hidden rounded-sm bg-trinetra-saffron px-3 py-2 text-xs font-semibold text-black hover:bg-trinetra-saffronDim sm:block">Ask Trinetra</Link><button className="rounded-sm border border-trinetra-border p-2 text-neutral-300 lg:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Close navigation" : "Open navigation"}>{open ? <X /> : <Menu />}</button></div>
    </div>
    {open && <nav className="flex flex-col gap-1 border-t border-trinetra-border px-5 py-3 lg:hidden" aria-label="Mobile navigation">{NAV.map((item) => <Link key={item.to} onClick={() => setOpen(false)} to={item.to} className={`border-l-2 px-3 py-2 text-sm ${active(item.to) ? "border-trinetra-saffron text-white" : "border-transparent text-neutral-300"}`}>{item.label}</Link>)}<Link onClick={() => setOpen(false)} to="/analyze" className="mt-2 border-l-2 border-trinetra-saffron px-3 py-2 text-sm text-trinetra-saffron">Ask Trinetra</Link></nav>}
  </header>;
}
