import type { CountryIndexEntry, Country, RivalryAnalysis } from "../types";

const API_ROOT = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://127.0.0.1:8000" : "");
const BASE = `${API_ROOT.replace(/\/$/, "")}/api`;
const REQUEST_TIMEOUT_MS = 12000;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE}${path}`, { ...init, signal: controller.signal, headers: { Accept: "application/json", ...(init?.headers || {}) } });
    const contentType = res.headers.get("content-type") || "";
    const payload = contentType.includes("application/json") ? await res.json() : null;
    if (!res.ok) throw new Error(payload?.error || payload?.message || `Request failed (${res.status})`);
    return payload as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw new Error("Trinetra backend request timed out");
    throw error instanceof Error ? error : new Error("Trinetra backend unavailable");
  } finally { window.clearTimeout(timeout); }
}

const get = <T,>(path: string) => request<T>(path);

export const api = {
  getHealth: () => get<{ status: string }>("/health"),
  getCountries: () => get<CountryIndexEntry[]>("/countries"),
  getCountry: (id: string) => get<Country>(`/countries/${id}`),
  getRelationship: (a: string, b: string) => get<any>(`/relationships/${a}/${b}`),
  getNetwork: () => get<{ nodes: any[]; edges: any[] }>("/network"),
  getChokepoints: () => get<any[]>("/chokepoints"),
  getCountryModules: (id: string) => get<{ available_modules: string[] }>(`/countries/${id}/modules`),
  getCountryModule: async (id: string, module: string): Promise<any | null> => {
    const res = await fetch(`${BASE}/countries/${id}/${module}`);
    if (!res.ok) return null;
    return res.json();
  },
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
