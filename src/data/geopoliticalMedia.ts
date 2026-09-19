export interface GeopoliticalVisualAsset {
  id: string;
  title: string;
  category: "theatre" | "chokepoint" | "dossier" | "doctrine";
  imageUrl: string;
  caption: string;
  theatre: string;
  tags: string[];
}

export const GEOPOLITICAL_IMAGES: Record<string, GeopoliticalVisualAsset> = {
  // Key Theatres & Chokepoints
  malacca: {
    id: "malacca",
    title: "Strait of Malacca Maritime Corridor",
    category: "chokepoint",
    imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80",
    caption: "Singapore Strait & Malacca transit lane: handling over 25% of global seaborne commerce and 80% of East Asian crude.",
    theatre: "Indo-Pacific Maritime",
    tags: ["Malacca Dilemma", "Energy Transit", "Indian Ocean"],
  },
  hormuz: {
    id: "hormuz",
    title: "Strait of Hormuz Petroleum Gateway",
    category: "chokepoint",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80",
    caption: "Persian Gulf littoral artery through which ~20% of global petroleum liquid consumption transits under Iranian coastal surveillance.",
    theatre: "Middle East / Persian Gulf",
    tags: ["Persian Gulf", "OPEC+", "Littoral Warfare"],
  },
  taiwan_strait: {
    id: "taiwan_strait",
    title: "First Island Chain & Taiwan Strait",
    category: "theatre",
    imageUrl: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1600&q=80",
    caption: "Pivotal geopolitical fault line linking the East China Sea and South China Sea, commanding global advanced semiconductor logistics.",
    theatre: "East Asia / Pacific Rim",
    tags: ["A2/AD", "Semiconductors", "Island Chain"],
  },
  himalayan_lac: {
    id: "himalayan_lac",
    title: "Line of Actual Control (Himalayan LAC)",
    category: "theatre",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80",
    caption: "High-altitude militarized border spanning 3,488 km between India and China across eastern Ladakh and Arunachal Pradesh.",
    theatre: "South Asia / High Himalayas",
    tags: ["Galwan", "Border Dispute", "Mountain Corps"],
  },
  red_sea: {
    id: "red_sea",
    title: "Bab el-Mandeb & Red Sea Corridor",
    category: "chokepoint",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
    caption: "The southern gateway to the Suez Canal, vulnerable to anti-ship ballistic missiles and drone interdictions.",
    theatre: "Red Sea & Horn of Africa",
    tags: ["Bab el-Mandeb", "Maritime Security", "Suez Transit"],
  },
  euro_atlantic: {
    id: "euro_atlantic",
    title: "Euro-Atlantic Deterrence & NATO Flank",
    category: "theatre",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
    caption: "Expanded NATO frontline encompassing the Baltic littoral, Eastern Europe, and strategic Arctic surveillance sectors.",
    theatre: "Euro-Atlantic & Arctic",
    tags: ["NATO Article 5", "Nuclear Umbrella", "Baltic Flank"],
  },
};

// Comprehensive Sovereign Presentation Images with Real High-Res Photography
export const SOVEREIGN_PHOTO_DOSSIERS: Record<string, { image: string; capital: string; strategicFocus: string; flag: string }> = {
  IND: {
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80",
    capital: "New Delhi",
    strategicFocus: "Strategic Autonomy, Indian Ocean SAGAR, Quad Security",
    flag: "🇮🇳",
  },
  CHN: {
    image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80",
    capital: "Beijing",
    strategicFocus: "First Island Chain A2/AD, Belt and Road, Semi Autarky",
    flag: "🇨🇳",
  },
  USA: {
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80",
    capital: "Washington, D.C.",
    strategicFocus: "Integrated Deterrence, Dollar Hegemony, Global Alliances",
    flag: "🇺🇸",
  },
  RUS: {
    image: "https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=1200&q=80",
    capital: "Moscow",
    strategicFocus: "Nuclear Triad Deterrence, Arctic Route, Multipolarity",
    flag: "🇷🇺",
  },
  JPN: {
    image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1200&q=80",
    capital: "Tokyo",
    strategicFocus: "First Island Chain Defence, Counterstrike Capability, Quad",
    flag: "🇯🇵",
  },
  DEU: {
    image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1200&q=80",
    capital: "Berlin",
    strategicFocus: "Zeitenwende Defence Modernization, EU Industrial Anchor",
    flag: "🇩🇪",
  },
  GBR: {
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80",
    capital: "London",
    strategicFocus: "Global Britain, Continuous At-Sea Nuclear Deterrent, AUKUS",
    flag: "🇬🇧",
  },
  FRA: {
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
    capital: "Paris",
    strategicFocus: "European Strategic Autonomy, Force de Frappe, Indo-Pacific EEZ",
    flag: "🇫🇷",
  },
  KOR: {
    image: "https://images.unsplash.com/photo-1538485399081-7c897a1e6fce?auto=format&fit=crop&w=1200&q=80",
    capital: "Seoul",
    strategicFocus: "Kill Chain Pre-emption, Extended Deterrence, High-Tech Export",
    flag: "🇰🇷",
  },
  TUR: {
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80",
    capital: "Ankara",
    strategicFocus: "Montreux Straits Control, Drone Warfare Innovation, Balancing",
    flag: "🇹🇷",
  },
  SAU: {
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1200&q=80",
    capital: "Riyadh",
    strategicFocus: "Vision 2030, OPEC+ Production Discipline, Regional De-escalation",
    flag: "🇸🇦",
  },
  IRN: {
    image: "https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?auto=format&fit=crop&w=1200&q=80",
    capital: "Tehran",
    strategicFocus: "Axis of Resistance, Hormuz Interdiction Threat, Missile Program",
    flag: "🇮🇷",
  },
  ISR: {
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
    capital: "Jerusalem",
    strategicFocus: "Begin Doctrine Counter-Proliferation, Multi-Tier Air Defence",
    flag: "🇮🇱",
  },
  PAK: {
    image: "https://images.unsplash.com/photo-1567606409415-9e7b7b8a1f16?auto=format&fit=crop&w=1200&q=80",
    capital: "Islamabad",
    strategicFocus: "Full Spectrum Nuclear Deterrence, CPEC Gateway, Strategic Depth",
    flag: "🇵🇰",
  },
  AUS: {
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80",
    capital: "Canberra",
    strategicFocus: "AUKUS Nuclear Submarines, Critical Minerals, Pacific Island Aid",
    flag: "🇦🇺",
  },
  CAN: {
    image: "https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=1200&q=80",
    capital: "Ottawa",
    strategicFocus: "NORAD Continental Defence, Arctic Sovereignty, Critical Minerals",
    flag: "🇨🇦",
  },
  BRA: {
    image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=80",
    capital: "Brasília",
    strategicFocus: "South Atlantic Blue Amazon, BRICS Multi-Alignment, Agri-Export",
    flag: "🇧🇷",
  },
  ARG: {
    image: "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?auto=format&fit=crop&w=1200&q=80",
    capital: "Buenos Aires",
    strategicFocus: "Lithium Triangle Resource Diplomacy, Antarctic Claims",
    flag: "🇦🇷",
  },
  IDN: {
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
    capital: "Jakarta",
    strategicFocus: "Non-Aligned Bebas Aktif, Nickel Downstreaming, Archipelagic Sea Lanes",
    flag: "🇮🇩",
  },
  ITA: {
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80",
    capital: "Rome",
    strategicFocus: "Enlarged Mediterranean (Mediterraneo Allargato), Mattei Plan",
    flag: "🇮🇹",
  },
  ARE: {
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
    capital: "Abu Dhabi",
    strategicFocus: "AI & Sovereign Capital, Global Logistics, Abraham Accords",
    flag: "🇦🇪",
  },
  BGD: {
    image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1200&q=80",
    capital: "Dhaka",
    strategicFocus: "Bay of Bengal Littoral Geopolitics, Indo-Pacific Transit Hub",
    flag: "🇧🇩",
  },
};
