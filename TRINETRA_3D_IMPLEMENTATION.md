# TRINETRA spatial implementation

TRINETRA uses lightweight CSS depth rather than a mandatory WebGL dependency. `SpatialPanel` adds perspective and layered surface treatment, `DepthCard` adds pointer-safe hover elevation, and `ParallaxSection` provides a restrained scroll-independent depth cue. Content remains fully readable without effects.

## Constraints
- No fabricated geography or strategic data.
- No spatial transform on tables, charts, maps, or keyboard-critical controls.
- `prefers-reduced-motion` disables transforms and transitions.
- Mobile uses flat surfaces and avoids pointer tracking.
- Existing Leaflet and Recharts visualizations remain the data visualization primitives.

## Upgrade path
A globe can be added later only when canonical coordinates and a tested accessibility fallback exist. If a heavier 3D dependency becomes necessary, lazy-load it at the route boundary and keep the API contract unchanged.
