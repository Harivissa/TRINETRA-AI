import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Shield, Search, Menu, X, Compass, Globe2, Share2, Layers } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Dashboard", icon: Compass },
    { to: "/countries", label: "Countries", icon: Globe2 },
    { to: "/compare", label: "Rivalry Analysis", icon: Shield },
    { to: "/network", label: "Network", icon: Share2 },
    { to: "/groups", label: "Groups", icon: Layers },
    { to: "/search", label: "Search", icon: Search },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-trinetra-border bg-[#0a0a0a]/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1540px] items-center justify-between px-5 py-3.5 sm:px-8">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="size-8 rounded border border-trinetra-saffron/60 bg-trinetra-saffron/10 flex items-center justify-center text-trinetra-saffron font-bold text-xs tracking-wider transition-colors group-hover:bg-trinetra-saffron group-hover:text-black">
            त्र
          </div>
          <div>
            <div className="font-display text-xl font-bold tracking-wider text-neutral-100 flex items-center gap-1.5">
              TRINETRA <span className="text-trinetra-saffron text-sm font-sans font-semibold tracking-normal">AI</span>
            </div>
            <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-neutral-500">
              Strategic Intelligence
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded text-xs tracking-wide transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? "bg-trinetra-panel text-trinetra-saffron border border-trinetra-border font-medium"
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900"
                }`
              }
            >
              <item.icon className="size-3.5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right tools / System status */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/about"
            className="text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            About
          </Link>
          <div className="h-4 w-px bg-trinetra-border" />
          <div className="flex items-center gap-2 font-mono text-[11px] text-neutral-400 border border-trinetra-border/80 px-2.5 py-1 rounded bg-black/40">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>CORE ACTIVE</span>
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-neutral-400 hover:text-neutral-100 rounded border border-trinetra-border"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-trinetra-border bg-trinetra-panel px-5 py-4 space-y-2">
          {navLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-neutral-300 hover:text-trinetra-saffron rounded hover:bg-black/30"
            >
              <item.icon className="size-4 text-trinetra-saffron" />
              {item.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-trinetra-border/60 flex items-center justify-between text-xs text-neutral-500">
            <Link to="/about" onClick={() => setMobileMenuOpen(false)}>About Platform</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
          </div>
        </div>
      )}
    </header>
  );
}
