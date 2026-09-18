# Implementation Plan: About Page

**Branch**: `004-about-page` | **Date**: 2026-09-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-about-page/spec.md`

## Summary

Replace the inline "Mangi & Bevi version: …" text on the Profile screen with
an About screen (app name + version) that links to two sub-pages: Open
Source Licenses (full license text for every production dependency whose
license requires attribution, auto-regenerated every release by the existing
prerelease script) and Costs & Transparency (real monetary costs from a
hand-maintained data file + an auto-generated developer-time estimate from
git history at a fixed €25/hour, plus the "always free and ad-free"
statement). No backend/Firebase involvement — purely static/generated local
data rendered by three new read-only screens.

## Technical Context

**Language/Version**: JavaScript (ES2020+), React Native via Expo SDK (existing project toolchain); generation scripts run under Node.js (project's installed Node, v26.8.2 locally)

**Primary Dependencies**: Existing: `expo-router`, `expo-constants`, `react-native-paper` (theme), Redux (`react-redux`, unused by this feature — no new state). New devDependency: `license-checker-rseidelsohn` (license enumeration, prerelease-time only, never bundled into the app)

**Storage**: N/A (no Firebase/Appwrite/Supabase involvement) — static JSON/JS data files bundled into the app (`data/generated/*.json`, `data/CostsConfig.js`)

**Testing**: Jest (`npm test`), existing `tests/unit-tests/` convention

**Target Platform**: iOS + Android via Expo (same as rest of app)

**Project Type**: Mobile app (Expo Router file-based routing, existing single-project layout — no new top-level project)

**Performance Goals**: N/A beyond existing app norms — three additional static-content screens, no new network calls, no measurable perf budget beyond normal RN screen-mount cost

**Constraints**: Generated data MUST be computed at release time, not app runtime (`.git` is not shipped in the app bundle); license list and dev-hours estimate MUST regenerate via the existing `scripts/prerelease.fish` step; monetary figures MUST stay in a separate hand-edited file the generation scripts never touch

**Scale/Scope**: ~61 production dependencies to scan for licenses (spec's Clarifications sizing: ~1.1MB raw / ~358 unique license texts project-wide including dev deps; production-only subset is smaller); 3 new screens; 3 new routes; no new Firebase paths

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|---|---|---|
| I. Test-First (NON-NEGOTIABLE) | **PASS** | `scripts/lib/requiresAttribution.js` and `scripts/lib/estimateDevHours.js` are pure, synchronous functions — straightforward to pin down with a failing test first (synthetic SPDX strings / synthetic commit timestamps). `/speckit-tasks` must sequence their tests before their implementations. |
| II. Concurrency-Safe Multi-Client Writes | **N/A** | Feature has no meal (or any Firebase) writes. |
| III. Explicit Permission Checks | **N/A** | About/Licenses/Costs are unconditional, read-only, no author/edit semantics — `HasEditPermission` doesn't apply. |
| IV. JavaScript-Only | **PASS** | All new files are `.js` (screens, routes, scripts, data). |
| V. Single-Purpose, Independently Tested Utilities | **PASS, with a placement note** | The two new pure functions live in `scripts/lib/` rather than `common_functions/` because they're release-tooling (run by `scripts/prerelease.fish`, never imported by the app bundle), not runtime app logic — keeping them out of `common_functions/` avoids implying they're screen/component-usable. Each still gets exactly one file + one matching test in `tests/unit-tests/`, same convention. |
| VI. Minimal Footprint | **PASS** | Reuses the existing prerelease hook point, the existing `data/` static-config convention, and the existing flat `profile/*.js` route-naming pattern — no new top-level directories, no speculative abstraction. |

**Architecture Constraints check**: No server-side code added (generation runs locally in Node at release time, not a backend). `data/` used per its documented purpose (static config/constants). Directory boundaries respected — see Principle V note above for the one deliberate, documented placement decision.

No violations requiring Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/004-about-page/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output
├── data-model.md         # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit-tasks — not created here)
```

No `contracts/` — this feature exposes no external interface (no API, no
CLI, no new Firebase path); it's read-only local/generated data rendered by
screens within the existing app.

### Source Code (repository root)

```text
app/(app)/profile/
├── about.js                 # new route: Stack.Screen wrapper → screens/AboutScreen.js
├── about-licenses.js        # new route: Stack.Screen wrapper → screens/OpenSourceLicensesScreen.js
├── about-costs.js           # new route: Stack.Screen wrapper → screens/CostsScreen.js
└── index.js                 # edited: replace inline version <Text> with an "About" MyButton

screens/
├── ProfileScreen.js          # edited (see above)
├── AboutScreen.js             # new
├── OpenSourceLicensesScreen.js  # new
└── CostsScreen.js             # new

scripts/
├── prerelease.fish            # edited: run the two generators before `git add -A`
├── generate-license-data.js   # new: writes data/generated/openSourceLicenses.json
├── generate-dev-hours-data.js # new: writes data/generated/devHoursEstimate.json
└── lib/
    ├── requiresAttribution.js # new: pure SPDX-id → boolean
    └── estimateDevHours.js    # new: pure timestamps[] → { estimatedHours, sessionCount }

data/
├── CostsConfig.js             # new, hand-maintained
└── generated/
    ├── openSourceLicenses.json  # new, generated (committed)
    └── devHoursEstimate.json    # new, generated (committed)

tests/unit-tests/
├── requiresAttribution.test.js  # new
└── estimateDevHours.test.js     # new
```

**Structure Decision**: Single existing Expo Router project — no new
top-level project/package. New screens follow the existing flat
`app/(app)/profile/*.js` route convention (matching `account.js`/`friends.js`/
`meals.js`/`settings.js`); new pure logic follows the existing
`scripts/` + `tests/unit-tests/` split, placed under a new `scripts/lib/`
subfolder since it's release-tooling rather than app-runtime code (see
Constitution Check, Principle V).

## Complexity Tracking

*No violations — table intentionally omitted.*
