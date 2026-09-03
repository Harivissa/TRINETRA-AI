import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Grid2X2, Info, List, Search, SlidersHorizontal } from "lucide-react";
import Header from "../components/dashboard/Header";
import Footer from "../components/dashboard/Footer";
import { api } from "../services/api";
import type { Country, CountryIndexEntry } from "../types";

type ViewMode = "grid" | "list";
type Profile = CountryIndexEntry & { detail?: Country; error?: boolean };

const regions = ["All Regions", "Americas", "Europe", "East Asia", "South Asia", "West Asia", "Africa", "Oceania"];
const regionFallback: Record<string, string> = { USA: "Americas", CAN: "Americas", BRA: "Americas", GBR: "Europe", FRA: "Europe", DEU: "Europe", RUS: "Europe", ITA: "Europe", IND: "South Asia", BGD: "South Asia", PAK: "South Asia", CHN: "East Asia", JPN: "East Asia", KOR: "East Asia", ISR: "West Asia", SAU: "West Asia", IRN: "West Asia", TUR: "West Asia", ARE: "West Asia", AUS: "Oceania", IDN: "East Asia" };
const crops = ["0% 18%", "50% 18%", "100% 18%", "0% 82%", "50% 82%", "100% 82%"];

function arrayValues(detail: Country | undefined, key: keyof Country) {
  const value = detail?.[key];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}
function regionOf(detail: Country | undefined, id: string) { return detail?.region || regionFallback[id] || "Global"; }
function domains(detail: Country | undefined) {
  const result: string[] = [];
  if (detail?.military) result.push("Defence");
  if (detail?.energy) result.push("Energy");
  if (detail?.trade) result.push("Trade");
  if (detail?.technology) result.push("Technology");
  if (detail?.infrastructure) result.push("Infrastructure");
  return result.slice(0, 4);
}
function leverage(detail: Country | undefined) {
  const geography = detail?.geography;
  if (!geography || typeof geography !== "object") return [];
  return Object.values(geography).flatMap((value) => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : typeof value === "string" ? [value] : []).slice(0, 3);
}

function Card({ profile, index, mode, onOpen }: { profile: Profile; index: number; mode: ViewMode; onOpen: () => void }) {
  const detail = profile.detail;
  const region = regionOf(detail, profile.id);
  const leverageItems = leverage(detail);
  const domainItems = domains(detail);
  const priorities = arrayValues(detail, "strategic_priorities");
  return <button onClick={onOpen} aria-label={`Open intelligence profile for ${profile.name}`} className={`group relative overflow-hidden rounded-md border border-trinetra-border bg-trinetra-panel text-left transition-colors hover:border-trinetra-saffron focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-trinetra-saffron ${mode === "list" ? "flex min-h-36" : "aspect-[16/9] min-h-[174px]"}`}>
    <div className={`${mode === "list" ? "w-32 shrink-0" : "absolute inset-0"} bg-cover bg-center opacity-35 transition duration-500 group-hover:scale-105 group-hover:opacity-50`} style={{ backgroundImage: "url('/chokepoints-atlas.png')", backgroundPosition: crops[index % crops.length], backgroundSize: "300% 220%" }} aria-hidden="true" />
    <div className="absolute inset-0 bg-gradient-to-t from-trinetra-bg via-trinetra-bg/90 to-trinetra-bg/55" aria-hidden="true" />
    <div className={`relative flex min-w-0 flex-1 flex-col justify-between gap-4 p-4 ${mode === "list" ? "sm:flex-row sm:items-center" : "min-h-full"}`}>
      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex items-start justify-between gap-3"><div><div className="mb-1 font-mono text-[9px] uppercase tracking-[0.18em] text-trinetra-saffron">Profile</div><h2 className="font-display text-2xl leading-none text-neutral-100 transition-colors group-hover:text-trinetra-saffron">{profile.name}</h2></div><span className="bg-trinetra-bg/90 px-2 py-1 font-mono text-[10px] text-neutral-300">{profile.id}</span></div>
        <div><div className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-500">Region</div><p className="mt-1 text-xs text-neutral-200">{region}</p></div>
        {leverageItems.length > 0 && <div><div className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-500">Geographic leverage</div><p className="mt-1 line-clamp-2 text-xs leading-5 text-neutral-300">{leverageItems.join(" · ")}</p></div>}
        {leverageItems.length === 0 && priorities.length > 0 && <div><div className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-500">Strategic priorities</div><p className="mt-1 line-clamp-2 text-xs leading-5 text-neutral-300">{priorities.slice(0, 3).join(" · ")}</p></div>}
      </div>
      <div className="flex flex-col gap-3"><div className="flex min-h-5 flex-wrap items-center gap-1.5">{domainItems.map((domain) => <span key={domain} className="border border-trinetra-border px-1.5 py-1 font-mono text-[9px] uppercase tracking-wider text-neutral-400">{domain}</span>)}</div><div className="flex items-center justify-between border-t border-trinetra-border pt-3 font-mono text-[10px] uppercase tracking-wider text-trinetra-saffron">View full intelligence profile <ArrowRight className="size-3" aria-hidden="true" /></div></div>
    </div>
  </button>;
}

export default function CountriesGrid() {
  const [countries, setCountries] = useState<Profile[]>([]); const [query, setQuery] = useState(""); const [region, setRegion] = useState("All Regions"); const [view, setView] = useState<ViewMode>("grid"); const [showFilters, setShowFilters] = useState(false); const [loading, setLoading] = useState(true); const [error, setError] = useState(false); const navigate = useNavigate();
  const load = () => { setLoading(true); setError(false); api.getCountries().then(async (entries) => setCountries(await Promise.all(entries.map(async (entry) => { try { return { ...entry, detail: await api.getCountry(entry.id) }; } catch { return { ...entry, error: true }; } })))).catch(() => setError(true)).finally(() => setLoading(false)); };
  useEffect(load, []);
  const filtered = useMemo(() => countries.filter((profile) => { const r = regionOf(profile.detail, profile.id); return (!query || `${profile.name} ${profile.id} ${r}`.toLowerCase().includes(query.toLowerCase())) && (region === "All Regions" || r === region); }), [countries, query, region]);
  return <div className="min-h-screen bg-trinetra-bg text-neutral-200"><Header /><main className="mx-auto max-w-[1540px] px-5 py-7 sm:px-8"><div className="mb-6 flex flex-col gap-6 border-b border-trinetra-border pb-6 lg:flex-row lg:items-end lg:justify-between"><div><div className="section-kicker">TRINETRA / COUNTRY INTELLIGENCE</div><h1 className="mt-3 font-display text-5xl leading-none text-neutral-100 sm:text-6xl">Global Country Intelligence</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-400">Evidence-led intelligence profiles of the states shaping the global strategic system.</p></div><div className="flex gap-8 border-l border-trinetra-border pl-5 font-mono text-[10px] uppercase tracking-wider text-neutral-500"><div><span className="block text-2xl text-neutral-100">{countries.length || "—"}</span>States</div><div><span className="block text-sm text-neutral-200">02 Sep 2026</span>Last verified</div></div></div><div className="mb-5 flex flex-col gap-3 border-b border-trinetra-border pb-4 lg:flex-row lg:items-center lg:justify-between"><div className="flex flex-wrap items-center gap-2"><div className="view-switch" role="group" aria-label="View mode"><button aria-selected={view === "grid"} onClick={() => setView("grid")}><Grid2X2 className="size-3.5" />Grid</button><button aria-selected={view === "list"} onClick={() => setView("list")}><List className="size-3.5" />List</button></div><button className="control-button" onClick={() => setShowFilters(!showFilters)} aria-expanded={showFilters}><SlidersHorizontal className="size-3.5" />Filters</button></div><div className="flex flex-wrap gap-2"><label className="control-button"><Search className="size-3.5" /><span className="sr-only">Search countries</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search countries..." className="w-40 bg-transparent outline-none placeholder:text-neutral-600" /></label><select value={region} onChange={(event) => setRegion(event.target.value)} className="control-button min-w-40 bg-trinetra-bg"><option value="All Regions">All Regions</option>{regions.slice(1).map((item) => <option key={item}>{item}</option>)}</select></div></div>{showFilters && <div className="mb-5 flex flex-wrap gap-2">{regions.map((item) => <button key={item} onClick={() => setRegion(item)} className={`filter-chip ${region === item ? "is-active" : ""}`}>{item}</button>)}</div>}{loading ? <div className="border border-trinetra-border p-12 text-center font-mono text-xs uppercase tracking-wider text-neutral-500">Loading country profiles...</div> : error ? <div className="border border-trinetra-border p-12 text-center"><p className="font-mono text-xs uppercase text-neutral-400">Country index unavailable</p><button onClick={load} className="mt-4 text-xs text-trinetra-saffron">Retry connection <ArrowRight className="ml-1 inline size-3" /></button></div> : filtered.length === 0 ? <div className="border border-trinetra-border p-12 text-center font-mono text-xs uppercase tracking-wider text-neutral-500">No country profiles match the current query.</div> : <div className={view === "grid" ? "grid gap-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5" : "flex flex-col gap-3"}>{filtered.map((profile, index) => <Card key={profile.id} profile={profile} index={index} mode={view} onOpen={() => navigate(`/country?id=${profile.id}`)} />)}</div>}<div className="mt-8 flex flex-col gap-4 border-t border-trinetra-border pt-4 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-2"><Info className="mt-0.5 size-4 shrink-0" /><p><span className="font-mono uppercase tracking-wider text-neutral-300">Data integrity</span><br />Profiles are derived from verified public datasets and institutional sources. Metrics retain their original reference years.</p></div><p className="font-mono uppercase tracking-wider">Confidence: High · Medium · Low · Insufficient data</p></div></main><Footer /></div>;
}
