import type { CountryIndexEntry, Country, RivalryAnalysis } from "../types";

const configuredBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
const BASE = `${(configuredBase || "").replace(/\/$/, "")}/api`;
const REQUEST_TIMEOUT_MS = 12000;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!configuredBase) throw new Error("VITE_API_BASE_URL is not configured");
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE}${path}`, { ...init, signal: controller.signal, headers: { Accept: "application/json", ...(init?.headers || {}) } });
    const payload = await res.json().catch(() => null);
    if (!res.ok) throw new Error(payload?.error || `Request failed (${res.status})`);
    return payload as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw new Error("Backend request timed out");
    throw error instanceof Error ? error : new Error("Backend unavailable");
  } finally { window.clearTimeout(timeout); }
}

const get = <T,>(path: string) => request<T>(path);

export const api = {
  getCountries: () => get<CountryIndexEntry[]>("/countries"),
  getCountry: (id: string) => get<Country>(`/countries/${id}`),
  getRelationship: (a: string, b: string) => get<any>(`/relationships/${a}/${b}`),
  getNetwork: () => get<{ nodes: any[]; edges: any[] }>("/network"),
  getCountryModules: (id: string) => get<{ available_modules: string[] }>(`/countries/${id}/modules`),
  getCountryModule: (id: string, module: string): Promise<any | null> => request<any>(`/countries/${id}/${module}`).catch(() => null),
  runRivalry: async (countryA: string, countryB: string, includeAi = false): Promise<RivalryAnalysis> => {
    const [res, profileA, profileB, relationship] = await Promise.all([
      request<RivalryAnalysis>("/analysis/rivalry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country_a: countryA, country_b: countryB, include_ai_summary: includeAi }),
      }),
      get<Country>(`/countries/${countryA}`),
      get<Country>(`/countries/${countryB}`),
      get<any>(`/relationships/${countryA}/${countryB}`).catch(() => null),
    ]);

    return { ...res, country_a_profile: profileA, country_b_profile: profileB, source_relationship: relationship } as RivalryAnalysis;
  },
};
