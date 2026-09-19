import { useEffect, useState } from "react";
import Header from "../components/dashboard/Header";
import Footer from "../components/dashboard/Footer";
import ConflictTicker from "../components/home/ConflictTicker";
import LiveMapInterface from "../components/map/LiveMapInterface";
import { api } from "../services/api";
import type { CountryIndexEntry } from "../types";

export default function LiveMap() {
  const [countries, setCountries] = useState<CountryIndexEntry[]>([]);
  const [chokepoints, setChokepoints] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);

  useEffect(() => {
    // Scroll to top when landing on Live Map
    window.scrollTo({ top: 0, behavior: "instant" });

    Promise.all([
      api.getCountries().catch(() => []),
      api.getChokepoints().catch(() => []),
      api.getGroups().catch(() => []),
    ]).then(([cList, cpList, gList]) => {
      setCountries(cList);
      setChokepoints(cpList);
      setGroups(gList);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#070707] text-neutral-200 selection:bg-[#FF7A00]/30 selection:text-white flex flex-col justify-between">
      {/* 1. Primary Header */}
      <div>
        <Header />

        {/* 2. Geopolitical Crisis Ticker Bar (Directly below Header, matching Reference Image) */}
        <ConflictTicker />

        {/* 3. Main Live Map Section */}
        <main className="mx-auto max-w-[1720px] px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <LiveMapInterface
            countryCount={countries.length || 49}
            chokepointCount={chokepoints.length || 8}
            groupCount={groups.length || 6}
          />
        </main>
      </div>

      {/* 4. Footer */}
      <Footer />
    </div>
  );
}
