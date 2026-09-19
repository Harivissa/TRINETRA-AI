import { repository } from "./data";

export function analyzeMilitary(countryA: any, countryB: any) {
  const build = (c: any) => {
    const military = c?.military || {};
    return {
      id: c.id,
      active_troops: military.active_troops ?? null,
      defence_spending_usd_billion: military.defence_spending_usd_billion ?? null,
      defence_spending_pct_gdp: military.defence_spending_pct_gdp ?? null,
      nuclear_state: c?.nuclear?.weapons_state ?? null,
      strengths: c?.strengths || [],
      vulnerabilities: c?.vulnerabilities || [],
      meta: c?._meta || {},
    };
  };

  return {
    country_a: build(countryA),
    country_b: build(countryB),
    note: "Factual fields from canonical country profiles; no composite score.",
  };
}

export function analyzeEconomic(countryA: any, countryB: any) {
  const build = (c: any) => {
    const economy = c?.economy || {};
    return {
      id: c.id,
      gdp_usd_trillion: economy.gdp_usd_trillion ?? null,
      gdp_growth_pct: economy.gdp_growth_pct ?? null,
      notes: economy.notes ?? null,
      meta: c?._meta || {},
    };
  };

  return {
    country_a: build(countryA),
    country_b: build(countryB),
    note: "Factual fields from canonical country profiles; no resilience score.",
  };
}

export function analyzeEnergy(countryA: any, countryB: any) {
  const build = (c: any) => {
    const energy = c?.energy || {};
    return {
      id: c.id,
      net_import_dependence_ratio: energy.net_import_dependence_ratio ?? null,
      note: energy.note ?? null,
      meta: c?._meta || {},
    };
  };

  return {
    country_a: build(countryA),
    country_b: build(countryB),
    note: "Dependence is shown as stored; no vulnerability score is inferred.",
  };
}

export function analyzeInfrastructure(countryA: any, countryB: any) {
  const build = (c: any) => {
    const infra = c?.infrastructure || {};
    return {
      id: c.id,
      major_ports: infra.major_ports || [],
      rail_network_km: infra.rail_network_km ?? null,
      strategic_airports: infra.strategic_airports || [],
      energy_grid_resilience: infra.energy_grid_resilience ?? null,
      digital_infrastructure: infra.digital_infrastructure ?? null,
      meta: c?._meta || {},
    };
  };

  return {
    country_a: build(countryA),
    country_b: build(countryB),
    note: "Infrastructure assets and nodes as recorded.",
  };
}

export function analyzeGeopolitical(countryA: any, countryB: any, relationship: any | null) {
  const aId = countryA.id;
  const bId = countryB.id;
  const exclude = new Set([aId, bId]);

  const tiesToA = repository.getRelationshipsFor(aId).filter((r) => {
    const other = r.country_a === aId ? r.country_b : r.country_a;
    return !exclude.has(other);
  });

  const tiesToB = repository.getRelationshipsFor(bId).filter((r) => {
    const other = r.country_a === bId ? r.country_b : r.country_a;
    return !exclude.has(other);
  });

  const thirdPartyCountries = new Set<string>();
  for (const r of [...tiesToA, ...tiesToB]) {
    const other = [r.country_a, r.country_b].find((c) => !exclude.has(c));
    if (other) thirdPartyCountries.add(other);
  }

  const strong = new Set(["strategic_ally", "strategic_partner", "defence_partner"]);

  const actors = Array.from(thirdPartyCountries).map((cid) => {
    const aTies = tiesToA.filter((r) => r.country_a === cid || r.country_b === cid);
    const bTies = tiesToB.filter((r) => r.country_a === cid || r.country_b === cid);

    const catA = aTies.map((t) => t.classification?.category || t.relationship_type);
    const catB = bTies.map((t) => t.classification?.category || t.relationship_type);

    const hasStrongA = catA.some((c) => strong.has(c));
    const hasStrongB = catB.some((c) => strong.has(c));

    let role = "Not directly connected";
    let reason = "No significant strategic alignment detected.";

    if (hasStrongA && hasStrongB) {
      role = "Potential mediator / strategic balancer";
      reason =
        "This country holds strong ties to both sides. Maintaining both relationships is usually more valuable to it than picking a side, giving it an incentive to encourage de-escalation rather than let the rivalry force a choice.";
    } else if (hasStrongA && !hasStrongB) {
      role = `Likely supporter of ${countryA.name || aId}`;
      reason = `This country has a strategic-ally or strategic-partner tie to ${countryA.name || aId} and no comparable tie to ${countryB.name || bId}.`;
    } else if (hasStrongB && !hasStrongA) {
      role = `Likely supporter of ${countryB.name || bId}`;
      reason = `This country has a strategic-ally or strategic-partner tie to ${countryB.name || bId} and no comparable tie to ${countryA.name || aId}.`;
    } else if (catA.length > 0 || catB.length > 0) {
      role = "Economically exposed, likely to stay neutral";
      reason =
        "This country has some economic or diplomatic ties to one or both sides, but nothing strong enough to indicate it would take sides.";
    }

    return {
      country: cid,
      role,
      reason,
      ties_to_a: aTies.length,
      ties_to_b: bTies.length,
    };
  });

  return {
    bilateral: relationship
      ? {
          major_disputes: relationship.major_disputes || [],
          cooperation_areas: relationship.cooperation_areas || [],
          escalation_factors: relationship.escalation_factors || [],
          deescalation_factors: relationship.deescalation_factors || [],
          trade_dependencies: relationship.trade_dependencies || [],
          status: relationship.status || "active",
        }
      : null,
    external_actors: actors,
  };
}

export function analyzeScenarios(countryA: any, countryB: any, relationship: any | null) {
  const templates = [
    "Diplomatic crisis",
    "Limited conflict",
    "Economic confrontation",
    "Energy disruption",
    "Infrastructure disruption",
    "Regional escalation",
    "Large-scale conventional conflict",
    "De-escalation",
  ];

  const escalationFactors = relationship?.escalation_factors || [];
  const deescalationFactors = relationship?.deescalation_factors || [];
  const disputes = relationship?.major_disputes || [];

  return templates.map((name) => {
    let probability = "low";
    let triggers: string[] = [];

    if (name === "De-escalation") {
      probability = deescalationFactors.length > 0 ? "elevated" : "low";
      triggers = deescalationFactors.length > 0 ? deescalationFactors : ["Sustained diplomatic engagement"];
    } else {
      probability = escalationFactors.length > 0 ? "elevated" : "low";
      triggers =
        escalationFactors.length > 0
          ? escalationFactors
          : disputes.length > 0
          ? disputes
          : ["Underlying strategic competition"];
    }

    return {
      scenario: name,
      actors: [countryA.id, countryB.id],
      trigger_factors: triggers,
      probability_estimate: probability,
      probability_note: "Analytical estimate only, not a forecast.",
      off_ramps:
        deescalationFactors.length > 0 ? deescalationFactors : ["Third-party mediation", "Track-two diplomacy"],
    };
  });
}

export function buildResilienceProfile(military: any, economic: any, energy: any, infrastructure: any) {
  return {
    dimensions: [
      {
        dimension: "Military capability",
        country_a_value: null,
        country_b_value: null,
        edge: null,
        explains: "Compare the source-backed military fields above; no composite score is calculated.",
      },
      {
        dimension: "Economic position",
        country_a_value: null,
        country_b_value: null,
        edge: null,
        explains: "GDP and growth are shown as separate source-backed metrics; no resilience score is calculated.",
      },
      {
        dimension: "Energy dependence",
        country_a_value: energy.country_a?.net_import_dependence_ratio ?? null,
        country_b_value: energy.country_b?.net_import_dependence_ratio ?? null,
        edge: null,
        explains: "Stored net import dependence ratio; interpretation remains source-dependent.",
      },
    ],
    note: "TRINETRA does not assign a single country score or winner. Read each factual metric with its source and reference context.",
  };
}

export function buildConsequenceChain(countryA: any, countryB: any, relationship: any | null) {
  const aId = countryA.id;
  const bId = countryB.id;
  const tradeNotes = relationship?.trade_dependencies || [];
  const hasTradeLink = tradeNotes.length > 0;

  const energyImporter = (c: any) => (c?.energy?.net_import_dependence_ratio || 0) > 0.3;

  const importers = [countryA, countryB].filter(energyImporter).map((c) => c.id);
  const importerText =
    importers.length > 0 ? importers.join(", ") : "neither side shows high import dependence in the current data";

  return {
    steps: [
      {
        step: 1,
        domain: "Diplomatic",
        description: `Diplomatic tension rises between ${aId} and ${bId}, following the disputes on file for this relationship.`,
      },
      {
        step: 2,
        domain: "Military",
        description: "Both sides raise military readiness / forward posture along contested areas.",
      },
      {
        step: 3,
        domain: "Trade",
        description: hasTradeLink
          ? `Trade between ${aId} and ${bId} comes under strain.`
          : `${aId} and ${bId} have limited direct trade on file, so this domain is less exposed for this pair specifically — but each side's trade with third parties may still be affected.`,
      },
      {
        step: 4,
        domain: "Shipping / supply chains",
        description:
          "Shipping insurers and freight operators reassess risk on routes serving either country, which can raise costs even without a formal blockade.",
      },
      {
        step: 5,
        domain: "Energy markets",
        description: `Energy markets react with more sensitivity for the side more dependent on imports: ${importerText}.`,
      },
      {
        step: 6,
        domain: "Inflation / economy",
        description:
          "Higher shipping and energy costs feed into import costs and, with a lag, consumer inflation in both countries.",
      },
      {
        step: 7,
        domain: "External actors",
        description:
          "Allies, energy suppliers and regional balancers begin shifting trade routes, financial settlements or diplomatic positions.",
      },
    ],
    note: "Analytical scenario model tracing potential cross-domain pressure transfer; not a deterministic prediction.",
  };
}

export function analyzeChokepoints(countryA: any, countryB: any) {
  const aId = countryA.id;
  const bId = countryB.id;
  const relevant: any[] = [];

  for (const cp of repository.getChokepoints()) {
    const exposed = (cp.countries_most_exposed || []).map((e: any) => e.country || e);
    const leverage = (cp.countries_with_leverage || []).map((e: any) => e.country || e);

    const exposedSet = new Set(exposed);
    const leverageSet = new Set(leverage);

    if (!exposedSet.has(aId) && !exposedSet.has(bId) && !leverageSet.has(aId) && !leverageSet.has(bId)) {
      continue;
    }

    const aExposure = (cp.countries_most_exposed || []).find((e: any) => (e.country || e) === aId) || null;
    const bExposure = (cp.countries_most_exposed || []).find((e: any) => (e.country || e) === bId) || null;
    const aLeverage = (cp.countries_with_leverage || []).find((e: any) => (e.country || e) === aId) || null;
    const bLeverage = (cp.countries_with_leverage || []).find((e: any) => (e.country || e) === bId) || null;

    relevant.push({
      chokepoint: cp.name,
      why_it_matters: cp.why_it_matters,
      country_a_exposure: aExposure,
      country_b_exposure: bExposure,
      country_a_leverage: aLeverage,
      country_b_leverage: bLeverage,
    });
  }

  return {
    relevant_chokepoints: relevant,
    note: "Geographic leverage over a chokepoint is not the same as the ability to unilaterally close it - most chokepoints are bordered by multiple sovereign states and used by global shipping, not just the two countries being compared. Treat 'leverage' here as a real but bounded strategic asset, not a guaranteed blockade capability.",
  };
}

export function runRivalryAnalysis(countryA: any, countryB: any, relationship: any | null) {
  const military = analyzeMilitary(countryA, countryB);
  const economic = analyzeEconomic(countryA, countryB);
  const energy = analyzeEnergy(countryA, countryB);
  const infrastructure = analyzeInfrastructure(countryA, countryB);
  const geopolitical = analyzeGeopolitical(countryA, countryB, relationship);
  const scenarios = analyzeScenarios(countryA, countryB, relationship);
  const resilienceProfile = buildResilienceProfile(military, economic, energy, infrastructure);
  const consequenceChain = buildConsequenceChain(countryA, countryB, relationship);
  const chokepoints = analyzeChokepoints(countryA, countryB);
  const deepDiveAnalyses = repository.getDeepDiveAnalyses(countryA.id, countryB.id);

  return {
    country_a: { id: countryA.id, name: countryA.name },
    country_b: { id: countryB.id, name: countryB.name },
    military,
    economic,
    energy,
    infrastructure,
    geopolitical,
    scenarios,
    resilience_profile: resilienceProfile,
    consequence_chain: consequenceChain,
    chokepoints,
    deep_dive_analyses: deepDiveAnalyses,
  };
}
