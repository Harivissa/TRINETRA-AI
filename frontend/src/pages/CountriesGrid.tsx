import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Grid2X2, Info, List, MapPin, Search } from "lucide-react";
import Header from "../components/dashboard/Header";
import Footer from "../components/dashboard/Footer";
import { api } from "../services/api";
import type { Country, CountryIndexEntry } from "../types";

type ViewMode = "grid" | "list";
type Profile = CountryIndexEntry & { detail?: Country };


function regionOf(country: Country | undefined) {
  return country?.region || "Region not available";
}

function Card({ profile, index, mode }: { profile: Profile; index: number; mode: ViewMode }) {
  const region = regionOf(profile.detail);
  const geography = profile.detail?.geography;
  const image = typeof geography?.image === "string" ? geography.image : undefined;
  const landmark = typeof geography?.capital === "string" ? geography.capital : undefined;
  return <Link to={`/country?id=${profile.id}`} className={`group relative overflow-hidden rounded-md border border-trinetra-border bg-trinetra-panel text-left transition-all hover:border-trinetra-saffron focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-trinetra-saffron ${mode === "list" ? "flex min-h-32" : "aspect-[16/9] min-h-[174px]"}`}>
    <div className={`${mode === "list" ? "w-36 shrink-0" : "absolute inset-0"} bg-cover bg-center opacity-50 transition duration-500 group-hover:scale-105 group-hover:opacity-65`} style={image ? { backgroundImage: `url(${image})` } : undefined} aria-hidden="true" />
    <div className="absolute inset-0 bg-gradient-to-t from-trinetra-bg via-trinetra-bg/80 to-trinetra-bg/35" aria-hidden="true" />
    <div className={`relative flex min-w-0 flex-1 flex-col justify-between gap-4 p-4 ${mode === "list" ? "sm:flex-row sm:items-center" : "min-h-full"}`}>
      <div className="min-w-0">
        <div className="mb-3 flex items-start justify-between gap-3"><h2 className="font-display text-[25px] leading-none text-neutral-100 transition-colors group-hover:text-trinetra-saffron">{profile.name}</h2><span className="rounded-sm bg-trinetra-bg/85 px-2 py-1 font-mono text-[10px] text-neutral-300">{profile.id}</span></div>
        <p className="text-xs text-neutral-300">Region: {region}</p>
        <p className="mt-3 flex items-start gap-1.5 text-xs leading-5 text-neutral-300"><MapPin className="mt-0.5 size-3 shrink-0 text-trinetra-saffron" aria-hidden="true" />{landmark || "Data unavailable"}</p>
      </div>
      <div className="flex items-center justify-between border-t border-trinetra-border pt-3 text-xs text-trinetra-saffron">View full intelligence profile <ArrowRight className="size-3" aria-hidden="true" /></div>
    </div>
  </Link>;
}

export default function CountriesGrid() {
  const [countries, setCountries] = useState<Profile[]>([]);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All Regions");
  const [view, setView] = useState<ViewMode>("grid");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => { setLoading(true); setError(false); api.getCountries().then(async (entries) => setCountries(await Promise.all(entries.map(async (entry) => { try { return { ...entry, detail: await api.getCountry(entry.id) }; } catch { return entry; } })))).catch(() => setError(true)).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const regions = useMemo(() => ["All Regions", ...Array.from(new Set(countries.map((profile) => regionOf(profile.detail)).filter((item) => item !== "Region not available"))).sort()], [countries]);
  const filtered = useMemo(() => countries.filter((profile) => { const haystack = `${profile.name} ${profile.id} ${regionOf(profile.detail)} ${typeof profile.detail?.geography?.capital === "string" ? profile.detail.geography.capital : ""}`.toLowerCase(); return haystack.includes(query.toLowerCase()) && (region === "All Regions" || regionOf(profile.detail) === region); }), [countries, query, region]);

  return <div className="min-h-screen bg-trinetra-bg text-neutral-200"><Header /><main className="mx-auto max-w-[1540px] px-5 py-6 sm:px-8 sm:py-8"><div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><div className="section-kicker">TRINETRA <span>/</span> COUNTRIES</div><h1 className="mt-3 font-display text-5xl leading-none text-neutral-100 sm:text-6xl">COUNTRIES</h1><p className="mt-3 text-sm text-neutral-400">Intelligence profiles of 20 major states shaping the global order.</p></div><div className="flex flex-wrap items-center gap-3"><div className="view-switch" role="group" aria-label="View mode"><button aria-selected={view === "grid"} onClick={() => setView("grid")}><Grid2X2 className="size-3.5" />Grid</button><button aria-selected={view === "list"} onClick={() => setView("list")}><List className="size-3.5" />List</button></div><label className="control-button"><Search className="size-3.5" /><span className="sr-only">Search countries</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search countries..." className="w-36 bg-transparent outline-none placeholder:text-neutral-600" /></label><select value={region} onChange={(event) => setRegion(event.target.value)} className="control-button min-w-40 appearance-none bg-trinetra-bg"><option value="All Regions">All Regions</option>{regions.slice(1).map((item) => <option key={item}>{item}</option>)}</select></div></div>
      {loading && <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">{Array.from({ length: 10 }).map((_, index) => <div key={index} className="aspect-[16/9] animate-pulse rounded-md border border-trinetra-border bg-trinetra-panel" />)}</div>}
      {!loading && error && <div className="border border-trinetra-border p-8 text-center"><p className="font-mono text-xs uppercase tracking-wider text-trinetra-saffron">COUNTRY INDEX UNAVAILABLE</p><button onClick={load} className="mt-4 text-sm text-neutral-300 underline underline-offset-4">Retry connection</button></div>}
      {!loading && !error && filtered.length === 0 && <div className="border border-trinetra-border p-8 text-center text-sm text-neutral-500">No country records match this search or region.</div>}
      {!loading && !error && filtered.length > 0 && <div className={view === "grid" ? "grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5" : "flex flex-col gap-3"}>{filtered.map((profile, index) => <Card key={profile.id} profile={profile} index={index} mode={view} />)}</div>}
      <div className="mt-4 flex flex-col gap-3 border-t border-trinetra-border pt-4 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between"><p className="flex items-center gap-2"><Info className="size-4" aria-hidden="true" />All profiles are derived from verified public datasets and intelligence reports.</p><p className="font-mono text-[10px] uppercase tracking-wider">Last updated: Not available <span className="ml-4 text-emerald-500">● Operational</span></p></div>
    </main><Footer /></div>;
}
