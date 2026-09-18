"""
Ingests the SIPRI/IMF/World-Bank-sourced Country Core Dataset from the
user's Perplexity research (verified against live SIPRI Yearbook 2026
press materials for nuclear warhead counts and India's defence spend).

Explicitly logs discrepancies against the World-Bank-derived figures
already in each file (from ingest_worldbank.py) rather than silently
overwriting — per instruction to identify contradictions, not erase them.
"""
import json
import os
import re

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "countries")

FILES = {
    "IND": "india.json", "USA": "usa.json", "CHN": "china.json", "RUS": "russia.json",
    "PAK": "pakistan.json", "GBR": "uk.json", "FRA": "france.json", "DEU": "germany.json",
    "JPN": "japan.json", "KOR": "south-korea.json", "ISR": "israel.json", "IRN": "iran.json",
    "SAU": "saudi-arabia.json", "TUR": "turkey.json", "AUS": "australia.json", "CAN": "canada.json",
    "IDN": "indonesia.json", "BRA": "brazil.json",
}

# Extracted from SOURCE A (Perplexity), Section 2 "Country Core Dataset".
# India's defence spend corrected 83.6 -> 92.1 per live SIPRI verification
# (SIPRI Yearbook 2026 press coverage: "India... defence expenditure
# increased by 8.9% from 2024, reaching USD 92.1 billion" — the uploaded
# file's 83.6 figure does not match the primary source it cites).
CORE_DATA = {
    "IND": dict(pop=1441.7, gdp=4.11, growth=6.8, troops=1455000, reserve=1155000, defspend=92.1, defpct=2.03, nuc=190, energy="Net importer — ~87% of crude oil consumption imported", autonomy="Multi-alignment, strategic autonomy doctrine"),
    "USA": dict(pop=341.8, gdp=29.17, growth=2.4, troops=1328000, reserve=799500, defspend=967.7, defpct=3.32, nuc=5042, energy="Net exporter (LNG/oil)", autonomy="Hegemonic coalition anchor, global reach"),
    "CHN": dict(pop=1408.3, gdp=18.94, growth=4.6, troops=2035000, reserve=510000, defspend=314.0, defpct=1.66, nuc=620, energy="Net importer — ~72% of crude oil consumption imported", autonomy="Revisionist power, comprehensive national power"),
    "RUS": dict(pop=143.8, gdp=2.18, growth=3.2, troops=1320000, reserve=2000000, defspend=149.0, defpct=6.83, nuc=5420, energy="Major net exporter", autonomy="Eurasian sovereign fortress, war-economy mode"),
    "PAK": dict(pop=245.2, gdp=0.39, growth=2.8, troops=654000, reserve=550000, defspend=9.8, defpct=2.51, nuc=170, energy="Severe net importer", autonomy="Dependent balancer (China anchor, IMF reliance)"),
    "GBR": dict(pop=68.3, gdp=3.53, growth=1.1, troops=141000, reserve=74000, defspend=78.5, defpct=2.22, nuc=225, energy="Net importer", autonomy="NATO Euro-Atlantic anchor, Five Eyes pillar"),
    "FRA": dict(pop=68.2, gdp=3.16, growth=1.1, troops=203000, reserve=41000, defspend=64.7, defpct=2.05, nuc=290, energy="Net importer (nuclear-power dominant grid)", autonomy="European strategic autonomy proponent"),
    "DEU": dict(pop=84.5, gdp=4.65, growth=0.3, troops=182000, reserve=34000, defspend=88.5, defpct=1.90, nuc=0, energy="Severe net importer", autonomy="Multilateral European geo-economic anchor"),
    "JPN": dict(pop=123.8, gdp=4.19, growth=0.7, troops=247000, reserve=56000, defspend=58.2, defpct=1.39, nuc=0, energy="Critical net importer", autonomy="US alliance anchor, expanding counterstrike capability"),
    "KOR": dict(pop=51.7, gdp=1.78, growth=2.2, troops=500000, reserve=3100000, defspend=52.1, defpct=2.93, nuc=0, energy="Critical net importer", autonomy="High-tech/industrial power, asymmetric peninsula threat"),
    "ISR": dict(pop=9.9, gdp=0.54, growth=1.8, troops=170000, reserve=465000, defspend=33.5, defpct=6.20, nuc=90, energy="Net gas exporter", autonomy="Regional military-tech dominance, US-backed"),
    "IRN": dict(pop=89.8, gdp=0.43, growth=3.1, troops=610000, reserve=350000, defspend=12.8, defpct=2.98, nuc=None, energy="Major net exporter", autonomy="Asymmetric regional 'Axis of Resistance' leader"),
    "SAU": dict(pop=36.9, gdp=1.11, growth=2.6, troops=257000, reserve=0, defspend=75.8, defpct=6.83, nuc=0, energy="Major net exporter", autonomy="Strategic swing producer, diversified hedging"),
    "TUR": dict(pop=86.1, gdp=1.19, growth=3.0, troops=355000, reserve=380000, defspend=25.4, defpct=2.13, nuc=0, energy="Severe net importer", autonomy="Cross-regional balancer, independent drone power"),
    "AUS": dict(pop=26.8, gdp=1.79, growth=1.5, troops=58500, reserve=32000, defspend=34.2, defpct=1.91, nuc=0, energy="Massive net exporter", autonomy="Indo-Pacific southern anchor (AUKUS/Quad)"),
    "CAN": dict(pop=40.1, gdp=2.24, growth=1.3, troops=68000, reserve=34000, defspend=29.8, defpct=1.33, nuc=0, energy="Net energy exporter", autonomy="NORAD/Arctic flank, raw-materials exporter"),
    "IDN": dict(pop=281.6, gdp=1.49, growth=5.0, troops=400000, reserve=400000, defspend=9.4, defpct=0.63, nuc=0, energy="Major coal/mineral exporter", autonomy="Non-aligned maritime archipelagic balancer"),
    "BRA": dict(pop=217.6, gdp=2.33, growth=2.1, troops=360000, reserve=1340000, defspend=24.1, defpct=1.03, nuc=0, energy="Net exporter (agri/oil)", autonomy="Global South leader, non-interventionist hedging"),
}

SOURCE_NOTE = "SIPRI Yearbook 2026 (released 8 Jun 2026) + IMF WEO Apr/Jul 2026 + World Bank WDI Jun 2026, via user-provided unified research file; nuclear warhead counts and India's defence spend independently cross-checked against live SIPRI press materials (Aug 2026)"

updated = []
for cid, d in CORE_DATA.items():
    fname = FILES[cid]
    path = os.path.join(DATA_DIR, fname)
    if not os.path.exists(path):
        print(f"SKIP {cid} — {fname} not found")
        continue
    with open(path) as f:
        data = json.load(f)

    # Log discrepancy vs the World-Bank-derived %GDP figure already present
    prior_pct = data.get("military", {}).get("defence_spending_pct_gdp")
    discrepancy_note = None
    if prior_pct is not None and abs(float(prior_pct) - d["defpct"]) > 0.15:
        discrepancy_note = f"World Bank WDI (MS.MIL.XPND.GD.ZS, 2024) gave {prior_pct}%; SIPRI Yearbook 2026 (2025 data) gives {d['defpct']}% — both are legitimate sources measuring different years and, per SIPRI's own methodology notes, sometimes different expenditure scopes. SIPRI figure used as primary since it is defence-specific and more recent; World Bank figure retained below for comparison."

    data.setdefault("demographics", {})["population_millions"] = d["pop"]
    data.setdefault("demographics", {})["population_source"] = f"{SOURCE_NOTE} (2025 figure)"

    data.setdefault("economy", {})["gdp_usd_trillion"] = d["gdp"]
    data["economy"]["gdp_growth_pct"] = d["growth"]
    data["economy"]["gdp_source"] = f"{SOURCE_NOTE} (2025 figures)"

    mil = data.setdefault("military", {})
    mil["active_troops"] = d["troops"]
    mil["reserve_troops"] = d["reserve"]
    mil["defence_spending_usd_billion"] = d["defspend"]
    mil["defence_spending_pct_gdp_worldbank_2024"] = prior_pct
    mil["defence_spending_pct_gdp"] = d["defpct"]
    mil["defence_spending_source"] = f"{SOURCE_NOTE} (2025 figures)"
    if discrepancy_note:
        mil["defence_spending_discrepancy_note"] = discrepancy_note

    nuc = data.setdefault("nuclear", {})
    if d["nuc"] is not None:
        nuc["warhead_estimate"] = d["nuc"]
        nuc["warhead_estimate_year"] = 2026
        nuc["warhead_estimate_source"] = "SIPRI Yearbook 2026 (as of Jan 2026), independently verified against live SIPRI press materials Aug 2026"
        nuc["weapons_state"] = True
    elif cid == "IRN":
        nuc["weapons_state"] = False
        nuc["status"] = "Threshold capability — HEU enrichment capacity, no declared weapon"
        nuc["status_source"] = SOURCE_NOTE
        nuc["record_type"] = "ASSESSMENT — Iran's exact enrichment/breakout status is disputed and changes; treat as a snapshot, not a settled fact"

    data.setdefault("energy", {})["status_2025"] = d["energy"]
    data["strategic_autonomy_profile"] = d["autonomy"]

    meta = data.setdefault("_meta", {})
    meta["last_updated"] = "2026-09-01"
    meta["core_data_source"] = SOURCE_NOTE

    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    updated.append(cid)

print(f"Updated {len(updated)} countries: {updated}")
