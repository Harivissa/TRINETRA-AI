import type { CountryIndexEntry, Country, RivalryAnalysis } from "../types";

const BASE = `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api`;

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`Request failed: ${path}`);
  return res.json();
}

export const api = {
  getCountries: () => get<CountryIndexEntry[]>("/countries"),
  getCountry: (id: string) => get<Country>(`/countries/${id}`),
  getCountryEnergy: (id: string) => get<Record<string, any>>(`/countries/${id}/energy`),
  getCountryInfrastructure: (id: string) => get<Record<string, any>>(`/countries/${id}/infrastructure`),
  getRelationship: (a: string, b: string) => get<any>(`/relationships/${a}/${b}`),
  getNetwork: () => get<{ nodes: any[]; edges: any[] }>("/network"),
  getCountryModules: (id: string) => get<{ available_modules: string[] }>(`/countries/${id}/modules`),
  getCountryModule: async (id: string, module: string): Promise<any | null> => {
    const res = await fetch(`${BASE}/countries/${id}/${module}`);
    if (!res.ok) return null;
    return res.json();
  },
  runRivalry: async (countryA: string, countryB: string, includeAi = false): Promise<RivalryAnalysis> => {
    const [res, profileA, profileB, relationship] = await Promise.all([
      fetch(`${BASE}/analysis/rivalry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country_a: countryA, country_b: countryB, include_ai_summary: includeAi }),
      }),
      get<Country>(`/countries/${countryA}`),
      get<Country>(`/countries/${countryB}`),
      get<any>(`/relationships/${countryA}/${countryB}`).catch(() => null),
    ]);

    if (!res.ok) throw new Error("Rivalry analysis failed");
    const analysis = await res.json();
    return { ...analysis, country_a_profile: profileA, country_b_profile: profileB, source_relationship: relationship } as RivalryAnalysis;
  },
};
