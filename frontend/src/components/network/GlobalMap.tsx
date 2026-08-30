import { useMemo, useState } from "react";

interface Node {
  id: string;
  label: string;
}
interface Edge {
  source: string;
  target: string;
  type: string;
}

interface Props {
  nodes: Node[];
  edges: Edge[];
}

const WIDTH = 640;
const HEIGHT = 640;
const RADIUS = 260;
const CENTER = { x: WIDTH / 2, y: HEIGHT / 2 };

export default function GlobalMap({ nodes, edges }: Props) {
  const [filter, setFilter] = useState<"all" | "alliance" | "rivalry">("all");
  const [hovered, setHovered] = useState<string | null>(null);

  const positions = useMemo(() => {
    const map: Record<string, { x: number; y: number }> = {};
    nodes.forEach((n, i) => {
      const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
      map[n.id] = {
        x: CENTER.x + RADIUS * Math.cos(angle),
        y: CENTER.y + RADIUS * Math.sin(angle),
      };
    });
    return map;
  }, [nodes]);

  const visibleEdges = edges.filter((e) => filter === "all" || e.type === filter);
  const highlightedEdges = hovered
    ? visibleEdges.filter((e) => e.source === hovered || e.target === hovered)
    : visibleEdges;

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {(["all", "alliance", "rivalry"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded border ${
              filter === f
                ? "border-trinetra-saffron text-trinetra-saffron"
                : "border-trinetra-border text-neutral-400"
            }`}
          >
            {f === "all" ? "All ties" : f === "alliance" ? "Alliances only" : "Rivalries only"}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full max-w-2xl mx-auto">
        {highlightedEdges.map((e, i) => {
          const a = positions[e.source];
          const b = positions[e.target];
          if (!a || !b) return null;
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={e.type === "rivalry" ? "#f87171" : "#ff9933"}
              strokeWidth={hovered ? 1.6 : 0.8}
              opacity={hovered ? 0.9 : 0.35}
            />
          );
        })}

        {nodes.map((n) => {
          const p = positions[n.id];
          if (!p) return null;
          const isActive = hovered === n.id;
          return (
            <g
              key={n.id}
              onMouseEnter={() => setHovered(n.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
            >
              <circle cx={p.x} cy={p.y} r={isActive ? 10 : 7} fill={isActive ? "#ff9933" : "#e5e5e5"} />
              <text
                x={p.x}
                y={p.y - 14}
                textAnchor="middle"
                fontSize="11"
                fill={isActive ? "#ff9933" : "#a3a3a3"}
                fontFamily="DM Sans, sans-serif"
              >
                {n.id}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="flex gap-6 justify-center mt-4 text-xs text-neutral-400">
        <span className="flex items-center gap-2"><span className="w-3 h-0.5 bg-trinetra-saffron inline-block" /> Alliance</span>
        <span className="flex items-center gap-2"><span className="w-3 h-0.5 bg-red-400 inline-block" /> Rivalry</span>
      </div>
    </div>
  );
}
