import { Shield, TrendingUp, Globe2, GitBranch, Anchor, BookOpen, Radio } from "lucide-react";
import ResilienceRadar from "../charts/ResilienceRadar";
import CompareBarChart from "../charts/CompareBarChart";
import type { RivalryAnalysis as RivalryAnalysisType } from "../../types";

function SectionHeader({ icon: Icon, title }: { icon: any; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-9 h-9 rounded bg-trinetra-saffron/10 border border-trinetra-saffron/30 flex items-center justify-center">
        <Icon size={18} className="text-trinetra-saffron" />
      </div>
      <h2 className="font-display text-2xl text-trinetra-saffron">{title}</h2>
    </div>
  );
}

export default function AnalysisResults({ analysis }: { analysis: RivalryAnalysisType }) {
  return (
    <div className="space-y-14">
      {/* RESILIENCE RADAR — the pictorial centerpiece */}
      <section>
        <SectionHeader icon={Shield} title="Strategic Resilience Profile" />
        <p className="text-sm text-neutral-500 mb-4">{analysis.resilience_profile.note}</p>
        <div className="border border-trinetra-border rounded-lg p-6 bg-trinetra-panel">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <ResilienceRadar
              dimensions={analysis.resilience_profile.dimensions}
              aLabel={analysis.country_a.id}
              bLabel={analysis.country_b.id}
            />
            <div className="space-y-3">
              {analysis.resilience_profile.dimensions.map((d) => (
                <div key={d.dimension} className="border-b border-trinetra-border pb-2 last:border-0">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-300">{d.dimension}</span>
                    <span className="text-trinetra-saffron font-semibold">
                      {d.country_a_value} <span className="text-neutral-600">vs</span> {d.country_b_value}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-0.5">{d.explains}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MILITARY + ECONOMIC BAR CHARTS */}
      <section>
        <SectionHeader icon={TrendingUp} title="Head-to-Head Metrics" />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-trinetra-border rounded-lg p-6 bg-trinetra-panel">
            <h3 className="text-sm uppercase tracking-wide text-neutral-500 mb-3">Military</h3>
            <CompareBarChart
              aLabel={analysis.country_a.id}
              bLabel={analysis.country_b.id}
              data={[
                { metric: "Composite score", a: analysis.military.country_a.composite_score, b: analysis.military.country_b.composite_score },
                { metric: "Troops (K)", a: Math.round((analysis.military.country_a.active_troops || 0) / 1000), b: Math.round((analysis.military.country_b.active_troops || 0) / 1000) },
                { metric: "Budget ($bn)", a: analysis.military.country_a.defence_spending_usd_billion || 0, b: analysis.military.country_b.defence_spending_usd_billion || 0 },
              ]}
            />
          </div>
          <div className="border border-trinetra-border rounded-lg p-6 bg-trinetra-panel">
            <h3 className="text-sm uppercase tracking-wide text-neutral-500 mb-3">Economy & Energy</h3>
            <CompareBarChart
              aLabel={analysis.country_a.id}
              bLabel={analysis.country_b.id}
              data={[
                { metric: "GDP ($tn)", a: analysis.economic.country_a.gdp_usd_trillion || 0, b: analysis.economic.country_b.gdp_usd_trillion || 0 },
                { metric: "Growth %", a: analysis.economic.country_a.gdp_growth_pct || 0, b: analysis.economic.country_b.gdp_growth_pct || 0 },
                { metric: "Energy vulnerability", a: analysis.energy.country_a.energy_vulnerability_score, b: analysis.energy.country_b.energy_vulnerability_score },
              ]}
            />
          </div>
        </div>
      </section>

      {/* EXTERNAL ACTORS */}
      <section>
        <SectionHeader icon={Globe2} title="External Actors" />
        <p className="text-sm text-neutral-500 mb-4">{analysis.geopolitical.note}</p>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          {analysis.geopolitical.external_actors.map((a) => (
            <div key={a.country} className="border border-trinetra-border rounded-lg p-4 bg-trinetra-panel">
              <div className="flex justify-between items-center mb-1">
                <span className="font-display text-lg text-neutral-100">{a.country}</span>
                <span className="text-xs uppercase tracking-wide text-trinetra-saffron border border-trinetra-saffron rounded px-2 py-1">
                  {a.role}
                </span>
              </div>
              <p className="text-sm text-neutral-400">{a.reason}</p>
            </div>
          ))}
          {analysis.geopolitical.external_actors.length === 0 && (
            <p className="text-sm text-neutral-500">No third-party relationship data on file for this pair yet.</p>
          )}
        </div>
      </section>

      {/* CHOKEPOINTS */}
      <section>
        <SectionHeader icon={Anchor} title="Chokepoint Leverage" />
        <p className="text-sm text-neutral-500 mb-4">{analysis.chokepoints.note}</p>
        {analysis.chokepoints.relevant_chokepoints.length === 0 && (
          <p className="text-sm text-neutral-500">No maritime/energy chokepoints in the current dataset apply directly to this pair.</p>
        )}
        <div className="space-y-4">
          {analysis.chokepoints.relevant_chokepoints.map((cp) => (
            <div key={cp.chokepoint} className="border border-trinetra-border rounded-lg p-5 bg-trinetra-panel">
              <h3 className="font-display text-xl text-trinetra-saffron mb-2">{cp.chokepoint}</h3>
              <p className="text-sm text-neutral-400 mb-4">{cp.why_it_matters}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-neutral-500 text-xs uppercase mb-1">{analysis.country_a.id} exposure/leverage</div>
                  {cp.country_a_exposure && <p className="text-neutral-300 mb-1"><span className="text-red-400">Exposed:</span> {cp.country_a_exposure.reason}</p>}
                  {cp.country_a_leverage && <p className="text-neutral-300"><span className="text-trinetra-saffron">Leverage:</span> {cp.country_a_leverage.reason}</p>}
                  {!cp.country_a_exposure && !cp.country_a_leverage && <p className="text-neutral-600">Not directly implicated</p>}
                </div>
                <div>
                  <div className="text-neutral-500 text-xs uppercase mb-1">{analysis.country_b.id} exposure/leverage</div>
                  {cp.country_b_exposure && <p className="text-neutral-300 mb-1"><span className="text-red-400">Exposed:</span> {cp.country_b_exposure.reason}</p>}
                  {cp.country_b_leverage && <p className="text-neutral-300"><span className="text-trinetra-saffron">Leverage:</span> {cp.country_b_leverage.reason}</p>}
                  {!cp.country_b_exposure && !cp.country_b_leverage && <p className="text-neutral-600">Not directly implicated</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONSEQUENCE CHAIN */}
      <section>
        <SectionHeader icon={GitBranch} title="Strategic Consequence Chain" />
        <p className="text-sm text-neutral-500 mb-4">{analysis.consequence_chain.note}</p>
        <div className="space-y-1">
          {analysis.consequence_chain.steps.map((s, i) => (
            <div key={s.step} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-trinetra-saffron/10 border-2 border-trinetra-saffron flex items-center justify-center text-trinetra-saffron font-display text-sm shrink-0">
                  {s.step}
                </div>
                {i < analysis.consequence_chain.steps.length - 1 && <div className="w-0.5 flex-1 bg-trinetra-border my-1" />}
              </div>
              <div className="pb-5">
                <div className="text-xs uppercase tracking-wide text-neutral-500">{s.domain}</div>
                <div className="text-sm text-neutral-200">{s.description}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DEEP DIVE ANALYSES */}
      {analysis.deep_dive_analyses.length > 0 && (
        <section>
          <SectionHeader icon={BookOpen} title="Deep-Dive Strategic Analysis" />
          <div className="space-y-6">
            {analysis.deep_dive_analyses.map((a) => (
              <div key={a.subject} className="border border-trinetra-border rounded-lg p-5 bg-trinetra-panel">
                <h3 className="font-display text-xl text-white mb-1">{a.subject}</h3>
                <p className="text-xs text-neutral-600 mb-4">Confidence: {a.confidence} — {a.confidence_reason}</p>

                {a.facts && (
                  <div className="mb-4">
                    <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Facts</div>
                    {a.facts.map((f, i) => (
                      <p key={i} className="text-sm text-neutral-300 mb-2">• {f.statement}</p>
                    ))}
                  </div>
                )}

                {a.assessment && (
                  <div className="mb-4 border-t border-trinetra-border pt-4">
                    <div className="text-xs uppercase tracking-wide text-trinetra-saffron mb-2">Analytical Assessment</div>
                    <p className="text-sm text-neutral-200 mb-2">{a.assessment.statement}</p>
                    <p className="text-xs text-neutral-500">{a.assessment.reasoning}</p>
                  </div>
                )}

                {a.scenario_note && (
                  <div className="border-t border-trinetra-border pt-4">
                    <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Scenario (not a prediction)</div>
                    <p className="text-sm text-neutral-300 mb-2">{a.scenario_note.statement}</p>
                    <p className="text-xs text-neutral-600 italic">{a.scenario_note.caveat}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SCENARIOS */}
      <section>
        <SectionHeader icon={Radio} title="Scenarios" />
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          {analysis.scenarios.map((s) => (
            <div key={s.scenario} className="border border-trinetra-border rounded-lg p-4 bg-trinetra-panel flex justify-between items-center">
              <div>
                <div className="font-semibold text-neutral-200">{s.scenario}</div>
                <div className="text-xs text-neutral-500">{s.trigger_factors.join(", ")}</div>
              </div>
              <span className="text-xs uppercase tracking-wide text-trinetra-saffron border border-trinetra-saffron rounded px-2 py-1 shrink-0 ml-3">
                {s.probability_estimate}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
