import { Link, useLocation } from "react-router-dom";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Nations", to: "/countries" },
  { label: "Country Intel", to: "/country" },
  { label: "About", to: "/about" },
  { label: "Modules", to: "/modules" },
  { label: "Global Map", to: "/network" },
  { label: "Analyze", to: "/analyze" },
  { label: "Contact", to: "/contact" },
];

export default function Header() {
  const location = useLocation();
  return (
    <header className="flex items-center justify-between px-10 py-5 border-b border-trinetra-border">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded bg-trinetra-saffron text-black font-bold flex items-center justify-center font-body">
          TN
        </div>
        <div>
          <div className="font-display text-xl leading-tight text-white">Trinetra AI</div>
          <div className="text-xs text-neutral-400 leading-tight">Geopolitical Intelligence Platform</div>
        </div>
      </div>

      <nav className="flex items-center gap-8 text-sm text-neutral-300">
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`hover:text-trinetra-saffron transition-colors ${
              location.pathname === item.to ? "text-trinetra-saffron" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2 text-xs text-neutral-400 tracking-wide">
        <span className="status-dot" />
        STATIC ENGINE
      </div>
    </header>
  );
}
