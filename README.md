# Trinetra AI — Phase 1 MVP

Geopolitical intelligence platform. Data ≠ Logic ≠ UI ≠ AI — each layer is
independently editable.

## Run the backend

```
cd trinetra
pip install -r requirements.txt --break-system-packages
cp .env.example .env   # add your ANTHROPIC_API_KEY if you want AI summaries
python3 -m backend.app
```
Backend runs at http://localhost:8000

## Run the frontend

```
cd trinetra/frontend
npm install
npm run dev
```
Frontend runs at http://localhost:5173 (proxies /api to :8000)

## To update one country

Edit `data/countries/india.json` directly. Nothing else needs to change.

## To add a new country

1. Add `data/countries/newcountry.json` (same schema as existing files)
2. Add an entry to `data/countries/index.json`

It appears everywhere automatically — dropdown, API, network graph.

## To add a new relationship

Add `data/geopolitics/<a>-<b>.json` following the schema in
`data/geopolitics/india-china.json`.

## To change how the AI explains results

Edit `config/prompts/strategic_analysis.txt`. No code changes needed.

## Verified in this session

- All 20 country files + registry load correctly
- Flask API tested end-to-end via test client: /api/countries,
  /api/countries/<id>, /api/relationships/<a>/<b>,
  /api/analysis/rivalry, /api/network — all return correct data
- Frontend: `tsc -b` type-checks clean, `vite build` builds clean
- Backend and frontend were run locally in this sandbox and responded
  correctly; if you hit connection issues locally, confirm both are
  running on the ports above

## Not yet built (future phases, per original spec)

- Live news, real-time events (Phase 2-3)
- Satellite/geospatial intelligence (Phase 4)
- Real-time energy/infrastructure monitoring (Phase 5-6)
- Predictive scenario modeling (Phase 9)
- All current country/relationship data is clearly-marked demo data —
  replace via `data/sources/` once you have sourced datasets
