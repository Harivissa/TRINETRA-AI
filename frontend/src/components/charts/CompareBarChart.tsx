import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

interface Props {
  data: { metric: string; a: number; b: number }[];
  aLabel: string;
  bLabel: string;
  height?: number;
}

export default function CompareBarChart({ data, aLabel, bLabel, height = 260 }: Props) {
  const chartData = data.map((d) => ({ metric: d.metric, [aLabel]: d.a, [bLabel]: d.b }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#262626" horizontal={false} />
        <XAxis type="number" tick={{ fill: "#737373", fontSize: 11 }} />
        <YAxis type="category" dataKey="metric" tick={{ fill: "#a3a3a3", fontSize: 12 }} width={140} />
        <Tooltip
          contentStyle={{ background: "#111111", border: "1px solid #262626", borderRadius: 6 }}
          labelStyle={{ color: "#ff9933" }}
          cursor={{ fill: "#262626", opacity: 0.3 }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: "#a3a3a3" }} />
        <Bar dataKey={aLabel} radius={[0, 4, 4, 0]}>
          {chartData.map((_, i) => <Cell key={i} fill="#ff9933" />)}
        </Bar>
        <Bar dataKey={bLabel} radius={[0, 4, 4, 0]}>
          {chartData.map((_, i) => <Cell key={i} fill="#525252" />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
