import type { Country } from "../../types";

interface Props {
  a: Country | undefined;
  b: Country | undefined;
}

type Metric = { label: string; a: number | null; b: number | null; suffix: string; format?: "money" | "number" };

function numberOf(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export default function Comparison3D({ a, b }: Props) {
  const metrics: Metric[] = [
    { label: "Population", a: numberOf(a?.demographics?.population_millions), b: numberOf(b?.demographics?.population_millions), suffix: "M" },
    { label: "GDP", a: numberOf(a?.economy?.gdp_usd_trillion), b: numberOf(b?.economy?.gdp_usd_trillion), suffix: "T", format: "money" },
    { label: "Growth", a: numberOf(a?.economy?.gdp_growth_pct), b: numberOf(b?.economy?.gdp_growth_pct), suffix: "%" },
    { label: "Defence", a: numberOf(a?.military?.defence_spending_usd_billion), b: numberOf(b?.military?.defence_spending_usd_billion), suffix: "B", format: "money" },
    { label: "Active personnel", a: numberOf(a?.military?.active_troops), b: numberOf(b?.military?.active_troops), suffix: "" },
    { label: "Energy dependence", a: numberOf(a?.energy?.net_import_dependence_ratio ?? a?.energy?.energy_dependence_pct), b: numberOf(b?.energy?.net_import_dependence_ratio ?? b?.energy?.energy_dependence_pct), suffix: "" },
  ];

  return (
    <section className="comparison-visual border-b border-trinetra-border py-8" aria-labelledby="comparison-visual-title">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="section-kicker">SPATIAL DATA VIEW</p>
          <h3 id="comparison-visual-title" className="mt-2 font-display text-3xl text-white">Visual comparison</h3>
        </div>
        <p className="max-w-xl text-xs leading-5 text-neutral-500">Relative bar heights are visualizations of the factual values above. They are not power scores, rankings, or a winner calculation.</p>
      </div>
      <div className="comparison-3d-stage">
        <div className="comparison-3d-floor" />
        <div className="comparison-3d-grid">
          {metrics.map((metric) => {
            const max = Math.max(metric.a ?? 0, metric.b ?? 0, 1);
            const heightA = metric.a == null ? 0 : Math.max(8, (metric.a / max) * 100);
            const heightB = metric.b == null ? 0 : Math.max(8, (metric.b / max) * 100);
            const display = (value: number | null) => value == null ? "Data unavailable" : `${metric.format === "money" ? "$" : ""}${value.toLocaleString()}${metric.suffix}`;
            return (
              <article key={metric.label} className="comparison-3d-metric">
                <div className="comparison-3d-columns">
                  <div className="comparison-3d-bar comparison-3d-bar--a" style={{ height: `${heightA}%` }}><span>{display(metric.a)}</span></div>
                  <div className="comparison-3d-bar comparison-3d-bar--b" style={{ height: `${heightB}%` }}><span>{display(metric.b)}</span></div>
                </div>
                <div className="comparison-3d-label">{metric.label}</div>
              </article>
            );
          })}
        </div>
        <div className="comparison-3d-legend"><span><i />{a?.name || "Country A"}</span><span><i />{b?.name || "Country B"}</span></div>
      </div>
    </section>
  );
}
