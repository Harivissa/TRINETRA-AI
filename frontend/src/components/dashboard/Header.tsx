import { Link, useLocation } from "react-router-dom";
import { Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

const NAV = [
  { label: "Overview", to: "/" },
  { label: "Countries", to: "/countries" },
  { label: "Relationships", to: "/network" },
  { label: "Comparison", to: "/analyze" },
];

export default function Header() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const active = (to: string) => to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        window.location.assign("/country");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return <header className="sticky top-0 z-20 border-b border-trinetra-border bg-trinetra-bg/95 backdrop-blur">
    <div className="mx-auto flex min-h-[62px] max-w-[1920px] items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
      <Link to="/" className="flex shrink-0 items-center gap-3" aria-label="TRINETRA overview">
        <span className="flex size-9 items-center justify-center rounded-sm bg-trinetra-saffron text-xs font-bold text-black">TN</span>
        <span><span className="block font-display text-[22px] leading-none text-white">TRINETRA</span><span className="hidden font-mono text-[9px] uppercase tracking-[.14em] text-neutral-600 sm:block">Strategic intelligence</span></span>
      </Link>
      <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
        {NAV.map((item) => <Link key={item.to} to={item.to} className={`border-b-2 py-5 text-sm transition-colors ${active(item.to) ? "border-trinetra-saffron text-white" : "border-transparent text-neutral-400 hover:text-white"}`}>{item.label}</Link>)}
      </nav>
      <div className="flex shrink-0 items-center gap-3">
        <Link to="/country" className="hidden items-center gap-2 text-xs text-neutral-400 transition-colors hover:text-trinetra-saffron lg:flex" aria-label="Search intelligence"><Search size={16} aria-hidden="true" /> Search intelligence <kbd className="border border-trinetra-border px-1.5 py-0.5 font-mono text-[9px]">Ctrl K</kbd></Link>
        <Link to="/analyze" className="rounded-sm bg-trinetra-saffron px-3 py-2 text-xs font-semibold text-black transition-colors hover:bg-trinetra-saffronDim">Ask Trinetra</Link>
        <button className="rounded-sm border border-trinetra-border p-2 text-neutral-300 md:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open}>{open ? <X size={18} /> : <Menu size={18} />}</button>
      </div>
    </div>
    {open && <nav className="flex flex-col gap-1 border-t border-trinetra-border px-4 py-3 md:hidden" aria-label="Mobile navigation">
      {NAV.map((item) => <Link key={item.to} onClick={() => setOpen(false)} to={item.to} className={`border-l-2 px-3 py-2 text-sm ${active(item.to) ? "border-trinetra-saffron text-white" : "border-transparent text-neutral-300"}`}>{item.label}</Link>)}
      <Link onClick={() => setOpen(false)} to="/country" className="border-l-2 border-transparent px-3 py-2 text-sm text-neutral-300">Country intelligence</Link>
    </nav>}
  </header>;
}
