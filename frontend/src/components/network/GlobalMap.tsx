import { useMemo, useState } from "react";

interface Node { id: string; label: string; }
interface Edge { source: string; target: string; type: string; }
interface Props { nodes: Node[]; edges: Edge[]; }
const WIDTH = 640; const HEIGHT = 560; const RADIUS = 220; const CENTER = { x: WIDTH / 2, y: HEIGHT / 2 };

export default function GlobalMap({ nodes, edges }: Props) {
  const [filter, setFilter] = useState<"all" | "alliance" | "rivalry">("all");
  const [hovered, setHovered] = useState<string | null>(null);
  const positions = useMemo(() => Object.fromEntries(nodes.map((n, i) => { const angle = (2 * Math.PI * i) / Math.max(nodes.length, 1) - Math.PI / 2; return [n.id, { x: CENTER.x + RADIUS * Math.cos(angle), y: CENTER.y + RADIUS * Math.sin(angle) }]; })), [nodes]);
  const visibleEdges = edges.filter((e) => filter === "all" || e.type === filter);
  const activeNode = nodes.find((n) => n.id === hovered);
  const activeTies = hovered ? visibleEdges.filter((e) => e.source === hovered || e.target === hovered) : [];

  return <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
    <div><div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter relationships">{(["all", "alliance", "rivalry"] as const).map((f) => <button key={f} onClick={() => setFilter(f)} aria-pressed={filter === f} className={`rounded border px-3 py-1.5 text-xs transition-colors ${filter === f ? "border-trinetra-saffron bg-trinetra-saffron text-black" : "border-trinetra-border text-neutral-400 hover:text-white"}`}>{f === "all" ? "All ties" : f === "alliance" ? "Alliances only" : "Rivalries only"}</button>)}</div>
      <div className="overflow-hidden rounded border border-trinetra-border bg-trinetra-bg"><svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="mx-auto aspect-[640/560] w-full" role="img" aria-label="Interactive geopolitical relationship network">{visibleEdges.map((e, i) => { const a = positions[e.source]; const b = positions[e.target]; if (!a || !b) return null; const active = !hovered || e.source === hovered || e.target === hovered; return <line key={`${e.source}-${e.target}-${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={e.type === "rivalry" ? "#f87171" : "#ff9933"} strokeWidth={active && hovered ? 2 : 1} opacity={active ? (hovered ? .9 : .35) : .06} />; })}{nodes.map((n) => { const p = positions[n.id]; if (!p) return null; const active = hovered === n.id; return <g key={n.id} onMouseEnter={() => setHovered(n.id)} onMouseLeave={() => setHovered(null)}><circle cx={p.x} cy={p.y} r={active ? 10 : 6} fill={active ? "#ff9933" : "#e5e5e5"} stroke={active ? "#ff9933" : "transparent"} strokeWidth="5" strokeOpacity=".15" /><text x={p.x} y={p.y - 14} textAnchor="middle" fontSize="11" fill={active ? "#ff9933" : "#a3a3a3"} fontFamily="DM Sans, sans-serif">{n.id}</text></g>; })}</svg></div><div className="mt-3 flex flex-wrap gap-5 text-xs text-neutral-400"><span className="flex items-center gap-2"><span className="h-0.5 w-4 bg-trinetra-saffron" /> Alliance</span><span className="flex items-center gap-2"><span className="h-0.5 w-4 bg-red-400" /> Rivalry</span><span className="text-neutral-500">Hover a node to isolate ties</span></div></div>
    <aside className="rounded border border-trinetra-border bg-trinetra-panel p-4" aria-live="polite"><p className="font-mono text-[10px] uppercase tracking-widest text-trinetra-saffron">Node inspector</p>{activeNode ? <><h2 className="mt-4 font-display text-2xl text-white">{activeNode.label || activeNode.id}</h2><p className="mt-1 font-mono text-xs text-neutral-500">{activeNode.id}</p><div className="mt-6 border-t border-trinetra-border pt-4"><p className="text-xs text-neutral-500">Visible ties</p><p className="mt-1 font-display text-3xl text-trinetra-saffron">{activeTies.length}</p></div></> : <p className="mt-4 text-sm leading-6 text-neutral-400">Select a nation on the network to inspect its visible alliances and rivalries.</p>}</aside>
  </div>;
}
