import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

interface Props {
  activeConflicts?: number;
  criticalWars?: number;
  nationsCovered?: number;
  historicalBattles?: number;
  intelligenceSections?: number;
}

export default function MapMetricsStrip({
  activeConflicts = 24,
  criticalWars = 6,
  nationsCovered = 49,
  historicalBattles = 9115,
  intelligenceSections = 19,
}: Props) {
  return (
    <div
      id="map-metrics-strip"
      className="w-full mt-5 p-4 sm:p-6 rounded-xl border border-white/10 bg-[#07090d] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl"
    >
      {/* 5 Distinct Metrics Matching Reference Image */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 w-full md:w-auto">
        {/* Metric 1 */}
        <div className="flex flex-col">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#FF7A00] font-mono tracking-tight">
            {activeConflicts}
          </span>
          <span className="text-xs text-neutral-400 font-medium mt-0.5">
            Active Conflicts
          </span>
        </div>

        {/* Metric 2 */}
        <div className="flex flex-col">
          <span className="text-2xl sm:text-3xl font-extrabold text-red-500 font-mono tracking-tight">
            {criticalWars}
          </span>
          <span className="text-xs text-neutral-400 font-medium mt-0.5">
            Critical Wars
          </span>
        </div>

        {/* Metric 3 */}
        <div className="flex flex-col">
          <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
            {nationsCovered}
          </span>
          <span className="text-xs text-neutral-400 font-medium mt-0.5">
            Nations Covered
          </span>
        </div>

        {/* Metric 4 */}
        <div className="flex flex-col">
          <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
            {historicalBattles.toLocaleString()}
          </span>
          <span className="text-xs text-neutral-400 font-medium mt-0.5">
            Historical Battles
          </span>
        </div>

        {/* Metric 5 */}
        <div className="flex flex-col">
          <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
            {intelligenceSections}
          </span>
          <span className="text-xs text-neutral-400 font-medium mt-0.5">
            Intelligence Sections
          </span>
        </div>
      </div>

      {/* Button on Right (Matching Reference Image "Open Global Analysis ->") */}
      <div className="w-full md:w-auto shrink-0 flex justify-end">
        <Link
          to="/analyze"
          id="btn-open-global-analysis"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#FF7A00]/80 bg-[#FF7A00]/10 hover:bg-[#FF7A00] text-[#FF7A00] hover:text-black font-semibold text-sm transition-all duration-200 group shadow-lg shadow-orange-500/10"
        >
          <span>Open Global Analysis</span>
          <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
