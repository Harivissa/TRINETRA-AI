# Trinetra AI Architecture

## Stability boundaries

- `frontend/src/data/strategicGroups.ts` is the single frontend source for strategic-group metadata.
- `backend/data/strategic_groups.py` is the backend source for group API metadata.
- `frontend/src/components/entry/` owns the isolated video-first entry experience.
- `frontend/public/video/` contains static cinematic assets and is independent of application UI components.
- `backend/data/repository.py` remains the data-access boundary; analysis engines should not read raw files directly.
- New analytical modules should be added behind API routes or repository methods rather than modifying unrelated pages.

## Evidence policy

The platform must distinguish sourced facts, assessments and scenarios. Missing data is displayed as unavailable; it is never inferred into a score or ranking.
