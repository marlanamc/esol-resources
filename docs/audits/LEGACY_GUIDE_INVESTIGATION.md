# Legacy Guide System — Investigation (Summer Audit M4)

**Date:** 2026-06-26
**Question:** Can `_legacy/` (2.3M) be removed to simplify the codebase?
**Answer:** Not safely yet — the legacy guide path is live. Leave it wired; do a
deliberate content migration later if desired.

## How it works

1. Some `Activity` rows store content whose `metadata.source === "legacy"` with a
   `metadata.originalFile` pointing at an HTML file.
2. `src/components/renderers/ActivityRenderer.tsx` detects this via
   `isLegacyGuideContent()` (`src/types/activity.ts`) and renders
   `LegacyGuideRenderer`, which fetches `GET /api/legacy-guide?file=<originalFile>`.
3. `src/app/api/legacy-guide/route.ts` reads the HTML from `_legacy/activities/`,
   extracts the `.grammar-guide` element + inline styles/scripts, and returns it.
4. `next.config.ts` `outputFileTracingIncludes` bundles `_legacy/activities/**` so
   the files ship to the serverless function.

## Surface

- **17** HTML guide files in `_legacy/activities/`.
- Importers that create `source: "legacy"` activities exist, e.g.
  `scripts/import/import-present-perfect-guide.js`
  (`source: 'legacy'`, `originalFile: 'present-perfect-complete-guide.html'`).
- `scripts/import/fix-legacy-imports.mjs` is the historical migrator from the older
  `legacy-html` shape into this `legacy-guide` shape.

## Latent issue found (not fixed here)

The route also tries to read `css-from-legacy/main.css`, but **`css-from-legacy/`
does not exist in the repo** (and `next.config.ts` lists `./css-from-legacy/**/*`
in `outputFileTracingIncludes` for a missing directory). The route tolerates this
(try/catch → continues without CSS), so **legacy guides currently render without
their base CSS** — degraded but functional. If legacy guides look unstyled, this is
why. Either restore `css-from-legacy/main.css` or drop the dead tracing-include
entry. Left as-is pending a decision on the whole legacy path.

## Recommendation

Do **not** delete `_legacy/` or change the wiring now. Retiring it requires
migrating the 17 guides into the current `InteractiveGuideContent` format — a
multi-session project with regression risk to live, student-facing grammar guides.
Before starting, query production for how many of the 17 are still assigned to
active students vs. orphaned; migrate only what's in use, then remove the three
wiring points (`api/legacy-guide/route.ts`, the `ActivityRenderer` branch, and the
`next.config.ts` tracing include) and delete `_legacy/`.
