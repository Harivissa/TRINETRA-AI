import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Grid2X2, List, Search, SlidersHorizontal } from "lucide-react";
import Header from "../components/dashboard/Header";
import Footer from "../components/dashboard/Footer";
import { api } from "../services/api";
import type { Country, CountryIndexEntry } from "../types";

type ViewMode = "grid" | "list";
type Profile = CountryIndexEntry & { detail?: Country; error?: boolean };

const regions = ["All regions", "Americas", "Europe", "Asia", "Middle East", "Africa", "Oceania"];
const strategies = ["All focus areas", "Maritime", "Energy", "Trade", "Military", "Technology"];
const crops = ["0% 18%", "50% 18%", "100% 18%", "0% 82%", "50% 82%", "100% 82%"];

function textValues(detail: Country | undefined, key: keyof Country) {
  const value = detail?.[key];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function inferRegion(detail: Country | undefined, id: string) {
  const value = detail?.region;
  if (value) return value;
  const map: Record<string, string> = { USA: "Americas", CAN: "Americas", BRA: "Americas", MEX: "Americas", GBR: "Europe", FRA: "Europe", DEU: "Europe", RUS: "Europe", IND: "Asia", CHN: "Asia", JPN: "Asia", ISR: "Middle East", SAU: "Middle East", AUS: "Oceania" };
  return map[id] ?? "Global";
}

function inferFocus(detail: Country | undefined) {
  const all = [...textValues(detail, "strategic_priorities"), ...textValues(detail, "strengths"), ...textValues(detail, "dependencies")].join(" ").toLowerCase();
  const labels: string[] = [];
  if (/maritime|naval|port|sea|chokepoint/.test(all)) labels.push("Maritime");
  if (/energy|oil|gas|pipeline/.test(all)) labels.push("Energy");
  if (/trade|export|import|supply/.test(all)) labels.push("Trade");
  if (/military|defense|army|nuclear/.test(all)) labels.push("Military");
  if (/technology|digital|chip|semiconductor/.test(all)) labels.push("Technology");
  return labels.length ? labels.slice(0, 2) : ["Strategic profile"];
}

function Card({ profile, index, mode, onOpen }: { profile: Profile; index: number; mode: ViewMode; onOpen: () => void }) {
  const detail = profile.detail;
  const region = inferRegion(detail, profile.id);
  const focus = inferFocus(detail);
  const priorities = textValues(detail, "strategic_priorities");
  const vulnerabilities = textValues(detail, "vulnerabilities");
  const summary = priorities[0] ?? vulnerabilities[0] ?? "Evidence-led country intelligence profile";
  return (
    <button onClick={onOpen} className={`group relative overflow-hidden rounded-md border border-trinetra-border bg-trinetra-panel text-left transition-all hover:-translate-y-0.5 hover:border-trinetra-saffron focus-visible:outline-none ${mode === "list" ? "flex min-h-32 items-stretch" : "min-h-[174px]"}`} aria-label={`Open intelligence profile for ${profile.name}`}>
      <div className={`${mode === "list" ? "w-40 shrink-0" : "absolute inset-0"} bg-cover bg-no-repeat opacity-75 transition duration-500 group-hover:scale-105 group-hover:opacity-95`} style={{ backgroundImage: "url('/chokepoints-atlas.png')", backgroundPosition: crops[index % crops.length], backgroundSize: mode === "list" ? "360% 220%" : "300% 220%" }} aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-trinetra-bg via-trinetra-bg/75 to-trinetra-bg/10" aria-hidden="true" />
      <div className={`relative flex min-w-0 flex-1 flex-col justify-between gap-6 p-5 ${mode === "list" ? "sm:flex-row sm:items-center sm:gap-8" : "min-h-[280px]"}`}>
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex items-center justify-between gap-2"><span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">{profile.id}</span><span className="bg-trinetra-bg/80 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-neutral-400">{region}</span></div>
          <div><h2 className="font-display text-3xl leading-none text-neutral-100 transition-colors group-hover:text-trinetra-saffron">{profile.name}</h2><p className="mt-2 max-w-lg text-sm leading-6 text-neutral-300">{summary}</p></div>
        </div>
        <div className="flex items-end justify-between gap-4 sm:items-center"><div className="flex flex-wrap gap-2">{focus.map((item) => <span key={item} className="border border-trinetra-border bg-trinetra-bg/70 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-neutral-400">{item}</span>)}</div><ArrowRight className="shrink-0 text-trinetra-saffron transition-transform group-hover:translate-x-1" size={18} aria-hidden="true" /></div>
      </div>
    </button>
  );
}

export default function CountriesGrid() {
  const [countries, setCountries] = useState<Profile[]>([]);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All regions");
  const [strategy, setStrategy] = useState("All focus areas");
  const [view, setView] = useState<ViewMode>("grid");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const load = () => {
    setLoading(true); setError(false);
    api.getCountries().then(async (entries) => {
      const profiles = await Promise.all(entries.map(async (entry) => { try { return { ...entry, detail: await api.getCountry(entry.id) }; } catch { return { ...entry, error: true }; } }));
      setCountries(profiles);
    }).catch(() => setError(true)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filtered = useMemo(() => countries.filter((profile) => {
    const detailRegion = inferRegion(profile.detail, profile.id);
    const focus = inferFocus(profile.detail);
    return (!query || `${profile.name} ${profile.id} ${detailRegion}`.toLowerCase().includes(query.toLowerCase())) && (region === "All regions" || detailRegion === region) && (strategy === "All focus areas" || focus.includes(strategy));
  }), [countries, query, region, strategy]);

  return <div className="min-h-screen bg-trinetra-bg text-neutral-200"><Header /><main className="mx-auto max-w-[1920px] px-5 py-6 sm:px-8 sm:py-8">
    <div className="flex flex-col gap-8 border-b border-trinetra-border pb-8 lg:flex-row lg:items-end lg:justify-between"><div><div className="section-kicker">Strategic intelligence / nations</div><h1 className="mt-3 font-display text-5xl text-neutral-100 sm:text-6xl">Country intelligence.</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-400">A navigable index of national capability, dependencies, geography, and strategic priorities. Select a country to move from context into evidence.</p></div><div className="flex shrink-0 items-center gap-4 font-mono text-[10px] uppercase tracking-wider text-neutral-500"><span>{loading ? "Index loading" : `${filtered.length} profiles visible`}</span><span className="status-dot" /></div></div>
    <div className="flex flex-col gap-4 border-b border-trinetra-border py-5 xl:flex-row xl:items-center"><label className="map-search border border-trinetra-border px-3 py-3 xl:max-w-md"><Search size={16} aria-hidden="true" /><span className="sr-only">Search countries</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search countries or country codes" /></label><div className="flex flex-wrap items-center gap-3"><SlidersHorizontal size={15} className="text-neutral-500" aria-hidden="true" /><select value={region} onChange={(event) => setRegion(event.target.value)} className="border border-trinetra-border bg-trinetra-panel px-3 py-3 text-xs text-neutral-300 outline-none focus:border-trinetra-saffron"><option>{regions[0]}</option>{regions.slice(1).map((item) => <option key={item}>{item}</option>)}</select><select value={strategy} onChange={(event) => setStrategy(event.target.value)} className="border border-trinetra-border bg-trinetra-panel px-3 py-3 text-xs text-neutral-300 outline-none focus:border-trinetra-saffron"><option>{strategies[0]}</option>{strategies.slice(1).map((item) => <option key={item}>{item}</option>)}</select><div className="view-switch ml-auto" role="group" aria-label="View mode"><button aria-selected={view === "grid"} onClick={() => setView("grid")} aria-label="Grid view"><Grid2X2 size={15} /></button><button aria-selected={view === "list"} onClick={() => setView("list")} aria-label="List view"><List size={15} /></button></div></div></div>
    {loading ? <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 8 }).map((_, index) => <div key={index} className="min-h-[280px] animate-pulse border border-trinetra-border bg-trinetra-panel/60" />)}</div> : error ? <div className="border border-trinetra-border py-20 text-center"><div className="section-kicker">Index unavailable</div><p className="mt-3 text-sm text-neutral-400">The country index could not be retrieved from the intelligence service.</p><button onClick={load} className="mt-5 border border-trinetra-saffron px-4 py-2 text-xs uppercase tracking-wider text-trinetra-saffron hover:bg-trinetra-saffron hover:text-black">Retry index</button></div> : filtered.length === 0 ? <div className="border border-trinetra-border py-20 text-center"><div className="section-kicker">No matching profiles</div><p className="mt-3 text-sm text-neutral-400">Adjust the search or filters to inspect another country.</p></div> : <div className={view === "grid" ? "grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5" : "flex flex-col gap-3"}>{filtered.map((profile) => <Card key={profile.id} profile={profile} index={countries.indexOf(profile)} mode={view} onOpen={() => navigate(`/country?id=${profile.id}`)} />)}</div>}
    <div className="mt-10 flex flex-col gap-2 border-t border-trinetra-border pt-5 font-mono text-[10px] uppercase tracking-wider text-neutral-600 sm:flex-row sm:justify-between"><span>Evidence-led profiles / no synthetic scores</span><span>Index verified 02 Sep 2026 · Source coverage varies by nation</span></div>
  </main><Footer /></div>;
}
