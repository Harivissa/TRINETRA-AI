import { useEffect, useState } from "react";

const LAYERS = [
  "GEOPOLITICS",
  "ALLIANCES",
  "ECONOMICS",
  "TECHNOLOGY",
  "CONFLICTS",
  "RESOURCES",
  "DEPENDENCIES",
  "PEOPLE",
];

const FLOW_LAYERS = [
  "TRADE ROUTES",
  "ENERGY FLOWS",
  "MILITARY ACTIVITY",
  "SUPPLY CHAINS",
  "CRITICAL MINERALS",
  "DIGITAL INFRASTRUCTURE",
];

const SYSTEM_LAYERS = [
  "RELATIONSHIPS",
  "DEPENDENCIES",
  "CHOKEPOINTS",
  "CONFLICTS",
  "INFLUENCE",
  "CONSEQUENCES",
];

function Mark({ large = false }: { large?: boolean }) {
  return (
    <div className={`cinema-mark ${large ? "cinema-mark--large" : ""}`} aria-hidden="true">
      <i /><i /><i />
    </div>
  );
}

function Globe({ detailed = false, hand = false }: { detailed?: boolean; hand?: boolean }) {
  return (
    <div className={`cinema-globe ${detailed ? "cinema-globe--detailed" : ""}`}>
      <div className="cinema-globe__atmosphere" />
      <div className="cinema-globe__grid" />
      <div className="cinema-globe__land" />
      <div className="cinema-globe__lights" />
      <div className="cinema-globe__routes">
        <i /><i /><i /><i /><i />
      </div>
      <div className="cinema-globe__nodes"><i /><i /><i /><i /><i /><i /><i /></div>
      {hand && <div className="cinema-hand" />}
    </div>
  );
}

export default function EntryExperience() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("trinetra-entry-seen") === "1") return;
    } catch {
      // If storage is unavailable, still play the cinematic once for this mount.
    }

    setVisible(true);
    const exit = window.setTimeout(() => {
      setLeaving(true);
      window.setTimeout(() => {
        try { sessionStorage.setItem("trinetra-entry-seen", "1"); } catch { /* noop */ }
        setVisible(false);
      }, 1100);
    }, 30000);

    return () => {
      window.clearTimeout(exit);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`trinetra-entry trinetra-entry--cinema ${leaving ? "trinetra-entry--leaving" : ""}`} aria-label="Trinetra cinematic intelligence initialization">
      <div className="cinema-vignette" />
      <div className="cinema-noise" />
      <div className="cinema-stars" />
      <div className="cinema-scanlines" />

      <section className="cinema-scene cinema-scene--opening">
        <div className="cinema-doorway"><span /></div>
        <div className="cinema-analyst" />
        <div className="cinema-columns cinema-columns--left">
          {LAYERS.slice(0, 4).map((x) => <span key={x}>{x}</span>)}
        </div>
        <div className="cinema-columns cinema-columns--right">
          {LAYERS.slice(4).map((x) => <span key={x}>{x}</span>)}
        </div>
        <div className="cinema-caption cinema-caption--bottom">
          <span>THE WORLD IS</span> <em>NOT WHAT IT LOOKS LIKE.</em>
        </div>
      </section>

      <section className="cinema-scene cinema-scene--perspective">
        <div className="cinema-command-ring" />
        <Globe />
        <div className="cinema-analyst cinema-analyst--small" />
        <div className="cinema-caption cinema-caption--left">A BROADER<br />PERSPECTIVE.</div>
        <div className="cinema-caption cinema-caption--right">A DEEPER<br /><em>TRUTH.</em></div>
      </section>

      <section className="cinema-scene cinema-scene--power">
        <Globe detailed hand />
        <div className="cinema-country-tag cinema-country-tag--usa">USA</div>
        <div className="cinema-country-tag cinema-country-tag--india">INDIA</div>
        <div className="cinema-country-tag cinema-country-tag--russia">RUSSIA</div>
        <div className="cinema-power-copy"><em>POWER</em><span>SHAPES NATIONS.</span></div>
      </section>

      <section className="cinema-scene cinema-scene--flows">
        <Globe detailed />
        <div className="cinema-flow-list">
          {FLOW_LAYERS.map((x, i) => <span key={x} style={{ "--i": i } as React.CSSProperties}>{x}</span>)}
        </div>
        <div className="cinema-ship cinema-ship--one" /><div className="cinema-ship cinema-ship--two" />
        <div className="cinema-caption cinema-caption--bottom cinema-caption--leftwide">BUT POWER<br /><em>IS ONLY ONE LAYER.</em></div>
      </section>

      <section className="cinema-scene cinema-scene--system">
        <Globe detailed />
        <div className="cinema-system-list">
          {SYSTEM_LAYERS.map((x, i) => <span key={x} style={{ "--i": i } as React.CSSProperties}>{x}</span>)}
        </div>
        <div className="cinema-floating-screens"><i /><i /><i /><i /><i /><i /></div>
        <div className="cinema-caption cinema-caption--bottom"><span>UNDERSTAND</span> <em>THE SYSTEM.</em></div>
      </section>

      <section className="cinema-scene cinema-scene--insight">
        <Globe detailed />
        <div className="cinema-data-wall">
          <div /><div /><div /><div /><div /><div />
        </div>
        <div className="cinema-insight-copy">
          <span>REAL DATA.</span><span>REAL CONTEXT.</span><span>REAL INSIGHTS.</span>
          <strong>A MORE SECURE<br /><em>TOMORROW.</em></strong>
        </div>
        <div className="cinema-analyst cinema-analyst--back" />
      </section>

      <section className="cinema-scene cinema-scene--converge">
        <div className="cinema-perspective-wall">
          {Array.from({ length: 18 }).map((_, i) => <i key={i} style={{ "--i": i } as React.CSSProperties} />)}
        </div>
        <Mark large />
        <div className="cinema-converge-copy">ALL PERSPECTIVES. <em>ONE VISION.</em></div>
      </section>

      <section className="cinema-scene cinema-scene--identity">
        <Mark large />
        <h1>TRINETRA</h1>
        <p>STRATEGIC INTELLIGENCE</p>
        <div className="cinema-rule" />
        <div className="cinema-evidence">EVIDENCE FIRST.<br />NO BLOC LOYALTY.</div>
      </section>

      <section className="cinema-scene cinema-scene--dashboard">
        <div className="cinema-dashboard-glow" />
        <div className="cinema-dashboard-mock">
          <div className="cinema-dashboard-top"><span><Mark /> TRINETRA</span><span>Overview　Countries　Relationships　Comparison</span><b>ASK TRINETRA</b></div>
          <div className="cinema-dashboard-body">
            <div><small>STRATEGIC INTELLIGENCE</small><h2>INTELLIGENCE<br /><em>FOR A MORE SECURE</em><br />TOMORROW.</h2><p>Evidence-led geopolitical intelligence for a complex world.</p></div>
            <Globe detailed />
          </div>
        </div>
        <div className="cinema-dashboard-analyst cinema-analyst--back" />
      </section>

      <div className="cinema-progress"><span /></div>
      <div className="cinema-timecode">TRINETRA // INITIALIZING INTELLIGENCE</div>
    </div>
  );
}
