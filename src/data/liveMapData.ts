import { GEOPOLITICAL_IMAGES, SOVEREIGN_PHOTO_DOSSIERS } from "./geopoliticalMedia";

export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface MapChokepoint {
  id: string;
  name: string;
  region: string;
  coordinates: [number, number]; // [lat, lng]
  dailyVolume: string;
  importance: string;
  exposure: string;
  keyActors: string[];
  status: "CRITICAL_BOTTLENECK" | "HIGH_EXPOSURE" | "ACTIVE_INTERDICTION" | "DISRUPTED_FLOW" | "MONTREUX_REGULATED" | "CLIMATE_CONSTRAINED" | "SECURE_PATROL" | "REROUTING_HUB";
  imageKey: string;
}

export interface MapEvent {
  id: string;
  title: string;
  category: "Conflict / Tension" | "Strategic Activity" | "Maritime Activity" | "Other";
  severity: "CRITICAL" | "HIGH" | "MONITORED";
  region: string;
  timeAgo: string;
  coordinates: [number, number]; // [lat, lng]
  summary: string;
  actors: string[];
  imageKey: string;
  linkTo?: string;
  linkType?: "rivalry" | "country" | "group";
}

export interface MapStrategicRoute {
  id: string;
  name: string;
  category: "maritime_artery" | "alliance_arc" | "defense_axis" | "frontline";
  coordinates: [number, number][]; // Array of [lat, lng]
  color: string;
  dashArray?: string;
  description: string;
}

export interface MapCountryMarker {
  id: string;
  name: string;
  capital: string;
  coordinates: [number, number]; // [lat, lng]
  region: string;
  nuclear: boolean;
  quad?: boolean;
  brics?: boolean;
  nato?: boolean;
  sco?: boolean;
  details: string;
  gdp: string;
  military: string;
  imageKey: string;
}

// 1. Verified Maritime Chokepoints (Real Coordinates & Application Data)
export const MAP_CHOKEPOINTS: MapChokepoint[] = [
  {
    id: "CHOKEPOINT_MALACCA",
    name: "Strait of Malacca",
    region: "Southeast Asia / Indo-Pacific",
    coordinates: [4.2105, 100.5568],
    dailyVolume: "~16–17M bpd · 84,000+ vessels/yr",
    importance: "Primary maritime bottleneck linking Indian Ocean to South China Sea; handles ~80% of China's crude oil imports and >25% of global merchandise trade.",
    exposure: "China (Malacca Dilemma), Japan, South Korea, India",
    keyActors: ["Singapore", "Malaysia", "Indonesia", "China", "India"],
    status: "HIGH_EXPOSURE",
    imageKey: "malacca",
  },
  {
    id: "CHOKEPOINT_HORMUZ",
    name: "Strait of Hormuz",
    region: "Persian Gulf / Middle East",
    coordinates: [26.5667, 56.2500],
    dailyVolume: "~20.5M bpd (~20% of global petroleum liquids)",
    importance: "World's most critical oil transit artery; only maritime egress for crude from Saudi Arabia, UAE, Iraq, Kuwait, Qatar, and Iran.",
    exposure: "Global petroleum market, China, India, Japan, EU",
    keyActors: ["Iran", "Oman", "UAE", "Saudi Arabia", "United States"],
    status: "CRITICAL_BOTTLENECK",
    imageKey: "hormuz",
  },
  {
    id: "CHOKEPOINT_BAB_EL_MANDEB",
    name: "Bab el-Mandeb Strait",
    region: "Horn of Africa / Red Sea",
    coordinates: [12.5833, 43.3333],
    dailyVolume: "~6.2M bpd + 12% global maritime trade",
    importance: "The Gate of Tears connecting the Gulf of Aden to the Red Sea and Suez Canal; subjected to regional asymmetric drone and anti-ship missile interdictions.",
    exposure: "Europe-Asia supply lines, Mediterranean energy, Egypt",
    keyActors: ["Yemen (Ansar Allah)", "Djibouti", "Eritrea", "Saudi Arabia", "United States", "Egypt"],
    status: "ACTIVE_INTERDICTION",
    imageKey: "red_sea",
  },
  {
    id: "CHOKEPOINT_SUEZ",
    name: "Suez Canal",
    region: "Egypt / Afro-Eurasian Isthmus",
    coordinates: [30.7050, 32.3442],
    dailyVolume: "~12% of total global trade volume",
    importance: "Artificial 193 km waterway circumventing the 10–14 day voyage around the Cape of Good Hope; vital foreign currency generator for Egypt.",
    exposure: "European consumer supply chains, LNG cargo, Mediterranean refineries",
    keyActors: ["Egypt", "European Union", "China", "Gulf States"],
    status: "DISRUPTED_FLOW",
    imageKey: "red_sea",
  },
  {
    id: "CHOKEPOINT_BOSPHORUS",
    name: "Turkish Straits (Bosphorus & Dardanelles)",
    region: "Eurasia / Black Sea",
    coordinates: [41.1172, 29.0628],
    dailyVolume: "~3M bpd oil + Black Sea agricultural bulk",
    importance: "Governed by the 1936 Montreux Convention; single maritime access bottleneck connecting Black Sea naval fleets and grain shipments to the Aegean and Mediterranean.",
    exposure: "Russia, Ukraine, Romania, Bulgaria, Turkey",
    keyActors: ["Turkey", "Russia", "Ukraine", "NATO"],
    status: "MONTREUX_REGULATED",
    imageKey: "euro_atlantic",
  },
  {
    id: "CHOKEPOINT_PANAMA",
    name: "Panama Canal",
    region: "Central America / Inter-Oceanic",
    coordinates: [9.0800, -79.6800],
    dailyVolume: "~5% of global seaborne commerce (~14,000 ships/yr)",
    importance: "Freshwater-fed lock canal uniting the Atlantic and Pacific oceans; constrained during meteorological drought cycles impacting Gatun Lake reservoir depths.",
    exposure: "US East Coast LNG exports, South American grain, East Asian manufacturing",
    keyActors: ["Panama", "United States", "China", "Japan"],
    status: "CLIMATE_CONSTRAINED",
    imageKey: "malacca",
  },
  {
    id: "CHOKEPOINT_GIBRALTAR",
    name: "Strait of Gibraltar",
    region: "Iberia / North Africa",
    coordinates: [35.9800, -5.6000],
    dailyVolume: "100,000+ vessels annually",
    importance: "Pivotal passage linking Atlantic Ocean to Mediterranean Basin; major NATO naval transit surveillance zone.",
    exposure: "Mediterranean rim commerce, transatlantic logistics",
    keyActors: ["Spain", "United Kingdom (Gibraltar)", "Morocco", "NATO"],
    status: "SECURE_PATROL",
    imageKey: "euro_atlantic",
  },
  {
    id: "CHOKEPOINT_CAPE",
    name: "Cape of Good Hope",
    region: "Southern Africa",
    coordinates: [-34.3568, 18.4740],
    dailyVolume: "Surging +60–80% diverted container transits",
    importance: "Open-ocean circumnavigation route around Africa; absorbs massive vessel diversions avoiding Red Sea missile threats at the cost of 10–14 days and bunker fuel surcharges.",
    exposure: "Global container liners (Maersk, MSC, CMA CGM, Hapag-Lloyd)",
    keyActors: ["South Africa", "Global Maritime Alliances"],
    status: "REROUTING_HUB",
    imageKey: "malacca",
  },
];

// 2. Verified Active Geopolitical Events (Matching Screenshot & Authoritative TRINETRA Dataset)
export const MAP_ACTIVE_EVENTS: MapEvent[] = [
  {
    id: "ev-ukraine-war",
    title: "Russia–Ukraine War",
    category: "Conflict / Tension",
    severity: "CRITICAL",
    region: "Europe",
    timeAgo: "Active Front",
    coordinates: [50.4501, 30.5234],
    summary: "High-intensity conventional conflict spanning the Donbas, Zaporizhzhia, and Black Sea theatres; ongoing NATO collective forward defense posture.",
    actors: ["Russia", "Ukraine", "United States", "NATO"],
    imageKey: "euro_atlantic",
    linkTo: "/compare?a=RUS&b=USA",
    linkType: "rivalry",
  },
  {
    id: "ev-israel-gaza",
    title: "Israel–Hamas Conflict",
    category: "Conflict / Tension",
    severity: "CRITICAL",
    region: "Middle East",
    timeAgo: "Active Clashes",
    coordinates: [31.5000, 34.4667],
    summary: "Multi-front confrontation across the Gaza Strip, southern Lebanese border, Syria, and ballistic missile exchanges; acute regional escalatory risks.",
    actors: ["Israel", "Iran", "United States"],
    imageKey: "isr_irn",
    linkTo: "/compare?a=ISR&b=IRN",
    linkType: "rivalry",
  },
  {
    id: "ev-red-sea",
    title: "Red Sea Shipping Tension",
    category: "Maritime Activity",
    severity: "HIGH",
    region: "Middle East",
    timeAgo: "Persistent Interdiction",
    coordinates: [13.2000, 43.1500],
    summary: "Asymmetric anti-ship ballistic missile and one-way attack drone interdictions targeting commercial navigation transiting Bab el-Mandeb; coalition escorts deployed.",
    actors: ["Yemen (Ansar Allah)", "United States", "United Kingdom", "Egypt", "Iran"],
    imageKey: "red_sea",
    linkTo: "/compare?a=SAU&b=IRN",
    linkType: "rivalry",
  },
  {
    id: "ev-taiwan-strait",
    title: "Taiwan Strait Activity",
    category: "Strategic Activity",
    severity: "HIGH",
    region: "East Asia",
    timeAgo: "Forward Posture",
    coordinates: [24.0000, 119.5000],
    summary: "Joint PLA naval task forces and combat air patrols crossing the median line; US carrier strike groups conducting routine freedom-of-navigation operations.",
    actors: ["China", "Taiwan", "United States", "Japan"],
    imageKey: "taiwan_strait",
    linkTo: "/compare?a=USA&b=CHN",
    linkType: "rivalry",
  },
  {
    id: "ev-sahel-deterioration",
    title: "Sahel Security Deterioration",
    category: "Conflict / Tension",
    severity: "HIGH",
    region: "Africa",
    timeAgo: "Regime Shift",
    coordinates: [14.5000, 1.0000],
    summary: "Alliance of Sahel States (AES: Mali, Burkina Faso, Niger) formal withdrawal from ECOWAS; realignment toward Russian Africa Corps security architecture.",
    actors: ["Mali", "Niger", "Burkina Faso", "Russia"],
    imageKey: "drc_goma",
    linkTo: "/countries",
    linkType: "country",
  },
  {
    id: "ev-drc-m23",
    title: "DRC–M23 Conflict",
    category: "Conflict / Tension",
    severity: "CRITICAL",
    region: "Africa",
    timeAgo: "Heavy Clashes",
    coordinates: [-1.6792, 29.2228],
    summary: "Intense clashes between M23 insurgent factions and Congolese FARDC coalition around Goma; acute humanitarian impact across Great Lakes critical mineral corridors.",
    actors: ["DRC", "Rwanda", "SAMIDRC Coalition"],
    imageKey: "drc_goma",
    linkTo: "/countries",
    linkType: "country",
  },
  {
    id: "ev-korea-dmz",
    title: "Korean Peninsula Risk",
    category: "Strategic Activity",
    severity: "HIGH",
    region: "East Asia",
    timeAgo: "Elevated Alert",
    coordinates: [38.0000, 127.0000],
    summary: "Solid-fuel hypersonic missile test launches and formal renunciation of reunification doctrine; enhanced trilateral US-ROK-Japan ballistic missile tracking.",
    actors: ["North Korea", "South Korea", "United States", "Japan"],
    imageKey: "JPN",
    linkTo: "/compare?a=USA&b=CHN",
    linkType: "rivalry",
  },
  {
    id: "ev-india-china-lac",
    title: "Himalayan LAC Standoff",
    category: "Strategic Activity",
    severity: "HIGH",
    region: "South Asia",
    timeAgo: "Forward Deployed",
    coordinates: [34.2000, 78.5000],
    summary: "Continuous forward corps deployment along the 3,488 km Line of Actual Control in Eastern Ladakh; ongoing bilateral military commander negotiations.",
    actors: ["India", "China"],
    imageKey: "himalayan_lac",
    linkTo: "/compare?a=IND&b=CHN",
    linkType: "rivalry",
  },
  {
    id: "ev-myanmar-conflict",
    title: "Myanmar Civil War",
    category: "Conflict / Tension",
    severity: "CRITICAL",
    region: "Southeast Asia",
    timeAgo: "Broad Offensive",
    coordinates: [21.9162, 95.9560],
    summary: "Three Brotherhood Alliance Operation 1027 capturing border crossings and military garrisons, complicating China-Myanmar transit corridors.",
    actors: ["Myanmar Junta", "Ethnic Armed Alliances", "China", "India"],
    imageKey: "malacca",
    linkTo: "/countries",
    linkType: "country",
  },
  {
    id: "ev-iran-nuclear",
    title: "Iran Nuclear Crisis",
    category: "Strategic Activity",
    severity: "HIGH",
    region: "Middle East",
    timeAgo: "Threshold Status",
    coordinates: [32.4279, 53.6880],
    summary: "Advanced centrifuge enrichment to near-weapons grade; heightened reciprocal deterrence posturing and maritime seizures in Gulf of Oman.",
    actors: ["Iran", "Israel", "United States", "IAEA"],
    imageKey: "hormuz",
    linkTo: "/compare?a=ISR&b=IRN",
    linkType: "rivalry",
  },
];

// 3. Verified Strategic Maritime Corridors & Defense Axes (Actual Geographic Coordinates)
export const MAP_STRATEGIC_ROUTES: MapStrategicRoute[] = [
  {
    id: "route-malacca-artery",
    name: "Malacca Dilemma Hydrocarbon Sea Lane",
    category: "maritime_artery",
    coordinates: [
      [26.56, 56.25], // Hormuz
      [22.00, 60.00], // Gulf of Oman
      [15.00, 65.00], // Arabian Sea
      [8.00, 75.00],  // South India
      [5.50, 82.00],  // Sri Lanka passage
      [5.00, 95.00],  // Northern Sumatra
      [4.21, 100.55], // Malacca Strait
      [1.30, 104.00], // Singapore
      [8.00, 109.00], // South China Sea
      [16.00, 114.00], // Paracels
      [22.50, 118.00], // Taiwan Strait approach
      [31.20, 122.00], // Shanghai Maritime Hub
    ],
    color: "#f59e0b",
    dashArray: "6, 4",
    description: "Vital sea lane transporting ~80% of East Asian crude oil from Gulf ports through the Indian Ocean and Malacca Strait bottleneck.",
  },
  {
    id: "route-suez-med",
    name: "Red Sea — Suez Canal Conduit",
    category: "maritime_artery",
    coordinates: [
      [11.50, 48.00], // Gulf of Aden
      [12.58, 43.33], // Bab el-Mandeb
      [18.00, 40.00], // Southern Red Sea
      [25.00, 36.00], // Northern Red Sea
      [30.70, 32.34], // Suez Canal
      [32.50, 31.00], // Port Said
      [35.00, 24.00], // Eastern Mediterranean
      [36.50, 15.00], // Central Mediterranean
      [36.00, -5.60], // Strait of Gibraltar
    ],
    color: "#ef4444",
    dashArray: "5, 5",
    description: "Shortest maritime route linking Asia to European consumer markets; exposed to Bab el-Mandeb coastal interdiction.",
  },
  {
    id: "route-quad-arc",
    name: "QUAD Indo-Pacific Maritime Security Arc",
    category: "alliance_arc",
    coordinates: [
      [11.60, 92.70],  // Port Blair (Andaman & Nicobar)
      [-12.46, 130.84], // Darwin, Australia
      [35.28, 139.67], // Yokosuka, Japan
      [21.30, -157.85], // Pearl Harbor, Hawaii (USINDOPACOM)
    ],
    color: "#ff9933",
    dashArray: "8, 4",
    description: "Inter-operability maritime surveillance quadrilateral linking India, Australia, Japan, and the United States across the Indo-Pacific.",
  },
  {
    id: "route-nato-axis",
    name: "Transatlantic NATO Defense Axis",
    category: "defense_axis",
    coordinates: [
      [38.90, -77.03], // Washington DC
      [51.50, -0.12],  // London
      [50.85, 4.35],   // Brussels (NATO HQ)
      [52.52, 13.40],  // Berlin
      [52.23, 21.01],  // Warsaw (Eastern Flank)
    ],
    color: "#38bdf8",
    dashArray: "4, 4",
    description: "North Atlantic Treaty Organization collective security axis binding North America and European allies under Article 5 deterrence.",
  },
];

// 4. Verified Key Sovereigns (Coordinates & Application Dossiers)
export const MAP_SOVEREIGNS: MapCountryMarker[] = [
  {
    id: "IND",
    name: "India",
    capital: "New Delhi",
    coordinates: [20.5937, 78.9629],
    region: "South Asia",
    nuclear: true,
    quad: true,
    brics: true,
    sco: true,
    details: "South Asian sovereign anchor; practicing strategic autonomy with naval command over the Indian Ocean Region and primary Quad pillar.",
    gdp: "$3.94T (Nominal)",
    military: "1.45M Active Troops · $83B Budget",
    imageKey: "IND",
  },
  {
    id: "CHN",
    name: "China",
    capital: "Beijing",
    coordinates: [35.8617, 104.1954],
    region: "East Asia",
    nuclear: true,
    brics: true,
    sco: true,
    details: "East Asian superpower; world's manufacturing center, high crude import vulnerability through Strait of Malacca (~80%).",
    gdp: "$18.5T (Nominal)",
    military: "2.0M Active Troops · $290B+ Budget",
    imageKey: "CHN",
  },
  {
    id: "USA",
    name: "United States",
    capital: "Washington, D.C.",
    coordinates: [37.0902, -95.7129],
    region: "North America",
    nuclear: true,
    quad: true,
    nato: true,
    details: "Global military and financial reserve hegemon; 11 carrier strike groups, leading NATO collective defense and Indo-Pacific alliances.",
    gdp: "$28.0T (Nominal)",
    military: "1.3M Active Troops · $850B+ Budget",
    imageKey: "USA",
  },
  {
    id: "RUS",
    name: "Russia",
    capital: "Moscow",
    coordinates: [61.5240, 105.3188],
    region: "Eurasia",
    nuclear: true,
    brics: true,
    sco: true,
    details: "Eurasian energy and nuclear power; largest nuclear warhead stockpile (~5,580 warheads) and strategic depth spanning 11 time zones.",
    gdp: "$2.0T (Nominal)",
    military: "1.1M Active Troops · ~5,580 Warheads",
    imageKey: "RUS",
  },
  {
    id: "JPN",
    name: "Japan",
    capital: "Tokyo",
    coordinates: [36.2048, 138.2529],
    region: "East Asia",
    nuclear: false,
    quad: true,
    details: "Cornerstone US Indo-Pacific ally along First Island Chain; commanding high-tech Aegis destroyers and expanding counterstrike capabilities.",
    gdp: "$4.2T (Nominal)",
    military: "First Island Chain Hub · 247k Troops",
    imageKey: "JPN",
  },
  {
    id: "AUS",
    name: "Australia",
    capital: "Canberra",
    coordinates: [-25.2744, 133.7751],
    region: "Oceania / Indo-Pacific",
    nuclear: false,
    quad: true,
    details: "Indo-Pacific continental fortress; primary global exporter of iron ore, LNG, and critical minerals; AUKUS nuclear submarine pillar.",
    gdp: "$1.7T (Nominal)",
    military: "AUKUS Pillar I · Critical Minerals Hub",
    imageKey: "AUS",
  },
  {
    id: "GBR",
    name: "United Kingdom",
    capital: "London",
    coordinates: [55.3781, -3.4360],
    region: "Western Europe",
    nuclear: true,
    nato: true,
    details: "Permanent UN Security Council member, nuclear power (Vanguard SSBN continuous deterrent), and pivotal transatlantic defense pillar.",
    gdp: "$3.3T (Nominal)",
    military: "Vanguard SSBN Triad · AUKUS Co-founder",
    imageKey: "GBR",
  },
  {
    id: "FRA",
    name: "France",
    capital: "Paris",
    coordinates: [46.2276, 2.2137],
    region: "Western Europe",
    nuclear: true,
    nato: true,
    details: "Independent nuclear force de frappe, Charles de Gaulle carrier group, and sovereign Indo-Pacific territories across Réunion and New Caledonia.",
    gdp: "$3.0T (Nominal)",
    military: "Force de Frappe · Carrier Strike Group",
    imageKey: "FRA",
  },
  {
    id: "DEU",
    name: "Germany",
    capital: "Berlin",
    coordinates: [51.1657, 10.4515],
    region: "Central Europe",
    nuclear: false,
    nato: true,
    details: "Central European economic heavyweight; implementing €100B Zeitenwende modernization to build NATO's strongest European conventional force.",
    gdp: "$4.4T (Nominal)",
    military: "€100B Zeitenwende Modernization",
    imageKey: "DEU",
  },
  {
    id: "TUR",
    name: "Turkey",
    capital: "Ankara",
    coordinates: [38.9637, 35.2433],
    region: "Middle East / Europe",
    nuclear: false,
    nato: true,
    details: "Strategic crossroad linking Europe, Middle East, and Black Sea; enforces 1936 Montreux Convention over the Bosphorus & Dardanelles straits.",
    gdp: "$1.1T (Nominal)",
    military: "Montreux Straits Regime · NATO 2nd Army",
    imageKey: "TUR",
  },
  {
    id: "SAU",
    name: "Saudi Arabia",
    capital: "Riyadh",
    coordinates: [23.8859, 45.0792],
    region: "Middle East",
    nuclear: false,
    brics: true,
    details: "Global crude oil production heavyweight; leader of OPEC+, managing Persian Gulf and Red Sea maritime littoral security and regional diplomacy.",
    gdp: "$1.06T (Nominal)",
    military: "~9M bpd Production · Vision 2030",
    imageKey: "SAU",
  },
  {
    id: "IRN",
    name: "Iran",
    capital: "Tehran",
    coordinates: [32.4279, 53.6880],
    region: "Middle East",
    nuclear: false,
    brics: true,
    sco: true,
    details: "Littoral controller of northern Strait of Hormuz; deep arsenal of anti-ship ballistic missiles, long-range drones, and regional proxy network.",
    gdp: "$400B (Nominal)",
    military: "Hormuz Coastal Defense · Ballistic Arsenal",
    imageKey: "IRN",
  },
  {
    id: "ISR",
    name: "Israel",
    capital: "Jerusalem",
    coordinates: [31.0461, 34.8516],
    region: "Middle East",
    nuclear: true,
    details: "High-technology military vanguard with integrated multi-layered air & missile defense (Iron Dome, David's Sling, Arrow 3) and unacknowledged nuclear triad.",
    gdp: "$530B (Nominal)",
    military: "Multi-Tier Air Defense · Cyber Vanguard",
    imageKey: "ISR",
  },
  {
    id: "PAK",
    name: "Pakistan",
    capital: "Islamabad",
    coordinates: [30.3753, 69.3451],
    region: "South Asia",
    nuclear: true,
    sco: true,
    details: "Nuclear-armed South Asian state bordering India, China, and Afghanistan; host to the China-Pakistan Economic Corridor (CPEC) terminating at Gwadar Port.",
    gdp: "$340B (Nominal)",
    military: "~170 Warheads · Gwadar CPEC Hub",
    imageKey: "PAK",
  },
  {
    id: "BRA",
    name: "Brazil",
    capital: "Brasília",
    coordinates: [-14.2350, -51.9253],
    region: "South America",
    nuclear: false,
    brics: true,
    details: "South American agricultural and commodity giant; founding member of BRICS with vast offshore deepwater pre-salt oil reserves and Amazon sovereignty.",
    gdp: "$2.1T (Nominal)",
    military: "Agri & Petro Giant · BRICS Anchor",
    imageKey: "BRA",
  },
];

// Helper to resolve an authentic image for any map entity
export function resolveMapEntityImage(key?: string): { url: string; caption?: string } {
  if (!key) {
    return {
      url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
      caption: "Geopolitical Intelligence Reconnaissance",
    };
  }

  if (GEOPOLITICAL_IMAGES[key]) {
    return {
      url: GEOPOLITICAL_IMAGES[key].imageUrl,
      caption: GEOPOLITICAL_IMAGES[key].caption,
    };
  }

  if (SOVEREIGN_PHOTO_DOSSIERS[key]) {
    return {
      url: SOVEREIGN_PHOTO_DOSSIERS[key].image,
      caption: `Sovereign Capital: ${SOVEREIGN_PHOTO_DOSSIERS[key].capital} · Focus: ${SOVEREIGN_PHOTO_DOSSIERS[key].strategicFocus}`,
    };
  }

  return {
    url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
    caption: "Geopolitical Intelligence Reconnaissance",
  };
}
