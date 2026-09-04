"""
Ingests real World Bank data (military expenditure %GDP, arms exports)
into each country's JSON file, replacing demo placeholder figures.
Source: user-provided World Bank WDI extracts (MS.MIL.XPND.GD.ZS,
MS.MIL.XPRT.KD), last updated 2026-02-24 per the file's own metadata.
"""
import json
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "countries")

# id -> (mil_spend_pct_gdp, year, arms_exports_usd, arms_exports_year)
REAL_DATA = {
    "IND": (2.2712033218142, 2024, 25000000, 2024),
    "CHN": (1.71129740345228, 2024, 1131000000, 2024),
    "USA": (3.41921653228044, 2024, 13512000000, 2024),
    "RUS": (7.05233864500366, 2024, 1339000000, 2024),
    "JPN": (1.37139689580634, 2024, 21000000, 2024),
    "DEU": (1.89190377205494, 2024, 2049000000, 2024),
    "GBR": (2.2786177901127, 2024, 756000000, 2024),
    "FRA": (2.05257687860637, 2024, 2272000000, 2024),
    "KOR": (2.56205259386748, 2024, 964000000, 2024),
    "TUR": (1.92255231276371, 2024, 332000000, 2024),
    "SAU": (7.2981029390103, 2024, 3000000, 2023),
    "IRN": (2.01043175751636, 2024, 226000000, 2024),
    "ISR": (8.77671668977531, 2024, 1026000000, 2024),
    "PAK": (2.66760037007452, 2024, 6000000, 2024),
    "AUS": (1.8837883329175, 2024, 75000000, 2024),
    "CAN": (1.31303419578919, 2024, 152000000, 2024),
    "BRA": (0.972774559040702, 2024, 116000000, 2024),
    "IDN": (0.779216788275608, 2024, 17000000, 2021),
    "ITA": (1.60924561245844, 2024, 1379000000, 2024),
    "ARE": (5.64365135247024, 2014, 117000000, 2024),
    "BGD": (0.941321120606305, 2024, 2000000, 1984),
}

# id -> country JSON filename
FILES = {
    "IND": "india.json", "CHN": "china.json", "USA": "usa.json", "RUS": "russia.json",
    "JPN": "japan.json", "DEU": "germany.json", "GBR": "uk.json", "FRA": "france.json",
    "KOR": "south-korea.json", "TUR": "turkey.json", "SAU": "saudi-arabia.json",
    "IRN": "iran.json", "ISR": "israel.json", "PAK": "pakistan.json", "AUS": "australia.json",
    "CAN": "canada.json", "BRA": "brazil.json", "IDN": "indonesia.json", "ITA": "italy.json",
    "ARE": "uae.json", "BGD": "bangladesh.json",
}

updated = []
for cid, (pct_gdp, year, arms_exp, arms_year) in REAL_DATA.items():
    fname = FILES[cid]
    path = os.path.join(DATA_DIR, fname)
    if not os.path.exists(path):
        print(f"SKIP {cid} — {fname} not found")
        continue
    with open(path) as f:
        data = json.load(f)

    old_pct = data.get("military", {}).get("defence_spending_pct_gdp")
    data.setdefault("military", {})["defence_spending_pct_gdp"] = round(pct_gdp, 2)
    data["military"]["defence_spending_pct_gdp_source"] = f"World Bank WDI (MS.MIL.XPND.GD.ZS), {year} data, extracted from user-provided dataset (file last updated 2026-02-24)"
    data["military"]["arms_exports_usd"] = arms_exp
    data["military"]["arms_exports_year"] = arms_year
    data["military"]["arms_exports_source"] = "World Bank WDI (MS.MIL.XPRT.KD), constant USD, from user-provided dataset"

    # Update _meta to reflect the new sourced military figures
    meta = data.setdefault("_meta", {})
    prior_quality = meta.get("data_quality", "")
    if "World Bank military data" not in prior_quality:
        meta["data_quality"] = (prior_quality + "; military spending %GDP and arms exports now sourced from real World Bank WDI data").strip("; ")
    meta["last_updated"] = "2026-08-27"

    with open(path, "w") as f:
        json.dump(data, f, indent=2)

    updated.append((cid, old_pct, round(pct_gdp, 2)))

print(f"Updated {len(updated)} countries:")
for cid, old, new in updated:
    print(f"  {cid}: defence_spending_pct_gdp {old} -> {new} (real World Bank 2024 data)")
