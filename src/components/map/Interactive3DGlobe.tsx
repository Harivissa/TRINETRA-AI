import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import {
  RotateCcw,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  Compass,
  Globe2,
  Anchor,
  Flame,
  Layers,
  X,
  Eye,
} from "lucide-react";
import {
  MAP_ACTIVE_EVENTS,
  MAP_CHOKEPOINTS,
  MAP_STRATEGIC_ROUTES,
  MAP_SOVEREIGNS,
  type MapEvent,
  type MapChokepoint,
  resolveMapEntityImage,
} from "../../data/liveMapData";

interface Props {
  selectedEventId: string | null;
  onSelectEvent: (event: MapEvent) => void;
  onToggle2DMap?: () => void;
}

export default function Interactive3DGlobe({
  selectedEventId,
  onSelectEvent,
  onToggle2DMap,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rotation, setRotation] = useState<[number, number]>([20, 20]); // [lng, lat]
  const [zoom, setZoom] = useState<number>(1);
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [geoFeatures, setGeoFeatures] = useState<any[]>([]);
  const [inspectedEntity, setInspectedEntity] = useState<any | null>(null);

  // Load official Natural Earth GeoJSON for 3D Globe projection
  useEffect(() => {
    fetch("/data/world-countries.geojson")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.features) {
          setGeoFeatures(data.features);
        }
      })
      .catch((err) => console.warn("3D Globe GeoJSON load:", err));
  }, []);

  // Orthographic projection math: converts [lng, lat] to [x, y, isVisible]
  const project = useCallback(
    (
      lng: number,
      lat: number,
      width: number,
      height: number,
      centerLng: number,
      centerLat: number,
      radius: number
    ): [number, number, boolean] => {
      const rad = Math.PI / 180;
      const lambda = lng * rad;
      const phi = lat * rad;
      const lambda0 = centerLng * rad;
      const phi0 = centerLat * rad;

      const cosC =
        Math.sin(phi0) * Math.sin(phi) +
        Math.cos(phi0) * Math.cos(phi) * Math.cos(lambda - lambda0);

      if (cosC < 0) {
        return [0, 0, false]; // Point is on the far/dark side of the globe
      }

      const k = radius;
      const x = width / 2 + k * Math.cos(phi) * Math.sin(lambda - lambda0);
      const y =
        height / 2 -
        k *
          (Math.cos(phi0) * Math.sin(phi) -
            Math.sin(phi0) * Math.cos(phi) * Math.cos(lambda - lambda0));

      return [x, y, true];
    },
    []
  );

  // Render loop on HTML5 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 800);
      const height = (canvas.height = canvas.parentElement?.clientHeight || 600);
      const radius = Math.min(width, height) * 0.42 * zoom;

      // Deep space tactical backdrop
      ctx.fillStyle = "#050608";
      ctx.fillRect(0, 0, width, height);

      // Starfield / subtle tactical grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Outer atmosphere glow
      const glowGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        radius * 0.95,
        width / 2,
        height / 2,
        radius * 1.15
      );
      glowGrad.addColorStop(0, "rgba(56, 189, 248, 0.15)");
      glowGrad.addColorStop(0.5, "rgba(255, 122, 0, 0.05)");
      glowGrad.addColorStop(1, "transparent");
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, radius * 1.15, 0, Math.PI * 2);
      ctx.fill();

      // Earth sphere base (Deep oceanic dark blue/black)
      const oceanGrad = ctx.createRadialGradient(
        width / 2 - radius * 0.3,
        height / 2 - radius * 0.3,
        radius * 0.1,
        width / 2,
        height / 2,
        radius
      );
      oceanGrad.addColorStop(0, "#0a1322");
      oceanGrad.addColorStop(0.7, "#060a12");
      oceanGrad.addColorStop(1, "#030408");

      ctx.save();
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
      ctx.fillStyle = oceanGrad;
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.clip(); // Clip everything to the spherical disk

      // Draw graticule lines (Latitude & Longitude parallels on sphere)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
      ctx.lineWidth = 0.75;
      for (let lat = -80; lat <= 80; lat += 20) {
        ctx.beginPath();
        let first = true;
        for (let lng = -180; lng <= 180; lng += 5) {
          const [px, py, vis] = project(
            lng,
            lat,
            width,
            height,
            rotation[0],
            rotation[1],
            radius
          );
          if (vis) {
            if (first) {
              ctx.moveTo(px, py);
              first = false;
            } else {
              ctx.lineTo(px, py);
            }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      }

      // Draw Real Country Geometry from Natural Earth
      if (geoFeatures.length > 0) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
        ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
        ctx.lineWidth = 0.75;

        geoFeatures.forEach((feat) => {
          const geom = feat.geometry;
          if (!geom) return;

          const renderPolygon = (coords: number[][]) => {
            ctx.beginPath();
            let hasVisible = false;
            coords.forEach(([lng, lat], i) => {
              const [px, py, vis] = project(
                lng,
                lat,
                width,
                height,
                rotation[0],
                rotation[1],
                radius
              );
              if (vis) {
                hasVisible = true;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
              }
            });
            if (hasVisible) {
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
            }
          };

          if (geom.type === "Polygon") {
            geom.coordinates.forEach((ring: number[][]) => renderPolygon(ring));
          } else if (geom.type === "MultiPolygon") {
            geom.coordinates.forEach((poly: number[][][]) => {
              poly.forEach((ring: number[][]) => renderPolygon(ring));
            });
          }
        });
      }

      // Draw Strategic Corridors (Polylines) on the 3D sphere
      MAP_STRATEGIC_ROUTES.forEach((route) => {
        ctx.strokeStyle = route.color;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        let started = false;
        route.coordinates.forEach(([lat, lng]) => {
          const [px, py, vis] = project(
            lng,
            lat,
            width,
            height,
            rotation[0],
            rotation[1],
            radius
          );
          if (vis) {
            if (!started) {
              ctx.moveTo(px, py);
              started = true;
            } else {
              ctx.lineTo(px, py);
            }
          } else {
            started = false;
          }
        });
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Draw Maritime Chokepoints (Cyan anchors)
      MAP_CHOKEPOINTS.forEach((cp) => {
        const [px, py, vis] = project(
          cp.coordinates[1],
          cp.coordinates[0],
          width,
          height,
          rotation[0],
          rotation[1],
          radius
        );
        if (vis) {
          ctx.beginPath();
          ctx.arc(px, py, 6, 0, Math.PI * 2);
          ctx.fillStyle = "#0284c7";
          ctx.fill();
          ctx.strokeStyle = "#38bdf8";
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Label
          ctx.font = "9px 'JetBrains Mono', monospace";
          ctx.fillStyle = "#bae6fd";
          ctx.fillText(cp.name, px + 9, py + 3);
        }
      });

      // Draw Active Flashpoints / Conflicts (Pulsing Red Concentric Rings)
      const pulseTime = Date.now() * 0.003;
      const pulseRadius = 5 + Math.sin(pulseTime) * 3;

      MAP_ACTIVE_EVENTS.forEach((ev) => {
        const [px, py, vis] = project(
          ev.coordinates[1],
          ev.coordinates[0],
          width,
          height,
          rotation[0],
          rotation[1],
          radius
        );
        if (vis) {
          const isCritical = ev.severity === "CRITICAL";

          // Concentric radar ring
          ctx.beginPath();
          ctx.arc(px, py, pulseRadius + 6, 0, Math.PI * 2);
          ctx.strokeStyle = isCritical
            ? "rgba(239, 68, 68, 0.45)"
            : "rgba(245, 158, 11, 0.45)";
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Core dot
          ctx.beginPath();
          ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fillStyle = isCritical ? "#ef4444" : "#f59e0b";
          ctx.fill();

          // Label
          ctx.font = "bold 10px sans-serif";
          ctx.fillStyle = "#ffffff";
          ctx.fillText(ev.title, px + 10, py - 3);

          ctx.font = "8px 'JetBrains Mono', monospace";
          ctx.fillStyle = isCritical ? "#f87171" : "#fbbf24";
          ctx.fillText(ev.severity, px + 10, py + 8);
        }
      });

      // Terminal shadow crescent on sphere (Spherical lighting)
      const shadowGrad = ctx.createRadialGradient(
        width / 2 + radius * 0.4,
        height / 2 + radius * 0.4,
        radius * 0.4,
        width / 2,
        height / 2,
        radius
      );
      shadowGrad.addColorStop(0, "transparent");
      shadowGrad.addColorStop(0.8, "rgba(0, 0, 0, 0.35)");
      shadowGrad.addColorStop(1, "rgba(0, 0, 0, 0.75)");
      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    render();
    animId = requestAnimationFrame(function loop() {
      render();
      animId = requestAnimationFrame(loop);
    });

    return () => cancelAnimationFrame(animId);
  }, [rotation, zoom, geoFeatures, project]);

  // Mouse drag handlers for spherical rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    setRotation(([lng, lat]) => [
      lng + dx * 0.5,
      Math.max(-85, Math.min(85, lat - dy * 0.5)),
    ]);
  };

  const handleMouseUp = () => setIsDragging(false);

  // Zoom controls
  const handleZoomIn = () => setZoom((z) => Math.min(2.5, z * 1.15));
  const handleZoomOut = () => setZoom((z) => Math.max(0.6, z / 1.15));
  const handleReset = () => {
    setRotation([20, 20]);
    setZoom(1);
  };

  return (
    <div
      id="interactive-3d-globe-container"
      className="relative flex-1 min-h-[580px] lg:min-h-[640px] xl:min-h-[700px] bg-[#050608] rounded-xl border border-white/10 overflow-hidden shadow-2xl flex"
    >
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="size-full cursor-grab active:cursor-grabbing select-none"
      />

      {/* Top Left Indicator */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/80 border border-white/15 px-3 py-1.5 rounded-lg backdrop-blur-md">
        <Globe2 className="size-4 text-[#FF7A00] animate-spin-slow" />
        <span className="text-xs font-mono font-bold text-white uppercase">
          3D ORTHOGRAPHIC GLOBE PROJECTION
        </span>
      </div>

      {/* Top Right Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={onToggle2DMap}
          className="px-3 py-1.5 rounded-lg bg-[#FF7A00] text-black font-semibold text-xs hover:bg-[#ff9933] shadow-md transition-colors"
        >
          Switch to 2D Planar Map
        </button>

        <div className="flex items-center rounded-lg bg-black/85 border border-white/15 overflow-hidden backdrop-blur-md divide-x divide-white/10">
          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-2 text-neutral-300 hover:text-white hover:bg-white/10"
          >
            <Plus className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-2 text-neutral-300 hover:text-white hover:bg-white/10"
          >
            <Minus className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={handleReset}
            title="Reset Orientation"
            className="p-2 text-neutral-300 hover:text-white hover:bg-white/10"
          >
            <RotateCcw className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Information */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="px-3 py-1.5 rounded-lg bg-black/85 border border-white/15 text-[11px] font-mono text-neutral-300 backdrop-blur-md pointer-events-auto">
          Drag to rotate globe · Scroll / buttons to zoom · True spherical projection
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-black/85 border border-white/15 text-[11px] font-mono text-[#FF7A00] backdrop-blur-md pointer-events-auto">
          Natural Earth Admin-0 Verified Geometry
        </div>
      </div>
    </div>
  );
}
