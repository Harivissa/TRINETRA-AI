export interface CountryIndexEntry {
  id: string;
  name: string;
  file: string;
}

export interface Country {
  id: string;
  name: string;
  region?: string;
  demographics?: Record<string, any>;
  economy?: Record<string, any>;
  military?: Record<string, any>;
  energy?: Record<string, any>;
  infrastructure?: Record<string, any>;
  trade?: Record<string, any>;
  technology?: Record<string, any>;
  geography?: Record<string, any>;
  politics?: Record<string, any>;
  nuclear?: Record<string, any>;
  strategic_priorities?: string[];
  dependencies?: string[];
  vulnerabilities?: string[];
  strengths?: string[];
  alliances?: string[];
  rivals?: string[];
  _meta?: Record<string, any>;
}

export interface RivalryAnalysis {
  country_a: { id: string; name: string };
  country_b: { id: string; name: string };
  military: any;
  economic: any;
  energy: any;
  infrastructure: any;
  geopolitical: {
    relationship: any;
    external_actors: { country: string; role: string; reason: string; tie_to_a: string | null; tie_to_b: string | null }[];
    note: string;
  };
  scenarios: any[];
  resilience_profile: {
    dimensions: { dimension: string; country_a_value: number; country_b_value: number; edge: string | null; explains: string }[];
    note: string;
  };
  consequence_chain: {
    chain_type: string;
    steps: { step: number; domain: string; description: string }[];
    note: string;
  };
  chokepoints: {
    relevant_chokepoints: {
      chokepoint: string;
      why_it_matters: string;
      country_a_exposure: any;
      country_b_exposure: any;
      country_a_leverage: any;
      country_b_leverage: any;
    }[];
    note: string;
  };
  deep_dive_analyses: {
    subject: string;
    confidence: string;
    confidence_reason: string;
    facts?: { statement: string; record_type: string; confidence: string }[];
    assessment?: { statement: string; record_type: string; confidence: string; reasoning: string };
    scenario_note?: { statement: string; record_type: string; confidence: string; caveat: string };
  }[];
  ai_summary?: string;
  country_a_profile?: Country;
  country_b_profile?: Country;
  source_relationship?: Record<string, any> | null;
}
