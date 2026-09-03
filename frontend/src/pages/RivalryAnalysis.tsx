import { useEffect, useState } from "react";
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
  const [countryA, setCountryA] = useState("IND");
  const [countryB, setCountryB] = useState("CHN");
  const [analysis, setAnalysis] = useState<RivalryAnalysisType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [engineDone, setEngineDone] = useState(false);
  const [fetchDone, setFetchDone] = useState(false);

  useEffect(() => {
    api.getCountries().then(setCountries).catch(() => setError("Country index unavailable. Try again when the data service is reachable."));
  }, []);

  async function runAnalysis() {
    if (!countryA || !countryB || countryA === countryB) {
      setError("Select two different countries to compare.");
      return;
    }
    playLoadingAudio();
    setError(null);
    setAnalysis(null);
    setEngineDone(false);
    setFetchDone(false);
    setLoading(true);
    try {
      const result = await api.runRivalry(countryA, countryB);
      setAnalysis(result);
    } catch {
      setError("Comparison service unavailable. Confirm the TRINETRA data service is running, then retry.");
    } finally {
      setFetchDone(true);
    }
  }

  useEffect(() => {
    if (engineDone && fetchDone) setLoading(false);
  }, [engineDone, fetchDone]);

  const labelA = countries.find((country) => country.id === countryA)?.name || countryA;
  const labelB = countries.find((country) => country.id === countryB)?.name || countryB;

  return (
    <div className="min-h-screen bg-trinetra-bg text-neutral-200">
      <Header />
      <main className="mx-auto max-w-[1500px] px-5 py-5 md:px-8 md:py-7">
        <div className="border-b border-trinetra-border pb-8">
          <p className="eyebrow mb-4">COMPARE / STRATEGIC ASSESSMENT</p>
          <h1 className="font-display text-4xl text-neutral-100 md:text-6xl">Compare national positions</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-400">
            Examine the relationship, dependencies, leverage, and constraints connecting two states. TRINETRA does not produce a winner or a predictive score.
          </p>
        </div>

        <section aria-labelledby="comparison-controls" className="border-b border-trinetra-border py-7">
          <h2 id="comparison-controls" className="sr-only">Comparison controls</h2>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end">
            <div className="grid flex-1 gap-5 md:grid-cols-2">
              <CountrySelect label="First country" countries={countries} value={countryA} onChange={setCountryA} />
              <CountrySelect label="Second country" countries={countries} value={countryB} onChange={setCountryB} />
            </div>
            <button onClick={runAnalysis} disabled={loading} className="inline-flex h-11 items-center justify-center gap-3 rounded bg-trinetra-saffron px-5 font-semibold text-black transition-colors hover:bg-trinetra-saffronDim disabled:cursor-wait disabled:opacity-50">
              {loading ? "Preparing assessment" : "Run comparison"}
              {!loading && <ArrowRight aria-hidden="true" size={17} />}
            </button>
          </div>
          <p className="mt-4 text-xs text-neutral-500">{labelA} <span className="px-2 text-neutral-700">vs</span> {labelB}</p>
        </section>

        {error && (
          <div role="alert" className="mt-7 flex flex-col gap-4 border border-red-900/60 bg-red-950/20 p-5 md:flex-row md:items-center md:justify-between">
            <div><p className="text-sm font-semibold text-red-300">TRINETRA DATA SERVICE UNAVAILABLE</p><p className="mt-1 text-sm text-neutral-400">{error}</p></div>
            <button onClick={runAnalysis} className="inline-flex items-center gap-2 self-start text-sm font-semibold text-trinetra-saffron hover:underline"><RefreshCw size={15} aria-hidden="true" /> Retry</button>
          </div>
        )}

        {loading && <LoadingEngine countryA={countryA} countryB={countryB} onComplete={() => setEngineDone(true)} />}
        {analysis && <div className="pt-10"><AnalysisResults analysis={analysis} /></div>}
      </main>
      <Footer />
    </div>
  );
}
