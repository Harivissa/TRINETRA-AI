import type { CountryIndexEntry } from "../../types";

interface Props {
  label: string;
  countries: CountryIndexEntry[];
  value: string;
  onChange: (id: string) => void;
}

export default function CountrySelect({ label, countries, value, onChange }: Props) {
  return (
    <div className="flex-1">
      <label className="block text-xs uppercase tracking-wide text-neutral-500 mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-trinetra-panel border border-trinetra-border rounded px-4 py-3 text-neutral-200 focus:outline-none focus:border-trinetra-saffron"
      >
        <option value="">Select a country</option>
        {countries.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
