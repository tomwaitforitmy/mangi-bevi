# Implementation Plan: App Theming System

**Branch**: `003-app-theming-system` | **Date**: 2026-09-05 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-app-theming-system/spec.md`

## Summary

Replace the app's single hard-coded `constants/Colors.js` palette with a central, per-appearance
theme system built on **React Native Paper** (already an installed, currently-unused dependency)
providing Light, Dark, and Colorful themes, plus a persistent Automatic mode that follows the
device's OS setting. Existing screens/components keep their current RN primitives and
`StyleSheet.create` usage — they're migrated to *read colors from the new theme* rather than
rewritten to use Paper's UI components. That component-level swap is the "future migration" this
feature explicitly prepares for (FR-007), not something it does now.

## Technical Context

**Language/Version**: JavaScript (no TypeScript, per constitution IV), React 19.2, React Native
0.86.3, Expo SDK 57 (`expo` ~57.0.18)

**Primary Dependencies**: `react-native-paper` ^5.15.3 (already in `package.json`, currently
unused anywhere in the codebase — adopted here as the theming engine via its `PaperProvider` +
MD3 theme object, per user decision this session); React Native's built-in `useColorScheme`/
`Appearance` (OS scheme detection for Automatic mode); `@react-native-async-storage/async-storage`
(already a dependency, used to persist the appearance selection locally)

**Storage**: N/A for app data (no Firebase involvement). Appearance selection persisted locally
only, via AsyncStorage — confirmed per-device, not account-synced (`/speckit-clarify` session
2026-09-05).

**Testing**: Jest + `jest-expo` (`tests/unit-tests/`), `@testing-library/react-native`
(`tests/component-tests/`) — existing project conventions, no new test tooling needed.

**Target Platform**: iOS + Android via Expo/React Native (single codebase, `app/` Expo Router
tree)

**Project Type**: Mobile app (Expo Router, file-based routing under `app/`)

**Performance Goals**: Appearance switch reflects on all mounted screens with no perceptible
delay (same frame/next render, no reload); no measurable app startup regression from theme
resolution.

**Constraints**: Stay 100% `.js` (constitution IV — react-native-paper is plain JS, no `.tsx`
needed). Any React Navigation chrome theming (native-stack header/tab bar colors) must go through
`expo-router/react-navigation`'s `ThemeProvider`, never `@react-navigation/*` directly (CLAUDE.md)
— Paper's theme feeds values into that provider rather than replacing it. All theme token pairs
(text/background, icon/background) MUST satisfy WCAG AA contrast (FR-010).

**Scale/Scope**: 103 screen/component files; 36 already import the central `Colors.js` (mechanical
swap to the new theme); ~2 files currently have stray hard-coded color literals outside it (small
remediation surface). Three themes (Light, Dark, Colorful) plus Automatic selection mode.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Test-First**: Applies. New pure logic (appearance resolution, contrast-ratio check) gets a
  failing unit test before implementation; `/speckit-tasks` must sequence tests before the code
  they cover. PASS (see Phase 1 test-relevant artifacts below).
- **II. Concurrency-Safe Multi-Client Writes**: Not applicable — this feature touches no `meal` or
  other multi-client Firebase resource; appearance selection is local-device-only (per
  clarification), never written through `runOptimisticTransaction`. PASS (no gate triggered).
- **III. Explicit Permission Checks**: Not applicable — no edit-permission logic is touched. PASS.
- **IV. JavaScript-Only**: `react-native-paper` and all new theme files are plain `.js`; no `.ts`/
  `.tsx` introduced. PASS.
- **V. Single-Purpose, Independently Tested Utilities**: New pure functions (appearance
  resolution, contrast-ratio calculation) go in `common_functions/`, one per file, each with a
  matching `tests/unit-tests/` test — same convention as the rest of the repo. PASS.
- **VI. Minimal Footprint**: Deliberately scoped to *theming* (colors/tokens), not a full
  component-library rewrite — see Summary. Avoids the much larger, unrequested blast radius of
  swapping all 103 files' JSX to Paper components. PASS.

No violations requiring the Complexity Tracking table.

**Post-Phase-1 re-check**: data-model.md and contracts/theme-api.md confirm the design stays
theming-only (no component rewrite, no Firebase writes, no `.ts` files, one-function-per-file
utilities with dedicated tests). All six gates above still PASS unchanged.

## Project Structure

### Documentation (this feature)

```text
specs/003-app-theming-system/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md         # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   └── theme-api.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
theme/                          # NEW — cross-cutting UI concern, own top-level dir
├── lightTheme.js                # MD3-shaped theme object (Paper base + app-specific tokens)
├── darkTheme.js
├── colorfulTheme.js
├── ThemeProvider.js             # Wraps children in Paper's PaperProvider with the resolved theme;
│                                 # also feeds expo-router/react-navigation's ThemeProvider
├── useAppTheme.js               # Thin wrapper around Paper's useTheme() for app call sites
└── AppearanceOptions.js          # Enum-like constants: light | dark | colorful | automatic

common_functions/                # existing dir — new single-purpose, tested utilities added
├── ResolveAppearance.js         # (selection, deviceColorScheme) -> concrete theme name
├── GetContrastRatio.js          # WCAG contrast ratio calculation between two colors
└── ...(existing files unchanged)

constants/
├── Colors.js                    # Removed once migration completes (values move into theme/*)
└── ...(other constants files unchanged)

screens/, components/, app/      # existing files updated to read colors via theme/useAppTheme.js
                                  # instead of importing constants/Colors.js — no structural moves

tests/
├── unit-tests/
│   ├── ResolveAppearance.test.js       # NEW
│   └── GetContrastRatio.test.js        # NEW (also asserts each theme's token pairs meet WCAG AA)
└── component-tests/
    └── ThemeProvider.spec.js           # NEW — appearance switch re-renders with new theme values
```

**Structure Decision**: Single Expo Router mobile app (existing layout, no new top-level app/
package). A new `theme/` directory holds the React-facing theme objects, provider, and hook —
mirroring how `firebase/`, `appwrite/`, and `notifications/` already get their own top-level
directory for a cross-cutting concern. Pure, stateless logic (appearance resolution, contrast
math) goes in `common_functions/` per the existing one-function-per-file/one-test convention
(constitution V), not in `theme/`. `constants/Colors.js` is retired once every consumer migrates
to `theme/useAppTheme.js`; no new directories are introduced beyond `theme/`.
