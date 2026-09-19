import express from "express";
import cors from "cors";
import path from "node:path";
import { createServer as createViteServer } from "vite";
import { repository } from "./server/data";
import { runRivalryAnalysis } from "./server/strategic";
import { explainRivalry } from "./server/ai";
import { searchEngine } from "./server/search";

// Ensure any invalid VITE_API_BASE_URL pointing to port 8000 is sanitized
if (process.env.VITE_API_BASE_URL && process.env.VITE_API_BASE_URL.includes("8000")) {
  process.env.VITE_API_BASE_URL = "";
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: "10mb" }));

  // Serve static assets from public, video, and frontend/public directories
  app.use("/frontend/public", express.static(path.join(process.cwd(), "frontend/public")));
  app.use("/public", express.static(path.join(process.cwd(), "public")));
  app.use("/video", express.static(path.join(process.cwd(), "public/video")));

  // --- API Routes ---

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      engine: process.env.GEMINI_API_KEY || process.env.ANTHROPIC_API_KEY ? "static+ai" : "static",
    });
  });

  app.get("/api/countries", (_req, res) => {
    try {
      const countries = repository.getCountryIndex();
      if (!countries || !Array.isArray(countries)) {
        return res.json([]);
      }
      return res.json(countries);
    } catch (err) {
      console.error("Failed to retrieve countries:", err);
      return res.status(500).json({ error: "Failed to retrieve country data" });
    }
  });

  app.get("/api/entities", (_req, res) => {
    try {
      const countries = repository.getCountryIndex();
      if (!countries || !Array.isArray(countries)) {
        return res.json([]);
      }
      return res.json(countries);
    } catch (err) {
      console.error("Failed to retrieve entities:", err);
      return res.status(500).json({ error: "Failed to retrieve entity data" });
    }
  });

  app.get("/api/countries/:country_id", (req, res) => {
    const countryId = req.params.country_id;
    const country = repository.getCountry(countryId);
    if (!country) {
      return res.status(404).json({ error: `Country '${countryId}' not found` });
    }
    return res.json(country);
  });

  app.get("/api/countries/:country_id/energy", (req, res) => {
    const countryId = req.params.country_id;
    const country = repository.getCountry(countryId);
    if (!country) {
      return res.status(404).json({ error: `Country '${countryId}' not found` });
    }
    return res.json(country.energy || {});
  });

  app.get("/api/countries/:country_id/infrastructure", (req, res) => {
    const countryId = req.params.country_id;
    const country = repository.getCountry(countryId);
    if (!country) {
      return res.status(404).json({ error: `Country '${countryId}' not found` });
    }
    return res.json(country.infrastructure || {});
  });

  app.get("/api/countries/:country_id/modules", (req, res) => {
    const countryId = req.params.country_id;
    const country = repository.getCountry(countryId);
    if (!country) {
      return res.status(404).json({ error: `Country '${countryId}' not found` });
    }
    return res.json({
      available_modules: repository.getCountryModulesAvailable(countryId),
    });
  });

  app.get("/api/countries/:country_id/:module", (req, res) => {
    const { country_id, module: moduleName } = req.params;
    const country = repository.getCountry(country_id);
    if (!country) {
      return res.status(404).json({ error: `Country '${country_id}' not found` });
    }
    const data = repository.getCountryModule(country_id, moduleName);
    if (!data) {
      return res.status(404).json({
        error: "Not enough reliable data",
        detail: `No '${moduleName}' module has been populated for ${country.name || country_id} yet.`,
      });
    }
    return res.json(data);
  });

  app.get("/api/relationships/:country_a/:country_b", (req, res) => {
    const { country_a, country_b } = req.params;
    const rel = repository.getRelationship(country_a, country_b);
    if (!rel) {
      return res.status(404).json({ error: "No relationship data found for this pair" });
    }
    return res.json(rel);
  });

  const handleComparison = async (req: express.Request, res: express.Response) => {
    const body = req.body || {};
    const query = req.query || {};
    const aRaw = body.country_a || body.countryA || body.a || query.country_a || query.countryA || query.a;
    const bRaw = body.country_b || body.countryB || body.b || query.country_b || query.countryB || query.b;
    const include_ai_summary = Boolean(body.include_ai_summary || query.include_ai_summary);

    const aId = typeof aRaw === "string" ? aRaw.trim() : "";
    const bId = typeof bRaw === "string" ? bRaw.trim() : "";

    if (!aId || !bId) {
      return res.status(400).json({ error: "country_a and country_b are required" });
    }

    if (aId.toUpperCase() === bId.toUpperCase()) {
      return res.status(400).json({ error: "Select two different countries to compare." });
    }

    const countryA = repository.getCountry(aId);
    const countryB = repository.getCountry(bId);

    if (!countryA && !countryB) {
      return res.status(404).json({ error: `Neither '${aId}' nor '${bId}' was found in the TRINETRA dataset.` });
    }
    if (!countryA) {
      return res.status(404).json({ error: `Country '${aId}' was not found in the TRINETRA dataset.` });
    }
    if (!countryB) {
      return res.status(404).json({ error: `Country '${bId}' was not found in the TRINETRA dataset.` });
    }

    const relationship = repository.getRelationship(countryA.id, countryB.id);
    const analysis: any = runRivalryAnalysis(countryA, countryB, relationship);

    const pair = new Set([countryA.id.toUpperCase(), countryB.id.toUpperCase()]);
    const chokepoints: any[] = [];
    for (const cp of repository.getChokepoints()) {
      const exposed = (cp.countries_most_exposed || []).map((e: any) => (e.country || e)?.toUpperCase());
      const leverage = (cp.countries_with_leverage || []).map((e: any) => (e.country || e)?.toUpperCase());
      const allInCp = new Set([...exposed, ...leverage]);
      if (Array.from(pair).some((c) => allInCp.has(c))) {
        chokepoints.push(cp);
      }
    }

    const modules = repository.getModulesForPair(countryA.id, countryB.id);
    const externalActorRecords = repository.getExternalActorRecords(countryA.id, countryB.id);

    const modulesA: Record<string, any> = {};
    for (const mod of repository.getCountryModulesAvailable(countryA.id)) {
      const data = repository.getCountryModule(countryA.id, mod);
      if (data) modulesA[mod] = data;
    }

    const modulesB: Record<string, any> = {};
    for (const mod of repository.getCountryModulesAvailable(countryB.id)) {
      const data = repository.getCountryModule(countryB.id, mod);
      if (data) modulesB[mod] = data;
    }

    const entityA = repository.getEntity(countryA.id);
    const entityB = repository.getEntity(countryB.id);

    analysis.country_a_profile = countryA;
    analysis.country_b_profile = countryB;
    analysis.country_a_modules = modulesA;
    analysis.country_b_modules = modulesB;
    analysis.country_a_entity = entityA;
    analysis.country_b_entity = entityB;
    analysis.source_relationship = relationship;
    analysis.comparison_data = {
      chokepoints,
      pair_modules: modules,
      external_actor_records: externalActorRecords,
      availability: {
        country_profiles: true,
        bilateral_relationship: relationship !== null,
        chokepoints: chokepoints.length > 0,
        pair_modules: modules.length > 0,
        source_metadata: Boolean(countryA._meta || countryB._meta),
        external_actor_records: externalActorRecords.length > 0,
        country_a_politics: Boolean(modulesA.politics || entityA?.governance_note || entityA?.people_details?.length),
        country_b_politics: Boolean(modulesB.politics || entityB?.governance_note || entityB?.people_details?.length),
        country_a_history: Boolean(modulesA.history?.events?.length),
        country_b_history: Boolean(modulesB.history?.events?.length),
        country_a_foreign_policy: Boolean(modulesA.foreign_policy),
        country_b_foreign_policy: Boolean(modulesB.foreign_policy),
      },
    };

    if (include_ai_summary) {
      try {
        analysis.ai_summary = await explainRivalry(analysis);
      } catch (err: any) {
        console.error("AI summary generation error:", err);
        analysis.ai_summary_error = String(err?.message || err);
      }
    }

    return res.json(analysis);
  };

  app.post("/api/analysis/rivalry", handleComparison);
  app.get("/api/analysis/rivalry", handleComparison);
  app.post("/api/compare", handleComparison);
  app.get("/api/compare", handleComparison);
  app.post("/api/comparison", handleComparison);
  app.get("/api/comparison", handleComparison);

  app.get("/api/groups", (_req, res) => {
    const available = new Set(repository.getCountryIndex().map((c) => c.id));
    const groups = repository.getGroups().map((g) => ({
      ...g,
      available_members: g.members.filter((m) => available.has(m)),
    }));
    return res.json(groups);
  });

  app.get("/api/groups/:group_id", (req, res) => {
    const groupId = req.params.group_id;
    const group = repository.getGroup(groupId);
    if (!group) {
      return res.status(404).json({ error: `Strategic group '${groupId}' not found` });
    }
    const available = new Set(repository.getCountryIndex().map((c) => c.id));
    return res.json({
      ...group,
      available_members: group.members.filter((m) => available.has(m)),
    });
  });

  app.get("/api/chokepoints", (_req, res) => {
    return res.json(repository.getChokepoints());
  });

  app.get("/api/network", (_req, res) => {
    const countries = repository.getCountryIndex();
    const nodes = countries.map((c) => ({ id: c.id, label: c.name, type: "country" }));
    const edges: Array<{ source: string; target: string; type: string }> = [];

    for (const entry of countries) {
      const full = repository.getCountry(entry.id);
      if (!full) continue;
      for (const ally of full.alliances || []) {
        edges.push({ source: entry.id, target: ally, type: "alliance" });
      }
      for (const rival of full.rivals || []) {
        edges.push({ source: entry.id, target: rival, type: "rivalry" });
      }
    }

    return res.json({ nodes, edges });
  });

  app.post("/api/search", (req, res) => {
    const body = req.body || {};
    const query = String(body.query || "").trim();
    if (!query) {
      return res.status(400).json({ error: "query is required" });
    }
    const topK = Math.min(Math.max(Number(body.top_k) || 5, 1), 20);
    const results = searchEngine.search(query, topK);
    return res.json({ query, results });
  });

  // --- Vite Dev Server Middleware or Static Production Serving ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: "0.0.0.0", port: PORT },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Trinetra AI server running on port ${PORT}`);
  });
}

startServer();
