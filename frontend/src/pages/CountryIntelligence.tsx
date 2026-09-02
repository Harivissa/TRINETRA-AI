import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Users, DollarSign, TrendingUp, Radiation, Swords } from "lucide-react";
import Header from "../components/dashboard/Header";
import Footer from "../components/dashboard/Footer";
import ProfileSection from "../components/country/ProfileSection";
import CountrySelect from "../components/country/CountrySelect";
import Timeline from "../components/country/Timeline";
import LoadingEngine from "../components/analysis/LoadingEngine";
import AnalysisResults from "../components/analysis/AnalysisResults";
import { api } from "../services/api";
import { playLoadingAudio } from "../lib/audio";
import type { CountryIndexEntry, Country, RivalryAnalysis as RivalryAnalysisType } from "../types";

function List({ items }: { items?: string[] }) {
  if (!items || items.length === 0) {
    return <div className="text-sm text-neutral-500">No data yet for this section.</div>;
  }
  return (
    <ul className="space-y-2">
      {items.map((s) => (
        <li key={s} className="text-sm text-neutral-200 leading-relaxed flex gap-2">
          <span className="text-trinetra-saffron">•</span>
          <span>{s}</span>
        </li>
      ))}
    </ul>
  );
}

export default function CountryIntelligence() {
  const [countries, setCountries] = useState<CountryIndexEntry[]>([]);
  const [searchParams] = useSearchParams();
  const [selected, setSelected] = useState(searchParams.get("id") || "IND");
  const [country, setCountry] = useState<Country | null>(null);
  const [availableModules, setAvailableModules] = useState<string[]>([]);
  const [history, setHistory] = useState<any | null>(null);
  const [politics, setPolitics] = useState<any | null>(null);
  const [foreignPolicy, setForeignPolicy] = useState<any | null>(null);
  // Inline full-width comparison — no sidebar box. Opening it reveals a
  // full-page-width section below the profile and scrolls there.
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareB, setCompareB] = useState("CHN");
  const [compareAnalysis, setCompareAnalysis] = useState<RivalryAnalysisType | null>(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareError, setCompareError] = useState<string | null>(null);
  const [pendingResult, setPendingResult] = useState<RivalryAnalysisType | null>(null);
  const [pendingError, setPendingError] = useState<string | null>(null);
  const [engineDone, setEngineDone] = useState(false);
  const [fetchDone, setFetchDone] = useState(false);
  const compareSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getCountries().then(setCountries);
  }, []);

  useEffect(() => {
    if (!selected) return;
    api.getCountry(selected).then(setCountry).catch(() => setCountry(null));
    setHistory(null);
    setPolitics(null);
    setForeignPolicy(null);
    setCompareOpen(false);
    setCompareAnalysis(null);
    api.getCountryModules(selected).then(({ available_modules }) => {
      setAvailableModules(available_modules);
      if (available_modules.includes("history")) api.getCountryModule(selected, "history").then(setHistory);
      if (available_modules.includes("politics")) api.getCountryModule(selected, "politics").then(setPolitics);
      if (available_modules.includes("foreign_policy")) api.getCountryModule(selected, "foreign_policy").then(setForeignPolicy);
    });
  }, [selected]);

  function openCompare() {
    setCompareOpen(true);
    setTimeout(() => {
      compareSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  async function runCompare() {
    if (!selected || !compareB || selected === compareB) {
      setCompareError("Pick a different nation to compare against");
      return;
    }
    playLoadingAudio();
    setCompareError(null);
    setCompareAnalysis(null);
    setEngineDone(false);
    setFetchDone(false);
    setCompareLoading(true);
    try {
      const result = await api.runRivalry(selected, compareB);
      setPendingResult(result);
    } catch (e) {
      setPendingError("Analysis failed — check the backend is running on :8000");
    } finally {
      setFetchDone(true);
    }
  }

  useEffect(() => {
    if (engineDone && fetchDone) {
      setCompareLoading(false);
      if (pendingResult) setCompareAnalysis(pendingResult);
      if (pendingError) setCompareError(pendingError);
      setPendingResult(null);
      setPendingError(null);
      setTimeout(() => {
        compareSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engineDone, fetchDone]);

  return (
    <div className="min-h-screen bg-trinetra-bg text-neutral-200">
      <Header />
      <main className="max-w-[1800px] mx-auto px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-4xl text-trinetra-saffron">Country Intelligence</h1>
        </div>

        <div className="flex gap-4 mb-10 max-w-3xl">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="flex-1 bg-trinetra-panel border border-trinetra-border rounded px-4 py-3 text-neutral-200"
          >
            {countries.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button
            onClick={openCompare}
            className="border border-trinetra-border text-trinetra-saffron px-5 py-3 rounded hover:border-trinetra-saffron transition-colors whitespace-nowrap"
          >
            Compare with another nation
          </button>
        </div>

        {country && (
          <div>
            <div className="mb-10">
              <h2 className="font-display text-5xl text-white">{country.name}</h2>
              <p className="text-neutral-500 text-sm mt-1">{country.region}</p>
            </div>

            <div className="mb-6">
              <ProfileSection title="At a Glance">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="border border-trinetra-border rounded-lg p-4 bg-black/20">
                    <Users size={20} className="text-trinetra-saffron mb-2" />
                    <div className="text-neutral-500 text-xs uppercase">Population</div>
                    <div className="text-neutral-100 font-display text-lg">{country.demographics?.population_millions ? `${country.demographics.population_millions}M` : "N/A"}</div>
                  </div>
                  <div className="border border-trinetra-border rounded-lg p-4 bg-black/20">
                    <DollarSign size={20} className="text-trinetra-saffron mb-2" />
                    <div className="text-neutral-500 text-xs uppercase">GDP</div>
                    <div className="text-neutral-100 font-display text-lg">{country.economy?.gdp_usd_trillion ? `$${country.economy.gdp_usd_trillion}T` : "N/A"}</div>
                  </div>
                  <div className="border border-trinetra-border rounded-lg p-4 bg-black/20">
                    <TrendingUp size={20} className="text-trinetra-saffron mb-2" />
                    <div className="text-neutral-500 text-xs uppercase">Growth</div>
                    <div className="text-neutral-100 font-display text-lg">{country.economy?.gdp_growth_pct !== undefined ? `${country.economy.gdp_growth_pct}%` : "N/A"}</div>
                  </div>
                  <div className="border border-trinetra-border rounded-lg p-4 bg-black/20">
                    <Radiation size={20} className={country.nuclear?.weapons_state ? "text-trinetra-saffron mb-2" : "text-neutral-600 mb-2"} />
                    <div className="text-neutral-500 text-xs uppercase">Nuclear</div>
                    <div className="text-neutral-100 font-display text-lg">{country.nuclear?.weapons_state ? "Yes" : "No"}</div>
                  </div>
                </div>
              </ProfileSection>
            </div>

            {availableModules.length === 0 && (
              <div className="text-xs text-neutral-600 border border-trinetra-border rounded p-4 mb-6">
                Deep-dive intelligence (history timeline, political system, foreign policy doctrine) has not
                been researched and populated for {country.name} yet — only the base profile below is available.
              </div>
            )}

            {/* Wide dashboard grid — sections spread across the screen in
                columns instead of one long narrow column. */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {history && (
                <div className="lg:col-span-2">
                  <ProfileSection title="Historical Timeline">
                    <Timeline events={history.events} />
                  </ProfileSection>
                </div>
              )}

              {politics && (
                <div className="lg:col-span-2">
                  <ProfileSection title="Political System">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="text-sm space-y-2">
                        <p><span className="text-neutral-500">System: </span>{politics.political_system.type}</p>
                        <p><span className="text-neutral-500">Executive: </span>{politics.political_system.executive}</p>
                        <p><span className="text-neutral-500">Legislature: </span>{politics.political_system.legislature}</p>
                        {politics.current_government && (
                          <div className="text-sm space-y-2 mt-4 border-t border-trinetra-border pt-4">
                            <p><span className="text-neutral-500">Ruling coalition: </span>{politics.current_government.ruling_coalition}</p>
                            <p><span className="text-neutral-500">Head of government: </span>{politics.current_government.prime_minister || politics.current_government.head_of_government}</p>
                            <p><span className="text-neutral-500">Main opposition: </span>{politics.current_government.main_opposition}</p>
                            <p className="text-xs text-neutral-600">As of {politics.current_government.as_of}</p>
                          </div>
                        )}
                      </div>
                      {politics.major_parties && (
                        <div>
                          <div className="text-neutral-500 text-sm mb-2">Major parties</div>
                          {politics.major_parties.map((p: any) => (
                            <div key={p.name} className="text-sm mb-2">
                              <span className="text-neutral-200 font-semibold">{p.name}</span>
                              <span className="text-neutral-500"> — {p.ideology}. {p.status}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </ProfileSection>
                </div>
              )}

              {foreignPolicy && (
                <ProfileSection title="Foreign Policy Doctrine">
                  <p className="text-sm text-neutral-300 mb-4">{foreignPolicy.doctrine}</p>
                  <div className="text-neutral-500 text-sm mb-2">Strategic priorities</div>
                  <List items={foreignPolicy.strategic_priorities} />
                </ProfileSection>
              )}

              <ProfileSection title="Military — How Strong Is Its Army">
                <div className="text-sm space-y-2">
                  <p>Active soldiers: <span className="text-neutral-200">{country.military?.active_troops?.toLocaleString() ?? "Not available"}</span></p>
                  <p>Yearly defence budget: <span className="text-neutral-200">{country.military?.defence_spending_usd_billion ? `$${country.military.defence_spending_usd_billion} billion` : "Not available"}</span></p>
                  <p>Share of the economy spent on defence: <span className="text-neutral-200">{country.military?.defence_spending_pct_gdp ? `${country.military.defence_spending_pct_gdp}%` : "Not available"}</span></p>
                </div>
              </ProfileSection>

              <ProfileSection title="Energy — Where It Gets Its Power">
                <div className="text-sm space-y-2">
                  <p>
                    {country.energy?.net_import_dependence_ratio !== undefined ? (
                      country.energy.net_import_dependence_ratio > 0
                        ? "This country buys more energy from abroad than it produces — meaning it depends on other countries for fuel."
                        : "This country produces more energy than it uses — it's a net energy exporter."
                    ) : "No energy data yet."}
                  </p>
                  {country.energy?.note && <p className="text-neutral-500">{country.energy.note}</p>}
                </div>
              </ProfileSection>

              {country.politics && Object.keys(country.politics).length > 0 && (
                <ProfileSection title="Politics — Who Runs the Country">
                  <div className="text-sm space-y-2">
                    {Object.entries(country.politics).map(([k, v]) => (
                      <p key={k}><span className="text-neutral-500 capitalize">{k.replace(/_/g, " ")}: </span>{String(v)}</p>
                    ))}
                  </div>
                </ProfileSection>
              )}

              <ProfileSection title="What This Country Is Good At (Strengths)">
                <List items={country.strengths} />
              </ProfileSection>

              <ProfileSection title="Where This Country Is Weak (Vulnerabilities)">
                <List items={country.vulnerabilities} />
              </ProfileSection>

              <ProfileSection title="What It Depends On (Dependencies)">
                <List items={country.dependencies} />
              </ProfileSection>

              <ProfileSection title="Its Main Goals (Strategic Priorities)">
                <List items={country.strategic_priorities} />
              </ProfileSection>

              <div className="lg:col-span-2">
                <ProfileSection title="Friends and Rivals">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-neutral-500 text-sm mb-2">Allied with</div>
                      <List items={country.alliances} />
                    </div>
                    <div>
                      <div className="text-neutral-500 text-sm mb-2">Rivals with</div>
                      <List items={country.rivals} />
                    </div>
                  </div>
                </ProfileSection>
              </div>

              {country._meta && (
                <div className="lg:col-span-2">
                  <ProfileSection title="How Reliable Is This Data">
                    <div className="text-xs text-neutral-500 space-y-1">
                      {country._meta.data_quality && <p>Data quality: {country._meta.data_quality}</p>}
                      {country._meta.source && <p>Sources: {country._meta.source}</p>}
                      {country._meta.confidence && <p>Confidence: {country._meta.confidence}</p>}
                      {country._meta.last_updated && <p>Last updated: {country._meta.last_updated}</p>}
                    </div>
                  </ProfileSection>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* FULL-WIDTH INLINE COMPARISON — breaks out of the narrow profile
          column deliberately; this is the "intelligence wing", not a sidebar. */}
      {compareOpen && (
        <div ref={compareSectionRef} className="border-t-2 border-trinetra-saffron/40 bg-black/20">
          <div className="max-w-[1800px] mx-auto px-8 py-16">
            <div className="flex items-center gap-3 mb-2">
              <Swords size={22} className="text-trinetra-saffron" />
              <h2 className="font-display text-4xl text-trinetra-saffron">Comparison Wing</h2>
            </div>
            <p className="text-neutral-400 mb-8">
              Full strategic comparison of {country?.name || selected} against any other nation —
              military, economy, energy, external actors, chokepoints, and scenarios.
            </p>

            <div className="flex gap-6 mb-6 max-w-2xl">
              <div className="flex-1">
                <label className="block text-xs uppercase tracking-wide text-neutral-500 mb-2">Nation A</label>
                <div className="w-full bg-trinetra-panel border border-trinetra-border rounded px-4 py-3 text-neutral-200">
                  {country?.name || selected} <span className="text-neutral-600">(current)</span>
                </div>
              </div>
              <CountrySelect label="Nation B" countries={countries.filter((c) => c.id !== selected)} value={compareB} onChange={setCompareB} />
            </div>

            <button
              onClick={runCompare}
              disabled={compareLoading}
              className="bg-trinetra-saffron text-black font-semibold px-6 py-3 rounded hover:bg-trinetra-saffronDim transition-colors disabled:opacity-50"
            >
              {compareLoading ? "Comparing..." : "Run Full Comparison"}
            </button>

            {compareError && <p className="text-red-400 mt-4 text-sm">{compareError}</p>}

            {compareLoading && (
              <LoadingEngine countryA={selected} countryB={compareB} onComplete={() => setEngineDone(true)} />
            )}

            {compareAnalysis && (
              <div className="mt-14">
                <AnalysisResults analysis={compareAnalysis} />
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
