import { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Globe2,
  Building2,
  Calendar,
  ShieldAlert,
  Compass,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

interface WorkflowStep {
  step: number;
  label: string;
  sublabel: string;
  icon: any;
}

interface InvestigationCase {
  id: string;
  title: string;
  countryId: string;
  flag: string;
  entity: {
    name: string;
    role: string;
    description: string;
  };
  profile: {
    capital: string;
    gdp: string;
    defence: string;
    doctrine: string;
  };
  relatedCountries: Array<{ id: string; name: string; relation: string }>;
  organizations: string[];
  events: string[];
  vulnerabilities: string[];
  analyticalAssessment: string;
}

export default function InvestigationWorkflow() {
  const steps: WorkflowStep[] = [
    { step: 1, label: "Entity Selection", sublabel: "State & Leader", icon: User },
    { step: 2, label: "Sovereign Profile", sublabel: "Core Metrics", icon: Globe2 },
    { step: 3, label: "Alliances & Ties", sublabel: "Multilateral Blocs", icon: Building2 },
    { step: 4, label: "Flashpoints & Events", sublabel: "Recent Friction", icon: Calendar },
    { step: 5, label: "Asymmetric Exposure", sublabel: "Chokepoints & Supply", icon: ShieldAlert },
    { step: 6, label: "Strategic Synthesis", sublabel: "Doctrinal Outlook", icon: Compass },
  ];

  const cases: InvestigationCase[] = [
    {
      id: "IND",
      title: "Republic of India (IND)",
      countryId: "IND",
      flag: "🇮🇳",
      entity: {
        name: "Prime Minister Narendra Modi",
        role: "Head of Government (Prime Minister of India)",
        description: "Pursues 'Strategic Autonomy' and multi-alignment, actively engaging the Quad while maintaining historic defence ties with Russia and founding membership in BRICS.",
      },
      profile: {
        capital: "New Delhi",
        gdp: "$3.94 Trillion (nominal, expanding at ~6-7% annually)",
        defence: "$75+ Billion (modernizing indigenous defence manufacturing via 'Make in India')",
        doctrine: "Strategic Autonomy, SAGAR (Security and Growth for All in the Region), credible minimum nuclear deterrence with No First Use (NFU).",
      },
      relatedCountries: [
        { id: "USA", name: "United States", relation: "Comprehensive Global Strategic Partner & Quad Ally" },
        { id: "CHN", name: "China", relation: "Strategic Competitor along LAC and Indian Ocean Region" },
        { id: "RUS", name: "Russia", relation: "Special & Privileged Strategic Partner (legacy spares supplier)" },
        { id: "PAK", name: "Pakistan", relation: "Historical Adversary across Line of Control (LOC)" },
      ],
      organizations: ["The Quad (Quadrilateral Security Dialogue)", "BRICS+ Founding Member", "SCO (Shanghai Cooperation Org)", "G20"],
      events: [
        "Galwan Valley & eastern Ladakh border standoff protocols (2020-2024)",
        "US-India Initiative on Critical and Emerging Technology (iCET)",
        "G20 New Delhi Leaders' Declaration consensus",
      ],
      vulnerabilities: [
        "Defence spares: ~36-40% military inventory legacy Russian design origin",
        "Active Pharmaceutical Ingredients (APIs): ~68% imported from China",
        "Strategic Leverage: Andaman & Nicobar Command sits within range of northern Strait of Malacca",
      ],
      analyticalAssessment:
        "India's core strategic challenge is balancing non-aligned autonomy with balancing against China's continental and maritime expansionism in the Indian Ocean, leveraging Quad maritime security while indigenizing domestic critical tech and defence production.",
    },
    {
      id: "CHN",
      title: "People's Republic of China (CHN)",
      countryId: "CHN",
      flag: "🇨🇳",
      entity: {
        name: "General Secretary Xi Jinping",
        role: "President of PRC & Chairman of Central Military Commission",
        description: "Directs the 'Great Rejuvenation of the Chinese Nation', expansion of the PLA Navy into a blue-water force, and the Belt and Road Initiative (BRI).",
      },
      profile: {
        capital: "Beijing",
        gdp: "$18.5 Trillion (world's largest manufacturing powerhouse)",
        defence: "$290+ Billion (second highest globally; expanding naval hulls & hypersonic missiles)",
        doctrine: "Active Defense, Dual Circulation economic model, anti-access/area denial (A2/AD) across First and Second Island Chains.",
      },
      relatedCountries: [
        { id: "USA", name: "United States", relation: "Primary Geostrategic Rival across technology, trade & security" },
        { id: "IND", name: "India", relation: "Continental rival along 3,488 km Himalayan Line of Actual Control" },
        { id: "RUS", name: "Russia", relation: "'No Limits' Comprehensive Strategic Partnership" },
        { id: "PAK", name: "Pakistan", relation: "All-Weather Strategic Cooperative Partner (CPEC)" },
      ],
      organizations: ["SCO (Shanghai Cooperation Org)", "BRICS+ Core Member", "RCEP", "UN Security Council P5"],
      events: [
        "Taiwan Strait regularized air and naval encirclement exercises",
        "South China Sea Second Thomas Shoal maritime confrontations",
        "US-led semiconductor lithography export controls below 7nm node",
      ],
      vulnerabilities: [
        "Malacca Dilemma: ~80% of crude oil imports transit the Strait of Malacca",
        "Iron Ore Dependency: ~70% imported, with Australia accounting for ~62%",
        "Advanced semiconductor fabrication tool export restrictions",
      ],
      analyticalAssessment:
        "China's strategic imperative is escaping the Malacca Dilemma and securing domestic semiconductor sovereignty while pressing territorial claims along its maritime periphery, counterbalanced by US-led Indo-Pacific coalitions.",
    },
    {
      id: "USA",
      title: "United States of America (USA)",
      countryId: "USA",
      flag: "🇺🇸",
      entity: {
        name: "President Joe Biden",
        role: "President & Commander-in-Chief of Armed Forces",
        description: "Enforces an Indo-Pacific strategy anchored in 'Integrated Deterrence', modernizing minilateral alliances (Quad, AUKUS) to contest revisionist powers.",
      },
      profile: {
        capital: "Washington, D.C.",
        gdp: "$28.0+ Trillion (global financial system and reserve currency)",
        defence: "$850+ Billion (global power projection with 11 nuclear aircraft carrier strike groups)",
        doctrine: "Integrated Deterrence, National Defense Strategy prioritized on Indo-Pacific and European theater assurance.",
      },
      relatedCountries: [
        { id: "CHN", name: "China", relation: "Primary pacing challenge in Indo-Pacific and global technology" },
        { id: "RUS", name: "Russia", relation: "Acute threat in Eastern Europe and strategic nuclear peer" },
        { id: "IND", name: "India", relation: "Critical Quad partner in Indian Ocean and technology supply chains" },
        { id: "GBR", name: "United Kingdom", relation: "Special Relationship, NATO pillar and AUKUS partner" },
      ],
      organizations: ["NATO (North Atlantic Treaty Organization)", "The Quad", "AUKUS", "G7", "Five Eyes"],
      events: [
        "Passage of CHIPS and Science Act and export controls on advanced AI hardware",
        "Freedom of Navigation Operations (FONOPs) in the South China Sea",
        "AUKUS Pillar I & II nuclear submarine and quantum tech pact",
      ],
      vulnerabilities: [
        "Rare earth element processing: ~90% global refining concentrated in China",
        "Titanium and critical mineral supply chains for aerospace defense base",
        "Fiscal debt debt-servicing load vs global forward deployment commitments",
      ],
      analyticalAssessment:
        "The United States prioritizes maintaining freedom of the global commons and democratic alliance networks, while working to reshore critical technology manufacturing and mitigate critical mineral supply vulnerabilities.",
    },
  ];

  const [activeCaseId, setActiveCaseId] = useState<string>("IND");
  const [activeStep, setActiveStep] = useState<number>(1);

  const currentCase = cases.find((c) => c.id === activeCaseId) || cases[0];

  return (
    <section className="mb-14 rounded-xl border border-trinetra-border bg-[#0a0c10] p-6 sm:p-10">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
        <div>
          <div className="section-kicker">WORKFLOW DEMONSTRATION</div>
          <h2 className="font-display text-3xl sm:text-4xl text-neutral-100 font-light mt-1">
            End-to-End Investigation Architecture
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-xl font-light">
            How an analyst proceeds from an initial entity node into multilateral treaties, military posture, supply chain exposure, and strategic synthesis.
          </p>
        </div>

        {/* Case Switcher */}
        <div className="flex items-center gap-2 p-1 bg-black/60 border border-white/10 rounded-lg text-xs font-mono">
          <span className="text-neutral-500 px-2">INVESTIGATE:</span>
          {cases.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCaseId(c.id)}
              className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 cursor-pointer ${
                activeCaseId === c.id
                  ? "bg-trinetra-saffron text-black font-semibold"
                  : "text-neutral-300 hover:text-white"
              }`}
            >
              <span>{c.flag}</span>
              <span>{c.id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Progress Step Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
        {steps.map((st) => {
          const isCurrent = st.step === activeStep;
          const isPassed = st.step < activeStep;
          const Icon = st.icon;
          return (
            <button
              key={st.step}
              onClick={() => setActiveStep(st.step)}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                isCurrent
                  ? "border-trinetra-saffron bg-trinetra-saffron/10 text-white shadow-lg shadow-trinetra-saffron/10"
                  : isPassed
                  ? "border-neutral-700 bg-neutral-900/60 text-neutral-300"
                  : "border-neutral-800/80 bg-black/40 text-neutral-500 hover:border-neutral-700"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[9px] uppercase tracking-wider">
                  0{st.step}
                </span>
                <Icon className={`size-3.5 ${isCurrent ? "text-trinetra-saffron" : isPassed ? "text-emerald-400" : "text-neutral-500"}`} />
              </div>
              <div className="font-medium text-xs truncate">{st.label}</div>
              <div className="font-mono text-[9px] text-neutral-400 truncate">{st.sublabel}</div>
            </button>
          );
        })}
      </div>

      {/* Active Step Panel */}
      <div className="rounded-lg border border-white/10 bg-black/60 p-6 sm:p-8 backdrop-blur">
        {activeStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-trinetra-saffron border border-trinetra-saffron/40 px-2 py-0.5 rounded uppercase">
                STEP 01 // KEY ENTITY IDENTIFICATION
              </span>
              <span className="text-xl">{currentCase.flag}</span>
            </div>
            <h3 className="font-display text-2xl text-neutral-100 font-medium">
              {currentCase.entity.name}
            </h3>
            <div className="font-mono text-xs text-neutral-400">
              {currentCase.entity.role}
            </div>
            <p className="text-sm text-neutral-300 leading-relaxed max-w-2xl font-light">
              {currentCase.entity.description}
            </p>
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-4">
            <div className="font-mono text-[10px] text-trinetra-saffron border border-trinetra-saffron/40 px-2 py-0.5 rounded uppercase inline-block">
              STEP 02 // FACTUAL COUNTRY DOSSIER
            </div>
            <h3 className="font-display text-2xl text-neutral-100 font-medium">
              {currentCase.title}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded border border-white/10 bg-neutral-950/60">
                <span className="font-mono text-[10px] text-neutral-400 uppercase block">ECONOMIC CAPACITY</span>
                <span className="text-xs text-neutral-200 font-mono mt-1 block">{currentCase.profile.gdp}</span>
              </div>
              <div className="p-3.5 rounded border border-white/10 bg-neutral-950/60">
                <span className="font-mono text-[10px] text-neutral-400 uppercase block">DEFENCE EXPENDITURE</span>
                <span className="text-xs text-neutral-200 font-mono mt-1 block">{currentCase.profile.defence}</span>
              </div>
            </div>
            <div className="p-3.5 rounded border border-white/10 bg-neutral-950/60">
              <span className="font-mono text-[10px] text-neutral-400 uppercase block">OPERATIONAL DOCTRINE</span>
              <span className="text-xs text-neutral-300 mt-1 block font-light leading-relaxed">{currentCase.profile.doctrine}</span>
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="space-y-4">
            <div className="font-mono text-[10px] text-trinetra-saffron border border-trinetra-saffron/40 px-2 py-0.5 rounded uppercase inline-block">
              STEP 03 // MULTILATERAL & BILATERAL TIES
            </div>
            <h3 className="font-display text-2xl text-neutral-100 font-medium">
              Institutional Alliances & Strategic Relationships
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <div className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider mb-2">
                  BILATERAL CORRIDORS
                </div>
                <div className="space-y-2">
                  {currentCase.relatedCountries.map((rc) => (
                    <div key={rc.id} className="p-2.5 rounded border border-neutral-800 bg-neutral-950/40 text-xs flex items-center justify-between">
                      <span className="font-mono text-neutral-200 font-medium">{rc.name}</span>
                      <span className="text-neutral-400 text-[11px]">{rc.relation}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider mb-2">
                  MULTILATERAL BLOCS
                </div>
                <div className="space-y-2">
                  {currentCase.organizations.map((org, i) => (
                    <div key={i} className="p-2.5 rounded border border-neutral-800 bg-neutral-950/40 text-xs text-neutral-300 font-mono">
                      ✓ {org}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeStep === 4 && (
          <div className="space-y-4">
            <div className="font-mono text-[10px] text-trinetra-saffron border border-trinetra-saffron/40 px-2 py-0.5 rounded uppercase inline-block">
              STEP 04 // RECENT GEOPOLITICAL EVENTS
            </div>
            <h3 className="font-display text-2xl text-neutral-100 font-medium">
              Flashpoints & Diplomatic Milestones
            </h3>
            <div className="space-y-2.5 pt-2">
              {currentCase.events.map((ev, i) => (
                <div key={i} className="p-3.5 rounded border border-white/10 bg-neutral-950/60 flex items-start gap-3">
                  <span className="font-mono text-xs text-trinetra-saffron font-bold mt-0.5">0{i + 1}</span>
                  <span className="text-xs text-neutral-300 leading-relaxed">{ev}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeStep === 5 && (
          <div className="space-y-4">
            <div className="font-mono text-[10px] text-trinetra-saffron border border-trinetra-saffron/40 px-2 py-0.5 rounded uppercase inline-block">
              STEP 05 // ASYMMETRIC VULNERABILITIES & LEVERAGE
            </div>
            <h3 className="font-display text-2xl text-neutral-100 font-medium">
              Chokepoints, Critical Minerals & Supply Dependencies
            </h3>
            <div className="space-y-2.5 pt-2">
              {currentCase.vulnerabilities.map((vuln, i) => (
                <div key={i} className="p-3.5 rounded border border-amber-500/20 bg-amber-500/5 flex items-start gap-3">
                  <span className="font-mono text-xs text-amber-400 font-bold mt-0.5">⚠️</span>
                  <span className="text-xs text-neutral-200 leading-relaxed font-mono">{vuln}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeStep === 6 && (
          <div className="space-y-4">
            <div className="font-mono text-[10px] text-emerald-400 border border-emerald-400/40 px-2 py-0.5 rounded uppercase inline-block">
              STEP 06 // INTEGRATED STRATEGIC SYNTHESIS
            </div>
            <h3 className="font-display text-2xl text-neutral-100 font-medium">
              Doctrinal Outlook & Anticipatory Balance
            </h3>
            <p className="text-sm text-neutral-200 leading-relaxed font-light p-4 rounded border border-emerald-500/20 bg-emerald-500/5">
              {currentCase.analyticalAssessment}
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to={`/country?id=${currentCase.countryId}`}
                className="px-4 py-2 rounded bg-trinetra-saffron text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#ffaa4d] transition-colors inline-flex items-center gap-2"
              >
                <span>Full {currentCase.countryId} Profile</span>
                <ArrowRight className="size-3.5" />
              </Link>
              <Link
                to={`/compare?a=${currentCase.countryId}&b=${currentCase.countryId === "IND" ? "CHN" : "USA"}`}
                className="px-4 py-2 rounded border border-white/15 text-neutral-300 hover:text-white text-xs font-mono transition-colors"
              >
                Launch Bilateral Contestation Matrix →
              </Link>
            </div>
          </div>
        )}

        {/* Step Navigation Controls */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-6">
          <button
            onClick={() => setActiveStep((s) => Math.max(1, s - 1))}
            disabled={activeStep === 1}
            className="px-3 py-1.5 rounded border border-neutral-800 text-xs font-mono text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            ← Previous Step
          </button>

          <span className="font-mono text-xs text-neutral-500">
            STEP {activeStep} OF 6
          </span>

          <button
            onClick={() => setActiveStep((s) => Math.min(6, s + 1))}
            disabled={activeStep === 6}
            className="px-4 py-1.5 rounded bg-white/10 hover:bg-white/20 text-xs font-mono text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
          >
            <span>Next Step</span>
            <ArrowRight className="size-3" />
          </button>
        </div>
      </div>
    </section>
  );
}
