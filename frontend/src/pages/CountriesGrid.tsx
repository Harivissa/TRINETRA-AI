import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Header from "../components/dashboard/Header";
import Footer from "../components/dashboard/Footer";
import { api } from "../services/api";
import type { CountryIndexEntry } from "../types";

export default function CountriesGrid() {
  const [countries, setCountries] = useState<CountryIndexEntry[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.getCountries().then(setCountries);
  }, []);

  return (
    <div className="min-h-screen bg-trinetra-bg text-neutral-200">
      <Header />
      <main className="max-w-[1800px] mx-auto px-8 py-16">
        <h1 className="font-display text-5xl text-trinetra-saffron mb-2">Nations</h1>
        <p className="text-neutral-400 mb-10">
          Click a nation for its full intelligence profile — overview, military, energy,
          history, politics, and more where researched.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {countries.map((c) => (
            <button
              key={c.id}
              onClick={() => navigate(`/country?id=${c.id}`)}
              className="relative overflow-hidden border border-trinetra-border rounded-lg p-5 bg-trinetra-panel text-left hover:border-trinetra-saffron hover:-translate-y-0.5 transition-all group"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-trinetra-saffron/0 group-hover:bg-trinetra-saffron transition-colors" />
              <div className="flex items-center justify-between mb-3">
                <span className="font-display text-2xl text-white group-hover:text-trinetra-saffron transition-colors">
                  {c.name}
                </span>
                <span className="text-xs text-neutral-600 border border-trinetra-border rounded px-2 py-1 font-mono">{c.id}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-neutral-500 group-hover:text-neutral-300 transition-colors">
                View full intelligence profile <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
