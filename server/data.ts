import fs from "node:fs";
import path from "node:path";

export interface CountryMeta {
  id: string;
  name: string;
  file: string;
  region?: string;
}

export interface StrategicGroup {
  id: string;
  name: string;
  description: string;
  focus_areas: string[];
  members: string[];
}

const GROUPS: StrategicGroup[] = [
  {
    id: "g20",
    name: "G20",
    description: "Forum for major advanced and emerging economies focused on global economic cooperation and financial stability.",
    focus_areas: ["Global economy", "Finance", "Trade", "Development"],
    members: ["ARG", "AUS", "BRA", "CAN", "CHN", "FRA", "DEU", "IND", "IDN", "ITA", "JPN", "MEX", "RUS", "SAU", "ZAF", "KOR", "TUR", "GBR", "USA", "EU", "AU"],
  },
  {
    id: "g7",
    name: "G7",
    description: "Coordination forum of advanced industrial democracies addressing economic, security and global policy issues.",
    focus_areas: ["Advanced economies", "Security", "Technology", "Global governance"],
    members: ["CAN", "FRA", "DEU", "ITA", "JPN", "GBR", "USA", "EU"],
  },
  {
    id: "brics",
    name: "BRICS",
    description: "Cooperation grouping centered on emerging economies, development, finance and reform of global institutions.",
    focus_areas: ["Emerging economies", "Development finance", "Trade", "Global governance"],
    members: ["BRA", "RUS", "IND", "CHN", "ZAF", "EGY", "ETH", "IRN", "ARE", "IDN"],
  },
  {
    id: "sco",
    name: "SCO",
    description: "Eurasian cooperation organization focused on security, regional stability and economic cooperation.",
    focus_areas: ["Regional security", "Counterterrorism", "Eurasia", "Economic cooperation"],
    members: ["CHN", "IND", "KAZ", "KGZ", "PAK", "RUS", "TJK", "UZB", "IRN", "BEL"],
  },
  {
    id: "quad",
    name: "QUAD",
    description: "Diplomatic partnership focused on a free, open, inclusive and resilient Indo-Pacific.",
    focus_areas: ["Indo-Pacific", "Maritime security", "Resilient supply chains", "Critical technology"],
    members: ["AUS", "IND", "JPN", "USA"],
  },
];

class DataRepository {
  private baseDir: string;
  private countryIndex: CountryMeta[] = [];
  private countryMap = new Map<string, any>();
  private countrySlugMap = new Map<string, string>();
  private chokepoints: any[] = [];
  private relationships: any[] = [];
  private strategicAnalyses: any[] = [];

  constructor() {
    this.baseDir = path.resolve(process.cwd(), "data");
    this.reload();
  }

  public reload() {
    try {
      const indexPath = path.join(this.baseDir, "countries", "index.json");
      if (fs.existsSync(indexPath)) {
        const raw = fs.readFileSync(indexPath, "utf-8");
        const parsed = JSON.parse(raw);
        this.countryIndex = parsed.countries || [];
      }

      this.countryMap.clear();
      this.countrySlugMap.clear();
      for (const item of this.countryIndex) {
        const filePath = path.join(this.baseDir, "countries", item.file);
        if (fs.existsSync(filePath)) {
          try {
            const raw = fs.readFileSync(filePath, "utf-8");
            const data = JSON.parse(raw);
            const id = (data.id || item.id).toUpperCase();
            this.countryMap.set(id, data);
            const slug = item.file.replace(/\.json$/i, "");
            this.countrySlugMap.set(id, slug);
          } catch (e) {
            console.error(`Failed to load country file ${item.file}:`, e);
          }
        }
      }

      const cpPath = path.join(this.baseDir, "geopolitics", "chokepoints.json");
      if (fs.existsSync(cpPath)) {
        try {
          const raw = fs.readFileSync(cpPath, "utf-8");
          const parsed = JSON.parse(raw);
          this.chokepoints = Array.isArray(parsed) ? parsed : parsed.chokepoints || [];
        } catch (e) {
          console.error("Failed to load chokepoints:", e);
        }
      }

      this.relationships = [];
      const geoDir = path.join(this.baseDir, "geopolitics");
      if (fs.existsSync(geoDir)) {
        const files = fs.readdirSync(geoDir);
        for (const file of files) {
          if (file === "chokepoints.json" || !file.endsWith(".json")) continue;
          try {
            const filePath = path.join(geoDir, file);
            const raw = fs.readFileSync(filePath, "utf-8");
            const data = JSON.parse(raw);
            if (data.country_a && data.country_b) {
              this.relationships.push({ ...data, source_file: file });
            }
          } catch (e) {
            console.error(`Failed to load relationship file ${file}:`, e);
          }
        }
      }

      this.strategicAnalyses = [];
      const stratDir = path.join(this.baseDir, "relationships", "strategic");
      if (fs.existsSync(stratDir)) {
        const files = fs.readdirSync(stratDir);
        for (const file of files) {
          if (file.endsWith(".json")) {
            try {
              const filePath = path.join(stratDir, file);
              const raw = fs.readFileSync(filePath, "utf-8");
              const data = JSON.parse(raw);
              this.strategicAnalyses.push({ ...data, source_file: file });
            } catch (e) {
              console.error(`Failed to load strategic analysis file ${file}:`, e);
            }
          }
        }
      }
    } catch (err) {
      console.error("DataRepository init error:", err);
    }
  }

  public getCountryIndex(): CountryMeta[] {
    return this.countryIndex.map((entry) => {
      const full = this.countryMap.get(entry.id.toUpperCase());
      return {
        ...entry,
        region: full?.region || entry.region || undefined,
      };
    });
  }

  public getCountry(id: string): any | null {
    if (!id) return null;
    const clean = id.trim().toUpperCase();
    const direct = this.countryMap.get(clean);
    if (direct) return direct;

    const lower = id.trim().toLowerCase();
    for (const country of this.countryMap.values()) {
      if (country.id?.toLowerCase() === lower || country.name?.toLowerCase() === lower) {
        return country;
      }
    }
    for (const [key, slug] of this.countrySlugMap.entries()) {
      if (slug.toLowerCase() === lower) {
        return this.countryMap.get(key) || null;
      }
    }
    return null;
  }

  public getCountrySlug(id: string): string | null {
    if (!id) return null;
    const clean = id.trim().toUpperCase();
    const direct = this.countrySlugMap.get(clean);
    if (direct) return direct;

    const country = this.getCountry(id);
    if (country?.id) {
      return this.countrySlugMap.get(country.id.toUpperCase()) || null;
    }
    return null;
  }

  public getCountryModulesAvailable(id: string): string[] {
    const slug = this.getCountrySlug(id);
    if (!slug) return [];
    const moduleDir = path.join(this.baseDir, "countries", slug);
    if (!fs.existsSync(moduleDir) || !fs.statSync(moduleDir).isDirectory()) {
      return [];
    }
    const files = fs.readdirSync(moduleDir);
    return files
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(/\.json$/, ""))
      .sort();
  }

  public getCountryModule(id: string, moduleName: string): any | null {
    const slug = this.getCountrySlug(id);
    if (!slug) return null;
    const sanitizedModule = path.basename(moduleName);
    const modPath = path.join(this.baseDir, "countries", slug, `${sanitizedModule}.json`);
    if (!fs.existsSync(modPath)) return null;
    try {
      return JSON.parse(fs.readFileSync(modPath, "utf-8"));
    } catch {
      return null;
    }
  }

  public getRelationship(countryA: string, countryB: string): any | null {
    const a = countryA.toUpperCase();
    const b = countryB.toUpperCase();
    return (
      this.relationships.find(
        (r) =>
          (r.country_a?.toUpperCase() === a && r.country_b?.toUpperCase() === b) ||
          (r.country_a?.toUpperCase() === b && r.country_b?.toUpperCase() === a)
      ) || null
    );
  }

  public getAllRelationships(): any[] {
    return this.relationships;
  }

  public getRelationshipsFor(countryId: string): any[] {
    const cid = countryId.toUpperCase();
    return this.relationships.filter(
      (r) => r.country_a?.toUpperCase() === cid || r.country_b?.toUpperCase() === cid
    );
  }

  public getChokepoints(): any[] {
    return this.chokepoints;
  }

  public getModulesForPair(countryA: string, countryB: string): any[] {
    const a = countryA.toUpperCase();
    const b = countryB.toUpperCase();
    return this.relationships.filter((r) => {
      const parties = new Set([r.country_a?.toUpperCase(), r.country_b?.toUpperCase()]);
      return parties.has(a) && parties.has(b);
    });
  }

  public getExternalActorRecords(countryA: string, countryB: string): any[] {
    const a = countryA.toUpperCase();
    const b = countryB.toUpperCase();
    return this.relationships.filter((r) => {
      const ra = r.country_a?.toUpperCase();
      const rb = r.country_b?.toUpperCase();
      return ra === a || ra === b || rb === a || rb === b;
    });
  }

  public getDeepDiveAnalyses(countryA: string, countryB: string): any[] {
    const a = countryA.toUpperCase();
    const b = countryB.toUpperCase();
    if (!((a === "IND" && b === "CHN") || (a === "CHN" && b === "IND"))) {
      return [];
    }
    return this.strategicAnalyses.filter((r) => r.source_file?.startsWith("analysis-"));
  }

  public getGroups(): StrategicGroup[] {
    return GROUPS;
  }

  public getGroup(id: string): StrategicGroup | null {
    return GROUPS.find((g) => g.id.toLowerCase() === id.toLowerCase()) || null;
  }

  public getEntity(id: string): any | null {
    const entityPath = path.join(this.baseDir, "entities", "countries", `${id.toUpperCase()}.json`);
    if (!fs.existsSync(entityPath)) return null;
    try {
      const data = JSON.parse(fs.readFileSync(entityPath, "utf-8"));
      if (Array.isArray(data.key_people)) {
        data.people_details = data.key_people.map((pId: string) => {
          const personPath = path.join(this.baseDir, "entities", "people", `${pId}.json`);
          if (fs.existsSync(personPath)) {
            try {
              return JSON.parse(fs.readFileSync(personPath, "utf-8"));
            } catch {
              return { id: pId };
            }
          }
          return { id: pId };
        });
      }
      if (Array.isArray(data.key_organisations_member_of)) {
        data.organisations_details = data.key_organisations_member_of.map((oId: string) => {
          const orgPath = path.join(this.baseDir, "entities", "organisations", `${oId}.json`);
          if (fs.existsSync(orgPath)) {
            try {
              return JSON.parse(fs.readFileSync(orgPath, "utf-8"));
            } catch {
              return { id: oId };
            }
          }
          return { id: oId };
        });
      }
      return data;
    } catch {
      return null;
    }
  }
}

export const repository = new DataRepository();
