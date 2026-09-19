import type { CountryIndexEntry } from "../../types";

interface Props {
  label: string;
  countries: CountryIndexEntry[];
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
  disabledOptionId?: string;
  loading?: boolean;
  error?: string | null;
}

export default function CountrySelect({
  label,
  countries,
  value,
  onChange,
  disabled = false,
  disabledOptionId,
  loading = false,
  error = null,
}: Props) {
  return (
    <div className="flex-1">
      <label className="block text-xs uppercase tracking-wide text-neutral-500 mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || loading}
        className="w-full bg-trinetra-panel border border-trinetra-border rounded px-4 py-3 text-neutral-200 focus:outline-none focus:border-trinetra-saffron disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <option value="" disabled>
            Loading countries…
          </option>
        ) : error ? (
          <option value="" disabled>
            Failed to load countries
          </option>
        ) : countries.length === 0 ? (
          <option value="" disabled>
            No countries available
          </option>
        ) : (
          <option value="">Select a country</option>
        )}
        {countries.map((c) => {
          const isSelectedElsewhere = disabledOptionId ? c.id === disabledOptionId : false;
          return (
            <option key={c.id} value={c.id} disabled={isSelectedElsewhere}>
              {c.name}
              {isSelectedElsewhere ? " (already selected)" : ""}
            </option>
          );
        })}
      </select>
    </div>
  );
}
