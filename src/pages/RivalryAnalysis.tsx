import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, RefreshCw } from "lucide-react";
import Header from "../components/dashboard/Header";
import Footer from "../components/dashboard/Footer";
import CountrySelect from "../components/country/CountrySelect";
import LoadingEngine from "../components/analysis/LoadingEngine";
import AnalysisResults from "../components/analysis/AnalysisResults";
import { playLoadingAudio } from "../lib/audio";
import { api } from "../services/api";
import type { CountryIndexEntry, RivalryAnalysis as RivalryAnalysisType } from "../types";

export default function RivalryAnalysis() {
  const [countries, setCountries] = useState<CountryIndexEntry[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [countriesError, setCountriesError] = useState<string | null>(null);

  const [countryA, setCountryA] = useState<string>("");
  const [countryB, setCountryB] = useState<string>("");
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
