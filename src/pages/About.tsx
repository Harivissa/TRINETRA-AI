import { Shield, CheckCircle2, Cpu, Database, Eye, Terminal } from "lucide-react";
import Header from "../components/dashboard/Header";
import Footer from "../components/dashboard/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-trinetra-bg text-neutral-200">
      <Header />

      <main className="mx-auto max-w-[1200px] px-5 py-8 sm:px-8 sm:py-12">
        <div className="mb-10">
          <div className="section-kicker">SYSTEM ARCHITECTURE / METHODOLOGY</div>
          <h1 className="font-display text-4xl sm:text-5xl text-neutral-100 mt-2 mb-4">
            About Trinetra AI
          </h1>
          <p className="text-base sm:text-lg text-neutral-400 leading-relaxed max-w-3xl">
            Trinetra (त्रिनेत्र — "The Third Eye") is an autonomous geopolitical intelligence framework engineered to analyze nation-state balance of power, maritime chokepoints, supply chain vulnerabilities, and escalating bilateral scenarios.
          </p>
        </div>

        {/* The Four-Tier Doctrine */}
        <section className="mb-14 border border-trinetra-border bg-trinetra-panel p-8 rounded-lg">
          <h2 className="font-display text-2xl text-trinetra-saffron mb-3">
            The Fundamental Architectural Principle
          </h2>
          <p className="text-xl text-neutral-100 font-display italic mb-6">
            "Data ≠ Logic ≠ UI ≠ AI — each layer is strictly isolated, independently auditable, and directly editable."
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded border border-trinetra-border bg-black/30">
              <div className="flex items-center gap-2 text-sm font-semibold text-neutral-200 mb-2">
                <Database className="size-4 text-trinetra-saffron" /> 1. Data Layer
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Canonical JSON repository of 22+ nations, bilateral relationships, and strategic chokepoints. Edited directly without breaking logic.
              </p>
            </div>

            <div className="p-4 rounded border border-trinetra-border bg-black/30">
              <div className="flex items-center gap-2 text-sm font-semibold text-neutral-200 mb-2">
                <Cpu className="size-4 text-trinetra-saffron" /> 2. Logic Layer
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Deterministic mathematical scoring across military spending, active troops, energy import dependence, and asymmetric resilience.
              </p>
            </div>

            <div className="p-4 rounded border border-trinetra-border bg-black/30">
              <div className="flex items-center gap-2 text-sm font-semibold text-neutral-200 mb-2">
                <Terminal className="size-4 text-trinetra-saffron" /> 3. UI Layer
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Clean, low-latency, responsive presentation using accessible design and restrained spatial depth.
              </p>
            </div>

            <div className="p-4 rounded border border-trinetra-border bg-black/30">
              <div className="flex items-center gap-2 text-sm font-semibold text-neutral-200 mb-2">
                <Eye className="size-4 text-trinetra-saffron" /> 4. AI Synthesis Layer
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Large language models used purely to explain, synthesize, and narrative-frame deterministic outputs, governed by strict prompt guardrails.
              </p>
            </div>
          </div>
        </section>

        {/* Evidence & Integrity Standard */}
        <section className="mb-14 space-y-6">
          <h2 className="font-display text-3xl text-neutral-100">
            Evidence Policy & Zero-Mock Standard
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Unlike superficial simulators that populate missing parameters with artificial estimates or random numbers, Trinetra AI enforces strict epistemic honesty:
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 rounded border border-trinetra-border bg-black/20 text-sm text-neutral-300">
              <CheckCircle2 className="size-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-100">Unavailable Data Is Explicitly Flagged:</strong> If a state has not released public verified numbers on specific munitions or reserves, the field is explicitly marked "Data unavailable" rather than assumed.
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded border border-trinetra-border bg-black/20 text-sm text-neutral-300">
              <CheckCircle2 className="size-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-100">No Synthetic Edges:</strong> Relationships and network ties are derived solely from verified treaties, bilateral treaties, military alliances, or official rivalries.
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded border border-trinetra-border bg-black/20 text-sm text-neutral-300">
              <CheckCircle2 className="size-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-100">Separation of Fact and Assessment:</strong> Sourced historical records are labeled with confidence tiers, distinct from scenario assessments.
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
