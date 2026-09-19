export interface SovereignMeta {
  id: string;
  name: string;
  formalTitle: string;
  iso2: string;
  flagUrl: string;
}

export const SOVEREIGN_DIRECTORY: Record<string, { name: string; formalTitle: string; iso2: string }> = {
  IND: { name: "INDIA", formalTitle: "REPUBLIC OF INDIA", iso2: "in" },
  CHN: { name: "CHINA", formalTitle: "PEOPLE'S REPUBLIC OF CHINA", iso2: "cn" },
  USA: { name: "UNITED STATES", formalTitle: "UNITED STATES OF AMERICA", iso2: "us" },
  RUS: { name: "RUSSIA", formalTitle: "RUSSIAN FEDERATION", iso2: "ru" },
  JPN: { name: "JAPAN", formalTitle: "STATE OF JAPAN", iso2: "jp" },
  DEU: { name: "GERMANY", formalTitle: "FEDERAL REPUBLIC OF GERMANY", iso2: "de" },
  GBR: { name: "UNITED KINGDOM", formalTitle: "UNITED KINGDOM OF GREAT BRITAIN & NORTHERN IRELAND", iso2: "gb" },
  FRA: { name: "FRANCE", formalTitle: "FRENCH REPUBLIC", iso2: "fr" },
  KOR: { name: "SOUTH KOREA", formalTitle: "REPUBLIC OF KOREA", iso2: "kr" },
  TUR: { name: "TÜRKIYE", formalTitle: "REPUBLIC OF TÜRKIYE", iso2: "tr" },
  SAU: { name: "SAUDI ARABIA", formalTitle: "KINGDOM OF SAUDI ARABIA", iso2: "sa" },
  IRN: { name: "IRAN", formalTitle: "ISLAMIC REPUBLIC OF IRAN", iso2: "ir" },
  ISR: { name: "ISRAEL", formalTitle: "STATE OF ISRAEL", iso2: "il" },
  PAK: { name: "PAKISTAN", formalTitle: "ISLAMIC REPUBLIC OF PAKISTAN", iso2: "pk" },
  AUS: { name: "AUSTRALIA", formalTitle: "COMMONWEALTH OF AUSTRALIA", iso2: "au" },
  CAN: { name: "CANADA", formalTitle: "DOMINION OF CANADA", iso2: "ca" },
  BRA: { name: "BRAZIL", formalTitle: "FEDERATIVE REPUBLIC OF BRAZIL", iso2: "br" },
  ARG: { name: "ARGENTINA", formalTitle: "ARGENTINE REPUBLIC", iso2: "ar" },
  IDN: { name: "INDONESIA", formalTitle: "REPUBLIC OF INDONESIA", iso2: "id" },
  ITA: { name: "ITALY", formalTitle: "ITALIAN REPUBLIC", iso2: "it" },
  ARE: { name: "UNITED ARAB EMIRATES", formalTitle: "UNITED ARAB EMIRATES", iso2: "ae" },
  BGD: { name: "BANGLADESH", formalTitle: "PEOPLE'S REPUBLIC OF BANGLADESH", iso2: "bd" },
  EGY: { name: "EGYPT", formalTitle: "ARAB REPUBLIC OF EGYPT", iso2: "eg" },
  ZAF: { name: "SOUTH AFRICA", formalTitle: "REPUBLIC OF SOUTH AFRICA", iso2: "za" },
  MEX: { name: "MEXICO", formalTitle: "UNITED MEXICAN STATES", iso2: "mx" },
  NGA: { name: "NIGERIA", formalTitle: "FEDERAL REPUBLIC OF NIGERIA", iso2: "ng" },
  VNM: { name: "VIETNAM", formalTitle: "SOCIALIST REPUBLIC OF VIETNAM", iso2: "vn" },
  PHL: { name: "PHILIPPINES", formalTitle: "REPUBLIC OF THE PHILIPPINES", iso2: "ph" },
  THA: { name: "THAILAND", formalTitle: "KINGDOM OF THAILAND", iso2: "th" },
  MYS: { name: "MALAYSIA", formalTitle: "FEDERATION OF MALAYSIA", iso2: "my" },
  SGP: { name: "SINGAPORE", formalTitle: "REPUBLIC OF SINGAPORE", iso2: "sg" },
  TWN: { name: "TAIWAN", formalTitle: "REPUBLIC OF CHINA (TAIWAN)", iso2: "tw" },
  UKR: { name: "UKRAINE", formalTitle: "UKRAINE", iso2: "ua" },
  POL: { name: "POLAND", formalTitle: "REPUBLIC OF POLAND", iso2: "pl" },
  SWE: { name: "SWEDEN", formalTitle: "KINGDOM OF SWEDEN", iso2: "se" },
  NOR: { name: "NORWAY", formalTitle: "KINGDOM OF NORWAY", iso2: "no" },
  NLD: { name: "NETHERLANDS", formalTitle: "KINGDOM OF THE NETHERLANDS", iso2: "nl" },
  CHE: { name: "SWITZERLAND", formalTitle: "SWISS CONFEDERATION", iso2: "ch" },
  ESP: { name: "SPAIN", formalTitle: "KINGDOM OF SPAIN", iso2: "es" },
  QAT: { name: "QATAR", formalTitle: "STATE OF QATAR", iso2: "qa" },
  KWT: { name: "KUWAIT", formalTitle: "STATE OF KUWAIT", iso2: "kw" },
  OMN: { name: "OMAN", formalTitle: "SULTANATE OF OMAN", iso2: "om" },
  IRQ: { name: "IRAQ", formalTitle: "REPUBLIC OF IRAQ", iso2: "iq" },
  SYR: { name: "SYRIA", formalTitle: "SYRIAN ARAB REPUBLIC", iso2: "sy" },
  PRK: { name: "NORTH KOREA", formalTitle: "DEMOCRATIC PEOPLE'S REPUBLIC OF KOREA", iso2: "kp" },
  NZL: { name: "NEW ZEALAND", formalTitle: "NEW ZEALAND", iso2: "nz" },
  CHL: { name: "CHILE", formalTitle: "REPUBLIC OF CHILE", iso2: "cl" },
  COL: { name: "COLOMBIA", formalTitle: "REPUBLIC OF COLOMBIA", iso2: "co" },
  PER: { name: "PERU", formalTitle: "REPUBLIC OF PERU", iso2: "pe" },
  KAZ: { name: "KAZAKHSTAN", formalTitle: "REPUBLIC OF KAZAKHSTAN", iso2: "kz" },
};

export function getSovereignMeta(id?: string, fallbackName?: string): SovereignMeta {
  const cleanId = (id || "IND").trim().toUpperCase();
  let entry = SOVEREIGN_DIRECTORY[cleanId];

  // Try matching by name or lowercase slug if direct ID didn't match
  if (!entry) {
    const rawLower = (id || "").toLowerCase().replace(/[-_]/g, " ").trim();
    const fallbackLower = (fallbackName || "").toLowerCase().trim();
    for (const [key, val] of Object.entries(SOVEREIGN_DIRECTORY)) {
      const valNameLower = val.name.toLowerCase();
      if (
        valNameLower === rawLower ||
        valNameLower === fallbackLower ||
        val.iso2.toLowerCase() === rawLower ||
        key.toLowerCase() === rawLower
      ) {
        entry = val;
        break;
      }
    }
  }

  if (entry) {
    return {
      id: cleanId,
      name: fallbackName ? fallbackName.toUpperCase() : entry.name,
      formalTitle: entry.formalTitle,
      iso2: entry.iso2,
      flagUrl: `https://flagcdn.com/w640/${entry.iso2}.png`,
    };
  }

  // Fallback for unlisted country - do not invent an official title
  const resolvedName = fallbackName ? fallbackName.toUpperCase() : cleanId;
  const iso2Guess = cleanId.slice(0, 2).toLowerCase();
  return {
    id: cleanId,
    name: resolvedName,
    formalTitle: "",
    iso2: iso2Guess,
    flagUrl: `https://flagcdn.com/w640/${iso2Guess}.png`,
  };
}
