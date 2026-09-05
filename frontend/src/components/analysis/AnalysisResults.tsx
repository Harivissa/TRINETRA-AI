import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { RivalryAnalysis as RivalryAnalysisType } from "../../types";

type SectionProps = { title: string; note?: string; children: ReactNode };
function Section({ title, note, children }: SectionProps) {
  return <section className="border-b border-trinetra-border py-9 last:border-b-0"><div className="mb-5 flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between"><h2 className="font-display text-2xl text-neutral-100">{title}</h2>{note && <p className="max-w-xl text-sm leading-6 text-neutral-500">{note}</p>}</div>{children}</section>;
}
function Evidence({ confidence, reason }: { confidence?: string; reason?: string }) {
  if (!confidence && !reason) return null;
  return <p className="mt-4 text-xs text-neutral-500">Assessment confidence: {confidence || "not stated"}{reason ? ` — ${reason}` : ""}</p>;
}
function EmptyData({ children }: { children: React.ReactNode }) { return <p className="border-l border-trinetra-border py-2 pl-4 text-sm leading-6 text-neutral-500">NO VERIFIED DATA AVAILABLE <span className="block normal-case">{children}</span></p>; }

export default function AnalysisResults({ analysis }: { analysis: RivalryAnalysisType }) {
  const [openEvidence, setOpenEvidence] = useState<string | null>(null);
  const a = analysis.country_a;
  const b = analysis.country_b;
  const militaryRows = [
    ["Composite score", analysis.military?.country_a?.composite_score, analysis.military?.country_b?.composite_score],
    ["Active personnel", analysis.military?.country_a?.active_troops, analysis.military?.country_b?.active_troops],
    ["Defence spending (USD bn)", analysis.military?.country_a?.defence_spending_usd_billion, analysis.military?.country_b?.defence_spending_usd_billion],
  ];
  const economicRows = [
    ["GDP (USD tn)", analysis.economic?.country_a?.gdp_usd_trillion, analysis.economic?.country_b?.gdp_usd_trillion],
    ["GDP growth (%)", analysis.economic?.country_a?.gdp_growth_pct, analysis.economic?.country_b?.gdp_growth_pct],
    ["Energy vulnerability", analysis.energy?.country_a?.energy_vulnerability_score, analysis.energy?.country_b?.energy_vulnerability_score],
  ];

  return <div>
    <div className="flex flex-col gap-2 border-b border-trinetra-border pb-7 md:flex-row md:items-end md:justify-between"><div><p className="eyebrow mb-3">ASSESSMENT RESULT</p><h2 className="font-display text-3xl text-neutral-100">{a.name} <span className="text-neutral-600">/</span> {b.name}</h2></div><p className="text-xs text-neutral-500">Structured comparison · source fields preserved</p></div>

    <Section title="Relationship context" note={analysis.geopolitical.note}><div className="grid gap-8 md:grid-cols-2"><div><p className="eyebrow mb-2">RECORDED RELATIONSHIP</p><p className="text-lg text-trinetra-saffron">{analysis.geopolitical.relationship?.relationship_type || analysis.geopolitical.relationship?.type || "Relationship type not stated"}</p></div><div><p className="eyebrow mb-2">EXTERNAL ACTORS</p>{analysis.geopolitical.external_actors?.length ? <ul className="flex flex-col gap-3">{analysis.geopolitical.external_actors.map((actor) => <li key={actor.country} className="border-b border-trinetra-border pb-3 last:border-0"><span className="text-neutral-200">{actor.country}</span><span className="ml-3 text-xs text-trinetra-saffron">{actor.role}</span><p className="mt-1 text-sm leading-6 text-neutral-400">{actor.reason}</p></li>)}</ul> : <EmptyData>No third-party relationship data is on file for this pair.</EmptyData>}</div></div></Section>

    <Section title="Material comparison" note="Raw values from the assessment response. No normalized scores or winner logic added."><div className="overflow-x-auto"><table className="w-full min-w-[520px] text-left text-sm"><thead><tr className="border-b border-trinetra-border text-xs text-neutral-500"><th className="pb-3 font-normal">MEASURE</th><th className="pb-3 font-normal">{a.id}</th><th className="pb-3 font-normal">{b.id}</th></tr></thead><tbody>{[...militaryRows, ...economicRows].map(([label, av, bv]) => <tr key={String(label)} className="border-b border-trinetra-border/70 transition-colors hover:bg-trinetra-panel"><td className="py-3 text-neutral-300">{label}</td><td className="py-3 text-trinetra-saffron">{av ?? "—"}</td><td className="py-3 text-neutral-200">{bv ?? "—"}</td></tr>)}</tbody></table></div></Section>

    <Section title="Leverage and dependencies" note={analysis.chokepoints.note}><div className="flex flex-col gap-7">{analysis.chokepoints.relevant_chokepoints?.length ? analysis.chokepoints.relevant_chokepoints.map((cp) => <article key={cp.chokepoint} className="border-l border-trinetra-saffron pl-5"><h3 className="text-lg text-neutral-100">{cp.chokepoint}</h3><p className="mt-1 text-sm leading-6 text-neutral-400">{cp.why_it_matters}</p><div className="mt-4 grid gap-5 text-sm md:grid-cols-2"><div><p className="eyebrow mb-2">{a.id}</p><p className="leading-6 text-neutral-300">{cp.country_a_exposure?.reason || cp.country_a_leverage?.reason || "No direct implication recorded."}</p></div><div><p className="eyebrow mb-2">{b.id}</p><p className="leading-6 text-neutral-300">{cp.country_b_exposure?.reason || cp.country_b_leverage?.reason || "No direct implication recorded."}</p></div></div></article>) : <EmptyData>No maritime or energy chokepoints in the current dataset apply directly to this pair.</EmptyData>}</div></Section>

    <Section title="Consequence chain" note={analysis.consequence_chain.note}><div className="flex flex-col">{analysis.consequence_chain.steps?.length ? analysis.consequence_chain.steps.map((step, index) => <div key={step.step} className="flex gap-5 border-l border-trinetra-border pb-7 pl-5 last:pb-0"><div className="-ml-[29px] flex size-5 shrink-0 items-center justify-center rounded-full border border-trinetra-saffron bg-trinetra-bg text-[10px] text-trinetra-saffron">{step.step}</div><div><p className="eyebrow mb-1">{step.domain}</p><p className="text-sm leading-6 text-neutral-300">{step.description}</p></div></div>) : <EmptyData>No consequence chain is available for this comparison.</EmptyData>}</div></Section>

    {analysis.deep_dive_analyses?.length > 0 && <Section title="Deep-dive assessments"><div className="flex flex-col gap-3">{analysis.deep_dive_analyses.map((item) => { const open = openEvidence === item.subject; return <article key={item.subject} className="border-b border-trinetra-border last:border-0"><button onClick={() => setOpenEvidence(open ? null : item.subject)} className="flex w-full items-center justify-between gap-4 py-4 text-left"><span className="text-neutral-200">{item.subject}</span><span className="flex items-center gap-3 text-xs text-neutral-500">{item.confidence}{open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</span></button>{open && <div className="pb-5 text-sm leading-6 text-neutral-400">{item.facts?.map((fact) => <p key={fact.statement} className="mb-2">{fact.statement}</p>)}{item.assessment && <div className="mt-4 border-l border-trinetra-saffron pl-4"><p className="text-neutral-200">{item.assessment.statement}</p><p className="mt-2 text-xs text-neutral-500">{item.assessment.reasoning}</p></div>}{item.scenario_note && <p className="mt-4">{item.scenario_note.statement} <span className="text-xs text-neutral-500">{item.scenario_note.caveat}</span></p>}<Evidence confidence={item.confidence} reason={item.confidence_reason} /></div>}</article>; })}</div></Section>}

    <Section title="Scenarios" note="Scenario framing is not a prediction."><div className="overflow-x-auto"><table className="w-full min-w-[520px] text-left text-sm"><thead><tr className="border-b border-trinetra-border text-xs text-neutral-500"><th className="pb-3 font-normal">SCENARIO</th><th className="pb-3 font-normal">TRIGGERS</th><th className="pb-3 font-normal">ESTIMATE</th></tr></thead><tbody>{analysis.scenarios?.map((scenario) => <tr key={scenario.scenario} className="border-b border-trinetra-border/70"><td className="py-3 text-neutral-200">{scenario.scenario}</td><td className="py-3 text-neutral-400">{scenario.trigger_factors?.join(", ") || "—"}</td><td className="py-3 text-trinetra-saffron">{scenario.probability_estimate || "Not stated"}</td></tr>)}</tbody></table></div></Section>
  </div>;
}
