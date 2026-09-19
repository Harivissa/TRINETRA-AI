import { repository } from "./data";

export interface SearchResult {
  record_id: string;
  record_type: string;
  entity: string;
  source: string;
  confidence: string;
  text: string;
  score: number;
}

interface IndexChunk {
  record_id: string;
  record_type: string;
  entity: string;
  source: string;
  confidence: string;
  text: string;
  tokens: Set<string>;
}

class SearchIndex {
  private chunks: IndexChunk[] = [];
  private indexed = false;

  private tokenize(text: string): Set<string> {
    const tokens = new Set<string>();
    const cleaned = text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 2);
    for (const t of cleaned) tokens.add(t);
    return tokens;
  }

  public buildIndex() {
    this.chunks = [];
    const countries = repository.getCountryIndex();

    for (const meta of countries) {
      const country = repository.getCountry(meta.id);
      if (!country) continue;

      const source = country._meta?.source || "Canonical profile";
      const confidence = country._meta?.confidence || "High";

      const addChunk = (section: string, textParts: string[]) => {
        const text = textParts.filter(Boolean).join(" ").trim();
        if (text) {
          this.chunks.push({
            record_id: `${meta.id}:${section}`,
            record_type: `country.${section}`,
            entity: meta.id,
            source,
            confidence,
            text,
            tokens: this.tokenize(`${meta.id} ${meta.name} ${section} ${text}`),
          });
        }
      };

      addChunk("strengths", country.strengths || []);
      addChunk("vulnerabilities", country.vulnerabilities || []);
      addChunk("dependencies", country.dependencies || []);
      addChunk("strategic_priorities", country.strategic_priorities || []);
      addChunk("overview", [
        meta.name,
        country.region,
        country.strategic_autonomy_profile,
        country.energy?.status_2025 ? String(country.energy.status_2025) : "",
      ]);

      const modules = repository.getCountryModulesAvailable(meta.id);
      for (const mod of modules) {
        const modData = repository.getCountryModule(meta.id, mod);
        if (modData) {
          const modText = JSON.stringify(modData);
          this.chunks.push({
            record_id: `${meta.id}:module:${mod}`,
            record_type: `country_module.${mod}`,
            entity: meta.id,
            source: `${meta.name} ${mod} module`,
            confidence: "High",
            text: modText.slice(0, 500),
            tokens: this.tokenize(`${meta.id} ${meta.name} ${mod} ${modText}`),
          });
        }
      }
    }

    const rels = repository.getAllRelationships();
    for (const rel of rels) {
      const a = rel.country_a;
      const b = rel.country_b;
      if (!a || !b) continue;

      const source = rel._meta?.source || "Bilateral registry";
      const confidence = rel._meta?.confidence || "High";

      const addRelChunk = (section: string, textParts: string[]) => {
        const text = textParts.filter(Boolean).join(" ").trim();
        if (text) {
          this.chunks.push({
            record_id: `${a}-${b}:${section}`,
            record_type: `relationship.${section}`,
            entity: `${a}-${b}`,
            source,
            confidence,
            text,
            tokens: this.tokenize(`${a} ${b} ${section} ${text}`),
          });
        }
      };

      addRelChunk("major_disputes", rel.major_disputes || []);
      addRelChunk("cooperation_areas", rel.cooperation_areas || []);
      addRelChunk("trade_dependencies", rel.trade_dependencies || []);
      addRelChunk("escalation_factors", rel.escalation_factors || []);
    }

    const chokepoints = repository.getChokepoints();
    for (const cp of chokepoints) {
      const name = cp.name || cp.title || "";
      const text = `${name}. ${cp.why_it_matters || ""}`;
      this.chunks.push({
        record_id: `chokepoint:${name.toLowerCase().replace(/\s+/g, "-")}`,
        record_type: "chokepoint",
        entity: name,
        source: "Maritime & Energy Chokepoints Registry",
        confidence: "High",
        text,
        tokens: this.tokenize(text),
      });
    }

    this.indexed = true;
  }

  public search(query: string, topK = 5): SearchResult[] {
    if (!this.indexed) {
      this.buildIndex();
    }

    const queryTokens = Array.from(this.tokenize(query));
    if (queryTokens.length === 0) return [];

    const scored: SearchResult[] = [];

    for (const chunk of this.chunks) {
      let matches = 0;
      for (const token of queryTokens) {
        if (chunk.tokens.has(token)) {
          matches += 2;
        } else {
          for (const cToken of chunk.tokens) {
            if (cToken.includes(token) || token.includes(cToken)) {
              matches += 1;
              break;
            }
          }
        }
      }

      if (matches > 0) {
        const score = Number((matches / (queryTokens.length * 2 + Math.log(chunk.tokens.size + 1))).toFixed(4));
        scored.push({
          record_id: chunk.record_id,
          record_type: chunk.record_type,
          entity: chunk.entity,
          source: chunk.source,
          confidence: chunk.confidence,
          text: chunk.text,
          score,
        });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK);
  }
}

export const searchEngine = new SearchIndex();
