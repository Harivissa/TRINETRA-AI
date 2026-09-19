import { GoogleGenAI } from "@google/genai";

let genAIClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    genAIClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return genAIClient;
}

const SYSTEM_PROMPT = `You are Trinetra AI, a geopolitical intelligence analyst producing a strategic briefing for public-awareness and research purposes.

You will be given structured analytical data comparing two countries across military, economic, energy, infrastructure, geopolitical, and scenario dimensions. Do NOT recompute or contradict the scores you are given — treat them as ground truth and explain what they mean.

Write a strategic assessment that:
1. Summarizes the overall balance of strategic leverage between the two countries, citing the specific data provided.
2. Explains the two or three most consequential dependencies or vulnerabilities for each side.
3. Highlights how pressure could realistically transmit across domains (e.g. energy disruption affecting economic resilience).
4. Notes the role of key external actors / strategic balancers.
5. Closes with the most plausible near-term scenario and its labeled probability, along with the clearest available off-ramp.

Rules:
- Never give operational instructions for attacking infrastructure, energy systems, or military targets.
- Always label probability estimates as analytical judgments, not forecasts.
- Do not invent statistics not present in the provided data.
- Keep the tone analytical, structured, and neutral.`;

export async function explainRivalry(analysis: any): Promise<string> {
  const gemini = getGeminiClient();
  const promptData = `Here is the structured analytical data for this rivalry:\n\n${JSON.stringify(analysis, null, 2)}`;

  if (gemini) {
    try {
      const response = await gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          { role: "user", parts: [{ text: `${SYSTEM_PROMPT}\n\n${promptData}` }] },
        ],
      });
      if (response.text) {
        return response.text;
      }
    } catch (e: any) {
      console.warn("Gemini API generation failed:", e?.message || e);
    }
  }

  // Fallback to structured analytical synthesis if AI key is unavailable or fails
  const countryA = analysis.country_a?.name || analysis.country_a?.id;
  const countryB = analysis.country_b?.name || analysis.country_b?.id;
  const milA = analysis.military?.country_a;
  const milB = analysis.military?.country_b;
  const econA = analysis.economic?.country_a;
  const econB = analysis.economic?.country_b;
  const energyA = analysis.energy?.country_a;
  const energyB = analysis.energy?.country_b;
  const chokepointList = (analysis.chokepoints?.relevant_chokepoints || [])
    .map((cp: any) => cp.chokepoint)
    .join(", ");

  return `### Strategic Intelligence Assessment: ${countryA} vs. ${countryB}

1. **Balance of Strategic Leverage**:
   - **${countryA}**: Defence spending estimated at $${milA?.defence_spending_usd_billion ?? "—"}B (${milA?.defence_spending_pct_gdp ?? "—"}% of GDP), with active forces numbering approximately ${milA?.active_troops?.toLocaleString() ?? "—"}. Economic base stands at $${econA?.gdp_usd_trillion ?? "—"}T GDP with growth at ${econA?.gdp_growth_pct ?? "—"}%.
   - **${countryB}**: Defence spending estimated at $${milB?.defence_spending_usd_billion ?? "—"}B (${milB?.defence_spending_pct_gdp ?? "—"}% of GDP), with active forces numbering approximately ${milB?.active_troops?.toLocaleString() ?? "—"}. Economic base stands at $${econB?.gdp_usd_trillion ?? "—"}T GDP with growth at ${econB?.gdp_growth_pct ?? "—"}%.

2. **Critical Dependencies & Vulnerabilities**:
   - **Energy Exposure**: ${countryA} net import dependence ratio is recorded at ${energyA?.net_import_dependence_ratio ?? "N/A"}. For ${countryB}, net import dependence ratio is recorded at ${energyB?.net_import_dependence_ratio ?? "N/A"}.
   - **Maritime & Transit Nodes**: Strategic corridors of consequence include: ${chokepointList || "Regional bilateral border axes"}. Proximity and access constraints dictate shipping and supply security.

3. **Cross-Domain Pressure Dynamics**:
   - Bilateral or regional friction transmits from initial diplomatic/border posturing into maritime freight re-routing, commercial insurance premiums, and localized energy price volatility, impacting downstream consumer inflation.

4. **Strategic Balancers & Third Parties**:
   - Regional middle powers and multilateral forums (G20, SCO, BRICS, QUAD) serve as either potential mediators or structural balancers attempting to prevent zero-sum escalation.

5. **Near-Term Trajectory & De-escalation**:
   - Primary monitored scenario remains managed strategic competition with low-to-elevated localized friction. Off-ramps rely on established bilateral communication mechanisms, high-level diplomatic channels, and multilateral summits.`;
}
