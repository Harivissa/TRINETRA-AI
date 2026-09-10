import { useEffect, useState } from "react";

const LAYERS = ["GEOPOLITICS", "ECONOMIES", "CONFLICTS", "DEPENDENCIES", "RELATIONSHIPS", "CHOKEPOINTS"];

export default function EntryExperience() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("trinetra-entry-seen") === "1") return;
      setVisible(true);
      const exit = window.setTimeout(() => {
        setLeaving(true);
        window.setTimeout(() => {
          sessionStorage.setItem("trinetra-entry-seen", "1");
          setVisible(false);
        }, 900);
      }, 6800);
      return () => window.clearTimeout(exit);
    } catch {
      setVisible(true);
      const exit = window.setTimeout(() => setLeaving(true), 6800);
      return () => window.clearTimeout(exit);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className={`trinetra-entry ${leaving ? "trinetra-entry--leaving" : ""}`} aria-label="Entering Trinetra strategic intelligence">
      <div className="entry-noise" />
      <div className="entry-grid" />
      <div className="entry-orbit entry-orbit--one" />
      <div className="entry-orbit entry-orbit--two" />
      <div className="entry-data entry-data--left">{LAYERS.slice(0, 3).map((item) => <span key={item}>{item}</span>)}</div>
      <div className="entry-data entry-data--right">{LAYERS.slice(3).map((item) => <span key={item}>{item}</span>)}</div>
      <div className="entry-stage">
        <div className="entry-globe" aria-hidden="true">
          <div className="entry-globe__grid" />
          <div className="entry-globe__continents" />
          <i className="entry-node entry-node--india" />
          <i className="entry-node entry-node--china" />
          <i className="entry-node entry-node--usa" />
          <i className="entry-route entry-route--a" />
          <i className="entry-route entry-route--b" />
          <i className="entry-route entry-route--c" />
        </div>
        <div className="entry-analyst" aria-hidden="true">
          <div className="entry-analyst__head" />
          <div className="entry-analyst__body" />
          <div className="entry-analyst__arm entry-analyst__arm--left" />
          <div className="entry-analyst__arm entry-analyst__arm--right" />
        </div>
      </div>
      <div className="entry-copy">
        <p className="entry-kicker">TRINETRA / STRATEGIC INTELLIGENCE</p>
        <h1>The world is not<br /><em>what it looks like.</em></h1>
        <p className="entry-sub">Power is only one layer. Understand the system.</p>
      </div>
      <div className="entry-logo">
        <div className="entry-trinetra-mark"><b /><b /><b /></div>
        <strong>TRINETRA</strong>
        <span>STRATEGIC INTELLIGENCE</span>
      </div>
      <div className="entry-progress"><span /></div>
    </div>
  );
}
