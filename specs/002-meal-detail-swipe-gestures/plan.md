# Implementation Plan: Meal Detail Swipe Gesture Coexistence

**Branch**: `002-meal-detail-swipe-gestures` | **Date**: 2026-09-05 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-meal-detail-swipe-gestures/spec.md`

## Summary

Restore the pre-iOS-26 coexistence of the meal detail screen's previous-tab swipe gesture and the
native edge-swipe-back gesture. Research (below) found the root cause directly in the installed
`react-native-screens` library's own type declarations: on iOS 26+, native-stack's
`fullScreenSwipeEnabled` option now **defaults to `true`** (it defaulted to `false` on iOS < 26),
so the native back-swipe recognizer claims drags starting anywhere on screen instead of just the
left edge — silently swallowing the previous-tab gesture, which uses the same finger motion. The
fix is to explicitly set `fullScreenGestureEnabled: false` on the meal detail `Stack.Screen` options
(both the authenticated and non-authenticated routes) — that's expo-router/react-navigation's option
name, which maps internally to react-native-screens' `fullScreenSwipeEnabled` native prop; the native
prop name itself is not a recognized `Stack.Screen` option (confirmed on-device: using it directly
was silently ignored) — restoring the platform's own edge-only recognition. No custom
`gestureResponseDistance` tuning, and no migration of the existing
`onTouchStart`/`onTouchEnd` tab-swipe detection to `react-native-gesture-handler`, appears
necessary — this is a one-option-per-route fix, not the complex rebuild the initial report
suggested. Android needs separate, hands-on verification: `fullScreenSwipeEnabled` and
`gestureResponseDistance` are both iOS-only per the library's own docs, and Android's back gesture
is architecturally different (system-level predictive back, not a native-stack-mediated recognizer
competing with app touch responders the same way).

## Technical Context

**Language/Version**: JavaScript (ES2021+), React Native 0.86.3, React 19.2

**Primary Dependencies**: `expo-router` ~57.0.17 (file-based routing, `Stack`/native-stack under
the hood via `expo-router/build/react-navigation`), `react-native-screens` ~4.26 (native-stack
implementation — owns the back-swipe recognizer), `react-native-gesture-handler` ~2.32 (already a
project dependency; `GestureHandlerRootView` already wraps the app in `app/_layout.js`, but is
**not** currently used by the meal detail tab-swipe, which uses raw `onTouchStart`/`onTouchEnd`
instead), `react-native-reanimated` (already used by `MyTabMenu`'s tab-indicator animation)

**Storage**: N/A — no persisted data; this is client-side gesture/navigation behavior only

**Testing**: Jest + `jest-expo` (`tests/unit-tests/`, `tests/component-tests/`); gesture
recognition itself (native `interactiveContentPopGestureRecognizer` vs. JS touch responder) is not
exercisable in Jest — covered by manual device verification instead (see `quickstart.md`). The
existing tab-swipe boundary logic (`TrySelectRightTab`/`TrySelectLeftTab`'s no-op-at-extremes
behavior) is already plain JS and unit-testable in isolation

**Target Platform**: iOS 15+ and Android, matching the app's existing Expo SDK 57 support range;
the regression itself is iOS 26–specific (see Summary), but the fix must not regress older iOS or
Android

**Project Type**: Mobile app (single Expo/React Native project, no separate frontend/backend split)

**Performance Goals**: No new performance requirement — the fix changes which gesture recognizer
claims a touch, not any rendering or computation path; existing 60fps tab-switch animation
(`MyTabMenu`'s `withSpring`) is unaffected

**Constraints**: Fix must be scoped to the meal detail screens only (`app/(app)/meals/meal/[mealId].js`,
`app/(auth)/detail/[mealId].js`) — `fullScreenSwipeEnabled: false` is a per-`Stack.Screen` option,
not a global default, so no other screen's back-gesture behavior should change incidentally

**Scale/Scope**: Two route files (`Stack.Screen` options only) plus their corresponding screen
components (`MealDetailScreen.js`, `MealDetailScreenNotAuthenticated.js` — no changes anticipated
to the screens themselves, since the fix lives entirely in the route's `Stack.Screen` options); no
data model changes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Test-First (NON-NEGOTIABLE)**: Applies to the boundary logic already covered by
  `TrySelectRightTab`/`TrySelectLeftTab` (no-op at the leftmost/rightmost tab) — a unit test for
  that pure decision logic MUST exist before any refactor touches it. The `fullScreenSwipeEnabled`
  option change itself has no unit-testable logic (it's a declarative screen option consumed by
  native code); its verification is the manual device walkthrough in `quickstart.md`, which
  `/speckit-tasks` should still sequence appropriately (verify-first where "test" means the manual
  scenario, since no automated harness can drive the native gesture recognizer). **PASS**, no
  violation — nothing here is exempted from the principle, one of its two halves just resolves to
  manual verification rather than Jest.
- **II. Concurrency-Safe Multi-Client Writes**: N/A — no meal data is written by this feature.
- **III. Explicit Permission Checks**: N/A — no edit-permission logic involved.
- **IV. JavaScript-Only**: PASS — no new files, all `.js`.
- **V. Single-Purpose, Independently Tested Utilities**: The existing `TrySelectRightTab`/
  `TrySelectLeftTab` boundary logic is currently inlined in `MealDetailScreen.js`/
  `MealDetailScreenNotAuthenticated.js`, not in `common_functions/`. This plan does **not** require
  extracting it — Minimal Footprint (VI) takes priority since the actual fix doesn't need that
  logic touched at all. Flagged here only so `/speckit-tasks` doesn't invent an unrequested
  refactor.
- **VI. Minimal Footprint**: PASS — the fix is two one-line `Stack.Screen` option additions. No
  migration to `react-native-gesture-handler`, no new abstractions.

No violations. Complexity Tracking section omitted (nothing to justify).

## Project Structure

### Documentation (this feature)

```text
specs/002-meal-detail-swipe-gestures/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── quickstart.md        # Phase 1 output (manual verification guide)
└── checklists/
    └── requirements.md  # Spec quality checklist (from /speckit-specify)
```

`data-model.md` and `contracts/` are intentionally not created: this feature introduces no data
entities (nothing persisted, nothing shaped by `models/`) and no external interface (no API,
endpoint, or public contract) — it changes one native-stack screen option per route.

### Source Code (repository root)

```text
app/(app)/meals/meal/[mealId].js       # Stack.Screen options — add fullScreenGestureEnabled: false
app/(auth)/detail/[mealId].js          # Stack.Screen options — add fullScreenGestureEnabled: false
screens/MealDetailScreen.js            # No change anticipated; TrySelectRightTab/TrySelectLeftTab live here
screens/MealDetailScreenNotAuthenticated.js  # No change anticipated; same swipe logic duplicated here
```

**Structure Decision**: Single Expo/React Native project (existing structure, see root `CLAUDE.md`
and `app/CLAUDE.md`). No new directories. The fix lands entirely in the two `app/` route files that
already own `Stack.Screen` options for these screens, per the project's existing
"`app/` files are thin wrappers around `screens/` components" convention — it does not touch the
`screens/` components themselves unless device verification (Phase 0/Android research) surfaces a
need to.

## Complexity Tracking

*No violations — section not applicable.*
