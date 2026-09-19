import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, ArrowRight, ArrowLeftRight, Flame, Scale } from "lucide-react";
import type { CountryIndexEntry } from "../../types";

interface Props {
  countries: CountryIndexEntry[];
}

export default function ComparisonLauncher({ countries }: Props) {
  const navigate = useNavigate();

  const featuredPairs = [
    {
      a: "IND",
      b: "CHN",
      label: "India vs China",
      tag: "Himalayan LAC & Indo-Pacific Theater",
      description: "Border demarcation contestation, Indian Ocean surveillance, and industrial API supply exposure.",
      heat: "HIGH FRICTION",
      color: "border-rose-500/30 hover:border-rose-500/60",
    },
    {
      a: "USA",
      b: "CHN",
      label: "United States vs China",
      tag: "Global Hegemony & Technology Chokepoints",
      description: "Semiconductor lithography export controls, Taiwan Strait contingency, and rare earth processing dependency.",
      heat: "STRUCTURAL RIVALRY",
      color: "border-amber-500/30 hover:border-amber-500/60",
    },
    {
      a: "IND",
      b: "PAK",
      label: "India vs Pakistan",
      tag: "South Asian Nuclear Deterrence",
      description: "Line of Control (LOC) tactical standoff, Indus Waters Treaty dynamics, and asymmetric proxy vectors.",
      heat: "HIGH FRICTION",
      color: "border-rose-500/30 hover:border-rose-500/60",
    },
    {
      a: "USA",
      b: "RUS",
      label: "United States vs Russia",
      tag: "Euro-Atlantic Strategic Nuclear Balance",
      description: "Nuclear triad modernisation, NATO forward posture, and energy export leverage across Europe.",
      heat: "ACUTE THREAT",
      color: "border-rose-500/30 hover:border-rose-500/60",
    },
    {
      a: "SAU",
      b: "IRN",
      label: "Saudi Arabia vs Iran",
      tag: "Persian Gulf & Maritime Littoral",
      description: "Strait of Hormuz energy transit security, OPEC+ coordination, and regional proxy architectures.",
      heat: "COMPLEX DETENTE",
      color: "border-blue-500/30 hover:border-blue-500/60",
    },
    {
      a: "ISR",
      b: "IRN",
      label: "Israel vs Iran",
      tag: "Middle East Asymmetric Contestation",
      description: "Multi-layered air defense (Arrow-3), ballistic missile arsenals, and nuclear enrichment timelines.",
      heat: "HIGH FRICTION",
      color: "border-rose-500/30 hover:border-rose-500/60",
    },
  ];

  const [customA, setCustomA] = useState<string>("IND");
  const [customB, setCustomB] = useState<string>("CHN");

  const handleLaunchCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customA && customB && customA !== customB) {
      navigate(`/compare?a=${customA}&b=${customB}`);
    }
  };

  return (
    <section className="mb-14 rounded-xl border border-trinetra-border bg-[#07090c] p-6 sm:p-10 shadow-2xl">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
        <div>
          <div className="section-kicker">COMPARATIVE INTELLIGENCE MATRIX</div>
          <h2 className="font-display text-3xl sm:text-4xl text-neutral-100 font-light mt-1">
            Bilateral Contestation Engine
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-xl font-light">
            Compare any two sovereign nations side-by-side across military inventories, economic resilience, chokepoint exposure, and escalation flashpoints.
          </p>
        </div>

        <Link
          to="/compare?a=IND&b=CHN"
          className="px-5 py-3 rounded bg-trinetra-saffron text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#ffaa4d] transition-colors inline-flex items-center gap-2 shadow-lg shadow-trinetra-saffron/20 self-start lg:self-auto"
        >
          <Shield className="size-4" />
          <span>Launch Comparison Matrix</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {/* Featured Strategic Rivalry Pairs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {featuredPairs.map((pair, idx) => (
          <Link
            key={idx}
            to={`/compare?a=${pair.a}&b=${pair.b}`}
            className={`p-5 rounded-lg border bg-[#0a0c10] transition-all duration-200 group flex flex-col justify-between hover:-translate-y-0.5 ${pair.color}`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border border-white/10 text-neutral-400 bg-white/5">
                  {pair.heat}
                </span>
                <span className="font-mono text-xs text-neutral-500">
                  {pair.a} vs {pair.b}
                </span>
              </div>

              <h3 className="font-display text-xl text-neutral-100 font-medium group-hover:text-trinetra-saffron transition-colors mb-1">
                {pair.label}
              </h3>

              <div className="font-mono text-[11px] text-neutral-400 mb-2">
                {pair.tag}
              </div>

              <p className="text-xs text-neutral-400 leading-relaxed font-light mb-4">
                {pair.description}
              </p>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-neutral-400 group-hover:text-white">
              <span>Launch Matrix</span>
              <ArrowRight className="size-3 text-trinetra-saffron transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>

      {/* Custom Pair Selector Toolbar */}
      <div className="rounded-lg border border-white/10 bg-black/60 p-5 backdrop-blur">
        <form onSubmit={handleLaunchCustom} className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Scale className="size-4 text-trinetra-saffron" />
            <span className="font-mono text-xs uppercase tracking-wider text-neutral-300">
              Custom Bilateral Pairing:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select
              value={customA}
              onChange={(e) => setCustomA(e.target.value)}
              className="bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs px-3 py-2 rounded focus:outline-none focus:border-trinetra-saffron font-mono flex-1 md:flex-initial min-w-[150px]"
            >
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} — {c.name}
                </option>
              ))}
            </select>

            <span className="text-neutral-500 font-mono text-xs flex items-center gap-1">
              <ArrowLeftRight className="size-3.5" />
            </span>

            <select
              value={customB}
              onChange={(e) => setCustomB(e.target.value)}
              className="bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs px-3 py-2 rounded focus:outline-none focus:border-trinetra-saffron font-mono flex-1 md:flex-initial min-w-[150px]"
            >
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} — {c.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={customA === customB}
              className="px-4 py-2 rounded bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-white text-xs font-mono disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Compare Selected →
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
