import { Link, useLocation } from "react-router-dom";
import { Menu, Search } from "lucide-react";
import { useState } from "react";

const NAV = [
  { label: "Overview", to: "/" },
  { label: "Nations", to: "/countries" },
  { label: "Network", to: "/network" },
  { label: "Compare", to: "/analyze" },
  { label: "Modules", to: "/modules" },
];

export default function Header() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-trinetra-border bg-trinetra-bg/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1800px] items-center justify-between px-5 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="Trinetra overview">
          <div className="flex size-10 items-center justify-center rounded bg-trinetra-saffron font-body font-bold text-black">TN</div>
          <div>
            <div className="font-display text-xl leading-tight text-white">Trinetra AI</div>
            <div className="hidden text-xs leading-tight text-neutral-400 sm:block">Geopolitical Intelligence Platform</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded border border-trinetra-border bg-trinetra-panel p-1 lg:flex" aria-label="Primary navigation">
          {NAV.map((item) => {
            const active = location.pathname === item.to;
            return <Link key={item.to} to={item.to} className={`rounded px-4 py-2 text-sm transition-colors ${active ? "bg-trinetra-saffron text-black" : "text-neutral-400 hover:text-white"}`}>{item.label}</Link>;
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/country" className="hidden items-center gap-2 text-xs text-neutral-400 transition-colors hover:text-trinetra-saffron md:flex"><Search data-icon="inline-start" /> Country intel</Link>
          <span className="hidden items-center gap-2 text-xs tracking-wide text-neutral-400 sm:flex"><span className="status-dot" /> ENGINE READY</span>
          <button className="rounded border border-trinetra-border p-2 text-neutral-300 lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle navigation"><Menu /></button>
        </div>
      </div>
      {open && <nav className="flex flex-col gap-1 border-t border-trinetra-border px-5 py-3 lg:hidden" aria-label="Mobile navigation">{NAV.map((item) => <Link key={item.to} onClick={() => setOpen(false)} to={item.to} className={`rounded px-3 py-2 text-sm ${location.pathname === item.to ? "bg-trinetra-saffron text-black" : "text-neutral-300"}`}>{item.label}</Link>)}</nav>}
    </header>
  );
}
