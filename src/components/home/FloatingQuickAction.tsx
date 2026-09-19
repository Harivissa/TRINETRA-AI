import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Shield, Globe2, X, ArrowRight, Zap, MapPin } from "lucide-react";

interface Props {
  countries?: Array<{ id: string; name: string }>;
}

export default function FloatingQuickAction({ countries = [] }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Action Button matching bottom-right of screenshot */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open Trinetra Quick Command Engine"
          className="size-13 sm:size-14 rounded-full bg-gradient-to-tr from-[#FF7A00] to-[#FF9933] text-black flex items-center justify-center font-serif font-bold text-xl sm:text-2xl shadow-xl shadow-orange-500/30 hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer"
        >
          {isOpen ? <X className="size-6 text-black" /> : "त्रि"}
        </button>
      </div>

      {/* Quick Command Modal / Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-xl border border-neutral-800 bg-[#0f0f0f] p-5 sm:p-6 shadow-2xl space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded bg-[#FF7A00] flex items-center justify-center text-black font-serif text-xs font-bold">
                  त्रि
                </div>
                <span className="font-sans font-semibold text-sm text-white">
                  Trinetra Command Center
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-white p-1"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Quick Search */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search sovereign dossier, chokepoint, or doctrine..."
                className="w-full rounded-lg border border-neutral-700 bg-black/60 px-4 py-2.5 pl-10 text-xs text-white placeholder-neutral-500 focus:border-[#FF7A00] focus:outline-none"
                autoFocus
              />
              <Search className="absolute left-3 top-3 size-4 text-neutral-400" />
            </form>

            {/* Quick Actions */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block">
                Direct Intelligence Pathways
              </span>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/compare?a=IND&b=CHN"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded border border-neutral-800 bg-neutral-900/60 hover:border-[#FF7A00] hover:text-white text-xs text-neutral-300 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Shield className="size-3.5 text-[#FF7A00]" />
                    India vs China
                  </span>
                  <ArrowRight className="size-3 text-neutral-500" />
                </Link>

                <Link
                  to="/compare?a=USA&b=CHN"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded border border-neutral-800 bg-neutral-900/60 hover:border-[#FF7A00] hover:text-white text-xs text-neutral-300 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Shield className="size-3.5 text-[#FF7A00]" />
                    USA vs China
                  </span>
                  <ArrowRight className="size-3 text-neutral-500" />
                </Link>

                <a
                  href="#live-map"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded border border-neutral-800 bg-neutral-900/60 hover:border-[#FF7A00] hover:text-white text-xs text-neutral-300 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="size-3.5 text-[#FF7A00]" />
                    Live Atlas Map
                  </span>
                  <ArrowRight className="size-3 text-neutral-500" />
                </a>

                <Link
                  to="/countries"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded border border-neutral-800 bg-neutral-900/60 hover:border-[#FF7A00] hover:text-white text-xs text-neutral-300 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Globe2 className="size-3.5 text-[#FF7A00]" />
                    All 22 Countries
                  </span>
                  <ArrowRight className="size-3 text-neutral-500" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
