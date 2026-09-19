import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { CountryIndexEntry } from "../../types";
import LiveMapInterface from "../map/LiveMapInterface";

interface Props {
  countries: CountryIndexEntry[];
  chokepoints: any[];
}

export default function GlobalIntelligenceMap({ countries, chokepoints }: Props) {
  return (
    <section
      id="live-map"
      className="mb-14 rounded-2xl border border-neutral-800 bg-[#07090c] p-4 sm:p-6 lg:p-8 shadow-2xl overflow-hidden scroll-mt-20"
    >
      {/* Header matching visual reference */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="size-2 rounded-full bg-red-500 animate-ping" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF7A00] font-bold">
              REAL-TIME GEOSPATIAL INTELLIGENCE MAP
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl text-neutral-100 font-light mt-1">
            Global Tactical Situation &amp; Chokepoints
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1.5 max-w-3xl font-light leading-relaxed">
            Real geographic map utilizing official Natural Earth sovereign boundaries, live maritime chokepoints, active conflict flashpoints, and strategic defense corridors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/live-map"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FF7A00] text-black text-xs font-semibold hover:bg-[#ff9933] transition-colors shadow-md shadow-orange-500/10"
          >
            <span>Full-Screen Operational Map</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>

      {/* Embedded Real Geospatial Map Interface */}
      <LiveMapInterface
        countryCount={countries.length || 49}
        chokepointCount={chokepoints.length || 8}
      />
    </section>
  );
}
