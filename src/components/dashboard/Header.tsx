import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Compass,
  Globe2,
  Shield,
  Share2,
  Layers,
  Search,
  BookOpen,
  Play,
  Menu,
  X,
  MapPin,
  Sparkles,
} from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Exact navigation incorporating all authoritative existing modules + screenshot layout
  const navLinks = [
    { to: "/", label: "Home", icon: Compass },
    { to: "/live-map", label: "Live Map", icon: MapPin },
    { to: "/countries", label: "Countries", icon: Globe2 },
    { to: "/compare", label: "Rivalries", icon: Shield },
    { to: "/groups", label: "Groups", icon: Layers },
    { to: "/network", label: "Network", icon: Share2 },
    { to: "/analyze", label: "Analyze", icon: Sparkles },
    { to: "/about", label: "Methodology", icon: BookOpen },
    { to: "/search", label: "Search", icon: Search },
  ];

  const handleReplayIntro = () => {
    window.dispatchEvent(new CustomEvent("trinetra:replay-intro"));
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-[#080808]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1540px] items-center justify-between px-4 py-2.5 sm:px-8">
        {/* Brand: Matching Screenshot with Orange 'त्रि' badge and subtitle */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="size-9 rounded-lg bg-[#FF7A00] flex items-center justify-center text-black font-serif font-extrabold text-lg shadow-sm shadow-orange-500/20 transition-transform group-hover:scale-105 select-none">
            त्रि
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1">
              Trinetra AI
            </span>
            <span className="text-[11px] text-neutral-400 font-normal leading-none tracking-normal">
              Third Eye of Global Intelligence
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `px-2.5 py-1.5 text-xs tracking-normal transition-colors rounded ${
                  isActive
                    ? "text-white font-medium bg-neutral-900/90"
                    : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900/50"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Tools: Run Analysis button & Replay Intro */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Saffron CTA Button: Run Analysis */}
          <Link
            to="/compare?a=IND&b=CHN"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#FF7A00] hover:bg-[#FF8811] text-black font-semibold text-xs transition-all shadow-sm shadow-orange-500/20 active:scale-95"
          >
            <span>▶</span>
            <span>Run Analysis</span>
          </Link>

          {/* Replay Intro Trigger */}
          <button
            onClick={handleReplayIntro}
            className="p-1.5 rounded border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
            title="Replay Cinematic Entry Experience"
            aria-label="Replay Cinematic Entry Experience"
          >
            <Play className="size-3.5 fill-current" />
          </button>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-neutral-400 hover:text-white rounded border border-neutral-800"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-800 bg-[#0d0d0d] px-5 py-4 space-y-2">
          {navLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-neutral-300 hover:text-[#FF7A00] rounded hover:bg-neutral-900"
            >
              <item.icon className="size-4 text-[#FF7A00]" />
              {item.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
            <Link
              to="/compare?a=IND&b=CHN"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 rounded bg-[#FF7A00] text-black font-semibold text-xs flex items-center gap-1.5"
            >
              <span>▶</span>
              <span>Run Analysis</span>
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleReplayIntro();
              }}
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-[#FF7A00]"
            >
              <Play className="size-3" />
              Replay Intro
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

