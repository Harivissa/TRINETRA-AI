import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import L from "leaflet";
import {
  Layers,
  Flame,
  Link2,
  Users,
  Search,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  RotateCcw,
  Globe2,
  Shield,
  Anchor,
  MapPin,
  ExternalLink,
  ChevronDown,
  X,
  Eye,
  Check,
  Compass,
} from "lucide-react";
import {
  MAP_CHOKEPOINTS,
  MAP_ACTIVE_EVENTS,
  MAP_STRATEGIC_ROUTES,
  MAP_SOVEREIGNS,
  type MapChokepoint,
  type MapEvent,
  type MapCountryMarker,
  resolveMapEntityImage,
} from "../../data/liveMapData";

type BasemapType = "satellite" | "dark" | "terrain";

interface Props {
  selectedEventId: string | null;
  onSelectEvent: (event: MapEvent) => void;
  onSelectCountry?: (countryId: string) => void;
  onToggle3DGlobe?: () => void;
  is3DMode?: boolean;
}

export default function RealGeospatialMap({
  selectedEventId,
  onSelectEvent,
  onSelectCountry,
  onToggle3DGlobe,
  is3DMode = false,
}: Props) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routesLayerRef = useRef<L.LayerGroup | null>(null);

  // Basemap selector state
  const [basemap, setBasemap] = useState<BasemapType>("satellite");
  const [basemapDropdownOpen, setBasemapDropdownOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Layer visibility toggles (Layers toolbar)
  const [layersOpen, setLayersOpen] = useState(false);
  const [showBorders, setShowBorders] = useState(true);
  const [showChokepoints, setShowChokepoints] = useState(true);
  const [showEvents, setShowEvents] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [showSovereigns, setShowSovereigns] = useState(true);

  // Active toolbar view
  const [activeTool, setActiveTool] = useState<"none" | "layers" | "events" | "rivalries" | "groups" | "search">("none");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // Inspector drawer for selected entity on map
  const [inspectedEntity, setInspectedEntity] = useState<{
    type: "event" | "chokepoint" | "sovereign";
    data: any;
  } | null>(null);

  // Basemap tile definitions (legitimate, high-quality, free public tiles)
  const BASEMAP_URLS = {
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: "Esri, Maxar, Earthstar Geographics",
      label: "Satellite (Real)",
      maxZoom: 19,
    },
    dark: {
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      attribution: "CARTO, OpenStreetMap",
      label: "Dark Tactical",
      maxZoom: 19,
    },
    terrain: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}",
      attribution: "Esri, USGS",
      label: "Tactical Terrain",
      maxZoom: 18,
    },
  };

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Create map with standard world bounds
    const map = L.map(mapContainerRef.current, {
      center: [20, 15],
      zoom: 2.5,
      minZoom: 1.8,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false,
      worldCopyJump: true,
    });

    // Add initial base tile layer
    const currentBase = BASEMAP_URLS[basemap];
    const tiles = L.tileLayer(currentBase.url, {
      attribution: currentBase.attribution,
      maxZoom: currentBase.maxZoom,
      subdomains: "abcd",
    }).addTo(map);
    tileLayerRef.current = tiles;

    // Layer groups for dynamic controls
    markersLayerRef.current = L.layerGroup().addTo(map);
    routesLayerRef.current = L.layerGroup().addTo(map);

    // Load authentic Natural Earth world boundaries GeoJSON
    fetch("/data/world-countries.geojson")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load GeoJSON");
        return res.json();
      })
      .then((geoData) => {
        if (!mapInstanceRef.current) return;

        const geoLayer = L.geoJSON(geoData, {
          style: (feature) => {
            const iso = feature?.properties?.ISO_A3;
            // Highlight if group selected
            let strokeColor = "rgba(255, 255, 255, 0.22)";
            let fillColor = "transparent";
            let fillOpacity = 0;

            if (selectedGroup) {
              const inGroup = isCountryInGroup(iso, selectedGroup);
              if (inGroup) {
                strokeColor = "#FF7A00";
                fillColor = "#FF7A00";
                fillOpacity = 0.18;
              }
            }

            return {
              color: strokeColor,
              weight: selectedGroup ? 1.2 : 0.8,
              opacity: 0.8,
              fillColor,
              fillOpacity,
            };
          },
          onEachFeature: (feature, layer) => {
            const name = feature.properties?.NAME || "Country";
            const iso = feature.properties?.ISO_A3 || "";

            layer.on({
              mouseover: (e) => {
                const target = e.target;
                target.setStyle({
                  weight: 1.8,
                  color: "#FF7A00",
                  fillColor: "rgba(255, 122, 0, 0.15)",
                  fillOpacity: 0.15,
                });
                target.bringToFront();
              },
              mouseout: (e) => {
                if (geoJsonLayerRef.current) {
                  geoJsonLayerRef.current.resetStyle(e.target);
                }
              },
              click: () => {
                const sovereign = MAP_SOVEREIGNS.find((s) => s.id === iso);
                if (sovereign) {
                  setInspectedEntity({ type: "sovereign", data: sovereign });
                } else {
                  setInspectedEntity({
                    type: "sovereign",
                    data: {
                      id: iso,
                      name,
                      capital: "Capital Region",
                      details: `Sovereign jurisdiction: ${name} (${iso}). Boundaries mapped via Natural Earth official registry.`,
                      region: feature.properties?.CONTINENT || "Global",
                      nuclear: false,
                      gdp: "National Accounts Monitored",
                      military: "Sovereign Defense Force",
                      coordinates: [0, 0],
                      imageKey: "IND",
                    },
                  });
                }
              },
            });
          },
        });

        if (showBorders) {
          geoLayer.addTo(map);
        }
        geoJsonLayerRef.current = geoLayer;
      })
      .catch((err) => {
        console.warn("World boundaries GeoJSON loading note:", err);
      });

    mapInstanceRef.current = map;

    // ResizeObserver ensures smooth container resizing without grey tiles
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Helper: check group membership
  function isCountryInGroup(iso: string, group: string): boolean {
    if (!iso) return false;
    switch (group) {
      case "QUAD":
        return ["IND", "USA", "JPN", "AUS"].includes(iso);
      case "BRICS":
        return ["BRA", "RUS", "IND", "CHN", "ZAF", "EGY", "ETH", "IRN", "ARE"].includes(iso);
      case "NATO":
        return ["USA", "GBR", "FRA", "DEU", "ITA", "TUR", "CAN", "ESP", "POL", "NLD"].includes(iso);
      case "SCO":
        return ["CHN", "RUS", "IND", "PAK", "IRN", "KAZ", "KGZ", "TJK", "UZB"].includes(iso);
      default:
        return false;
    }
  }

  // 2. Basemap Switcher Effect
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const currentBase = BASEMAP_URLS[basemap];
    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    const newTiles = L.tileLayer(currentBase.url, {
      attribution: currentBase.attribution,
      maxZoom: currentBase.maxZoom,
      subdomains: "abcd",
    }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newTiles;
    // Keep markers on top
    if (routesLayerRef.current) {
      routesLayerRef.current.eachLayer((l: any) => l.bringToFront?.());
    }
    if (markersLayerRef.current) {
      markersLayerRef.current.eachLayer((l: any) => l.bringToFront?.());
    }
  }, [basemap]);

  // 3. Borders Visibility Toggle
  useEffect(() => {
    if (!mapInstanceRef.current || !geoJsonLayerRef.current) return;
    if (showBorders) {
      if (!mapInstanceRef.current.hasLayer(geoJsonLayerRef.current)) {
        geoJsonLayerRef.current.addTo(mapInstanceRef.current);
      }
    } else {
      if (mapInstanceRef.current.hasLayer(geoJsonLayerRef.current)) {
        mapInstanceRef.current.removeLayer(geoJsonLayerRef.current);
      }
    }
  }, [showBorders]);

  // 4. Update GeoJSON styles when Group changes
  useEffect(() => {
    if (!geoJsonLayerRef.current) return;
    geoJsonLayerRef.current.setStyle((feature) => {
      const iso = feature?.properties?.ISO_A3;
      let strokeColor = "rgba(255, 255, 255, 0.22)";
      let fillColor = "transparent";
      let fillOpacity = 0;

      if (selectedGroup) {
        const inGroup = isCountryInGroup(iso, selectedGroup);
        if (inGroup) {
          strokeColor = "#FF7A00";
          fillColor = "#FF7A00";
          fillOpacity = 0.2;
        }
      }

      return {
        color: strokeColor,
        weight: selectedGroup ? 1.4 : 0.8,
        opacity: 0.85,
        fillColor,
        fillOpacity,
      };
    });
  }, [selectedGroup]);

  // 5. Render Data Markers & Routes on Leaflet Map
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !routesLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    routesLayerRef.current.clearLayers();

    // A. Strategic Corridors (Polylines)
    if (showRoutes) {
      MAP_STRATEGIC_ROUTES.forEach((route) => {
        const poly = L.polyline(route.coordinates, {
          color: route.color,
          weight: 2,
          dashArray: route.dashArray || "5, 5",
          opacity: 0.85,
        });

        poly.bindTooltip(
          `<div class="font-mono text-xs font-bold text-white bg-black/90 p-1.5 rounded border border-white/20">
            ${route.name}
            <div class="text-[10px] font-normal text-neutral-300 mt-0.5">${route.description}</div>
          </div>`,
          { sticky: true, className: "trinetra-leaflet-tooltip" }
        );

        poly.addTo(routesLayerRef.current!);
      });
    }

    // B. Maritime Chokepoints (Matching Reference Image Anchor Badge)
    if (showChokepoints) {
      MAP_CHOKEPOINTS.forEach((cp) => {
        const icon = L.divIcon({
          className: "custom-chokepoint-marker",
          html: `
            <div id="chokepoint-marker-${cp.id}" class="flex items-center justify-center size-6 rounded-full bg-[#051e36]/95 border border-sky-400 text-sky-300 shadow-md shadow-sky-500/25 cursor-pointer hover:scale-125 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="5" r="3"/>
                <line x1="12" y1="22" x2="12" y2="8"/>
                <path d="M5 12H2a10 10 0 0 0 20 0h-3"/>
              </svg>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker(cp.coordinates, { icon });
        marker.on("click", () => {
          setInspectedEntity({ type: "chokepoint", data: cp });
          mapInstanceRef.current?.flyTo(cp.coordinates, 6, { duration: 1.2 });
        });
        marker.addTo(markersLayerRef.current!);
      });
    }

    // C. Active Conflict & Tension Events (Pulsing Radar Rings matching Reference Image)
    if (showEvents) {
      MAP_ACTIVE_EVENTS.forEach((ev) => {
        const isCritical = ev.severity === "CRITICAL";
        const isSelected = selectedEventId === ev.id;

        const icon = L.divIcon({
          className: "custom-event-marker",
          html: `
            <div id="event-marker-${ev.id}" class="relative flex items-center justify-center size-8 cursor-pointer ${
            isSelected ? "scale-125" : "hover:scale-115"
          } transition-transform">
              <div class="absolute inset-0 rounded-full ${
                isCritical ? "bg-red-500/30" : "bg-amber-500/30"
              } animate-ping"></div>
              <div class="absolute size-6 rounded-full border ${
                isCritical ? "border-red-500 bg-red-950/90" : "border-amber-400 bg-amber-950/90"
              } shadow-lg shadow-black/80"></div>
              <div class="size-2.5 rounded-full ${
                isCritical ? "bg-red-500" : "bg-amber-400"
              } shadow-sm"></div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker(ev.coordinates, { icon });
        marker.on("click", () => {
          onSelectEvent(ev);
          setInspectedEntity({ type: "event", data: ev });
          mapInstanceRef.current?.flyTo(ev.coordinates, 5.5, { duration: 1.2 });
        });
        marker.addTo(markersLayerRef.current!);
      });
    }

    // D. Sovereigns Markers
    if (showSovereigns) {
      MAP_SOVEREIGNS.forEach((sov) => {
        const icon = L.divIcon({
          className: "custom-sov-marker",
          html: `
            <div id="sov-marker-${sov.id}" class="flex items-center justify-center px-1 py-0.5 rounded bg-black/80 border border-white/30 text-white font-mono text-[9px] font-bold shadow-sm hover:border-[#FF7A00] hover:text-[#FF7A00] transition-colors cursor-pointer">
              ${sov.id}
            </div>
          `,
          iconSize: [28, 16],
          iconAnchor: [14, 8],
        });

        const marker = L.marker(sov.coordinates, { icon });
        marker.on("click", () => {
          setInspectedEntity({ type: "sovereign", data: sov });
          mapInstanceRef.current?.flyTo(sov.coordinates, 5, { duration: 1.2 });
        });
        marker.addTo(markersLayerRef.current!);
      });
    }
  }, [showRoutes, showChokepoints, showEvents, showSovereigns, selectedEventId]);

  // 6. Fly to selected event when parent prop changes
  useEffect(() => {
    if (!selectedEventId || !mapInstanceRef.current) return;
    const ev = MAP_ACTIVE_EVENTS.find((e) => e.id === selectedEventId);
    if (ev) {
      setInspectedEntity({ type: "event", data: ev });
      mapInstanceRef.current.flyTo(ev.coordinates, 5.5, { duration: 1.5 });
    }
  }, [selectedEventId]);

  // Map Navigation Handlers
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetView = () => mapInstanceRef.current?.setView([20, 15], 2.5);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mapContainerRef.current?.parentElement?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Search filter
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const events = MAP_ACTIVE_EVENTS.filter(
      (e) => e.title.toLowerCase().includes(q) || e.region.toLowerCase().includes(q)
    ).map((e) => ({ type: "event" as const, title: e.title, coordinates: e.coordinates, raw: e }));

    const chokepoints = MAP_CHOKEPOINTS.filter(
      (c) => c.name.toLowerCase().includes(q) || c.region.toLowerCase().includes(q)
    ).map((c) => ({ type: "chokepoint" as const, title: c.name, coordinates: c.coordinates, raw: c }));

    const sovereigns = MAP_SOVEREIGNS.filter(
      (s) => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
    ).map((s) => ({ type: "sovereign" as const, title: s.name, coordinates: s.coordinates, raw: s }));

    return [...events, ...chokepoints, ...sovereigns];
  }, [searchQuery]);

  return (
    <div
      id="real-geospatial-map-container"
      className="relative flex-1 min-h-[580px] lg:min-h-[640px] xl:min-h-[700px] bg-[#050608] rounded-xl border border-white/10 overflow-hidden shadow-2xl flex"
    >
      {/* 1. LEFT VERTICAL TOOLBAR (Matching Reference Image) */}
      <div className="z-20 w-12 sm:w-14 bg-[#07080c]/95 border-r border-white/10 flex flex-col items-center justify-between py-3 select-none backdrop-blur-md shrink-0">
        {/* Top Tool Icons */}
        <div className="flex flex-col items-center gap-3">
          {/* Layers Button */}
          <button
            type="button"
            id="tool-layers"
            onClick={() => setActiveTool(activeTool === "layers" ? "none" : "layers")}
            title="Map Layers"
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              activeTool === "layers"
                ? "bg-[#FF7A00] text-black"
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Layers className="size-4" />
            <span className="text-[9px] font-medium">Layers</span>
          </button>

          {/* Events Button */}
          <button
            type="button"
            id="tool-events"
            onClick={() => {
              setShowEvents(true);
              setActiveTool(activeTool === "events" ? "none" : "events");
            }}
            title="Active Events"
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              activeTool === "events"
                ? "bg-[#FF7A00] text-black"
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Flame className="size-4" />
            <span className="text-[9px] font-medium">Events</span>
          </button>

          {/* Rivalries Button */}
          <button
            type="button"
            id="tool-rivalries"
            onClick={() => setActiveTool(activeTool === "rivalries" ? "none" : "rivalries")}
            title="Bilateral Rivalries"
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              activeTool === "rivalries"
                ? "bg-[#FF7A00] text-black"
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Link2 className="size-4" />
            <span className="text-[9px] font-medium">Rivalries</span>
          </button>

          {/* Groups / Alliances Button */}
          <button
            type="button"
            id="tool-groups"
            onClick={() => setActiveTool(activeTool === "groups" ? "none" : "groups")}
            title="Alliances & Groups"
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              activeTool === "groups"
                ? "bg-[#FF7A00] text-black"
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Users className="size-4" />
            <span className="text-[9px] font-medium">Groups</span>
          </button>

          {/* Search Button */}
          <button
            type="button"
            id="tool-search"
            onClick={() => setActiveTool(activeTool === "search" ? "none" : "search")}
            title="Search Map"
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              activeTool === "search"
                ? "bg-[#FF7A00] text-black"
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Search className="size-4" />
            <span className="text-[9px] font-medium">Search</span>
          </button>
        </div>

        {/* Bottom: 2D / 3D Globe Mode Switcher (Matching Reference Image Thumbnail) */}
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            id="tool-toggle-3d"
            onClick={onToggle3DGlobe}
            title={is3DMode ? "Switch to 2D Planar Map" : "Switch to 3D Globe Projection"}
            className="group relative size-10 rounded-lg overflow-hidden border border-white/20 p-0.5 hover:border-[#FF7A00] transition-colors shadow-lg bg-black"
          >
            <img
              src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=120&q=80"
              alt="Globe View Toggle"
              className="size-full object-cover rounded filter brightness-95 group-hover:scale-110 transition-transform"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <Globe2 className="size-4 text-white drop-shadow" />
            </div>
          </button>
          <span className="text-[8px] font-mono text-neutral-400 font-bold uppercase">
            {is3DMode ? "2D MAP" : "3D GLOBE"}
          </span>
        </div>
      </div>

      {/* 2. FLYOUT TOOL PANELS (Layers, Rivalries, Groups, Search) */}
      {activeTool !== "none" && (
        <div className="absolute left-14 sm:left-16 top-3 z-30 w-72 bg-[#090b10]/95 border border-white/10 rounded-xl p-3.5 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-left-2 duration-150">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
            <span className="text-xs font-mono font-bold uppercase text-[#FF7A00] flex items-center gap-1.5">
              {activeTool === "layers" && <Layers className="size-3.5" />}
              {activeTool === "rivalries" && <Link2 className="size-3.5" />}
              {activeTool === "groups" && <Users className="size-3.5" />}
              {activeTool === "search" && <Search className="size-3.5" />}
              {activeTool.toUpperCase()} CONTROL
            </span>
            <button
              type="button"
              onClick={() => setActiveTool("none")}
              className="text-neutral-400 hover:text-white"
            >
              <X className="size-3.5" />
            </button>
          </div>

          {/* Layers Drawer */}
          {activeTool === "layers" && (
            <div className="space-y-2 text-xs">
              <label className="flex items-center justify-between p-1.5 rounded hover:bg-white/5 cursor-pointer">
                <span className="text-neutral-300">National Boundaries (Natural Earth)</span>
                <input
                  type="checkbox"
                  checked={showBorders}
                  onChange={(e) => setShowBorders(e.target.checked)}
                  className="rounded border-white/20 text-[#FF7A00] focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between p-1.5 rounded hover:bg-white/5 cursor-pointer">
                <span className="text-neutral-300">Maritime Chokepoints</span>
                <input
                  type="checkbox"
                  checked={showChokepoints}
                  onChange={(e) => setShowChokepoints(e.target.checked)}
                  className="rounded border-white/20 text-[#FF7A00] focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between p-1.5 rounded hover:bg-white/5 cursor-pointer">
                <span className="text-neutral-300">Active Conflict Theatres</span>
                <input
                  type="checkbox"
                  checked={showEvents}
                  onChange={(e) => setShowEvents(e.target.checked)}
                  className="rounded border-white/20 text-[#FF7A00] focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between p-1.5 rounded hover:bg-white/5 cursor-pointer">
                <span className="text-neutral-300">Strategic Maritime Corridors</span>
                <input
                  type="checkbox"
                  checked={showRoutes}
                  onChange={(e) => setShowRoutes(e.target.checked)}
                  className="rounded border-white/20 text-[#FF7A00] focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between p-1.5 rounded hover:bg-white/5 cursor-pointer">
                <span className="text-neutral-300">Key Sovereigns</span>
                <input
                  type="checkbox"
                  checked={showSovereigns}
                  onChange={(e) => setShowSovereigns(e.target.checked)}
                  className="rounded border-white/20 text-[#FF7A00] focus:ring-0"
                />
              </label>
            </div>
          )}

          {/* Rivalries Drawer */}
          {activeTool === "rivalries" && (
            <div className="space-y-1.5 text-xs">
              <p className="text-[11px] text-neutral-400 mb-2">
                Quick-focus primary bilateral flashpoint vectors:
              </p>
              {[
                { name: "US — China", a: "USA", b: "CHN", coords: [28.0, 140.0] as [number, number], zoom: 3 },
                { name: "India — China (LAC)", a: "IND", b: "CHN", coords: [32.0, 85.0] as [number, number], zoom: 4.5 },
                { name: "Israel — Iran", a: "ISR", b: "IRN", coords: [32.0, 44.0] as [number, number], zoom: 5 },
                { name: "Russia — NATO / US", a: "RUS", b: "USA", coords: [55.0, 30.0] as [number, number], zoom: 4 },
                { name: "India — Pakistan", a: "IND", b: "PAK", coords: [30.0, 74.0] as [number, number], zoom: 5 },
              ].map((r) => (
                <button
                  key={r.name}
                  type="button"
                  onClick={() => {
                    mapInstanceRef.current?.flyTo(r.coords, r.zoom, { duration: 1.5 });
                    setActiveTool("none");
                  }}
                  className="w-full text-left p-2 rounded bg-black/40 hover:bg-white/10 flex items-center justify-between text-neutral-200"
                >
                  <span className="font-semibold">{r.name}</span>
                  <span className="text-[10px] text-[#FF7A00] font-mono">Pan To</span>
                </button>
              ))}
            </div>
          )}

          {/* Groups Drawer */}
          {activeTool === "groups" && (
            <div className="space-y-1.5 text-xs">
              <p className="text-[11px] text-neutral-400 mb-2">
                Highlight multilateral alliances on the world map:
              </p>
              {[
                { id: "QUAD", name: "QUAD (Indo-Pacific)", members: "IND, USA, JPN, AUS" },
                { id: "BRICS", name: "BRICS+ Multi-Polar Bloc", members: "BRA, RUS, IND, CHN, ZAF, etc." },
                { id: "NATO", name: "NATO Transatlantic Alliance", members: "USA, GBR, FRA, DEU, etc." },
                { id: "SCO", name: "Shanghai Cooperation Org", members: "CHN, RUS, IND, PAK, IRN, etc." },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    setSelectedGroup(selectedGroup === g.id ? null : g.id);
                  }}
                  className={`w-full text-left p-2 rounded flex flex-col gap-0.5 border ${
                    selectedGroup === g.id
                      ? "bg-[#FF7A00]/20 border-[#FF7A00] text-white"
                      : "bg-black/40 border-white/5 hover:bg-white/10 text-neutral-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{g.name}</span>
                    {selectedGroup === g.id && <Check className="size-3.5 text-[#FF7A00]" />}
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">{g.members}</span>
                </button>
              ))}
              {selectedGroup && (
                <button
                  type="button"
                  onClick={() => setSelectedGroup(null)}
                  className="w-full text-center py-1 text-[11px] text-neutral-400 hover:text-white mt-1 underline"
                >
                  Clear Group Highlight
                </button>
              )}
            </div>
          )}

          {/* Search Drawer */}
          {activeTool === "search" && (
            <div className="space-y-2">
              <input
                type="text"
                autoFocus
                placeholder="Search country, chokepoint, event..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded bg-black/60 border border-white/10 p-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#FF7A00]"
              />

              <div className="max-h-48 overflow-y-auto space-y-1 divide-y divide-white/5 text-xs">
                {searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      mapInstanceRef.current?.flyTo(item.coordinates, 5, { duration: 1.2 });
                      if (item.type === "event") onSelectEvent(item.raw);
                      setInspectedEntity({ type: item.type, data: item.raw });
                      setActiveTool("none");
                    }}
                    className="w-full text-left p-1.5 hover:bg-white/10 flex items-center justify-between text-neutral-300"
                  >
                    <span className="truncate">{item.title}</span>
                    <span className="text-[10px] uppercase font-mono text-[#FF7A00] ml-2 shrink-0">
                      {item.type}
                    </span>
                  </button>
                ))}
                {searchQuery && searchResults.length === 0 && (
                  <div className="p-2 text-center text-[11px] text-neutral-500 font-mono">
                    No matching entities found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. MAIN MAP CANVAS (LEAFLET) */}
      <div className="relative flex-1 h-full w-full">
        <div ref={mapContainerRef} className="size-full z-10" />

        {/* 4. TOP-RIGHT CONTROLS (Status Badge, Basemap Selector, Zoom +/- / Fullscreen) */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
          {/* Status Badge (Matching Reference Image "● Real-time" / "● Monitored") */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/85 border border-white/15 text-xs font-mono backdrop-blur-md">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-medium">Real-time</span>
          </div>

          {/* Basemap Dropdown (Matching Reference Image "Satellite (Real) v") */}
          <div className="relative">
            <button
              type="button"
              id="basemap-selector-btn"
              onClick={() => setBasemapDropdownOpen(!basemapDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/85 border border-white/15 text-xs text-white hover:bg-neutral-900 font-medium backdrop-blur-md"
            >
              <span>{BASEMAP_URLS[basemap].label}</span>
              <ChevronDown className="size-3.5 text-neutral-400" />
            </button>

            {basemapDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-44 rounded-lg bg-[#090b10] border border-white/15 shadow-2xl py-1 text-xs z-30">
                {(["satellite", "dark", "terrain"] as BasemapType[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setBasemap(key);
                      setBasemapDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-white/10 ${
                      basemap === key ? "text-[#FF7A00] font-semibold" : "text-neutral-300"
                    }`}
                  >
                    <span>{BASEMAP_URLS[key].label}</span>
                    {basemap === key && <Check className="size-3" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Zoom In, Zoom Out, Fullscreen, Reset Controls */}
          <div className="flex items-center rounded-lg bg-black/85 border border-white/15 overflow-hidden backdrop-blur-md divide-x divide-white/10">
            <button
              type="button"
              id="btn-zoom-in"
              onClick={handleZoomIn}
              title="Zoom In"
              className="p-2 text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Plus className="size-3.5" />
            </button>
            <button
              type="button"
              id="btn-zoom-out"
              onClick={handleZoomOut}
              title="Zoom Out"
              className="p-2 text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Minus className="size-3.5" />
            </button>
            <button
              type="button"
              id="btn-reset-view"
              onClick={handleResetView}
              title="Reset View"
              className="p-2 text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <RotateCcw className="size-3.5" />
            </button>
            <button
              type="button"
              id="btn-fullscreen"
              onClick={toggleFullscreen}
              title="Toggle Fullscreen"
              className="p-2 text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              {isFullscreen ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
            </button>
          </div>
        </div>

        {/* 5. BOTTOM OVERLAY: LEGEND & DATA FRESHNESS (Matching Reference Image) */}
        <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Legend on Left */}
          <div className="flex items-center gap-3 sm:gap-4 px-3.5 py-2 rounded-lg bg-black/85 border border-white/15 text-[11px] font-mono text-neutral-300 backdrop-blur-md pointer-events-auto shadow-xl">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-red-500 shadow-sm shadow-red-500" />
              <span>Conflict / Tension</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
              <span>Strategic Activity</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Anchor className="size-3 text-sky-400" />
              <span>Maritime Activity</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5">
              <span className="size-2 rounded-full border border-white/80 bg-transparent" />
              <span>Sovereign</span>
            </div>
          </div>

          {/* Freshness Badge on Right */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/85 border border-white/15 text-[11px] font-mono text-neutral-300 backdrop-blur-md pointer-events-auto shadow-xl">
            <span className="size-2 rounded-full bg-emerald-400" />
            <span>Last Updated: Verified TRINETRA Database</span>
          </div>
        </div>

        {/* 6. INSPECTED ENTITY RECONNAISSANCE DOSSIER OVERLAY */}
        {inspectedEntity && (
          <div
            id="map-inspected-dossier"
            className="absolute top-14 left-4 z-30 w-80 sm:w-96 rounded-xl bg-[#080a0e]/95 border border-[#FF7A00]/40 shadow-2xl p-4 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-2.5 mb-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-[#FF7A00] tracking-wider">
                  TACTICAL RECONNAISSANCE DOSSIER
                </span>
                <h3 className="text-base font-bold text-white leading-tight mt-0.5">
                  {inspectedEntity.type === "event" && inspectedEntity.data.title}
                  {inspectedEntity.type === "chokepoint" && inspectedEntity.data.name}
                  {inspectedEntity.type === "sovereign" && inspectedEntity.data.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectedEntity(null)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Entity Photo */}
            {(() => {
              const imgKey =
                inspectedEntity.type === "event"
                  ? inspectedEntity.data.imageKey
                  : inspectedEntity.type === "chokepoint"
                  ? inspectedEntity.data.imageKey
                  : inspectedEntity.data.id;
              const img = resolveMapEntityImage(imgKey);

              return (
                <div className="relative h-32 rounded-lg overflow-hidden border border-white/10 mb-3 bg-black">
                  <img
                    src={img.url}
                    alt="Reconnaissance"
                    className="size-full object-cover filter brightness-90"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-neutral-300">
                    <span className="truncate">{img.caption || "Strategic Theatre"}</span>
                  </div>
                </div>
              );
            })()}

            {/* Entity Details */}
            {inspectedEntity.type === "event" && (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 font-mono">Classification:</span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                      inspectedEntity.data.severity === "CRITICAL"
                        ? "bg-red-950 text-red-400 border border-red-800/40"
                        : "bg-amber-950 text-amber-400 border border-amber-800/40"
                    }`}
                  >
                    {inspectedEntity.data.severity}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 font-mono">Theatre:</span>
                  <span className="text-white font-medium">{inspectedEntity.data.region}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 font-mono">Involved Actors:</span>
                  <span className="text-neutral-200 truncate max-w-[200px]">
                    {inspectedEntity.data.actors.join(", ")}
                  </span>
                </div>
                <p className="text-neutral-300 text-[11px] leading-relaxed pt-1 border-t border-white/5">
                  {inspectedEntity.data.summary}
                </p>
                <div className="pt-2 flex gap-2">
                  <a
                    href={inspectedEntity.data.linkTo || "/compare"}
                    className="flex-1 py-1.5 px-3 rounded bg-[#FF7A00] text-black font-semibold text-xs text-center hover:bg-[#ff9933] transition-colors"
                  >
                    Launch Rivalry Analysis →
                  </a>
                </div>
              </div>
            )}

            {inspectedEntity.type === "chokepoint" && (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 font-mono">Transit Volume:</span>
                  <span className="text-sky-400 font-mono font-bold">
                    {inspectedEntity.data.dailyVolume}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 font-mono">Vulnerable Powers:</span>
                  <span className="text-neutral-200 truncate max-w-[200px]">
                    {inspectedEntity.data.exposure}
                  </span>
                </div>
                <p className="text-neutral-300 text-[11px] leading-relaxed pt-1 border-t border-white/5">
                  {inspectedEntity.data.importance}
                </p>
                <div className="pt-2">
                  <a
                    href="/compare?a=CHN&b=USA"
                    className="w-full block py-1.5 px-3 rounded bg-sky-500/20 border border-sky-400/40 text-sky-300 font-semibold text-xs text-center hover:bg-sky-500/30 transition-colors"
                  >
                    Inspect Maritime Chokepoint Dynamics →
                  </a>
                </div>
              </div>
            )}

            {inspectedEntity.type === "sovereign" && (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 font-mono">Sovereign Code:</span>
                  <span className="text-white font-mono font-bold">{inspectedEntity.data.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 font-mono">Capital:</span>
                  <span className="text-white font-medium">{inspectedEntity.data.capital}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 font-mono">Economic Output:</span>
                  <span className="text-emerald-400 font-mono">{inspectedEntity.data.gdp}</span>
                </div>
                <p className="text-neutral-300 text-[11px] leading-relaxed pt-1 border-t border-white/5">
                  {inspectedEntity.data.details}
                </p>
                <div className="pt-2">
                  <a
                    href={`/country?id=${inspectedEntity.data.id}`}
                    className="w-full block py-1.5 px-3 rounded bg-[#FF7A00] text-black font-semibold text-xs text-center hover:bg-[#ff9933] transition-colors"
                  >
                    Open Sovereign Intelligence Dossier →
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
