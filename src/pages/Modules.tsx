import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layers, Shield, History, Landmark, Zap, ArrowRight, ExternalLink } from "lucide-react";
import Header from "../components/dashboard/Header";
import Footer from "../components/dashboard/Footer";
import { api } from "../services/api";
import type { CountryIndexEntry } from "../types";

export default function Modules() {
  const [countries, setCountries] = useState<CountryIndexEntry[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("IND");
  const [availableModules, setAvailableModules] = useState<string[]>([]);
  const [activeModule, setActiveModule] = useState<string>("politics");
  const [moduleData, setModuleData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getCountries().then((list) => {
      setCountries(list);
    });
  }, []);

  useEffect(() => {
    if (!selectedCountry) return;
    setLoading(true);
    api.getCountryModules(selectedCountry).then(({ available_modules }) => {
      setAvailableModules(available_modules);
      const chosen = available_modules.includes(activeModule) ? activeModule : available_modules[0] || "";
      setActiveModule(chosen);
      if (chosen) {
        api.getCountryModule(selectedCountry, chosen).then((data) => {
          setModuleData(data);
          setLoading(false);
        }).catch(() => {
          setModuleData(null);
          setLoading(false);
        });
      } else {
        setModuleData(null);
        setLoading(false);
      }
    });
  }, [selectedCountry]);

  const loadModuleData = (mod: string) => {
    setActiveModule(mod);
    setLoading(true);
    api.getCountryModule(selectedCountry, mod).then((data) => {
      setModuleData(data);
      setLoading(false);
    }).catch(() => {
      setModuleData(null);
      setLoading(false);
    });
  };

  const moduleIcons: Record<string, any> = {
    politics: Landmark,
    history: History,
    foreign_policy: Shield,
    energy: Zap,
  };

  return (
    <div className="min-h-screen bg-trinetra-bg text-neutral-200">
      <Header />

      <main className="mx-auto max-w-[1540px] px-5 py-8 sm:px-8 sm:py-10">
        <div className="mb-8">
          <div className="section-kicker">ANALYTICAL FRAMEWORK / DOMAINS</div>
          <h1 className="font-display text-4xl sm:text-5xl text-neutral-100 mt-1">
            Deep-Dive Intelligence Modules
          </h1>
          <p className="text-sm text-neutral-400 mt-2 max-w-2xl">
            Modular domain records providing granular institutional, historical, and strategic policy structures for state actors.
          </p>
        </div>

        {/* State and Module Selectors */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="w-full sm:w-72">
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2 font-mono">
              Select State Dossier
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full bg-trinetra-panel border border-trinetra-border rounded px-4 py-2.5 text-sm text-neutral-200 focus:outline-none focus:border-trinetra-saffron"
            >
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.id})
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2 font-mono">
              Available Analytical Modules
            </label>
            <div className="flex flex-wrap gap-2">
              {availableModules.length === 0 ? (
                <div className="text-xs text-neutral-500 py-2.5">
                  No specialized deep-dive modules populated yet for this nation. Base profile available on the Dossier page.
                </div>
              ) : (
                availableModules.map((mod) => {
                  const Icon = moduleIcons[mod] || Layers;
                  const isCurrent = activeModule === mod;
                  return (
                    <button
                      key={mod}
                      onClick={() => loadModuleData(mod)}
                      className={`px-4 py-2 rounded text-xs tracking-wide capitalize flex items-center gap-2 transition-colors ${
                        isCurrent
                          ? "bg-trinetra-saffron text-black font-semibold shadow-md"
                          : "border border-trinetra-border bg-black/40 text-neutral-300 hover:border-neutral-500"
                      }`}
                    >
                      <Icon className="size-3.5" />
                      {mod.replace(/_/g, " ")}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Module Content Display */}
        <div className="border border-trinetra-border bg-trinetra-panel p-6 sm:p-8 rounded-lg">
          {loading ? (
            <div className="space-y-4">
              <div className="h-8 w-48 bg-neutral-800 animate-pulse rounded" />
              <div className="h-40 bg-neutral-800/40 animate-pulse rounded" />
            </div>
          ) : moduleData ? (
            <div>
              <div className="flex items-center justify-between border-b border-trinetra-border pb-4 mb-6">
                <div>
                  <span className="font-mono text-xs uppercase text-trinetra-saffron">
                    {selectedCountry} / {activeModule.replace(/_/g, " ")}
                  </span>
                  <h3 className="font-display text-2xl text-neutral-100 capitalize">
                    {activeModule.replace(/_/g, " ")} Module
                  </h3>
                </div>
                <Link
                  to={`/country?id=${selectedCountry}`}
                  className="text-xs text-trinetra-saffron hover:underline flex items-center gap-1"
                >
                  View Full State Dossier <ArrowRight className="size-3" />
                </Link>
              </div>

              {/* Render dynamic module JSON in clean readable cards */}
              <div className="space-y-6">
                {Object.entries(moduleData).map(([key, val]) => {
                  if (key === "country_id" || key === "_meta") return null;
                  return (
                    <div key={key} className="border border-trinetra-border/60 rounded p-4 bg-black/20">
                      <h4 className="font-mono text-xs uppercase tracking-wider text-neutral-400 mb-2">
                        {key.replace(/_/g, " ")}
                      </h4>
                      {typeof val === "string" || typeof val === "number" ? (
                        <p className="text-sm text-neutral-200 leading-relaxed">{String(val)}</p>
                      ) : Array.isArray(val) ? (
                        <div className="space-y-2">
                          {val.map((item, i) => (
                            <div key={i} className="text-xs text-neutral-300">
                              {typeof item === "object" ? (
                                <pre className="font-mono text-xs bg-black/40 p-3 rounded overflow-x-auto text-neutral-400">
                                  {JSON.stringify(item, null, 2)}
                                </pre>
                              ) : (
                                <div className="flex items-start gap-2">
                                  <span className="text-trinetra-saffron">•</span>
                                  <span>{String(item)}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <pre className="font-mono text-xs bg-black/40 p-3 rounded overflow-x-auto text-neutral-400">
                          {JSON.stringify(val, null, 2)}
                        </pre>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center text-neutral-500 py-16">
              Select a state dossier with populated modules (e.g. India) to explore deep-dive records.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
