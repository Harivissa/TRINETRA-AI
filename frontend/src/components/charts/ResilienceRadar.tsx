import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface Dimension {
  dimension: string;
  country_a_value: number;
  country_b_value: number;
}

interface Props {
  dimensions: Dimension[];
  aLabel: string;
  bLabel: string;
}

export default function ResilienceRadar({ dimensions, aLabel, bLabel }: Props) {
  // Normalize each dimension to 0-100 so wildly different scales (troop counts
  // vs GDP-derived scores) don't distort the shape of the radar.
  const data = dimensions.map((d) => {
    const max = Math.max(d.country_a_value, d.country_b_value, 1);
    return {
      dimension: d.dimension,
      [aLabel]: Math.round((d.country_a_value / max) * 100),
      [bLabel]: Math.round((d.country_b_value / max) * 100),
    };
  });

  return (
    <ResponsiveContainer width="100%" height={360}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
        <PolarGrid stroke="#262626" />
        <PolarAngleAxis dataKey="dimension" tick={{ fill: "#a3a3a3", fontSize: 11 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#525252", fontSize: 9 }} />
        <Radar name={aLabel} dataKey={aLabel} stroke="#ff9933" fill="#ff9933" fillOpacity={0.35} strokeWidth={2} />
        <Radar name={bLabel} dataKey={bLabel} stroke="#e5e5e5" fill="#e5e5e5" fillOpacity={0.15} strokeWidth={2} />
        <Legend wrapperStyle={{ fontSize: 12, color: "#a3a3a3" }} />
        <Tooltip contentStyle={{ background: "#111111", border: "1px solid #262626", borderRadius: 6 }} labelStyle={{ color: "#ff9933" }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
