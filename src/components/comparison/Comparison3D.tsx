import type { Country } from "../../types";

interface Props { a: Country | undefined; b: Country | undefined; }
type Metric = { label: string; key: string; a: number | null; b: number | null; suffix: string; format?: "money" | "number"; visual: string; image?: string };

function numberOf(value: unknown): number | null { const n = Number(value); return Number.isFinite(n) ? n : null; }
function flag(id?: string) { const map: Record<string, string> = { IND: "🇮🇳", CHN: "🇨🇳", USA: "🇺🇸", RUS: "🇷🇺", JPN: "🇯🇵", GBR: "🇬🇧", FRA: "🇫🇷", DEU: "🇩🇪", KOR: "🇰🇷", TUR: "🇹🇷", SAU: "🇸🇦", IRN: "🇮🇷", ISR: "🇮🇱", PAK: "🇵🇰", AUS: "🇦🇺", CAN: "🇨🇦", BRA: "🇧🇷", ARG: "🇦🇷", IDN: "🇮🇩", ITA: "🇮🇹", ARE: "🇦🇪", BGD: "🇧🇩" }; return map[id || ""] || "🌐"; }

export default function Comparison3D({ a, b }: Props) {
  const metrics: Metric[] = [
    { key: "population", label: "Population", a: numberOf(a?.demographics?.population_millions), b: numberOf(b?.demographics?.population_millions), suffix: "M", visual: "👥" },
    { key: "gdp", label: "Economic scale", a: numberOf(a?.economy?.gdp_usd_trillion), b: numberOf(b?.economy?.gdp_usd_trillion), suffix: "T", format: "money", visual: "🏙️", image: "/trinetra-earth.png" },
    { key: "growth", label: "Economic growth", a: numberOf(a?.economy?.gdp_growth_pct), b: numberOf(b?.economy?.gdp_growth_pct), suffix: "%", visual: "📈" },
    { key: "defence", label: "Defence spending", a: numberOf(a?.military?.defence_spending_usd_billion), b: numberOf(b?.military?.defence_spending_usd_billion), suffix: "B", format: "money", visual: "🛡️", image: "/chokepoints-atlas.png" },
    { key: "troops", label: "Active personnel", a: numberOf(a?.military?.active_troops), b: numberOf(b?.military?.active_troops), suffix: "", visual: "⚓" },
    { key: "energy", label: "Energy dependence", a: numberOf(a?.energy?.net_import_dependence_ratio ?? a?.energy?.energy_dependence_pct), b: numberOf(b?.energy?.net_import_dependence_ratio ?? b?.energy?.energy_dependence_pct), suffix: "%", visual: "⚡", image: "/trinetra-earth.png" },
  ];
  const display = (metric: Metric, value: number | null) => value == null ? "Data unavailable" : `${metric.format === "money" ? "$" : ""}${value.toLocaleString()}${metric.suffix}`;
  return <section className="comparison-visual border-b border-trinetra-border py-8" aria-labelledby="comparison-visual-title">
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div><p className="section-kicker">VISUAL INTELLIGENCE / TWO STATES</p><h3 id="comparison-visual-title" className="mt-2 font-display text-3xl text-white">See the difference in context</h3><p className="mt-2 text-sm text-neutral-500">Flags, factual measures and thematic visuals. No composite score or winner is calculated.</p></div>
      <div className="flex gap-3 text-sm"><span className="border border-trinetra-border px-3 py-2">{flag(a?.id)} {a?.name || "Country A"}</span><span className="border border-trinetra-border px-3 py-2">{flag(b?.id)} {b?.name || "Country B"}</span></div>
    </div>
    <div className="comparison-visual-grid">{metrics.map((metric) => { const max = Math.max(metric.a ?? 0, metric.b ?? 0, 1); const ha = metric.a == null ? 0 : Math.max(8, metric.a / max * 100); const hb = metric.b == null ? 0 : Math.max(8, metric.b / max * 100); return <article key={metric.key} className="comparison-visual-card">
      <div className="comparison-visual-art" style={metric.image ? { backgroundImage: `linear-gradient(180deg, rgba(5,8,10,.25), rgba(5,8,10,.9)), url(${metric.image})` } : undefined}><span>{metric.visual}</span><small>{metric.label}</small></div>
      <div className="comparison-visual-bars"><div className="comparison-visual-bar comparison-visual-bar--a" style={{ height: `${ha}%` }}><strong>{display(metric, metric.a)}</strong></div><div className="comparison-visual-bar comparison-visual-bar--b" style={{ height: `${hb}%` }}><strong>{display(metric, metric.b)}</strong></div></div>
      <div className="comparison-visual-footer"><span>{flag(a?.id)} {a?.id || "A"}</span><span>{flag(b?.id)} {b?.id || "B"}</span></div>
    </article>; })}</div>
  </section>;
}
