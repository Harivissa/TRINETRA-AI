"""
Deepens the energy module for all 21 countries — production/consumption/
trade balance, electricity mix, key suppliers/customers. Figures are
well-established approximate values (IEA/EIA-consistent orders of
magnitude), explicitly labeled ESTIMATE, not claimed as precise.
"""
import json
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "countries")

ENERGY = {
    "india.json": dict(oil_prod_bpd="~0.6M", oil_cons_bpd="~5.3M", net_oil="importer (~87% of consumption)",
        gas="net importer, growing LNG reliance", electricity_mix="coal ~70%, renewables/hydro ~25%, nuclear ~3%",
        suppliers=["IRQ", "RUS", "SAU", "ARE", "USA"], customers=[]),
    "china.json": dict(oil_prod_bpd="~4.1M", oil_cons_bpd="~15.9M", net_oil="importer (~72% of consumption)",
        gas="net importer, growing LNG + pipeline (RUS, Central Asia)", electricity_mix="coal ~60%, hydro/renewables/nuclear ~40%, rapidly expanding solar/wind",
        suppliers=["SAU", "RUS", "IRQ", "ARE"], customers=[]),
    "usa.json": dict(oil_prod_bpd="~13.2M", oil_cons_bpd="~20.3M", net_oil="net exporter (shale-driven since ~2019)",
        gas="major net exporter (LNG)", electricity_mix="gas ~40%, nuclear ~19%, coal ~16%, renewables ~25%",
        suppliers=[], customers=["EU", "JPN", "KOR"]),
    "russia.json": dict(oil_prod_bpd="~10.5M", oil_cons_bpd="~3.6M", net_oil="major net exporter",
        gas="major net exporter (pipeline to CHN/Central Asia, reduced pipeline to EU since 2022)", electricity_mix="gas ~45%, nuclear ~20%, hydro ~20%, coal ~15%",
        suppliers=[], customers=["CHN", "IND", "TUR"]),
    "japan.json": dict(oil_prod_bpd="negligible", oil_cons_bpd="~3.2M", net_oil="near-total importer",
        gas="near-total LNG importer", electricity_mix="gas ~34%, coal ~30%, renewables ~22%, nuclear restart ongoing ~7%",
        suppliers=["SAU", "ARE", "AUS (LNG)", "QAT"], customers=[]),
    "germany.json": dict(oil_prod_bpd="negligible", oil_cons_bpd="~2.3M", net_oil="near-total importer",
        gas="severe net importer, transitioned from Russian pipeline to US/Qatari LNG + Norwegian pipeline post-2022", electricity_mix="renewables ~50%+, coal ~25%, gas ~15%, nuclear phased out 2023",
        suppliers=["NOR", "USA", "QAT", "NLD"], customers=[]),
    "uk.json": dict(oil_prod_bpd="~0.75M (declining North Sea)", oil_cons_bpd="~1.3M", net_oil="net importer",
        gas="net importer, North Sea production declining, LNG-reliant", electricity_mix="gas ~30%, wind ~30%, nuclear ~15%, other renewables ~15%",
        suppliers=["NOR", "USA", "QAT"], customers=[]),
    "france.json": dict(oil_prod_bpd="negligible", oil_cons_bpd="~1.6M", net_oil="near-total importer",
        gas="net importer", electricity_mix="nuclear ~65% (highest nuclear share globally), hydro ~10%, renewables ~15%, gas ~10%",
        suppliers=["NOR", "USA", "DZA"], customers=[]),
    "south-korea.json": dict(oil_prod_bpd="negligible", oil_cons_bpd="~2.7M", net_oil="near-total importer",
        gas="near-total LNG importer", electricity_mix="coal ~35%, gas ~28%, nuclear ~28%, renewables ~9%",
        suppliers=["SAU", "ARE", "QAT", "USA"], customers=[]),
    "turkey.json": dict(oil_prod_bpd="~0.1M", oil_cons_bpd="~1.1M", net_oil="severe net importer",
        gas="severe net importer (RUS, AZE, Caspian pipelines + LNG)", electricity_mix="coal ~35%, gas ~22%, hydro ~20%, renewables ~20%",
        suppliers=["RUS", "AZE", "IRN", "IRQ"], customers=[]),
    "saudi-arabia.json": dict(oil_prod_bpd="~9-12M (OPEC+ swing capacity)", oil_cons_bpd="~3.3M", net_oil="major net exporter",
        gas="net producer, growing domestic use", electricity_mix="oil/gas ~99%, solar expansion under Vision 2030",
        suppliers=[], customers=["CHN", "IND", "JPN", "KOR"]),
    "iran.json": dict(oil_prod_bpd="~3.4M (constrained by sanctions/war damage)", oil_cons_bpd="~2.0M", net_oil="major net exporter (largely to China via shadow fleet under sanctions)",
        gas="major reserves (South Pars field), limited refining/export infrastructure", electricity_mix="gas ~90%, hydro/nuclear/renewables ~10%",
        suppliers=[], customers=["CHN"]),
    "israel.json": dict(oil_prod_bpd="negligible", oil_cons_bpd="~0.28M", net_oil="net importer",
        gas="net exporter (Leviathan/Tamar offshore fields) to Egypt/Jordan", electricity_mix="gas ~70%, coal ~15%, renewables ~15%",
        suppliers=["AZE"], customers=["EGY", "JOR"]),
    "pakistan.json": dict(oil_prod_bpd="~0.08M", oil_cons_bpd="~0.5M", net_oil="severe net importer",
        gas="net importer (declining domestic production, growing LNG reliance)", electricity_mix="gas ~30%, hydro ~25%, coal ~15%, nuclear ~10%, renewables ~15%",
        suppliers=["SAU", "ARE", "QAT (LNG)"], customers=[]),
    "australia.json": dict(oil_prod_bpd="~0.3M", oil_cons_bpd="~1.0M", net_oil="net importer (refined products) despite being a major raw exporter",
        gas="massive net exporter (LNG, one of world's largest)", electricity_mix="coal ~45%, renewables ~35%, gas ~20%",
        suppliers=[], customers=["JPN", "CHN", "KOR"]),
    "canada.json": dict(oil_prod_bpd="~5.1M (oil sands-driven)", oil_cons_bpd="~2.4M", net_oil="major net exporter (~almost entirely to USA)",
        gas="net exporter (pipeline to US, growing LNG)", electricity_mix="hydro ~60%, nuclear ~15%, gas ~10%, renewables ~15%",
        suppliers=[], customers=["USA"]),
    "brazil.json": dict(oil_prod_bpd="~3.4M (pre-salt offshore fields)", oil_cons_bpd="~3.1M", net_oil="net exporter (post-2020 pre-salt ramp-up)",
        gas="net importer (Bolivia pipeline + LNG)", electricity_mix="hydro ~60%, wind/solar ~20%, gas/biomass ~15%",
        suppliers=["BOL"], customers=["CHN", "USA"]),
    "indonesia.json": dict(oil_prod_bpd="~0.6M", oil_cons_bpd="~1.8M", net_oil="net importer (crude), net exporter of coal/LNG",
        gas="net exporter (LNG), though domestic consumption rising", electricity_mix="coal ~60%, gas ~20%, hydro/geothermal ~15%, renewables growing",
        suppliers=["SAU"], customers=["JPN", "KOR", "CHN"]),
    "italy.json": dict(oil_prod_bpd="~0.1M", oil_cons_bpd="~1.2M", net_oil="near-total importer",
        gas="severe net importer, diversified post-2022 (Algeria, Azerbaijan, Qatar LNG) away from Russian pipeline reliance", electricity_mix="gas ~45%, renewables ~40%, hydro ~15%",
        suppliers=["DZA", "AZE", "QAT", "LBY"], customers=[]),
    "uae.json": dict(oil_prod_bpd="~3.2M (OPEC+ member)", oil_cons_bpd="~0.7M", net_oil="major net exporter",
        gas="net exporter, though imports some LNG for peak domestic demand", electricity_mix="gas ~85%, nuclear (Barakah plant) ~10%, solar ~5% and growing",
        suppliers=[], customers=["JPN", "KOR", "IND"]),
    "bangladesh.json": dict(oil_prod_bpd="negligible", oil_cons_bpd="~0.15M", net_oil="near-total importer",
        gas="domestic production declining, growing LNG import reliance", electricity_mix="gas ~55%, coal ~15%, oil ~20%, renewables/hydro ~10%",
        suppliers=["IND (emergency diesel, 2026)", "QAT (LNG)"], customers=[]),
}

updated = []
for fname, e in ENERGY.items():
    path = os.path.join(DATA_DIR, fname)
    if not os.path.exists(path):
        print(f"SKIP {fname} — not found")
        continue
    with open(path) as f:
        data = json.load(f)

    energy = data.setdefault("energy", {})
    energy["oil_production_bpd_estimate"] = e["oil_prod_bpd"]
    energy["oil_consumption_bpd_estimate"] = e["oil_cons_bpd"]
    energy["net_oil_position"] = e["net_oil"]
    energy["gas_position"] = e["gas"]
    energy["electricity_mix_estimate"] = e["electricity_mix"]
    if e["suppliers"]:
        energy["major_energy_suppliers"] = e["suppliers"]
    if e["customers"]:
        energy["major_energy_customers"] = e["customers"]
    energy["record_type"] = "ESTIMATE"
    energy["confidence"] = "moderate — approximate orders of magnitude consistent with IEA/EIA reporting patterns, not precise official figures for a specific year"
    energy["source"] = "Compiled from IEA/EIA-consistent general energy-market knowledge; recommend cross-checking against IEA World Energy Outlook or EIA Country Analysis Briefs for precise current-year figures"

    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    updated.append(fname)

print(f"Updated energy detail for {len(updated)} countries")
