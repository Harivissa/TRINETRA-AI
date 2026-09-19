import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowRight, RefreshCw, Swords, Shield, Activity, MapPin } from "lucide-react";
import Header from "../components/dashboard/Header";
import Footer from "../components/dashboard/Footer";
import CountrySelect from "../components/country/CountrySelect";
import LoadingEngine from "../components/analysis/LoadingEngine";
import AnalysisResults from "../components/analysis/AnalysisResults";
import { playLoadingAudio } from "../lib/audio";
import { api } from "../services/api";
import type { CountryIndexEntry, RivalryAnalysis as RivalryAnalysisType } from "../types";
import { SOVEREIGN_PHOTO_DOSSIERS } from "../data/geopoliticalMedia";

export default function RivalryAnalysis() {
  const [searchParams] = useSearchParams();
  const [countries, setCountries] = useState<CountryIndexEntry[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [countriesError, setCountriesError] = useState<string | null>(null);

  const initialA = searchParams.get("a") || "IND";
  const initialB = searchParams.get("b") || "CHN";

  const [countryA, setCountryA] = useState<string>(initialA);
  const [countryB, setCountryB] = useState<string>(initialB);
  const [analysis, setAnalysis] = useState<RivalryAnalysisType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLoading, setShowLoading] = useState(false);
  const requestRef = useRef<AbortController | null>(null);


  const fetchCountries = useCallback(() => {
    setCountriesLoading(true);
    setCountriesError(null);
    api
      .getCountries()
      .then((data) => {
        const list = Array.isArray(data) ? data : (data as any)?.countries || [];
        setCountries(list);
        setCountriesLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load countries:", err);
        setCountriesError("Country list unavailable. Confirm the TRINETRA data service is reachable.");
        setCountriesLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  const runAnalysis = useCallback(async (targetA = countryA, targetB = countryB) => {
    if (!targetA || !targetB) {
      setError("Select two nations to compare.");
      return;
    }
    if (targetA === targetB) {
      setError("Select two different countries to compare.");
      return;
    }
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    playLoadingAudio();
    setError(null);
    setAnalysis(null);
    setShowLoading(true);
    setLoading(true);
    try {
      const result = await api.runRivalry(targetA, targetB, false, controller.signal);
      if (!controller.signal.aborted) setAnalysis(result);
    } catch (err) {
      if (controller.signal.aborted) return;
      const msg = err instanceof Error && err.message ? err.message : "Comparison service unavailable. Confirm the TRINETRA data service is running, then retry.";
      setError(msg);
      setShowLoading(false);
    } finally {
      if (!controller.signal.aborted) {
        requestRef.current = null;
        setLoading(false);
      }
    }
  }, [countryA, countryB]);

  useEffect(() => {
    return () => {
      requestRef.current?.abort();
    };
  }, []);

  const handleCountryAChange = (val: string) => {
    setCountryA(val);
    if (val && val === countryB) {
      setCountryB("");
    }
    setError(null);
  };

  const handleCountryBChange = (val: string) => {
    setCountryB(val);
    if (val && val === countryA) {
      setCountryA("");
    }
    setError(null);
  };

  const labelA = countryA ? (countries.find((country) => country.id === countryA)?.name || countryA) : "Select country";
  const labelB = countryB ? (countries.find((country) => country.id === countryB)?.name || countryB) : "Select country";
  const canCompare = Boolean(countryA && countryB && countryA !== countryB && !loading);

  return (
    <div className="min-h-screen bg-trinetra-bg text-neutral-200">
      <Header />
      <main className="mx-auto max-w-[1500px] px-5 py-5 md:px-8 md:py-7">
        <div className="border-b border-trinetra-border pb-8">
          <p className="eyebrow mb-4">
            {countryA && countryB ? `COMPARE / ${countryA} vs ${countryB}` : "COMPARE / STRATEGIC ASSESSMENT"}
          </p>
          <h1 className="font-display text-4xl text-neutral-100 md:text-6xl">
            {countryA && countryB ? `${countryA} vs ${countryB}` : "Compare national positions"}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-400">
            {countryA && countryB
              ? `Examine the relationship, dependencies, leverage, and constraints connecting ${labelA} and ${labelB}. TRINETRA does not produce a winner or a predictive score.`
              : "Examine the relationship, dependencies, leverage, and constraints connecting two states. TRINETRA does not produce a winner or a predictive score."}
          </p>
        </div>

        <section aria-labelledby="comparison-controls" className="border-b border-trinetra-border py-7">
          <h2 id="comparison-controls" className="sr-only">Comparison controls</h2>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end">
            <div className="grid flex-1 gap-5 md:grid-cols-2">
              <CountrySelect
                label="First country"
                countries={countries}
                value={countryA}
                disabledOptionId={countryB}
                loading={countriesLoading}
                error={countriesError}
                onChange={handleCountryAChange}
              />
              <CountrySelect
                label="Second country"
                countries={countries}
                value={countryB}
                disabledOptionId={countryA}
                loading={countriesLoading}
                error={countriesError}
                onChange={handleCountryBChange}
              />
            </div>
            <button
              onClick={() => runAnalysis(countryA, countryB)}
              disabled={!canCompare}
              className="inline-flex h-11 items-center justify-center gap-3 rounded bg-trinetra-saffron px-5 font-semibold text-black transition-colors hover:bg-trinetra-saffronDim disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Preparing assessment" : "Compare"}
              {!loading && <ArrowRight aria-hidden="true" size={17} />}
            </button>
          </div>
          <p className="mt-4 text-xs text-neutral-500">
            {countryA && countryB ? (
              <>
                <span className="font-mono text-trinetra-saffron font-bold">{countryA}</span> ({labelA})
                <span className="px-2 text-neutral-600">vs</span>
                <span className="font-mono text-trinetra-saffron font-bold">{countryB}</span> ({labelB})
              </>
            ) : (
              <>
                <span>{countryA ? `${labelA} (${countryA})` : "Select country"}</span>
                <span className="px-2 text-neutral-700">vs</span>
                <span>{countryB ? `${labelB} (${countryB})` : "Select country"}</span>
              </>
            )}
            {countryA && countryB && countryA === countryB && (
              <span className="text-amber-400 ml-2">(Duplicate selection: choose two distinct states)</span>
            )}
          </p>

          {/* Photographic Bilateral Reconnaissance Comparison Cards */}
          {countryA && countryB && countryA !== countryB && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Country A Dossier Header */}
              {(() => {
                const infoA = SOVEREIGN_PHOTO_DOSSIERS[countryA] || {
                  image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80",
                  capital: "Sovereign Seat",
                  strategicFocus: "Territorial & Maritime Autonomy",
                  flag: "🌐",
                };
                return (
                  <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#090b0e] h-44 shadow-lg group">
                    <img
                      src={infoA.image}
                      alt={labelA}
                      className="w-full h-full object-cover filter brightness-50 contrast-110 group-hover:scale-105 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090b0e] via-[#090b0e]/50 to-transparent" />
                    <div className="absolute top-3 left-4 right-4 flex items-center justify-between font-mono text-[9px]">
                      <span className="px-2 py-0.5 rounded bg-black/80 border border-trinetra-saffron/40 text-trinetra-saffron font-semibold">
                        ACTOR VECTOR A // {countryA}
                      </span>
                      <span className="text-neutral-400">SEAT: {infoA.capital.toUpperCase()}</span>
                    </div>
                    <div className="absolute bottom-3 left-4 right-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{infoA.flag}</span>
                        <h3 className="font-display text-2xl text-white font-medium">{labelA}</h3>
                      </div>
                      <p className="text-[11px] text-neutral-300 line-clamp-1 font-light">
                        <span className="text-amber-400 font-mono">Focus: </span>{infoA.strategicFocus}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Country B Dossier Header */}
              {(() => {
                const infoB = SOVEREIGN_PHOTO_DOSSIERS[countryB] || {
                  image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80",
                  capital: "Sovereign Seat",
                  strategicFocus: "Regional Power Projection & Defense",
                  flag: "🌐",
                };
                return (
                  <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#090b0e] h-44 shadow-lg group">
                    <img
                      src={infoB.image}
                      alt={labelB}
                      className="w-full h-full object-cover filter brightness-50 contrast-110 group-hover:scale-105 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090b0e] via-[#090b0e]/50 to-transparent" />
                    <div className="absolute top-3 left-4 right-4 flex items-center justify-between font-mono text-[9px]">
                      <span className="px-2 py-0.5 rounded bg-black/80 border border-cyan-400/40 text-cyan-400 font-semibold">
                        ACTOR VECTOR B // {countryB}
                      </span>
                      <span className="text-neutral-400">SEAT: {infoB.capital.toUpperCase()}</span>
                    </div>
                    <div className="absolute bottom-3 left-4 right-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{infoB.flag}</span>
                        <h3 className="font-display text-2xl text-white font-medium">{labelB}</h3>
                      </div>
                      <p className="text-[11px] text-neutral-300 line-clamp-1 font-light">
                        <span className="text-cyan-400 font-mono">Focus: </span>{infoB.strategicFocus}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </section>

        {(error || countriesError) && (
          <div role="alert" className="mt-7 flex flex-col gap-4 border border-red-900/60 bg-red-950/20 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-red-300">ASSESSMENT SERVICE NOTICE</p>
              <p className="mt-1 text-sm text-neutral-400">{error || countriesError}</p>
            </div>
            <button
              onClick={() => {
                if (countries.length === 0) {
                  fetchCountries();
                }
                if (countryA && countryB && countryA !== countryB) {
                  runAnalysis(countryA, countryB);
                }
              }}
              className="inline-flex items-center gap-2 self-start text-sm font-semibold text-trinetra-saffron hover:underline"
            >
              <RefreshCw size={15} aria-hidden="true" /> Retry
            </button>
          </div>
        )}

        {showLoading && countryA && countryB && (
          <LoadingEngine
            countryA={countryA}
            countryB={countryB}
            nameA={labelA}
            nameB={labelB}
            onComplete={() => setShowLoading(false)}
          />
        )}
        {analysis && <div className="pt-10"><AnalysisResults analysis={analysis} /></div>}
      </main>
      <Footer />
    </div>
  );
}
