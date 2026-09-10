import type { CountryIndexEntry, Country, RivalryAnalysis } from "../types";

const API_ROOT = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://127.0.0.1:8000" : "");
const BASE = `${API_ROOT.replace(/\/$/, "")}/api`;
const REQUEST_TIMEOUT_MS = 12000;

async function request<T>(path: string, init?: RequestInit, externalSignal?: AbortSignal): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const abortFromCaller = () => controller.abort();
  externalSignal?.addEventListener("abort", abortFromCaller, { once: true });
  try {
    const res = await fetch(`${BASE}${path}`, {
      ...init,
      signal: controller.signal,
      headers: { Accept: "application/json", ...(init?.headers || {}) },
    });
    const contentType = res.headers.get("content-type") || "";
    const payload = contentType.includes("application/json") ? await res.json() : null;
    if (!res.ok) throw new Error(payload?.error || payload?.message || `Request failed (${res.status})`);
    return payload as T;
  } catch (error) {
    if (controller.signal.aborted && externalSignal?.aborted) throw new DOMException("Request cancelled", "AbortError");
    if (error instanceof DOMException && error.name === "AbortError") throw new Error("Trinetra backend request timed out");
    throw error instanceof Error ? error : new Error("Trinetra backend unavailable");
  } finally {
    window.clearTimeout(timeout);
    externalSignal?.removeEventListener("abort", abortFromCaller);
  }
}

const get = <T,>(path: string, signal?: AbortSignal) => request<T>(path, undefined, signal);

export const api = {
  getHealth: (signal?: AbortSignal) => get<{ status: string }>("/health", signal),
  getCountries: (signal?: AbortSignal) => get<CountryIndexEntry[]>("/countries", signal),
  getCountry: (id: string, signal?: AbortSignal) => get<Country>(`/countries/${id}`, signal),
  getRelationship: (a: string, b: string, signal?: AbortSignal) => get<any>(`/relationships/${a}/${b}`, signal),
  getNetwork: (signal?: AbortSignal) => get<{ nodes: any[]; edges: any[] }>("/network", signal),
  getChokepoints: (signal?: AbortSignal) => get<any[]>("/chokepoints", signal),
  getCountryModules: (id: string, signal?: AbortSignal) => get<{ available_modules: string[] }>(`/countries/${id}/modules`, signal),
  getCountryModule: (id: string, module: string, signal?: AbortSignal): Promise<any | null> => request<any>(`/countries/${id}/${module}`, undefined, signal).catch(() => null),
  runRivalry: async (countryA: string, countryB: string, includeAi = false, signal?: AbortSignal): Promise<RivalryAnalysis> => {
    const [res, profileA, profileB, relationship] = await Promise.all([
      request<RivalryAnalysis>("/analysis/rivalry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country_a: countryA, country_b: countryB, include_ai_summary: includeAi }),
      }, signal),
      get<Country>(`/countries/${countryA}`, signal),
      get<Country>(`/countries/${countryB}`, signal),
      get<any>(`/relationships/${countryA}/${countryB}`, signal).catch(() => null),
    ]);
    return { ...res, country_a_profile: profileA, country_b_profile: profileB, source_relationship: relationship } as RivalryAnalysis;
  },
};
