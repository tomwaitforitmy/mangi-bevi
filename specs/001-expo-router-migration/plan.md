# Implementation Plan: Expo Router Migration

**Branch**: `001-expo-router-migration` | **Date**: 2026-08-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-expo-router-migration/spec.md`

## Summary

Replace the single 440-line imperative `navigation/MyNavigationContainer.js` (React Navigation
stack + bottom-tabs, wired by hand) with Expo Router's file-based routing under `app/`, with zero
user-visible regression (spec P1) and a new deep-linking capability for meal detail (spec P2).
Screens (`screens/*.js`) and header icon components (`components/HeaderIcons/*.js`) are reused
unchanged; only how they're registered as routes and how they receive params/navigation changes.
Global app setup currently in `App.js` (Redux `Provider`, `LogBox`, notification handler, splash
hold) relocates to the new `app/_layout.js` root, since `expo-router/entry` replaces `App.js` as
the mount point. Auth gating uses two parallel route groups (`(app)`/`(auth)`) rather than a
single guarded tree, because — unlike a typical "protected app" — this app's logged-out state is
a real, separately-implemented browsing experience, not a login wall (see research.md Decision 3).

## Technical Context

**Language/Version**: JavaScript (ES2022+ via Babel), no TypeScript — constitution Principle IV.
Node/React Native toolchain unchanged (React Native 0.86.3, Expo SDK 57).

**Primary Dependencies**: `expo-router` + `expo-linking` (new — versions resolved by
`npx expo install` for SDK 57 at implementation time, not pinned here). Everything else Expo
Router needs is already installed: `react-native-safe-area-context`, `react-native-screens`,
`expo-constants`, `expo-status-bar`, `react-native-gesture-handler`. `@react-navigation/*` stays
as a _transitive_ dependency (Expo Router is built on it) but is no longer imported directly by
app code once the migration lands.

**Storage**: N/A — no data/schema changes, this is routing-only (spec Assumptions).

**Testing**: `jest-expo` / existing Jest suite (`npm test`), per constitution Principle I
(test-first) applied to each route's `tasks.md` entry. No existing test exercises navigation
directly (confirmed by grep), so the suite's role here is regression-guarding the screens'
non-navigation logic through the migration, not navigation-specific test authoring from scratch.

**Target Platform**: iOS + Android (existing targets), Expo Go / dev-client via `npm run dev`.

**Project Type**: Mobile app (Expo/React Native), single project — no backend component (per
CLAUDE.md, unchanged by this migration).

**Performance Goals**: No regression vs. current cold-start time (SC-004, 5% budget) — this
migration is not a performance feature, just must not cost one.

**Constraints**: Every new route file is `.js` (constitution Principle IV); every existing screen
component's internal logic (data fetching, Redux, business logic) stays untouched (spec FR-008).

**Scale/Scope**: 22 existing screen registrations across 6 stacks/tabs + 1 standalone (Debug) →
25 route files + 4 layout files under `app/` (see data-model.md for the full table). No new
screens, no removed screens.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design below._

| Principle                                         | Check                                                                                                                                                                                                                                                                                | Result                                                                                                        |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| I. Test-First (NON-NEGOTIABLE)                    | This plan doesn't write code; `/speckit-tasks` MUST sequence a test-authoring task before each route's implementation task.                                                                                                                                                          | **PASS** (deferred to tasks.md by design — plan doesn't implement)                                            |
| II. Concurrency-Safe Multi-Client Writes          | No write paths touched — this is a navigation-only migration (spec Assumptions).                                                                                                                                                                                                     | **PASS / N/A**                                                                                                |
| III. Explicit Permission Checks                   | `HasEditPermission`/`GetFriends`/`GetAuthorByMealId` logic (today's `showEditIcon`) MUST be preserved verbatim, just relocated into `meal/[mealId].js` and `meal/[mealId]/images.js` (data-model.md). Not weakened, not duplicated-and-drifted.                                      | **PASS**, carried as an explicit data-model requirement so it can't be silently dropped during implementation |
| IV. JavaScript-Only                               | All new `app/` files are `.js` — explicit deviation from Expo Router's own `.tsx` defaults, decided in research.md Decision 6.                                                                                                                                                       | **PASS by design**                                                                                            |
| V. Single-Purpose, Independently Tested Utilities | No new `common_functions/` — N/A.                                                                                                                                                                                                                                                    | **PASS / N/A**                                                                                                |
| VI. Minimal Footprint                             | 25+4 small route files vs. 1 large file is _more_ files but each is smaller and single-purpose (one screen's config, matching the principle's actual intent — avoiding unrequested abstraction — not file count). No speculative routes added beyond what spec.md's FR-001 requires. | **PASS**                                                                                                      |

No violations requiring the Complexity Tracking table below to be filled.

## Project Structure

### Documentation (this feature)

```text
specs/001-expo-router-migration/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md         # Phase 1 output — full route table
├── quickstart.md         # Phase 1 output — validation guide
├── contracts/
│   └── deep-links.md     # Phase 1 output — URL surface this migration exposes
└── tasks.md              # Phase 2 output (/speckit-tasks — not created by this command)
```

### Source Code (repository root)

```text
app/                                      # NEW — Expo Router file-based routes
├── _layout.js                            # Root: global setup (moved from App.js) + auth split
├── debug.js                              # DEBUG_MODE override screen
├── meal/
│   └── [mealId].js                       # Unconditional deep-link redirector (research.md Decision 3)
├── (app)/                                # Authenticated group (Tabs)
│   ├── _layout.js
│   ├── meals/
│   │   ├── _layout.js
│   │   ├── index.js
│   │   └── meal/
│   │       ├── [mealId].js
│   │       └── [mealId]/
│   │           ├── edit.js
│   │           ├── images.js
│   │           ├── add-tag.js
│   │           ├── edit-links.js
│   │           └── report.js
│   ├── dev.js
│   ├── filters.js
│   ├── new.js
│   └── profile/
│       ├── _layout.js
│       ├── index.js
│       ├── meals.js
│       ├── account.js
│       ├── friends.js
│       └── settings.js
└── (auth)/                               # Not-authenticated group (plain Stack)
    ├── _layout.js
    ├── index.js
    ├── detail/
    │   ├── [mealId].js                   # NOT /meal/ — that path is reserved for the redirector above
    │   └── [mealId]/
    │       └── images.js
    ├── login.js
    ├── sign-up.js
    └── password-reset.js

screens/                          # UNCHANGED internally except navigation call sites (research.md Decision 5)
components/                       # Same — HeaderIcons/*, MealList, LinkedMealsList, MealSpeedDial navigate() call sites updated
common_functions/                 # + NEW useAuthState.js (shared auth-state hook, see research.md Decision 3)
navigation/          # REMOVED once migration lands (MyNavigationContainer.js deleted)
App.js               # REMOVED — contents relocated into app/_layout.js
package.json         # "main": "expo-router/entry" (was "node_modules/expo/AppEntry.js")
app.json             # + "scheme": "mangibevi" (see contracts/deep-links.md)
```

**Structure Decision**: Single-project mobile app structure (Option 1 shape from the template,
adapted — this is a React Native/Expo app, not a library/CLI/web-service split). The full route
inventory and per-route header/param behavior lives in `data-model.md` rather than duplicated
here.

## Complexity Tracking

_No Constitution Check violations — table intentionally left empty._
