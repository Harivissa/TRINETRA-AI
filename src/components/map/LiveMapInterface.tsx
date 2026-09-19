import { useState } from "react";
import RealGeospatialMap from "./RealGeospatialMap";
import Interactive3DGlobe from "./Interactive3DGlobe";
import GlobalSituationPanel from "./GlobalSituationPanel";
import MapMetricsStrip from "./MapMetricsStrip";
import { type MapEvent } from "../../data/liveMapData";

interface Props {
  className?: string;
  countryCount?: number;
  chokepointCount?: number;
  groupCount?: number;
}

export default function LiveMapInterface({
  className = "",
  countryCount = 49,
  chokepointCount = 8,
  groupCount = 6,
}: Props) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>("ev-ukraine-war");
  const [is3DMode, setIs3DMode] = useState(false);

  const handleSelectEvent = (event: MapEvent) => {
    setSelectedEventId(event.id);
  };

  const toggle3DGlobe = () => {
    setIs3DMode((prev) => !prev);
  };

  return (
    <div className={`w-full flex flex-col ${className}`}>
      {/* Central Viewport: Real Geospatial Map (Left) + Situation Panel (Right) */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 w-full items-stretch">
        {/* Real Interactive Map Canvas */}
        {is3DMode ? (
          <Interactive3DGlobe
            selectedEventId={selectedEventId}
            onSelectEvent={handleSelectEvent}
            onToggle2DMap={() => setIs3DMode(false)}
          />
        ) : (
          <RealGeospatialMap
            selectedEventId={selectedEventId}
            onSelectEvent={handleSelectEvent}
            onToggle3DGlobe={toggle3DGlobe}
            is3DMode={is3DMode}
          />
        )}

        {/* Global Situation Overview Panel */}
        <GlobalSituationPanel
          selectedEventId={selectedEventId}
          onSelectEvent={handleSelectEvent}
        />
      </div>

      {/* Bottom Metrics Strip */}
      <MapMetricsStrip
        activeConflicts={24}
        criticalWars={6}
        nationsCovered={countryCount}
        historicalBattles={9115}
        intelligenceSections={19}
      />
    </div>
  );
}
