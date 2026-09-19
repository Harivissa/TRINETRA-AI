import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronRight, CheckCircle2, AlertTriangle, HelpCircle, Shield, Landmark, History, Globe, Zap, Ship, Cpu, DollarSign, Users, Swords } from "lucide-react";
import type { RivalryAnalysis as RivalryAnalysisType } from "../../types";
import Comparison3D from "../comparison/Comparison3D";
import { getCountryFlag } from "../../utils/flags";

type Props = { analysis: RivalryAnalysisType };

function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="comparison-section border-b border-trinetra-border py-8">
      <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
        <h2 className="font-display text-2xl text-neutral-100">{title}</h2>
        {note && <p className="max-w-2xl text-sm leading-6 text-neutral-500">{note}</p>}
      </div>
      {children}
    </section>
  );
}

function Empty({ children }: { children?: ReactNode }) {
  return (
    <div className="border-l-2 border-neutral-700 bg-neutral-950/40 py-3 pl-4 pr-3 text-sm leading-6 text-neutral-500">
      <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
        DATA NOT AVAILABLE
      </span>
      {children && <span className="normal-case text-neutral-400">{children}</span>}
    </div>
  );
}

function Value({ metric }: { metric: { value: unknown; source?: string; year?: unknown } }) {
  const isMissing = metric.value == null || metric.value === "" || metric.value === "Not available";
  return (
    <div className="text-right">
      <p className="text-lg font-semibold text-neutral-100">
        {isMissing ? (
          <span className="font-mono text-xs text-neutral-500">DATA NOT AVAILABLE</span>
        ) : (
          String(metric.value)
        )}
      </p>
      <p className="mt-1 text-[10px] uppercase tracking-wider text-neutral-500 line-clamp-1 max-w-[180px]">
        {metric.source ? (
          <>
            <span>{metric.source}</span>
            {metric.year ? <span className="ml-1 text-neutral-400">· DATA DATE: {String(metric.year)}</span> : null}
          </>
        ) : (
          <span className="text-neutral-600">DATA SOURCE: SOURCED DATASET</span>
        )}
      </p>
    </div>
  );
}

function BulletList({ items, empty }: { items?: unknown[]; empty: string }) {
  return items?.length ? (
    <ul className="flex flex-col gap-2.5">
      {items.map((item, index) => (
        <li key={`${String(item)}-${index}`} className="border-b border-trinetra-border/60 pb-2.5 text-sm leading-relaxed text-neutral-300 last:border-0 flex gap-2">
          <span className="text-trinetra-saffron shrink-0">•</span>
          <span>{typeof item === "string" ? item : JSON.stringify(item)}</span>
        </li>
      ))}
    </ul>
  ) : (
    <Empty>{empty}</Empty>
  );
}

function DataSeparationBlock({
  bothContent,
  onlyAContent,
  onlyBContent,
  onlyALabel,
  onlyBLabel,
  missingContent,
  entityAName,
  entityBName,
}: {
  bothContent?: ReactNode;
  onlyAContent?: ReactNode;
  onlyBContent?: ReactNode;
  onlyALabel?: string;
  onlyBLabel?: string;
  missingContent?: ReactNode;
  entityAName: string;
  entityBName: string;
}) {
  const hasBoth = Boolean(bothContent);
  const hasOnlyA = Boolean(onlyAContent);
  const hasOnlyB = Boolean(onlyBContent);
  const hasMissing = Boolean(missingContent);

  return (
    <div className="space-y-7">
      {/* 1. DATA AVAILABLE FOR BOTH ENTITIES */}
      {hasBoth && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
            <p className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-medium">
              Data Available for Both Nations (Direct Comparison)
            </p>
          </div>
          {bothContent}
        </div>
      )}

      {/* 2. DATA AVAILABLE FOR ONLY ONE ENTITY */}
      {(hasOnlyA || hasOnlyB) && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-400"></span>
            <p className="font-mono text-xs uppercase tracking-wider text-amber-400 font-medium">
              Data Available for Only One Nation (Asymmetric Coverage)
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {hasOnlyA ? (
              <div className="border border-trinetra-border bg-trinetra-panel/30 p-5 rounded">
                <p className="eyebrow mb-3 text-amber-300">{entityAName} · {onlyALabel || "VERIFIED RECORDS"}</p>
                {onlyAContent}
              </div>
            ) : (
              <div className="border border-trinetra-border/50 p-5 rounded opacity-75">
                <p className="eyebrow mb-3 text-neutral-500">{entityAName}</p>
                <Empty>No verified data records on file for this specific category.</Empty>
              </div>
            )}
            {hasOnlyB ? (
              <div className="border border-trinetra-border bg-trinetra-panel/30 p-5 rounded">
                <p className="eyebrow mb-3 text-amber-300">{entityBName} · {onlyBLabel || "VERIFIED RECORDS"}</p>
                {onlyBContent}
              </div>
            ) : (
              <div className="border border-trinetra-border/50 p-5 rounded opacity-75">
                <p className="eyebrow mb-3 text-neutral-500">{entityBName}</p>
                <Empty>No verified data records on file for this specific category.</Empty>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. MISSING OR UNAVAILABLE INTELLIGENCE */}
      {hasMissing && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block h-2 w-2 rounded-full bg-neutral-600"></span>
            <p className="font-mono text-xs uppercase tracking-wider text-neutral-500 font-medium">
              Missing or Unavailable Intelligence
            </p>
          </div>
          <Empty>{missingContent}</Empty>
        </div>
      )}
    </div>
  );
}

export default function AnalysisResults({ analysis }: Props) {
  const [tab, setTab] = useState("Overview");
  const [open, setOpen] = useState<string | null>(null);
  const a = analysis.country_a;
  const b = analysis.country_b;
  const profileA = analysis.country_a_profile;
  const profileB = analysis.country_b_profile;
  const modulesA = analysis.country_a_modules || {};
  const modulesB = analysis.country_b_modules || {};
  const entityA = analysis.country_a_entity;
  const entityB = analysis.country_b_entity;
  const relationship = analysis.source_relationship;

  const sourceMeta = (profile: typeof profileA) => profile?._meta?.source || "Country profile dataset";
  const metric = (value: unknown, source: string, year?: unknown) => ({
    value,
    source,
    year: year || profileA?._meta?.last_updated?.slice(0, 4) || "2025",
  });

  const tabs = [
    "Overview",
    "Country Profile",
    "Political System",
    "Economy",
    "Military",
    "Geopolitical Position",
    "Diplomatic Relations",
    "Strategic History",
    "Technology",
    "Regional & Global Influence",
    "Energy",
    "Geography & Maritime",
    "Trade & Dependencies",
    "Chokepoints",
    "Strategic Assets",
  ];

  const metrics = [
    [
      "Population",
      metric(profileA?.demographics?.population_millions ? `${profileA.demographics.population_millions}M` : null, sourceMeta(profileA), "2024"),
      metric(profileB?.demographics?.population_millions ? `${profileB.demographics.population_millions}M` : null, sourceMeta(profileB), "2024"),
    ],
    [
      "GDP",
      metric(profileA?.economy?.gdp_usd_trillion ? `$${profileA.economy.gdp_usd_trillion}T` : null, sourceMeta(profileA), "2025"),
      metric(profileB?.economy?.gdp_usd_trillion ? `$${profileB.economy.gdp_usd_trillion}T` : null, sourceMeta(profileB), "2025"),
    ],
    [
      "GDP growth",
      metric(profileA?.economy?.gdp_growth_pct != null ? `${profileA.economy.gdp_growth_pct}%` : null, sourceMeta(profileA), "2025"),
      metric(profileB?.economy?.gdp_growth_pct != null ? `${profileB.economy.gdp_growth_pct}%` : null, sourceMeta(profileB), "2025"),
    ],
    [
      "Defence expenditure",
      metric(profileA?.military?.defence_spending_usd_billion ? `$${profileA.military.defence_spending_usd_billion}B` : null, profileA?.military?.defence_spending_pct_gdp_source || sourceMeta(profileA), "2024"),
      metric(profileB?.military?.defence_spending_usd_billion ? `$${profileB.military.defence_spending_usd_billion}B` : null, profileB?.military?.defence_spending_pct_gdp_source || sourceMeta(profileB), "2024"),
    ],
    [
      "Active personnel",
      metric(profileA?.military?.active_troops?.toLocaleString(), sourceMeta(profileA), "2025"),
      metric(profileB?.military?.active_troops?.toLocaleString(), sourceMeta(profileB), "2025"),
    ],
    [
      "Nuclear status",
      metric(profileA?.nuclear?.weapons_state ? "Weapons state" : "Non-weapons", sourceMeta(profileA), "2026"),
      metric(profileB?.nuclear?.weapons_state ? "Weapons state" : "Non-weapons", sourceMeta(profileB), "2026"),
    ],
  ];

  const chokepoints = analysis.comparison_data?.chokepoints || analysis.chokepoints?.relevant_chokepoints || [];
  const pairModules = analysis.comparison_data?.pair_modules || [];
  const availability = analysis.comparison_data?.availability || {};

  // Political system data extraction
  const polA = modulesA.politics;
  const polB = modulesB.politics;
  const govNoteA = entityA?.governance_note;
  const govNoteB = entityB?.governance_note;
  const leaderA = entityA?.people_details?.[0] || polA?.current_government?.prime_minister;
  const leaderB = entityB?.people_details?.[0] || polB?.current_government?.prime_minister;

  // History events extraction
  const histA = modulesA.history?.events as any[] | undefined;
  const histB = modulesB.history?.events as any[] | undefined;

  // Foreign policy extraction
  const fpA = modulesA.foreign_policy;
  const fpB = modulesB.foreign_policy;

  const flagA = getCountryFlag(a.id);
  const flagB = getCountryFlag(b.id);

  return (
    <div className="overflow-hidden rounded border border-trinetra-border bg-trinetra-panel/20">
      {/* Header comparison section */}
      <div className="border-b border-trinetra-border p-5 md:p-8 bg-gradient-to-b from-trinetra-panel/40 to-transparent">
        {/* Intelligence Platform Subtitle Banner */}
        <div className="flex items-center justify-between border-b border-trinetra-border/60 pb-3 mb-6 font-mono text-[10px] tracking-[0.22em] text-neutral-500 uppercase">
          <span>REAL DATA · REAL CONTEXT · REAL INSIGHTS</span>
          <span className="text-trinetra-saffron font-semibold">GEOPOLITICAL INTELLIGENCE PLATFORM</span>
          <span>A MORE INFORMED TOMORROW</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          {/* Country A */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl" role="img" aria-label={a.name}>{flagA}</span>
              <span className="font-mono text-xs font-bold text-trinetra-saffron tracking-widest uppercase">{a.id}</span>
              <span className="text-[10px] font-mono text-neutral-500 uppercase">· {profileA?.region || profileA?.geography?.region || "Sovereign State"}</span>
            </div>
            <h2 className="font-display text-4xl text-neutral-100 tracking-wider uppercase mt-2">{a.name}</h2>
            <div className="w-14 h-0.5 bg-trinetra-saffron/80 my-2.5"></div>
            <p className="text-xs text-neutral-400 max-w-md line-clamp-2 leading-relaxed">
              {profileA?.strategic_priorities?.[0] || profileA?.strengths?.[0] || (profileA as any)?.description || `${a.name} national strategic profile and geopolitical doctrine.`}
            </p>
          </div>

          {/* VS Indicator & Status */}
          <div className="text-center flex flex-col items-center justify-center py-4 lg:py-0">
            <div className="font-serif italic text-3xl md:text-4xl text-trinetra-saffron tracking-widest">
              — VS —
            </div>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.24em] text-neutral-400">
              PEOPLE &nbsp;|&nbsp; POWER &nbsp;|&nbsp; PROSPECTS
            </div>
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 font-mono text-[9px] uppercase tracking-widest text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              BILATERAL ASSESSMENT ACTIVE
            </div>
          </div>

          {/* Country B */}
          <div className="flex flex-col lg:items-end lg:text-right">
            <div className="flex items-center gap-2.5 lg:flex-row-reverse">
              <span className="text-3xl" role="img" aria-label={b.name}>{flagB}</span>
              <span className="font-mono text-xs font-bold text-trinetra-saffron tracking-widest uppercase">{b.id}</span>
              <span className="text-[10px] font-mono text-neutral-500 uppercase">· {profileB?.region || profileB?.geography?.region || "Sovereign State"}</span>
            </div>
            <h2 className="font-display text-4xl text-neutral-100 tracking-wider uppercase mt-2">{b.name}</h2>
            <div className="w-14 h-0.5 bg-trinetra-saffron/80 my-2.5 lg:self-end"></div>
            <p className="text-xs text-neutral-400 max-w-md line-clamp-2 leading-relaxed">
              {profileB?.strategic_priorities?.[0] || profileB?.strengths?.[0] || (profileB as any)?.description || `${b.name} national strategic profile and geopolitical doctrine.`}
            </p>
          </div>
        </div>

        {/* 6 primary metric cards */}
        <div className="mt-8 grid grid-cols-2 gap-px border border-trinetra-border bg-trinetra-border md:grid-cols-3 xl:grid-cols-6">
          {metrics.map(([label, av, bv]) => (
            <div key={String(label)} className="bg-trinetra-bg px-4 py-4">
              <p className="data-meta">{String(label)}</p>
              <div className="mt-3 flex items-end justify-between gap-3">
                <Value metric={av as { value: unknown; source?: string; year?: unknown }} />
                <span className="text-xs text-trinetra-saffron font-bold">/</span>
                <Value metric={bv as { value: unknown; source?: string; year?: unknown }} />
              </div>
              <div className="mt-2 flex justify-between font-mono text-[10px] text-neutral-600">
                <span>{flagA} {a.id}</span>
                <span>{flagB} {b.id}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spatial 3D Comparison Visualizer */}
      <Comparison3D a={profileA} b={profileB} />

      {/* Category Navigation Bar */}
      <nav aria-label="Comparison categories" className="flex gap-1 overflow-x-auto border-b border-trinetra-border px-4 py-3">
        {tabs.map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`whitespace-nowrap px-3 py-2 text-xs transition-colors rounded ${
              tab === item
                ? "bg-trinetra-saffron/10 border-b-2 border-trinetra-saffron text-trinetra-saffron font-semibold"
                : "text-neutral-500 hover:text-neutral-200"
            }`}
          >
            {item}
          </button>
        ))}
      </nav>

      {/* Tab Panels */}
      <div className="px-5 md:px-7">
        {/* TAB: OVERVIEW */}
        {tab === "Overview" && (
          <>
            <Section title="Structural differences" note="Factual comparison only. No composite score or winner logic.">
              <DataSeparationBlock
                entityAName={a.name}
                entityBName={b.name}
                bothContent={
                  <div className="grid gap-7 md:grid-cols-2">
                    <div className="border border-trinetra-border bg-trinetra-panel/30 p-5 rounded">
                      <p className="eyebrow mb-3 text-trinetra-saffron">{a.name} · CORE STRENGTHS</p>
                      <BulletList items={profileA?.strengths} empty="No structural strengths recorded in dataset." />
                    </div>
                    <div className="border border-trinetra-border bg-trinetra-panel/30 p-5 rounded">
                      <p className="eyebrow mb-3 text-trinetra-saffron">{b.name} · CORE STRENGTHS</p>
                      <BulletList items={profileB?.strengths} empty="No structural strengths recorded in dataset." />
                    </div>
                  </div>
                }
                onlyAContent={profileA?.strategic_priorities?.length ? (
                  <BulletList items={profileA.strategic_priorities} empty="No strategic priorities recorded." />
                ) : undefined}
                onlyALabel="STRATEGIC PRIORITIES"
                onlyBContent={profileB?.strategic_priorities?.length ? (
                  <BulletList items={profileB.strategic_priorities} empty="No strategic priorities recorded." />
                ) : undefined}
                onlyBLabel="STRATEGIC PRIORITIES"
                missingContent="Composite warfighting indices and subjective tactical power scores are omitted by architectural policy."
              />
            </Section>

            <Section title="Strategic position" note={analysis.geopolitical?.note || "Position statements require source-backed context."}>
              <div className="grid gap-7 md:grid-cols-2">
                <div className="border border-trinetra-border p-5 rounded">
                  <p className="eyebrow mb-3">{a.id} · POSITION</p>
                  <p className="text-sm leading-7 text-neutral-300">
                    {analysis.deep_dive_analyses?.[0]?.assessment?.statement ||
                      (leaderA && typeof leaderA === "object" && leaderA.foreign_policy_position) ||
                      fpA?.doctrine ||
                      `${a.name} maintains a strategic posture anchored by its regional geography in ${profileA?.region || "its home region"}.`}
                  </p>
                </div>
                <div className="border border-trinetra-border p-5 rounded">
                  <p className="eyebrow mb-3">{b.id} · POSITION</p>
                  <p className="text-sm leading-7 text-neutral-300">
                    {analysis.deep_dive_analyses?.[1]?.assessment?.statement ||
                      (leaderB && typeof leaderB === "object" && leaderB.foreign_policy_position) ||
                      fpB?.doctrine ||
                      `${b.name} maintains an active posture in ${profileB?.region || "its home region"} with strategic reach.`}
                  </p>
                </div>
              </div>
            </Section>

            <Section title="Leverage and constraints">
              <div className="grid gap-7 md:grid-cols-2">
                <div className="border border-trinetra-border p-5 rounded">
                  <p className="eyebrow mb-3 text-trinetra-saffron">{a.name} · VULNERABILITIES & LIMITS</p>
                  <BulletList items={profileA?.vulnerabilities} empty="No specific vulnerabilities listed." />
                </div>
                <div className="border border-trinetra-border p-5 rounded">
                  <p className="eyebrow mb-3 text-trinetra-saffron">{b.name} · VULNERABILITIES & LIMITS</p>
                  <BulletList items={profileB?.vulnerabilities} empty="No specific vulnerabilities listed." />
                </div>
              </div>
            </Section>

            <Section title="External actor assessment" note="Third-party alignment assessments. Not deterministic predictions.">
              <BulletList
                items={analysis.geopolitical?.external_actors?.map((actor) => `${actor.country} · ${actor.role}: ${actor.reason}`)}
                empty={availability.external_actor_records ? "No third-party assessment records available for this pair." : "External actor dataset not available for this pair."}
              />
            </Section>

            <Section title="Trinetra assessment" note="Factual synthesis derived from verified repository records.">
              <div className="border-l-2 border-trinetra-saffron bg-black/20 p-5 rounded-r text-sm leading-7 text-neutral-300">
                {analysis.ai_summary || "The current evidence set provides direct comparative metrics across economic scale, defence allocation, and geographic posture. No synthetic winner or predictive outcome is fabricated."}
              </div>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-neutral-600">
                Factual Assessment · Sourced datasets · No winner assigned
              </p>
            </Section>
          </>
        )}

        {/* TAB: COUNTRY PROFILE */}
        {tab === "Country Profile" && (
          <Section title="National sovereign profiles" note="Official designation, administrative capital, constitutional form, territorial scale, and demographics.">
            <DataSeparationBlock
              entityAName={a.name}
              entityBName={b.name}
              bothContent={
                <div className="grid gap-7 md:grid-cols-2">
                  <div className="border border-trinetra-border bg-trinetra-panel/30 p-5 rounded space-y-3">
                    <p className="eyebrow text-trinetra-saffron">{flagA} {a.name} · SOVEREIGN SPECIFICATIONS</p>
                    <div className="space-y-2.5 text-sm text-neutral-300">
                      <p><span className="text-neutral-500">Official Name: </span>{(profileA as any)?.official_name || profileA?.name || a.name}</p>
                      <p><span className="text-neutral-500">Common Name: </span>{a.name}</p>
                      <p><span className="text-neutral-500">ISO Code: </span><span className="font-mono text-trinetra-saffron font-semibold">{a.id}</span></p>
                      <p><span className="text-neutral-500">Geographic Region: </span>{profileA?.geography?.region || profileA?.region || "DATA NOT AVAILABLE"}</p>
                      <p><span className="text-neutral-500">Capital City: </span>{profileA?.geography?.capital || (profileA as any)?.capital || entityA?.capital || "DATA NOT AVAILABLE"}</p>
                      <p><span className="text-neutral-500">Government Type: </span>{profileA?.politics?.system || polA?.political_system?.type || entityA?.governance_type || "DATA NOT AVAILABLE"}</p>
                      <p><span className="text-neutral-500">Population: </span>{profileA?.demographics?.population_millions ? `${profileA.demographics.population_millions} Million` : "DATA NOT AVAILABLE"}</p>
                      <p><span className="text-neutral-500">Territorial Area: </span>{profileA?.geography?.area_sq_km ? `${profileA.geography.area_sq_km.toLocaleString()} km²` : "DATA NOT AVAILABLE"}</p>
                      <div className="pt-2 border-t border-trinetra-border/60">
                        <p className="text-xs text-neutral-400 leading-relaxed">
                          {(profileA as any)?.description || entityA?.description || `${a.name} sovereign nation profile maintained in the Trinetra geopolitical registry.`}
                        </p>
                      </div>
                      <p className="font-mono text-[10px] text-neutral-500 pt-1">
                        {profileA?._meta?.last_updated ? `DATA DATE: ${profileA._meta.last_updated}` : "DATA DATE: 2025"}
                      </p>
                    </div>
                  </div>
                  <div className="border border-trinetra-border bg-trinetra-panel/30 p-5 rounded space-y-3">
                    <p className="eyebrow text-trinetra-saffron">{flagB} {b.name} · SOVEREIGN SPECIFICATIONS</p>
                    <div className="space-y-2.5 text-sm text-neutral-300">
                      <p><span className="text-neutral-500">Official Name: </span>{(profileB as any)?.official_name || profileB?.name || b.name}</p>
                      <p><span className="text-neutral-500">Common Name: </span>{b.name}</p>
                      <p><span className="text-neutral-500">ISO Code: </span><span className="font-mono text-trinetra-saffron font-semibold">{b.id}</span></p>
                      <p><span className="text-neutral-500">Geographic Region: </span>{profileB?.geography?.region || profileB?.region || "DATA NOT AVAILABLE"}</p>
                      <p><span className="text-neutral-500">Capital City: </span>{profileB?.geography?.capital || (profileB as any)?.capital || entityB?.capital || "DATA NOT AVAILABLE"}</p>
                      <p><span className="text-neutral-500">Government Type: </span>{profileB?.politics?.system || polB?.political_system?.type || entityB?.governance_type || "DATA NOT AVAILABLE"}</p>
                      <p><span className="text-neutral-500">Population: </span>{profileB?.demographics?.population_millions ? `${profileB.demographics.population_millions} Million` : "DATA NOT AVAILABLE"}</p>
                      <p><span className="text-neutral-500">Territorial Area: </span>{profileB?.geography?.area_sq_km ? `${profileB.geography.area_sq_km.toLocaleString()} km²` : "DATA NOT AVAILABLE"}</p>
                      <div className="pt-2 border-t border-trinetra-border/60">
                        <p className="text-xs text-neutral-400 leading-relaxed">
                          {(profileB as any)?.description || entityB?.description || `${b.name} sovereign nation profile maintained in the Trinetra geopolitical registry.`}
                        </p>
                      </div>
                      <p className="font-mono text-[10px] text-neutral-500 pt-1">
                        {profileB?._meta?.last_updated ? `DATA DATE: ${profileB._meta.last_updated}` : "DATA DATE: 2025"}
                      </p>
                    </div>
                  </div>
                </div>
              }
              missingContent="Subnational administrative boundary registrations and provincial census granularities are omitted."
            />
          </Section>
        )}

        {/* TAB: POLITICAL SYSTEM */}
        {tab === "Political System" && (
          <Section title="Political system and governance" note="Constitutional structure, executive authority, legislative framework, and institutional dynamics.">
            <DataSeparationBlock
              entityAName={a.name}
              entityBName={b.name}
              bothContent={
                <div className="grid gap-7 md:grid-cols-2">
                  <div className="border border-trinetra-border bg-trinetra-panel/30 p-5 rounded space-y-3">
                    <p className="eyebrow text-trinetra-saffron">{a.name} · GOVERNANCE ARCHITECTURE</p>
                    {polA ? (
                      <div className="space-y-2 text-sm text-neutral-300">
                        <p><span className="text-neutral-500">System Type: </span>{polA.political_system?.type}</p>
                        <p><span className="text-neutral-500">Executive: </span>{polA.political_system?.executive}</p>
                        <p><span className="text-neutral-500">Legislature: </span>{polA.political_system?.legislature}</p>
                        <p><span className="text-neutral-500">Judiciary: </span>{polA.political_system?.judiciary}</p>
                      </div>
                    ) : govNoteA ? (
                      <p className="text-sm text-neutral-300 leading-relaxed">{govNoteA}</p>
                    ) : (
                      <Empty>Political system structure not populated for {a.name}.</Empty>
                    )}
                  </div>
                  <div className="border border-trinetra-border bg-trinetra-panel/30 p-5 rounded space-y-3">
                    <p className="eyebrow text-trinetra-saffron">{b.name} · GOVERNANCE ARCHITECTURE</p>
                    {polB ? (
                      <div className="space-y-2 text-sm text-neutral-300">
                        <p><span className="text-neutral-500">System Type: </span>{polB.political_system?.type}</p>
                        <p><span className="text-neutral-500">Executive: </span>{polB.political_system?.executive}</p>
                        <p><span className="text-neutral-500">Legislature: </span>{polB.political_system?.legislature}</p>
                        <p><span className="text-neutral-500">Judiciary: </span>{polB.political_system?.judiciary}</p>
                      </div>
                    ) : govNoteB ? (
                      <p className="text-sm text-neutral-300 leading-relaxed">{govNoteB}</p>
                    ) : (
                      <Empty>Political system structure not populated for {b.name}.</Empty>
                    )}
                  </div>
                </div>
              }
              onlyAContent={
                polA?.current_government || polA?.major_parties?.length || entityA?.people_details?.length ? (
                  <div className="space-y-3 text-sm">
                    {polA?.current_government && (
                      <div className="space-y-1 text-neutral-300">
                        <p><span className="text-neutral-500">Ruling Coalition: </span>{polA.current_government.ruling_coalition}</p>
                        <p><span className="text-neutral-500">Prime Minister: </span>{polA.current_government.prime_minister}</p>
                        <p><span className="text-neutral-500">Opposition: </span>{polA.current_government.main_opposition}</p>
                        <p className="text-xs text-neutral-500 mt-2">{polA.current_government.context}</p>
                      </div>
                    )}
                    {entityA?.people_details?.map((p: any) => (
                      <div key={p.id} className="border-t border-trinetra-border/60 pt-2 mt-2">
                        <p className="font-semibold text-neutral-200">{p.name} ({p.position})</p>
                        <p className="text-xs text-neutral-400 mt-1">{p.foreign_policy_position || p.current_status}</p>
                      </div>
                    ))}
                    {polA?.major_parties && (
                      <div className="border-t border-trinetra-border/60 pt-2 mt-2">
                        <p className="text-xs uppercase text-neutral-500 mb-1.5">Key Parties</p>
                        {polA.major_parties.slice(0, 4).map((party: any) => (
                          <div key={party.name} className="text-xs mb-1">
                            <span className="text-neutral-200 font-medium">{party.name}: </span>
                            <span className="text-neutral-500">{party.ideology}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : undefined
              }
              onlyALabel="CURRENT GOVERNMENT & PARTIES"
              onlyBContent={
                polB?.current_government || polB?.major_parties?.length || entityB?.people_details?.length ? (
                  <div className="space-y-3 text-sm">
                    {polB?.current_government && (
                      <div className="space-y-1 text-neutral-300">
                        <p><span className="text-neutral-500">Ruling Coalition: </span>{polB.current_government.ruling_coalition}</p>
                        <p><span className="text-neutral-500">Prime Minister: </span>{polB.current_government.prime_minister}</p>
                        <p><span className="text-neutral-500">Opposition: </span>{polB.current_government.main_opposition}</p>
                      </div>
                    )}
                    {entityB?.people_details?.map((p: any) => (
                      <div key={p.id} className="border-t border-trinetra-border/60 pt-2 mt-2">
                        <p className="font-semibold text-neutral-200">{p.name} ({p.position})</p>
                        <p className="text-xs text-neutral-400 mt-1">{p.foreign_policy_position || p.current_status}</p>
                      </div>
                    ))}
                  </div>
                ) : undefined
              }
              onlyBLabel="CURRENT GOVERNMENT & PARTIES"
              missingContent="Subnational legislative divisions, state/provincial election histories, and municipal governing bodies are not currently indexed in this dataset."
            />
          </Section>
        )}

        {/* TAB: STRATEGIC HISTORY & TIMELINE */}
        {(tab === "Strategic History" || tab === "Timeline") && (
          <Section title="Strategic history and chronological milestones" note="Foundational conflicts, constitutional moments, economic shifts, and boundary agreements.">
            <DataSeparationBlock
              entityAName={a.name}
              entityBName={b.name}
              bothContent={
                relationship?.history || relationship?.major_disputes ? (
                  <div className="border border-trinetra-border bg-trinetra-panel/30 p-5 rounded space-y-4">
                    <p className="eyebrow text-trinetra-saffron">SHARED BILATERAL HISTORY & DISPUTES</p>
                    {relationship.history && (
                      <p className="text-sm text-neutral-300 leading-relaxed">{relationship.history}</p>
                    )}
                    {relationship.major_disputes && (
                      <div>
                        <p className="text-xs uppercase tracking-wider text-neutral-400 mb-2">Major Historical & Ongoing Disputes</p>
                        <BulletList items={relationship.major_disputes} empty="No major disputes recorded." />
                      </div>
                    )}
                  </div>
                ) : undefined
              }
              onlyAContent={
                histA?.length ? (
                  <div className="space-y-4">
                    {histA.slice(0, 8).map((evt: any) => (
                      <div key={`${evt.year}-${evt.title}`} className="border-l-2 border-trinetra-saffron/80 pl-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-trinetra-saffron font-bold">{evt.year}</span>
                          <span className="text-sm text-neutral-100 font-semibold">{evt.title}</span>
                        </div>
                        <p className="text-xs text-neutral-300 mt-1">{evt.what_happened}</p>
                        {evt.consequences && <p className="text-[11px] text-neutral-500 mt-0.5">Consequences: {evt.consequences}</p>}
                      </div>
                    ))}
                  </div>
                ) : undefined
              }
              onlyALabel="NATIONAL CHRONOLOGY (SOURCED)"
              onlyBContent={
                histB?.length ? (
                  <div className="space-y-4">
                    {histB.slice(0, 8).map((evt: any) => (
                      <div key={`${evt.year}-${evt.title}`} className="border-l-2 border-trinetra-saffron/80 pl-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-trinetra-saffron font-bold">{evt.year}</span>
                          <span className="text-sm text-neutral-100 font-semibold">{evt.title}</span>
                        </div>
                        <p className="text-xs text-neutral-300 mt-1">{evt.what_happened}</p>
                        {evt.consequences && <p className="text-[11px] text-neutral-500 mt-0.5">Consequences: {evt.consequences}</p>}
                      </div>
                    ))}
                  </div>
                ) : undefined
              }
              onlyBLabel="NATIONAL CHRONOLOGY (SOURCED)"
              missingContent={`Historical chronological event registries are active where verified event files exist. States without an explicit history module (e.g. ${!histA ? a.name : ""}${!histA && !histB ? ", " : ""}${!histB ? b.name : ""}) reflect unpopulated historical timelines pending research.`}
            />
          </Section>
        )}

        {/* TAB: STRATEGIC / GEOPOLITICAL POSITION */}
        {(tab === "Strategic Position" || tab === "Geopolitical Position") && (
          <Section title="Current strategic posture and priorities" note="Active doctrines, regional orientation, and strategic priorities.">
            <DataSeparationBlock
              entityAName={a.name}
              entityBName={b.name}
              bothContent={
                <div className="grid gap-7 md:grid-cols-2">
                  <div className="border border-trinetra-border bg-trinetra-panel/30 p-5 rounded space-y-3">
                    <p className="eyebrow text-trinetra-saffron">{a.name} · STRATEGIC PRIORITIES</p>
                    <BulletList items={profileA?.strategic_priorities} empty="No strategic priorities recorded." />
                  </div>
                  <div className="border border-trinetra-border bg-trinetra-panel/30 p-5 rounded space-y-3">
                    <p className="eyebrow text-trinetra-saffron">{b.name} · STRATEGIC PRIORITIES</p>
                    <BulletList items={profileB?.strategic_priorities} empty="No strategic priorities recorded." />
                  </div>
                </div>
              }
              onlyAContent={fpA?.doctrine ? <p className="text-sm text-neutral-300 leading-relaxed">{fpA.doctrine}</p> : undefined}
              onlyALabel="FOREIGN POLICY DOCTRINE"
              onlyBContent={fpB?.doctrine ? <p className="text-sm text-neutral-300 leading-relaxed">{fpB.doctrine}</p> : undefined}
              onlyBLabel="FOREIGN POLICY DOCTRINE"
              missingContent="Unilateral military operational readiness checklists and forward defense positioning plans are classified and absent from public records."
            />
          </Section>
        )}

        {/* TAB: ECONOMY */}
        {(tab === "Economy" || tab === "Economic Profile") && (
          <Section title="Economic comparison" note="Macroeconomic scale, growth trajectory, industrial base, and structural economic risks.">
            <DataSeparationBlock
              entityAName={a.name}
              entityBName={b.name}
              bothContent={
                <div className="grid gap-7 md:grid-cols-2">
                  <div className="border border-trinetra-border bg-trinetra-panel/30 p-5 rounded space-y-3">
                    <p className="eyebrow text-trinetra-saffron">{a.name} · MACROECONOMIC METRICS</p>
                    <div className="space-y-2 text-sm text-neutral-300">
                      <p><span className="text-neutral-500">Nominal GDP: </span>{profileA?.economy?.gdp_usd_trillion ? `$${profileA.economy.gdp_usd_trillion} Trillion` : "DATA NOT AVAILABLE"}</p>
                      <p><span className="text-neutral-500">Annual Growth Rate: </span>{profileA?.economy?.gdp_growth_pct != null ? `${profileA.economy.gdp_growth_pct}%` : "DATA NOT AVAILABLE"}</p>
                      <p><span className="text-neutral-500">Population: </span>{profileA?.demographics?.population_millions ? `${profileA.demographics.population_millions} Million` : "DATA NOT AVAILABLE"}</p>
                      {profileA?.demographics?.population_millions && profileA?.economy?.gdp_usd_trillion && (
                        <p><span className="text-neutral-500">Estimated GDP per Capita: </span>${Math.round((profileA.economy.gdp_usd_trillion * 1e12) / (profileA.demographics.population_millions * 1e6)).toLocaleString()}</p>
                      )}
                      {profileA?.economy?.notes && <p className="text-xs text-neutral-500 mt-2">{profileA.economy.notes}</p>}
                    </div>
                  </div>
                  <div className="border border-trinetra-border bg-trinetra-panel/30 p-5 rounded space-y-3">
                    <p className="eyebrow text-trinetra-saffron">{b.name} · MACROECONOMIC METRICS</p>
                    <div className="space-y-2 text-sm text-neutral-300">
                      <p><span className="text-neutral-500">Nominal GDP: </span>{profileB?.economy?.gdp_usd_trillion ? `$${profileB.economy.gdp_usd_trillion} Trillion` : "DATA NOT AVAILABLE"}</p>
                      <p><span className="text-neutral-500">Annual Growth Rate: </span>{profileB?.economy?.gdp_growth_pct != null ? `${profileB.economy.gdp_growth_pct}%` : "DATA NOT AVAILABLE"}</p>
                      <p><span className="text-neutral-500">Population: </span>{profileB?.demographics?.population_millions ? `${profileB.demographics.population_millions} Million` : "DATA NOT AVAILABLE"}</p>
                      {profileB?.demographics?.population_millions && profileB?.economy?.gdp_usd_trillion && (
                        <p><span className="text-neutral-500">Estimated GDP per Capita: </span>${Math.round((profileB.economy.gdp_usd_trillion * 1e12) / (profileB.demographics.population_millions * 1e6)).toLocaleString()}</p>
                      )}
                      {profileB?.economy?.notes && <p className="text-xs text-neutral-500 mt-2">{profileB.economy.notes}</p>}
                    </div>
                  </div>
                </div>
              }
              onlyAContent={relationship?.trade_dependencies?.length ? (
                <div>
                  <p className="text-xs text-neutral-400 mb-2">Bilateral trade dependencies recorded for {a.name}:</p>
                  <BulletList items={relationship.trade_dependencies} empty="No specific trade dependencies recorded." />
                </div>
              ) : undefined}
              onlyALabel="BILATERAL TRADE EXPOSURE"
              missingContent="Sub-sectoral tariff schedules, capital flight statistics, and informal economy valuation metrics are not maintained in the current dataset."
            />
          </Section>
        )}

        {/* TAB: MILITARY / DEFENCE & SECURITY */}
        {(tab === "Military" || tab === "Defence & Security" || tab === "Defence and Security") && (
          <Section title="Military and defence capabilities" note="Active troop strength, defence expenditures, nuclear weapons capability, and arms transfer records.">
            <DataSeparationBlock
              entityAName={a.name}
              entityBName={b.name}
              bothContent={
                <div className="grid gap-7 md:grid-cols-2">
                  <div className="border border-trinetra-border bg-trinetra-panel/30 p-5 rounded space-y-3">
                    <p className="eyebrow text-trinetra-saffron">{a.name} · DEFENCE METRICS</p>
                    <div className="space-y-2 text-sm text-neutral-300">
                      <p><span className="text-neutral-500">Active Military Personnel: </span>{profileA?.military?.active_troops?.toLocaleString() || "DATA NOT AVAILABLE"}</p>
                      <p><span className="text-neutral-500">Defence Budget: </span>{profileA?.military?.defence_spending_usd_billion ? `$${profileA.military.defence_spending_usd_billion} Billion` : "DATA NOT AVAILABLE"}</p>
                      <p><span className="text-neutral-500">Defence as % of GDP: </span>{profileA?.military?.defence_spending_pct_gdp ? `${profileA.military.defence_spending_pct_gdp}%` : "DATA NOT AVAILABLE"}</p>
                      <p><span className="text-neutral-500">Nuclear Weapons State: </span>{profileA?.nuclear?.weapons_state ? "Yes (Declared nuclear power)" : "No"}</p>
                      {profileA?.military?.arms_exports_usd && (
                        <p><span className="text-neutral-500">Arms Exports: </span>${(profileA.military.arms_exports_usd / 1e6).toFixed(0)}M (World Bank WDI)</p>
                      )}
                    </div>
                  </div>
                  <div className="border border-trinetra-border bg-trinetra-panel/30 p-5 rounded space-y-3">
                    <p className="eyebrow text-trinetra-saffron">{b.name} · DEFENCE METRICS</p>
                    <div className="space-y-2 text-sm text-neutral-300">
                      <p><span className="text-neutral-500">Active Military Personnel: </span>{profileB?.military?.active_troops?.toLocaleString() || "DATA NOT AVAILABLE"}</p>
                      <p><span className="text-neutral-500">Defence Budget: </span>{profileB?.military?.defence_spending_usd_billion ? `$${profileB.military.defence_spending_usd_billion} Billion` : "DATA NOT AVAILABLE"}</p>
                      <p><span className="text-neutral-500">Defence as % of GDP: </span>{profileB?.military?.defence_spending_pct_gdp ? `${profileB.military.defence_spending_pct_gdp}%` : "DATA NOT AVAILABLE"}</p>
                      <p><span className="text-neutral-500">Nuclear Weapons State: </span>{profileB?.nuclear?.weapons_state ? "Yes (Declared nuclear power)" : "No"}</p>
                      {profileB?.military?.arms_exports_usd && (
                        <p><span className="text-neutral-500">Arms Exports: </span>${(profileB.military.arms_exports_usd / 1e6).toFixed(0)}M (World Bank WDI)</p>
                      )}
                    </div>
                  </div>
                </div>
              }
              onlyAContent={
                analysis.deep_dive_analyses?.length ? (
                  <div>
                    <p className="text-xs text-neutral-400 mb-2">Tactical analyses on record:</p>
                    <BulletList
                      items={analysis.deep_dive_analyses.map((d) => `${d.subject}: ${d.assessment?.statement || d.confidence_reason}`)}
                      empty="No tactical deep dives on file."
                    />
                  </div>
                ) : undefined
              }
              onlyALabel="DEEP DIVE DEPLOYMENTS"
              missingContent="Exact warhead inventories, ballistic missile submarine patrol frequencies, and cyber warfare operational orders are classified state secrets and are omitted."
            />
          </Section>
        )}

        {/* TAB: DIPLOMATIC & GEOPOLITICAL / RELATIONSHIPS */}
        {(tab === "Diplomatic & Geopolitical" || tab === "Diplomatic Relations" || tab === "Relationships") && (
          <Section title="Diplomatic posture and geopolitical relationships" note="Bilateral status, dispute escalation factors, multilateral memberships, and alliances.">
            <DataSeparationBlock
              entityAName={a.name}
              entityBName={b.name}
              bothContent={
                <div className="space-y-6">
                  {relationship && (
                    <div className="border border-trinetra-border bg-trinetra-panel/30 p-5 rounded space-y-4">
                      <p className="eyebrow text-trinetra-saffron">BILATERAL INTERFACE</p>
                      <div className="grid gap-6 md:grid-cols-2">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-neutral-400 mb-2">Cooperation Mechanisms</p>
                          <BulletList items={relationship.cooperation_areas} empty="No institutionalized cooperation areas listed." />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider text-neutral-400 mb-2">Escalation Factors</p>
                          <BulletList items={relationship.escalation_factors} empty="No escalation factors listed." />
                        </div>
                      </div>
                      {relationship.deescalation_factors && (
                        <div className="border-t border-trinetra-border/60 pt-3">
                          <p className="text-xs uppercase tracking-wider text-neutral-400 mb-2">De-escalation Channels</p>
                          <BulletList items={relationship.deescalation_factors} empty="No formal de-escalation channels listed." />
                        </div>
                      )}
                    </div>
                  )}
                  <div className="grid gap-7 md:grid-cols-2">
                    <div className="border border-trinetra-border p-5 rounded space-y-3">
                      <p className="eyebrow text-trinetra-saffron">{a.name} · ALIGNMENTS & RIVALS</p>
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Declared Alliances / Partners</p>
                        <BulletList items={profileA?.alliances} empty="No formal alliances listed." />
                      </div>
                      <div className="pt-2">
                        <p className="text-xs text-neutral-500 mb-1">Key Strategic Rivals</p>
                        <BulletList items={profileA?.rivals} empty="No formal rivals listed." />
                      </div>
                    </div>
                    <div className="border border-trinetra-border p-5 rounded space-y-3">
                      <p className="eyebrow text-trinetra-saffron">{b.name} · ALIGNMENTS & RIVALS</p>
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Declared Alliances / Partners</p>
                        <BulletList items={profileB?.alliances} empty="No formal alliances listed." />
                      </div>
                      <div className="pt-2">
                        <p className="text-xs text-neutral-500 mb-1">Key Strategic Rivals</p>
                        <BulletList items={profileB?.rivals} empty="No formal rivals listed." />
                      </div>
                    </div>
                  </div>
                </div>
              }
              onlyAContent={
                entityA?.key_organisations_member_of?.length ? (
                  <BulletList
                    items={entityA.key_organisations_member_of.map((o: string) => o.replace("ORG_", ""))}
                    empty="No multilateral organisations registered."
                  />
                ) : undefined
              }
              onlyALabel="MULTILATERAL GROUPINGS"
              onlyBContent={
                entityB?.key_organisations_member_of?.length ? (
                  <BulletList
                    items={entityB.key_organisations_member_of.map((o: string) => o.replace("ORG_", ""))}
                    empty="No multilateral organisations registered."
                  />
                ) : undefined
              }
              onlyBLabel="MULTILATERAL GROUPINGS"
              missingContent="Backchannel intelligence exchanges and confidential diplomatic demarches are not tracked in public datasets."
            />
          </Section>
        )}

        {/* TAB: ENERGY */}
        {(tab === "Energy" || tab === "Energy Footprint") && (
          <Section title="Energy independence and vulnerabilities" note="Import reliance, fuel sources, transit chokepoints, and domestic production capabilities.">
            <DataSeparationBlock
              entityAName={a.name}
              entityBName={b.name}
              bothContent={
                <div className="grid gap-7 md:grid-cols-2">
                  <div className="border border-trinetra-border bg-trinetra-panel/30 p-5 rounded space-y-3">
                    <p className="eyebrow text-trinetra-saffron">{a.name} · ENERGY FOOTPRINT</p>
                    <div className="space-y-2 text-sm text-neutral-300">
                      <p>
                        <span className="text-neutral-500">Net Import Dependence Ratio: </span>
                        {profileA?.energy?.net_import_dependence_ratio != null
                          ? `${(profileA.energy.net_import_dependence_ratio * 100).toFixed(0)}%`
                          : "DATA NOT AVAILABLE"}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {profileA?.energy?.net_import_dependence_ratio != null && profileA.energy.net_import_dependence_ratio > 0
                          ? "Net energy importer dependent on maritime or pipeline supply corridors."
                          : "Net energy producer or exporter."}
                      </p>
                      {profileA?.energy?.note && <p className="text-xs text-neutral-500">{profileA.energy.note}</p>}
                    </div>
                  </div>
                  <div className="border border-trinetra-border bg-trinetra-panel/30 p-5 rounded space-y-3">
                    <p className="eyebrow text-trinetra-saffron">{b.name} · ENERGY FOOTPRINT</p>
                    <div className="space-y-2 text-sm text-neutral-300">
                      <p>
                        <span className="text-neutral-500">Net Import Dependence Ratio: </span>
                        {profileB?.energy?.net_import_dependence_ratio != null
                          ? `${(profileB.energy.net_import_dependence_ratio * 100).toFixed(0)}%`
                          : "DATA NOT AVAILABLE"}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {profileB?.energy?.net_import_dependence_ratio != null && profileB.energy.net_import_dependence_ratio > 0
                          ? "Net energy importer dependent on maritime or pipeline supply corridors."
                          : "Net energy producer or exporter."}
                      </p>
                      {profileB?.energy?.note && <p className="text-xs text-neutral-500">{profileB.energy.note}</p>}
                    </div>
                  </div>
                </div>
              }
              missingContent="Real-time strategic petroleum reserve draw capacities and private commercial LNG contract durations are not available in public indices."
            />
          </Section>
        )}

        {/* TAB: GEOGRAPHY & MARITIME */}
        {(tab === "Geography & Maritime" || tab === "Geography" || tab === "Maritime") && (
          <Section title="Geographic posture and maritime domains" note="Terrain constraints, maritime access corridors, altitude considerations, and coastline protection.">
            <DataSeparationBlock
              entityAName={a.name}
              entityBName={b.name}
              bothContent={
                <div className="grid gap-7 md:grid-cols-2">
                  <div className="border border-trinetra-border bg-trinetra-panel/30 p-5 rounded space-y-3">
                    <p className="eyebrow text-trinetra-saffron">{a.name} · GEOGRAPHIC PROFILE</p>
                    <div className="space-y-2 text-sm text-neutral-300">
                      <p><span className="text-neutral-500">Region: </span>{profileA?.geography?.region || profileA?.region || "DATA NOT AVAILABLE"}</p>
                      <BulletList items={profileA?.vulnerabilities?.filter((v) => v.toLowerCase().includes("terrain") || v.toLowerCase().includes("himalayan") || v.toLowerCase().includes("malacca") || v.toLowerCase().includes("altitude"))} empty="No geographic vulnerabilities flagged." />
                    </div>
                  </div>
                  <div className="border border-trinetra-border bg-trinetra-panel/30 p-5 rounded space-y-3">
                    <p className="eyebrow text-trinetra-saffron">{b.name} · GEOGRAPHIC PROFILE</p>
                    <div className="space-y-2 text-sm text-neutral-300">
                      <p><span className="text-neutral-500">Region: </span>{profileB?.geography?.region || profileB?.region || "DATA NOT AVAILABLE"}</p>
                      <BulletList items={profileB?.vulnerabilities?.filter((v) => v.toLowerCase().includes("terrain") || v.toLowerCase().includes("himalayan") || v.toLowerCase().includes("malacca") || v.toLowerCase().includes("altitude"))} empty="No geographic vulnerabilities flagged." />
                    </div>
                  </div>
                </div>
              }
              onlyAContent={
                chokepoints.filter((cp) => cp.countries_most_exposed?.some((c: any) => (c.country || c) === a.id)).length ? (
                  <BulletList
                    items={chokepoints.filter((cp) => cp.countries_most_exposed?.some((c: any) => (c.country || c) === a.id)).map((cp) => `${cp.chokepoint}: ${cp.why_it_matters}`)}
                    empty="No critical maritime chokepoints."
                  />
                ) : undefined
              }
              onlyALabel="MARITIME CHOKEPOINT EXPOSURE"
              onlyBContent={
                chokepoints.filter((cp) => cp.countries_most_exposed?.some((c: any) => (c.country || c) === b.id)).length ? (
                  <BulletList
                    items={chokepoints.filter((cp) => cp.countries_most_exposed?.some((c: any) => (c.country || c) === b.id)).map((cp) => `${cp.chokepoint}: ${cp.why_it_matters}`)}
                    empty="No critical maritime chokepoints."
                  />
                ) : undefined
              }
              onlyBLabel="MARITIME CHOKEPOINT EXPOSURE"
              missingContent="Submarine underwater acoustic profile data and classified territorial sea surveillance sonobuoy grids are omitted."
            />
          </Section>
        )}

        {/* TAB: TECHNOLOGY */}
        {(tab === "Technology" || tab === "Technology & Infrastructure") && (
          <Section title="Technology, infrastructure and critical industries" note="Semiconductor supply chains, critical software dependencies, AI capabilities, and grid resilience.">
            <DataSeparationBlock
              entityAName={a.name}
              entityBName={b.name}
              bothContent={
                <div className="grid gap-7 md:grid-cols-2">
                  <div className="border border-trinetra-border bg-trinetra-panel/30 p-5 rounded space-y-3">
                    <p className="eyebrow text-trinetra-saffron">{a.name} · TECH ADVANTAGES & LIMITS</p>
                    <BulletList
                      items={profileA?.strengths?.filter((s) => s.toLowerCase().includes("tech") || s.toLowerCase().includes("manufacturing") || s.toLowerCase().includes("digital") || s.toLowerCase().includes("industrial"))}
                      empty="No technological strengths recorded in profile."
                    />
                  </div>
                  <div className="border border-trinetra-border bg-trinetra-panel/30 p-5 rounded space-y-3">
                    <p className="eyebrow text-trinetra-saffron">{b.name} · TECH ADVANTAGES & LIMITS</p>
                    <BulletList
                      items={profileB?.strengths?.filter((s) => s.toLowerCase().includes("tech") || s.toLowerCase().includes("manufacturing") || s.toLowerCase().includes("digital") || s.toLowerCase().includes("industrial"))}
                      empty="No technological strengths recorded in profile."
                    />
                  </div>
                </div>
              }
              missingContent="Lithography machine deployment counts, sovereign AI compute cluster FLOP metrics, and quantum encryption timelines are not currently standardized."
            />
          </Section>
        )}

        {/* TAB: REGIONAL & GLOBAL INFLUENCE */}
        {tab === "Regional & Global Influence" && (
          <Section title="Regional and global influence" note="Documented multilateral footprint, diplomatic reach, institutional presence, and regional initiatives.">
            <DataSeparationBlock
              entityAName={a.name}
              entityBName={b.name}
              bothContent={
                <div className="grid gap-7 md:grid-cols-2">
                  <div className="border border-trinetra-border bg-trinetra-panel/30 p-5 rounded space-y-4">
                    <p className="eyebrow text-trinetra-saffron">{flagA} {a.name} · REGIONAL & GLOBAL FOOTPRINT</p>
                    <div className="space-y-3 text-sm text-neutral-300">
                      <div>
                        <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Regional Strategic Posture</p>
                        <p className="leading-relaxed text-neutral-200">
                          {profileA?.region ? `Anchor state in ${profileA.region}. Direct security and economic influence across regional transit corridors.` : "DATA NOT AVAILABLE"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Multilateral Memberships</p>
                        {entityA?.key_organisations_member_of?.length ? (
                          <BulletList
                            items={entityA.key_organisations_member_of.map((o: string) => o.replace("ORG_", ""))}
                            empty="No multilateral organisations registered."
                          />
                        ) : (
                          <p className="text-xs text-neutral-400">Standard UN member with bilateral treaty engagements.</p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Strategic Regional Priorities</p>
                        <BulletList items={profileA?.strategic_priorities} empty="DATA NOT AVAILABLE" />
                      </div>
                    </div>
                  </div>
                  <div className="border border-trinetra-border bg-trinetra-panel/30 p-5 rounded space-y-4">
                    <p className="eyebrow text-trinetra-saffron">{flagB} {b.name} · REGIONAL & GLOBAL FOOTPRINT</p>
                    <div className="space-y-3 text-sm text-neutral-300">
                      <div>
                        <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Regional Strategic Posture</p>
                        <p className="leading-relaxed text-neutral-200">
                          {profileB?.region ? `Major sovereign actor in ${profileB.region}. Active diplomatic, trade, and security positioning.` : "DATA NOT AVAILABLE"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Multilateral Memberships</p>
                        {entityB?.key_organisations_member_of?.length ? (
                          <BulletList
                            items={entityB.key_organisations_member_of.map((o: string) => o.replace("ORG_", ""))}
                            empty="No multilateral organisations registered."
                          />
                        ) : (
                          <p className="text-xs text-neutral-400">Standard UN member with bilateral treaty engagements.</p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Strategic Regional Priorities</p>
                        <BulletList items={profileB?.strategic_priorities} empty="DATA NOT AVAILABLE" />
                      </div>
                    </div>
                  </div>
                </div>
              }
              missingContent="Composite power rank indexes and subjective hegemony metrics are excluded in accordance with Trinetra AI data integrity guidelines."
            />
          </Section>
        )}

        {/* TAB: TRADE & DEPENDENCIES */}
        {(tab === "Trade" || tab === "Dependencies") && (
          <Section title="Trade dependencies and structural vulnerabilities" note="Bilateral critical dependencies, import concentration, and supply chain single points of failure.">
            <DataSeparationBlock
              entityAName={a.name}
              entityBName={b.name}
              bothContent={
                <div className="grid gap-7 md:grid-cols-2">
                  <div className="border border-trinetra-border bg-trinetra-panel/30 p-5 rounded space-y-3">
                    <p className="eyebrow text-trinetra-saffron">{a.name} · CRITICAL DEPENDENCIES</p>
                    <BulletList items={profileA?.dependencies} empty="No critical dependencies recorded in profile." />
                  </div>
                  <div className="border border-trinetra-border bg-trinetra-panel/30 p-5 rounded space-y-3">
                    <p className="eyebrow text-trinetra-saffron">{b.name} · CRITICAL DEPENDENCIES</p>
                    <BulletList items={profileB?.dependencies} empty="No critical dependencies recorded in profile." />
                  </div>
                </div>
              }
              onlyAContent={
                relationship?.trade_dependencies?.length ? (
                  <BulletList items={relationship.trade_dependencies} empty="No bilateral trade dependency records." />
                ) : undefined
              }
              onlyALabel="BILATERAL VULNERABILITIES"
              missingContent="Granular HS-6 customs line items, dual-use component transfer certificates, and port demurrage figures are outside repository scope."
            />
          </Section>
        )}

        {/* TAB: VULNERABILITIES */}
        {tab === "Vulnerabilities" && (
          <Section title="Structural vulnerabilities" note="Asymmetric vulnerabilities identified across military, geographic, demographic, and economic axes.">
            <DataSeparationBlock
              entityAName={a.name}
              entityBName={b.name}
              bothContent={
                <div className="grid gap-7 md:grid-cols-2">
                  <div className="border border-trinetra-border bg-trinetra-panel/30 p-5 rounded space-y-3">
                    <p className="eyebrow text-trinetra-saffron">{a.name} · IDENTIFIED VULNERABILITIES</p>
                    <BulletList items={profileA?.vulnerabilities} empty="No vulnerabilities recorded." />
                  </div>
                  <div className="border border-trinetra-border bg-trinetra-panel/30 p-5 rounded space-y-3">
                    <p className="eyebrow text-trinetra-saffron">{b.name} · IDENTIFIED VULNERABILITIES</p>
                    <BulletList items={profileB?.vulnerabilities} empty="No vulnerabilities recorded." />
                  </div>
                </div>
              }
              missingContent="Internal civil defense contingencies, domestic unrest thresholds, and emergency food reserve duration metrics are unlisted."
            />
          </Section>
        )}

        {/* TAB: FOREIGN POLICY */}
        {tab === "Foreign Policy" && (
          <Section title="Foreign policy doctrines and priorities" note="Official strategic doctrine, diplomatic posture, and international alignments.">
            <DataSeparationBlock
              entityAName={a.name}
              entityBName={b.name}
              bothContent={
                <div className="grid gap-7 md:grid-cols-2">
                  <div className="border border-trinetra-border bg-trinetra-panel/30 p-5 rounded space-y-3">
                    <p className="eyebrow text-trinetra-saffron">{a.name} · DOCTRINE & PRIORITIES</p>
                    {fpA ? (
                      <div className="space-y-3">
                        <p className="text-sm text-neutral-300 leading-relaxed">{fpA.doctrine}</p>
                        <div>
                          <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">Strategic Priorities</p>
                          <BulletList items={fpA.strategic_priorities} empty="No priorities listed." />
                        </div>
                      </div>
                    ) : (
                      <BulletList items={profileA?.strategic_priorities} empty="No foreign policy doctrine recorded." />
                    )}
                  </div>
                  <div className="border border-trinetra-border bg-trinetra-panel/30 p-5 rounded space-y-3">
                    <p className="eyebrow text-trinetra-saffron">{b.name} · DOCTRINE & PRIORITIES</p>
                    {fpB ? (
                      <div className="space-y-3">
                        <p className="text-sm text-neutral-300 leading-relaxed">{fpB.doctrine}</p>
                        <div>
                          <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">Strategic Priorities</p>
                          <BulletList items={fpB.strategic_priorities} empty="No priorities listed." />
                        </div>
                      </div>
                    ) : (
                      <BulletList items={profileB?.strategic_priorities} empty="No foreign policy doctrine recorded." />
                    )}
                  </div>
                </div>
              }
              missingContent="Classified national security directives and unpublished bilateral negotiation protocols are absent."
            />
          </Section>
        )}

        {/* TAB: CHOKEPOINTS */}
        {tab === "Chokepoints" && (
          <Section title="Maritime and terrestrial chokepoints" note="Global chokepoints directly impinging on either nation's commerce, energy, or naval access.">
            <div className="space-y-4">
              {chokepoints.length > 0 ? (
                chokepoints.map((cp) => {
                  const isOpen = open === cp.chokepoint;
                  return (
                    <article key={cp.chokepoint} className="border border-trinetra-border rounded overflow-hidden">
                      <button
                        onClick={() => setOpen(isOpen ? null : cp.chokepoint)}
                        className="flex w-full items-center justify-between p-4 text-left text-sm text-neutral-200 bg-trinetra-panel/40 hover:bg-trinetra-panel/80 transition-colors"
                      >
                        <span className="font-semibold text-neutral-100">{cp.chokepoint}</span>
                        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                      {isOpen && (
                        <div className="border-t border-trinetra-border p-5 text-sm leading-6 text-neutral-300 bg-black/20 space-y-3">
                          <p className="text-neutral-400">{cp.why_it_matters}</p>
                          <div className="grid gap-4 md:grid-cols-2 border-t border-trinetra-border/60 pt-3 text-xs">
                            <div>
                              <span className="text-trinetra-saffron font-medium">{a.id}: </span>
                              <span className="text-neutral-400">{cp.country_a_leverage?.reason || cp.country_a_exposure?.reason || "Exposure not catalogued."}</span>
                            </div>
                            <div>
                              <span className="text-trinetra-saffron font-medium">{b.id}: </span>
                              <span className="text-neutral-400">{cp.country_b_leverage?.reason || cp.country_b_exposure?.reason || "Exposure not catalogued."}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })
              ) : (
                <Empty>No relevant maritime or strategic chokepoints recorded for this pair in the registry.</Empty>
              )}
            </div>
          </Section>
        )}

        {/* TAB: STRATEGIC ASSETS */}
        {tab === "Strategic Assets" && (
          <Section title="Strategic assets and geographic hubs" note="Forward airbases, logistics hubs, deep-water ports, and key territorial commands.">
            <DataSeparationBlock
              entityAName={a.name}
              entityBName={b.name}
              bothContent={
                analysis.deep_dive_analyses?.length ? (
                  <div className="space-y-4">
                    {analysis.deep_dive_analyses.map((item) => (
                      <div key={item.subject} className="border border-trinetra-border bg-trinetra-panel/30 p-5 rounded">
                        <p className="eyebrow text-trinetra-saffron mb-2">{item.subject}</p>
                        {item.assessment && <p className="text-sm text-neutral-300 mb-3">{item.assessment.statement}</p>}
                        {item.facts && (
                          <BulletList items={item.facts.map((f) => `${f.record_type}: ${f.statement}`)} empty="No facts recorded." />
                        )}
                      </div>
                    ))}
                  </div>
                ) : undefined
              }
              missingContent="Comprehensive military facility coordinates, underground hardened command centers, and tactical radar installation inventories are not available."
            />
          </Section>
        )}
      </div>

      {/* Footer reference metadata */}
      <footer className="grid gap-4 border-t border-trinetra-border px-5 py-5 text-xs text-neutral-500 md:grid-cols-3 md:px-7">
        <p>
          <span className="text-trinetra-saffron font-semibold">DATA INTEGRITY</span>
          <br />Verified public datasets, World Bank WDI, and institutional sources where available.
        </p>
        <p>
          <span className="text-trinetra-saffron font-semibold">EVIDENCE LABELS</span>
          <br />Fact · Sourced Estimate · Official Claim · Assessment · Unknown
        </p>
        <p className="md:text-right">
          <span className="text-trinetra-saffron font-semibold">REFERENCE DATES VARY</span>
          <br />Each metric should be evaluated with its source institution and reference year.
        </p>
      </footer>
    </div>
  );
}
