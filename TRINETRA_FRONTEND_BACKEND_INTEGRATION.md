# TRINETRA frontend/backend integration

## Source of truth
The Flask API is the only source for country intelligence, relationships, network edges, modules, sources, and analysis. React may format API values and use presentation-only assets, but must not recreate intelligence, scores, events, relationships, or source claims.

## API boundary
`frontend/src/services/api.ts` owns requests. It normalizes the configured base URL, applies a timeout, parses JSON, and throws actionable errors. Pages own loading, retry, empty, unavailable, and partial-data states.

## Endpoint map
- `GET /api/health` — service readiness
- `GET /api/countries` — country index
- `GET /api/countries/:id` — country profile
- `GET /api/countries/:id/energy` — energy module
- `GET /api/countries/:id/infrastructure` — infrastructure module
- `GET /api/countries/:id/modules` and `/:module` — available modules and module records
- `GET /api/relationships/:a/:b` — bilateral relationship
- `GET /api/network` — canonical nodes and edges
- `POST /api/analysis/rivalry` — server-side comparison analysis

## Runtime rules
No silent fallback to mock data. Missing fields render `Data unavailable`; request failures render a retryable service state. Visual maps may use presentation coordinates only when the API identifies the corresponding node; no edge is synthesized client-side.

## Accessibility and performance
Loading and error states use live regions, controls retain keyboard focus, and spatial effects are progressive enhancement. Reduced-motion users receive static surfaces. Heavy maps remain lazy at the page level and retain a readable 2D/list fallback.
