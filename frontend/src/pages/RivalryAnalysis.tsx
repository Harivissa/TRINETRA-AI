import { useEffect, useState } from "react";
import Header from "../components/dashboard/Header";
import Footer from "../components/dashboard/Footer";
import CountrySelect from "../components/country/CountrySelect";
import LoadingEngine from "../components/analysis/LoadingEngine";
import AnalysisResults from "../components/analysis/AnalysisResults";
import { api } from "../services/api";
import { playLoadingAudio } from "../lib/audio";
import type { CountryIndexEntry, RivalryAnalysis as RivalryAnalysisType } from "../types";

export default function RivalryAnalysis() {
  const [countries, setCountries] = useState<CountryIndexEntry[]>([]);
  const [countryA, setCountryA] = useState("IND");
  const [countryB, setCountryB] = useState("CHN");
  const [analysis, setAnalysis] = useState<RivalryAnalysisType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pendingResult, setPendingResult] = useState<RivalryAnalysisType | null>(null);
  const [pendingError, setPendingError] = useState<string | null>(null);
  const [engineDone, setEngineDone] = useState(false);
  const [fetchDone, setFetchDone] = useState(false);

  useEffect(() => {
    api.getCountries().then(setCountries).catch(() => setError("Could not load country list"));
  }, []);

  async function runAnalysis() {
    if (!countryA || !countryB || countryA === countryB) {
      setError("Select two different countries");
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
      setPendingResult(result);
    } catch (e) {
      setPendingError("Analysis failed — check the backend is running on :8000");
    } finally {
      setFetchDone(true);
    }
  }

  useEffect(() => {
    if (engineDone && fetchDone) {
      setLoading(false);
      if (pendingResult) setAnalysis(pendingResult);
      if (pendingError) setError(pendingError);
      setPendingResult(null);
      setPendingError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engineDone, fetchDone]);

  return (
    <div className="min-h-screen bg-trinetra-bg text-neutral-200">
      <Header />
      <main className="max-w-[1800px] mx-auto px-8 py-16">
        <h1 className="font-display text-5xl text-trinetra-saffron mb-2">Rivalry Analysis</h1>
        <p className="text-neutral-400 mb-10 max-w-2xl">
          A structured strategic comparison — military, economic, energy, external actors,
          scenarios, and how pressure could move from one domain to the next. Not a
          "who would win" prediction.
        </p>

        <div className="flex gap-6 mb-6 max-w-2xl">
          <CountrySelect label="Country A" countries={countries} value={countryA} onChange={setCountryA} />
          <CountrySelect label="Country B" countries={countries} value={countryB} onChange={setCountryB} />
        </div>

        <button
          onClick={runAnalysis}
          disabled={loading}
          className="bg-trinetra-saffron text-black font-semibold px-6 py-3 rounded hover:bg-trinetra-saffronDim transition-colors disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Run Analysis"}
        </button>

        {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}

        {loading && (
          <LoadingEngine countryA={countryA} countryB={countryB} onComplete={() => setEngineDone(true)} />
        )}

        {analysis && (
          <div className="mt-14">
            <AnalysisResults analysis={analysis} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
