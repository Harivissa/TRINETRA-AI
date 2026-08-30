interface Stat {
  value: string;
  label: string;
}

export default function StatRow({ stats }: { stats: Stat[] }) {
  return (
    <div className="flex justify-center gap-16 py-10 border-b border-trinetra-border">
      {stats.map((s) => (
        <div key={s.label} className="text-center">
          <div className="font-display text-4xl text-trinetra-saffron">{s.value}</div>
          <div className="text-sm text-neutral-400 mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
