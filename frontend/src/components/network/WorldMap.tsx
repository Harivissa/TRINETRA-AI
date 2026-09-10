import { useEffect, useMemo, useState } from "react";
import { CircleMarker, GeoJSON, MapContainer, Polyline, TileLayer, Tooltip, useMap } from "react-leaflet";
import type { GeoJsonObject } from "geojson";
import "leaflet/dist/leaflet.css";
import { RotateCcw, Search, Layers } from "lucide-react";

interface Node { id: string; label: string; }
interface Edge { source: string; target: string; type: string; }
interface Props { nodes: Node[]; edges: Edge[]; onSelect?: (id: string) => void; }

const GEOJSON_URL = "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";
const coordinates: Record<string, [number, number]> = {};
const chokepoints: { name: string; position: [number, number] }[] = [];

function ResetView() { const map = useMap(); return <button className="map-control" onClick={() => map.setView([20, 10], 2)} aria-label="Reset world view"><RotateCcw size={15} /></button>; }
function Focus({ id }: { id: string | null }) { const map = useMap(); useEffect(() => { if (id && coordinates[id]) map.flyTo(coordinates[id], 4, { duration: 0.7 }); }, [id, map]); return null; }

export default function WorldMap({ nodes, edges, onSelect }: Props) {
  const [geo, setGeo] = useState<GeoJsonObject | null>(null); const [geoError, setGeoError] = useState(false); const [selected, setSelected] = useState<string | null>(null); const [showRelations, setShowRelations] = useState(true); const [showChokepoints, setShowChokepoints] = useState(false); const [query, setQuery] = useState("");
  useEffect(() => { fetch(GEOJSON_URL).then((r) => { if (!r.ok) throw new Error("map"); return r.json(); }).then(setGeo).catch(() => setGeoError(true)); }, []);
  const countries = useMemo(() => new Set(nodes.map((n) => n.id)), [nodes]);
  const visibleEdges = edges.filter((e) => showRelations && selected && (e.source === selected || e.target === selected) && coordinates[e.source] && coordinates[e.target]);
  const results = nodes.map((n) => ({ id: n.id, label: n.label, position: coordinates[n.id] })).filter((x) => x.position && x.label.toLowerCase().includes(query.toLowerCase())).slice(0, 6);
  const selectCountry = (id: string) => { setSelected(id); onSelect?.(id); };
  return <div className="map-shell">
    <div className="map-toolbar"><div className="map-search"><Search size={15} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search countries or chokepoints" aria-label="Search map" />{query && <div className="map-results">{results.map((r) => <button key={r.id} onClick={() => { if (coordinates[r.id]) selectCountry(r.id); setQuery(""); }}>{r.label}<span>{coordinates[r.id] ? r.id : "Geographic feature"}</span></button>)}</div>}</div><div className="map-layers"><Layers size={15} /><label><input type="checkbox" checked={showRelations} onChange={(e) => setShowRelations(e.target.checked)} /> Relationships</label><label><input type="checkbox" checked={showChokepoints} onChange={(e) => setShowChokepoints(e.target.checked)} /> Chokepoints</label></div></div>
    <div className="map-frame"><MapContainer center={[20, 10]} zoom={2} minZoom={2} maxZoom={7} worldCopyJump scrollWheelZoom className="h-full w-full"><TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><ResetView /><Focus id={selected} />{geo && <GeoJSON data={geo} style={(feature) => { const id = feature?.properties?.ISO_A3 || feature?.properties?.ADM0_A3; const active = id === selected; return { color: active ? "#ff9933" : "#555", weight: active ? 2 : 0.6, fillColor: countries.has(id) ? "#2b2118" : "#151515", fillOpacity: active ? 0.75 : countries.has(id) ? 0.42 : 0.2 }; }} onEachFeature={(feature, layer) => { const id = feature.properties?.ISO_A3 || feature.properties?.ADM0_A3; const node = nodes.find((n) => n.id === id); if (node) { layer.bindTooltip(`${node.label || id}<br/><span>${id}</span>`); layer.on({ click: () => selectCountry(id), mouseover: (e) => e.target.setStyle({ fillOpacity: 0.65 }), mouseout: (e) => e.target.setStyle({ fillOpacity: id === selected ? 0.75 : countries.has(id) ? 0.42 : 0.2 }) }); } }} />}{visibleEdges.map((e, i) => <Polyline key={`${e.source}-${e.target}-${i}`} positions={[coordinates[e.source], coordinates[e.target]]} pathOptions={{ color: e.type === "rivalry" ? "#b85c5c" : "#ff9933", weight: 2, opacity: 0.8, dashArray: e.type === "rivalry" ? "5 5" : undefined }} />)}{nodes.filter((n) => coordinates[n.id]).map((n) => <CircleMarker key={n.id} center={coordinates[n.id]} radius={selected === n.id ? 7 : 4} pathOptions={{ color: selected === n.id ? "#ff9933" : "#d5d0c8", fillColor: selected === n.id ? "#ff9933" : "#d5d0c8", fillOpacity: 1 }} eventHandlers={{ click: () => selectCountry(n.id) }}><Tooltip>{n.label}<br /><span>{n.id}</span></Tooltip></CircleMarker>)}{showChokepoints && chokepoints.map((c) => <CircleMarker key={c.name} center={c.position} radius={5} pathOptions={{ color: "#ff9933", fillColor: "#ff9933", fillOpacity: 0.8 }}><Tooltip>{c.name}<br /><span>Geographic feature</span></Tooltip></CircleMarker>)}</MapContainer>{geoError && <div className="map-notice">Geographic boundary data unavailable. Base map remains available.</div>} {!geo && !geoError && <div className="map-loading">Loading global map<br /><span>Loading geographic data…</span></div>}</div>
  </div>;
}

export { coordinates };
export type { Edge, Node };
