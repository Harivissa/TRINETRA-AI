import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { getSovereignMeta } from "../../utils/sovereignMeta";
import { getCountryFlag } from "../../utils/flags";

interface Props {
  countryA: string;
  countryB: string;
  nameA?: string;
  nameB?: string;
  durationMs?: number;
  onComplete: () => void;
}

// Compact Sovereign Country Flag adhering strictly to dynamic country metadata
function SovereignFlag({ id, iso2, name }: { id: string; iso2: string; name: string }) {
  const [imgError, setImgError] = useState(false);
  const cleanId = (id || "").toUpperCase().trim();
  const cleanIso2 = (iso2 || "").toLowerCase().trim();

  if (!imgError && cleanIso2) {
    return (
      <img
        src={`https://flagcdn.com/w640/${cleanIso2}.png`}
        alt={`${name} Flag`}
        className="w-full h-full object-cover select-none"
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
      />
    );
  }

  const emoji = getCountryFlag(cleanId);
  return (
    <div className="w-full h-full bg-[#0d0f14] flex flex-col items-center justify-center p-2 select-none">
      <span className="text-3xl sm:text-4xl" role="img" aria-label={name}>
        {emoji}
      </span>
      <span className="font-mono text-[10px] text-neutral-400 mt-1.5 font-bold tracking-widest">{cleanId}</span>
    </div>
  );
}

// Verified Global City Coordinates for Night City Lights (lon, lat, intensity weight)
const EARTH_CITY_LIGHTS = [
  // India & South Asia
  { lon: 77.2, lat: 28.6, w: 2.5 }, // Delhi
  { lon: 72.8, lat: 18.9, w: 2.5 }, // Mumbai
  { lon: 80.2, lat: 13.0, w: 2.0 }, // Chennai
  { lon: 88.3, lat: 22.5, w: 2.2 }, // Kolkata
  { lon: 77.5, lat: 12.9, w: 2.3 }, // Bengaluru
  { lon: 78.4, lat: 17.3, w: 2.1 }, // Hyderabad
  { lon: 74.3, lat: 31.5, w: 1.8 }, // Lahore
  { lon: 67.0, lat: 24.8, w: 2.0 }, // Karachi
  { lon: 90.4, lat: 23.8, w: 2.0 }, // Dhaka

  // China & East Asia
  { lon: 116.4, lat: 39.9, w: 2.8 }, // Beijing
  { lon: 121.4, lat: 31.2, w: 2.9 }, // Shanghai
  { lon: 113.2, lat: 23.1, w: 2.6 }, // Guangzhou
  { lon: 114.1, lat: 22.3, w: 2.5 }, // Shenzhen/Hong Kong
  { lon: 104.0, lat: 30.6, w: 2.0 }, // Chengdu
  { lon: 114.3, lat: 30.5, w: 1.9 }, // Wuhan
  { lon: 139.6, lat: 35.6, w: 2.8 }, // Tokyo
  { lon: 135.5, lat: 34.6, w: 2.3 }, // Osaka
  { lon: 126.9, lat: 37.5, w: 2.6 }, // Seoul
  { lon: 121.5, lat: 25.0, w: 2.1 }, // Taipei

  // Europe & Western Eurasia
  { lon: -0.1, lat: 51.5, w: 2.6 },  // London
  { lon: 2.3, lat: 48.8, w: 2.5 },   // Paris
  { lon: 13.4, lat: 52.5, w: 2.2 },  // Berlin
  { lon: 4.9, lat: 52.3, w: 2.1 },   // Amsterdam
  { lon: 12.4, lat: 41.9, w: 2.0 },  // Rome
  { lon: -3.7, lat: 40.4, w: 2.1 },  // Madrid
  { lon: 37.6, lat: 55.7, w: 2.5 },  // Moscow
  { lon: 28.9, lat: 41.0, w: 2.3 },  // Istanbul

  // Middle East
  { lon: 55.2, lat: 25.2, w: 2.5 },  // Dubai
  { lon: 46.7, lat: 24.7, w: 2.2 },  // Riyadh
  { lon: 51.4, lat: 35.6, w: 2.2 },  // Tehran
  { lon: 31.2, lat: 30.0, w: 2.4 },  // Cairo

  // Americas
  { lon: -74.0, lat: 40.7, w: 2.9 }, // New York
  { lon: -77.0, lat: 38.9, w: 2.4 }, // Washington DC
  { lon: -87.6, lat: 41.8, w: 2.4 }, // Chicago
  { lon: -118.2, lat: 34.0, w: 2.7 }, // Los Angeles
  { lon: -122.4, lat: 37.7, w: 2.3 }, // San Francisco
  { lon: -99.1, lat: 19.4, w: 2.6 }, // Mexico City
  { lon: -46.6, lat: -23.5, w: 2.7 }, // Sao Paulo
  { lon: -43.1, lat: -22.9, w: 2.3 }, // Rio de Janeiro
  { lon: -58.3, lat: -34.6, w: 2.3 }, // Buenos Aires

  // Southeast Asia & Oceania
  { lon: 103.8, lat: 1.3, w: 2.5 },  // Singapore
  { lon: 100.5, lat: 13.7, w: 2.2 }, // Bangkok
  { lon: 106.8, lat: -6.2, w: 2.5 }, // Jakarta
  { lon: 120.9, lat: 14.5, w: 2.3 }, // Manila
  { lon: 151.2, lat: -33.8, w: 2.2 }, // Sydney

  // Africa
  { lon: 28.0, lat: -26.2, w: 2.1 }, // Johannesburg
  { lon: 3.3, lat: 6.5, w: 2.2 },   // Lagos
  { lon: 36.8, lat: -1.2, w: 1.8 },  // Nairobi
];

// Helper: Convert (lon, lat) to 3D Cartesian coordinates on sphere
function geoToVector3(lon: number, lat: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Global cached GeoJSON line pairs
let cachedCleanSegments: [number, number, number, number][] | null = null;

export default function LoadingEngine({
  countryA,
  countryB,
  nameA,
  nameB,
  durationMs = 4500,
  onComplete,
}: Props) {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const metaA = getSovereignMeta(countryA, nameA);
  const metaB = getSovereignMeta(countryB, nameB);

  // Smooth indeterminate progress bar
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / durationMs) * 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
      }
    }, 25);

    const timeout = setTimeout(() => {
      setProgress(100);
      onComplete();
    }, durationMs);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [durationMs, onComplete]);

  // REAL PROGRAMMATIC 3D EARTH IN THREE.JS (Clean, Subtle Background Visual)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, WebGL Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(38, width / height, 1, 3000);
    // Position camera far enough so Earth is a background visual occupying ~52% of viewport height
    camera.position.set(0, 0, 520);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // Transparent canvas over black canvas
    container.appendChild(renderer.domElement);

    // Earth radius: 95 units (with camera at z=520 and FOV=38, diameter occupies ~52% of screen height)
    const earthRadius = 95;
    const earthGroup = new THREE.Group();
    earthGroup.rotation.x = 0.12; // Slight axial tilt
    scene.add(earthGroup);

    // 2. Deep Dark Sphere Body (Single clean sphere with NO duplicate concentric meshes)
    const sphereGeo = new THREE.SphereGeometry(earthRadius, 64, 64);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x07080b, // Pure deep dark space charcoal
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    earthGroup.add(sphereMesh);

    // 3. Atmospheric Outer Rim Glow (Rendered on a 2D plane BEHIND the sphere to prevent ANY geometry noise)
    const haloCanvas = document.createElement("canvas");
    haloCanvas.width = 128;
    haloCanvas.height = 128;
    const hCtx = haloCanvas.getContext("2d")!;
    const hGrad = hCtx.createRadialGradient(64, 64, 46, 64, 64, 64);
    hGrad.addColorStop(0, "rgba(255, 122, 0, 0.18)");
    hGrad.addColorStop(0.5, "rgba(255, 140, 30, 0.08)");
    hGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    hCtx.fillStyle = hGrad;
    hCtx.fillRect(0, 0, 128, 128);
    const haloTexture = new THREE.CanvasTexture(haloCanvas);

    const haloGeo = new THREE.PlaneGeometry(earthRadius * 2.3, earthRadius * 2.3);
    const haloMat = new THREE.MeshBasicMaterial({
      map: haloTexture,
      transparent: true,
      depthWrite: false,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.position.set(0, 0, -5); // Positioned strictly behind sphere center
    scene.add(haloMesh);

    // 4. Clean Graticule (Subtle 3D Latitude Circles & Longitude Meridians)
    const graticuleGroup = new THREE.Group();
    const latitudes = [-60, -30, 0, 30, 60];
    latitudes.forEach((lat) => {
      const isEquator = lat === 0;
      const points: THREE.Vector3[] = [];
      const numSteps = 72;
      for (let i = 0; i <= numSteps; i++) {
        const lon = -180 + (i / numSteps) * 360;
        points.push(geoToVector3(lon, lat, earthRadius * 1.002));
      }
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: isEquator ? 0xff7a00 : 0xff9933,
        transparent: true,
        opacity: isEquator ? 0.28 : 0.07,
        depthWrite: false,
      });
      graticuleGroup.add(new THREE.Line(lineGeo, lineMat));
    });

    const numMeridians = 12;
    for (let m = 0; m < numMeridians; m++) {
      const lon = -180 + (m / numMeridians) * 360;
      const points: THREE.Vector3[] = [];
      const numSteps = 48;
      for (let i = 0; i <= numSteps; i++) {
        const lat = -80 + (i / numSteps) * 160;
        points.push(geoToVector3(lon, lat, earthRadius * 1.002));
      }
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0xff9933,
        transparent: true,
        opacity: 0.06,
        depthWrite: false,
      });
      graticuleGroup.add(new THREE.Line(lineGeo, lineMat));
    }
    earthGroup.add(graticuleGroup);

    // 5. Authentic Continental Geometry (Clean LineSegments with Antimeridian Jump Filter)
    const continentGroup = new THREE.Group();
    earthGroup.add(continentGroup);

    const renderContinents = (segments: [number, number, number, number][]) => {
      const linePositions: number[] = [];
      segments.forEach(([lon1, lat1, lon2, lat2]) => {
        const v1 = geoToVector3(lon1, lat1, earthRadius * 1.0025);
        const v2 = geoToVector3(lon2, lat2, earthRadius * 1.0025);
        linePositions.push(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
      });

      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
      const lineMat = new THREE.LineBasicMaterial({
        color: 0xcc7722,
        transparent: true,
        opacity: 0.32,
        depthWrite: false,
      });
      const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
      continentGroup.add(lineSegments);
    };

    if (cachedCleanSegments) {
      renderContinents(cachedCleanSegments);
    } else {
      fetch("/data/world-countries.geojson")
        .then((res) => res.json())
        .then((data) => {
          if (!data || !data.features) return;
          const extracted: [number, number, number, number][] = [];
          const processRing = (ring: [number, number][]) => {
            for (let i = 0; i < ring.length - 1; i++) {
              const lon1 = ring[i][0];
              const lat1 = ring[i][1];
              const lon2 = ring[i + 1][0];
              const lat2 = ring[i + 1][1];
              // Filter out antimeridian jump chord cutting across sphere
              if (Math.abs(lon1 - lon2) < 90) {
                extracted.push([lon1, lat1, lon2, lat2]);
              }
            }
          };

          data.features.forEach((feat: any) => {
            const geom = feat.geometry;
            if (!geom) return;
            if (geom.type === "Polygon") {
              geom.coordinates.forEach((ring: [number, number][]) => processRing(ring));
            } else if (geom.type === "MultiPolygon") {
              geom.coordinates.forEach((poly: [number, number][][]) => {
                poly.forEach((ring: [number, number][]) => processRing(ring));
              });
            }
          });
          cachedCleanSegments = extracted;
          renderContinents(extracted);
        })
        .catch(() => {});
    }

    // 6. Night City Lights in Amber & Gold
    const cityPositions: number[] = [];
    const cityColors: number[] = [];
    const colorGold = new THREE.Color(0xffb84d);
    const colorAmber = new THREE.Color(0xff7a00);

    EARTH_CITY_LIGHTS.forEach((city) => {
      const v = geoToVector3(city.lon, city.lat, earthRadius * 1.0035);
      cityPositions.push(v.x, v.y, v.z);
      const lerped = colorGold.clone().lerp(colorAmber, Math.random() * 0.4);
      cityColors.push(lerped.r, lerped.g, lerped.b);

      const scatterCount = Math.floor(city.w * 2);
      for (let s = 0; s < scatterCount; s++) {
        const dLon = (Math.random() - 0.5) * 2.0;
        const dLat = (Math.random() - 0.5) * 1.6;
        const sv = geoToVector3(city.lon + dLon, city.lat + dLat, earthRadius * 1.0035);
        cityPositions.push(sv.x, sv.y, sv.z);
        cityColors.push(lerped.r * 0.75, lerped.g * 0.65, lerped.b * 0.55);
      }
    });

    const cityGeo = new THREE.BufferGeometry();
    cityGeo.setAttribute("position", new THREE.Float32BufferAttribute(cityPositions, 3));
    cityGeo.setAttribute("color", new THREE.Float32BufferAttribute(cityColors, 3));

    const pCanvas = document.createElement("canvas");
    pCanvas.width = 16;
    pCanvas.height = 16;
    const pCtx = pCanvas.getContext("2d")!;
    const pGrad = pCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
    pGrad.addColorStop(0, "rgba(255, 210, 120, 1)");
    pGrad.addColorStop(0.35, "rgba(255, 140, 30, 0.7)");
    pGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 16, 16);
    const particleTex = new THREE.CanvasTexture(pCanvas);

    const cityMat = new THREE.PointsMaterial({
      size: 2.8,
      vertexColors: true,
      map: particleTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const cityPoints = new THREE.Points(cityGeo, cityMat);
    earthGroup.add(cityPoints);

    // 7. Dual 3D Orbital Rings (Matching Reference Image)
    // Primary Tilted Orbital Ring
    const orbitRadius1 = earthRadius * 1.44;
    const orbit1Curve = new THREE.EllipseCurve(0, 0, orbitRadius1, orbitRadius1 * 0.42, 0, 2 * Math.PI, false, 0);
    const orbit1Points = orbit1Curve.getPoints(128).map((p) => new THREE.Vector3(p.x, p.y, 0));
    const orbit1Geo = new THREE.BufferGeometry().setFromPoints(orbit1Points);
    const orbit1Mat = new THREE.LineBasicMaterial({
      color: 0xff7a00,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    });
    const orbit1Mesh = new THREE.Line(orbit1Geo, orbit1Mat);
    orbit1Mesh.rotation.z = -0.38;
    orbit1Mesh.rotation.x = 0.54;
    scene.add(orbit1Mesh);

    // Satellite 1 Node
    const sat1Geo = new THREE.SphereGeometry(2.0, 12, 12);
    const sat1Mat = new THREE.MeshBasicMaterial({ color: 0xffa827 });
    const sat1Mesh = new THREE.Mesh(sat1Geo, sat1Mat);
    orbit1Mesh.add(sat1Mesh);

    // Secondary Counter-Inclined Orbital Ring
    const orbitRadius2 = earthRadius * 1.62;
    const orbit2Curve = new THREE.EllipseCurve(0, 0, orbitRadius2, orbitRadius2 * 0.36, 0, 2 * Math.PI, false, 0);
    const orbit2Points = orbit2Curve.getPoints(128).map((p) => new THREE.Vector3(p.x, p.y, 0));
    const orbit2Geo = new THREE.BufferGeometry().setFromPoints(orbit2Points);
    const orbit2Mat = new THREE.LineBasicMaterial({
      color: 0xff9933,
      transparent: true,
      opacity: 0.20,
      depthWrite: false,
    });
    const orbit2Mesh = new THREE.Line(orbit2Geo, orbit2Mat);
    orbit2Mesh.rotation.z = 0.44;
    orbit2Mesh.rotation.x = -0.48;
    scene.add(orbit2Mesh);

    // Satellite 2 Node
    const sat2Geo = new THREE.SphereGeometry(1.6, 12, 12);
    const sat2Mat = new THREE.MeshBasicMaterial({ color: 0xff7a00 });
    const sat2Mesh = new THREE.Mesh(sat2Geo, sat2Mat);
    orbit2Mesh.add(sat2Mesh);

    // 8. Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Smooth continuous Earth rotation
      earthGroup.rotation.y = elapsed * 0.08;

      // Orbiting satellites along curves
      const angle1 = elapsed * 0.38;
      const pt1 = orbit1Curve.getPoint(angle1 % 1);
      sat1Mesh.position.set(pt1.x, pt1.y, 0);

      const angle2 = -(elapsed * 0.28);
      const pt2 = orbit2Curve.getPoint((angle2 % 1 + 1) % 1);
      sat2Mesh.position.set(pt2.x, pt2.y, 0);

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animate();

    // 9. Resize Handling & Proportional Distance Calibration
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);

      // Keep Earth occupying ~50-52% of viewport height regardless of aspect ratio
      const fovRad = (camera.fov * Math.PI) / 360;
      const targetDist = (earthRadius / 0.26) / (2 * Math.tan(fovRad));
      camera.position.z = Math.max(targetDist, 480);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      haloTexture.dispose();
      particleTex.dispose();
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 bg-[#000000] text-white flex flex-col justify-between overflow-hidden select-none font-sans"
      role="status"
      aria-live="polite"
    >
      {/* 1. REAL PROGRAMMATIC 3D EARTH WEBGL CANVAS (SUBTLE BACKGROUND ELEMENT) */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      />

      {/* 2. CENTRAL VERTICAL AMBER AXIS (Thin 1px Line through center) */}
      <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none z-[2] flex justify-center">
        <div
          className="w-[1px] h-full"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,122,0,0.15) 0%, rgba(255,122,0,0.55) 25%, rgba(255,168,39,0.85) 50%, rgba(255,122,0,0.55) 75%, rgba(255,122,0,0.15) 100%)",
          }}
        />
      </div>

      {/* 3. TOP HEADER BAR */}
      <header className="w-full px-6 sm:px-12 pt-5 sm:pt-7 flex items-center justify-between z-10 relative">
        {/* Brand: Trinetra AI logo & typography */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Compact Trinetra orange emblem */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-[#FF7A00] flex items-center justify-center text-black shadow-md shadow-orange-500/20 select-none shrink-0">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current text-black"
              aria-hidden="true"
            >
              <path d="M4 4.5h16c.3 0 .5.2.5.5v1.2c0 .3-.2.5-.5.5h-7.1v4.8c2.4.4 4.3 2.1 4.7 4.5h1.9c.3 0 .5.2.5.5v1c0 .3-.2.5-.5.5h-2.1c-.6 2.8-3.1 4.9-6 4.9s-5.4-2.1-6-4.9H2.5c-.3 0-.5-.2-.5-.5v-1c0-.3.2-.5.5-.5h1.9c.4-2.4 2.3-4.1 4.7-4.5V6.7H4c-.3 0-.5-.2-.5-.5V5c0-.3.2-.5.5-.5zm7.1 9.3v6.4c1.8-.4 3.2-1.9 3.5-3.8-1.1-.9-2.3-1.8-3.5-2.6zm-2.2 0c-1.2.8-2.4 1.7-3.5 2.6.3 1.9 1.7 3.4 3.5 3.8v-6.4z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-sm sm:text-base font-normal tracking-tight text-white leading-tight">
              Trinetra AI
            </span>
            <span className="text-[9px] sm:text-[10px] text-neutral-400 font-sans tracking-normal font-light">
              Third Eye of Global Intelligence
            </span>
          </div>
        </div>

        {/* Top Right: COMPARATIVE INTELLIGENCE —— */}
        <div className="flex items-center gap-2 font-mono text-[9px] sm:text-[10px] tracking-[0.25em] text-neutral-400 uppercase">
          <span>COMPARATIVE INTELLIGENCE</span>
          <span className="w-6 sm:w-7 h-[1.5px] bg-[#FF7A00] inline-block" />
        </div>
      </header>

      {/* 4. CENTER COMPARISON STAGE (PRIMARY FOREGROUND HERO ELEMENTS) */}
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-8 flex flex-col items-center justify-center z-10 relative my-auto">
        <div className="w-full flex flex-row items-center justify-center gap-4 sm:gap-10 md:gap-14 lg:gap-20">
          {/* COUNTRY A PANEL */}
          <div className="flex flex-col items-center w-full max-w-[130px] xs:max-w-[170px] sm:max-w-[210px] md:max-w-[230px]">
            {/* Flag Frame with 4 Thin Orange Corner Brackets */}
            <div className="relative p-1.5 sm:p-2">
              {/* Tactical Thin Orange Corner Brackets */}
              <div className="absolute top-0 left-0 w-2.5 sm:w-3 h-2.5 sm:h-3 border-t-[1.5px] border-l-[1.5px] border-[#FF7A00] pointer-events-none z-20" />
              <div className="absolute top-0 right-0 w-2.5 sm:w-3 h-2.5 sm:h-3 border-t-[1.5px] border-r-[1.5px] border-[#FF7A00] pointer-events-none z-20" />
              <div className="absolute bottom-0 left-0 w-2.5 sm:w-3 h-2.5 sm:h-3 border-b-[1.5px] border-l-[1.5px] border-[#FF7A00] pointer-events-none z-20" />
              <div className="absolute bottom-0 right-0 w-2.5 sm:w-3 h-2.5 sm:h-3 border-b-[1.5px] border-r-[1.5px] border-[#FF7A00] pointer-events-none z-20" />

              {/* Refined Medium-sized Flag Container */}
              <div className="w-28 xs:w-36 sm:w-44 md:w-48 h-18 xs:h-22 sm:h-28 md:h-30 rounded-[2px] overflow-hidden shadow-xl shadow-black/90 border border-white/10 bg-[#08090d] flex items-center justify-center">
                <SovereignFlag id={metaA.id} iso2={metaA.iso2} name={metaA.name} />
              </div>
            </div>

            {/* Country Primary Name (Refined Editorial Serif Typography) */}
            <h2 className="font-serif uppercase text-lg xs:text-xl sm:text-2xl md:text-[26px] text-white tracking-[0.2em] font-normal text-center mt-2.5 sm:mt-3.5 leading-tight">
              {metaA.name}
            </h2>

            {/* Sovereign Formal Title (Very Small Technical Uppercase) */}
            {metaA.formalTitle && (
              <p className="font-mono text-[8px] sm:text-[9px] text-neutral-400 tracking-[0.24em] uppercase text-center mt-1 font-light line-clamp-1">
                {metaA.formalTitle}
              </p>
            )}
          </div>

          {/* CENTRAL "VS" (Centered right between the two countries on the vertical axis) */}
          <div className="flex flex-col items-center justify-center py-2 px-1 sm:px-3 relative select-none shrink-0">
            {/* Glowing Italic Serif "VS" */}
            <span className="font-serif italic text-xl xs:text-2xl sm:text-3xl md:text-[34px] text-[#FFA827] font-normal tracking-wide drop-shadow-[0_0_14px_rgba(255,168,39,0.85)] z-10 leading-none">
              VS
            </span>

            {/* Tactical Crosshair Accent */}
            <div className="flex items-center gap-1 mt-1.5 font-mono text-[7px] text-[#FF9933]/70 tracking-widest uppercase">
              <span>+</span>
              <span className="w-2.5 sm:w-3 h-[1px] bg-[#FF7A00]/50" />
              <span>+</span>
            </div>
          </div>

          {/* COUNTRY B PANEL */}
          <div className="flex flex-col items-center w-full max-w-[130px] xs:max-w-[170px] sm:max-w-[210px] md:max-w-[230px]">
            {/* Flag Frame with 4 Thin Orange Corner Brackets */}
            <div className="relative p-1.5 sm:p-2">
              {/* Tactical Thin Orange Corner Brackets */}
              <div className="absolute top-0 left-0 w-2.5 sm:w-3 h-2.5 sm:h-3 border-t-[1.5px] border-l-[1.5px] border-[#FF7A00] pointer-events-none z-20" />
              <div className="absolute top-0 right-0 w-2.5 sm:w-3 h-2.5 sm:h-3 border-t-[1.5px] border-r-[1.5px] border-[#FF7A00] pointer-events-none z-20" />
              <div className="absolute bottom-0 left-0 w-2.5 sm:w-3 h-2.5 sm:h-3 border-b-[1.5px] border-l-[1.5px] border-[#FF7A00] pointer-events-none z-20" />
              <div className="absolute bottom-0 right-0 w-2.5 sm:w-3 h-2.5 sm:h-3 border-b-[1.5px] border-r-[1.5px] border-[#FF7A00] pointer-events-none z-20" />

              {/* Refined Medium-sized Flag Container */}
              <div className="w-28 xs:w-36 sm:w-44 md:w-48 h-18 xs:h-22 sm:h-28 md:h-30 rounded-[2px] overflow-hidden shadow-xl shadow-black/90 border border-white/10 bg-[#08090d] flex items-center justify-center">
                <SovereignFlag id={metaB.id} iso2={metaB.iso2} name={metaB.name} />
              </div>
            </div>

            {/* Country Primary Name (Refined Editorial Serif Typography) */}
            <h2 className="font-serif uppercase text-lg xs:text-xl sm:text-2xl md:text-[26px] text-white tracking-[0.2em] font-normal text-center mt-2.5 sm:mt-3.5 leading-tight">
              {metaB.name}
            </h2>

            {/* Sovereign Formal Title (Very Small Technical Uppercase) */}
            {metaB.formalTitle && (
              <p className="font-mono text-[8px] sm:text-[9px] text-neutral-400 tracking-[0.24em] uppercase text-center mt-1 font-light line-clamp-1">
                {metaB.formalTitle}
              </p>
            )}
          </div>
        </div>

        {/* 5. THIN HORIZONTAL PROGRESS BAR & STATUS */}
        <div className="w-full max-w-[280px] xs:max-w-[340px] sm:max-w-[390px] mx-auto px-2 mt-6 sm:mt-8 z-10 relative">
          {/* Glowing Amber/Orange Progress Track */}
          <div className="h-[5px] w-full bg-[#181a22] rounded-full overflow-hidden border border-white/10 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#FF7A00] via-[#FF9933] to-[#FFA827] rounded-full shadow-[0_0_10px_rgba(255,122,0,0.85)] transition-all duration-75 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Sole Loading Status Message (Small Technical Uppercase) */}
          <p className="font-mono text-[9px] sm:text-[9.5px] tracking-[0.3em] uppercase text-neutral-400 text-center mt-2.5 font-medium">
            PREPARING COMPARATIVE ANALYSIS
          </p>
        </div>
      </main>

      {/* 6. BOTTOM STATUS STRIP */}
      <footer className="w-full px-6 sm:px-14 pb-4 sm:pb-5 pt-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[8.5px] sm:text-[9.5px] font-mono tracking-[0.25em] text-neutral-500 uppercase border-t border-neutral-800/80 z-10 relative">
        {/* Bottom Left Categories */}
        <div className="text-center sm:text-left">
          PEOPLE &nbsp;&nbsp;/&nbsp;&nbsp; GEOGRAPHY &nbsp;&nbsp;/&nbsp;&nbsp; ECONOMY &nbsp;&nbsp;/&nbsp;&nbsp; DEFENCE &nbsp;&nbsp;/&nbsp;&nbsp; DIPLOMACY
        </div>

        {/* Center Intersection Node over Axis */}
        <div className="hidden sm:block absolute left-1/2 -top-[3.5px] -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#FF7A00] shadow-[0_0_8px_#FF7A00]" />

        {/* Bottom Right Slogan */}
        <div className="flex items-center gap-2 text-neutral-400">
          <span className="w-3 h-[1.5px] bg-[#FF7A00] inline-block" />
          <span>A MORE INFORMED WORLD</span>
        </div>
      </footer>
    </div>
  );
}
