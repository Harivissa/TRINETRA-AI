interface Props {
  label: string;
  aLabel: string;
  bLabel: string;
  aValue: number;
  bValue: number;
}

export default function ComparisonBar({ label, aLabel, bLabel, aValue, bValue }: Props) {
  const total = Math.max(aValue + bValue, 1);
  const aPct = (aValue / total) * 100;

  return (
    <div className="mb-5">
      <div className="flex justify-between text-sm text-neutral-400 mb-1">
        <span>{label}</span>
      </div>
      <div className="flex h-6 rounded overflow-hidden border border-trinetra-border">
        <div
          className="bg-trinetra-saffron flex items-center justify-start pl-2 text-xs text-black font-semibold"
          style={{ width: `${aPct}%` }}
        >
          {aLabel} {aValue}
        </div>
        <div
          className="bg-neutral-700 flex items-center justify-end pr-2 text-xs text-neutral-200 font-semibold"
          style={{ width: `${100 - aPct}%` }}
        >
          {bValue} {bLabel}
        </div>
      </div>
    </div>
  );
}
