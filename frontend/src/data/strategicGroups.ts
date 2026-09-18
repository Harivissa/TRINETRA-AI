export type StrategicGroup = {
  id: string;
  name: string;
  description: string;
  focusAreas: string[];
  members: string[];
};

export const STRATEGIC_GROUPS: StrategicGroup[] = [
  { id: "g20", name: "G20", description: "A forum for major advanced and emerging economies focused on global economic cooperation and financial stability.", focusAreas: ["Global economy", "Finance", "Trade", "Development"], members: ["ARG", "AUS", "BRA", "CAN", "CHN", "FRA", "DEU", "IND", "IDN", "ITA", "JPN", "MEX", "RUS", "SAU", "ZAF", "KOR", "TUR", "GBR", "USA", "EU", "AU"] },
  { id: "g7", name: "G7", description: "A coordination forum of advanced industrial democracies addressing economic, security and global policy issues.", focusAreas: ["Advanced economies", "Security", "Technology", "Global governance"], members: ["CAN", "FRA", "DEU", "ITA", "JPN", "GBR", "USA", "EU"] },
  { id: "brics", name: "BRICS", description: "A cooperation grouping centered on emerging economies, development, finance and reform of global institutions.", focusAreas: ["Emerging economies", "Development finance", "Trade", "Global governance"], members: ["BRA", "RUS", "IND", "CHN", "ZAF", "EGY", "ETH", "IRN", "ARE", "IDN"] },
  { id: "sco", name: "SCO", description: "A Eurasian cooperation organization focused on security, regional stability and economic cooperation.", focusAreas: ["Regional security", "Counterterrorism", "Eurasia", "Economic cooperation"], members: ["CHN", "IND", "KAZ", "KGZ", "PAK", "RUS", "TJK", "UZB", "IRN", "BEL"] },
  { id: "quad", name: "QUAD", description: "A diplomatic partnership focused on a free, open, inclusive and resilient Indo-Pacific.", focusAreas: ["Indo-Pacific", "Maritime security", "Resilient supply chains", "Critical technology"], members: ["AUS", "IND", "JPN", "USA"] },
];

export const GROUP_BY_ID = Object.fromEntries(STRATEGIC_GROUPS.map((group) => [group.id, group]));
