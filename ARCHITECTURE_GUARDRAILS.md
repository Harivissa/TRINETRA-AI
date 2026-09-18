# Trinetra AI architecture guardrails

- `backend/data/strategic_groups.py` is the single source of truth for group membership.
- `frontend/src/data/strategicGroups.ts` is the presentation mirror; do not duplicate membership lists in components.
- `backend/data/repository.py` owns data access. UI components must call `services/api.ts`, never read JSON directly.
- `frontend/src/components/visuals/` is reserved for reusable data visualizations.
- `frontend/src/components/entry/` owns the video-first entry only.
- `frontend/src/components/comparison/` owns comparison visuals only.
- New analytical domains should add a backend engine and API contract rather than modifying unrelated pages.
- Missing evidence must render as unavailable; never infer or fabricate values.
