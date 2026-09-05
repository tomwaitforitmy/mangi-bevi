# Phase 1 Data Model: App Theming System

## Theme

A named, complete set of style tokens applied consistently app-wide. Shaped as a React Native
Paper MD3 theme object extended with app-specific tokens not covered by stock MD3 roles (tag
colors, speed-dial colors, etc. — carried over conceptually from today's `constants/Colors.js`).

| Field | Type | Notes |
|---|---|---|
| `name` | `"light" \| "dark" \| "colorful"` | One of exactly three theme instances (FR-001, FR-009) |
| `colors` | object | Paper MD3 color roles (`primary`, `background`, `surface`, `onSurface`, `error`, …) plus app-specific extensions: `tagBackground`, `tagText`, `tagBorderColor`, `speedDialBackground`, `speedDialIcon`, `headerIconColor`, etc. — a superset of today's flat `constants/Colors.js` keys |
| `dark` | boolean | Paper's own flag, drives status-bar style / native-chrome light-vs-dark defaults |

**Validation rules**:
- Every token present in one theme MUST be present in all three (no theme silently falls back to
  a different theme's value) — enforced by a shared token-keys unit test.
- Every text/background and icon/background token pair used in the UI MUST pass WCAG AA contrast
  per theme (FR-010) — enforced by the contrast-ratio unit test (see research.md Decision 4).
- Tag-related tokens (`tagBackground`/`tagText`/`tagBorderColor`) MUST remain mutually
  distinguishable within each theme (FR-006) — verified visually per tag during theme authoring;
  no automated check beyond the general contrast rule.

**Lifecycle**: Static, defined at build time (three JS modules under `theme/`). Not created,
edited, or deleted at runtime — only *selected*.

## AppearanceSelection

The user's chosen appearance-selection mode, persisted locally.

| Field | Type | Notes |
|---|---|---|
| `selection` | `"light" \| "dark" \| "colorful" \| "automatic"` | User's chosen mode (FR-002). Default before any selection exists: `"automatic"` (FR-008). |
| *(derived, not stored)* `resolvedTheme` | `"light" \| "dark" \| "colorful"` | What actually renders: `selection` directly, unless `selection === "automatic"`, in which case it's the device's current light/dark scheme (colorful has no OS equivalent — device "dark" → `dark` theme, anything else → `light` theme, per `/speckit-clarify`) |

**Storage**: `@react-native-async-storage/async-storage`, one key, device-local only — never
synced to the user's account (`/speckit-clarify` 2026-09-05). No relation to the `User`/`Meal`
Firebase models; this entity is entirely local-device state.

**State transitions**:
1. **Unset** (first launch / key not yet read) → app renders using `resolvedTheme` computed as if
   `selection = "automatic"`, without persisting anything yet.
2. **User picks an option** → `selection` is written to AsyncStorage immediately; app re-renders
   with the new `resolvedTheme` on the same frame (no restart).
3. **Selection = "automatic" and device OS scheme changes** → `resolvedTheme` re-computes live via
   the `useColorScheme()` OS listener; `selection` itself is unchanged (still `"automatic"`).
4. **Stored value is unrecognized** (e.g. a removed/renamed option from a future change) → treated
   as unset; falls back to `"automatic"` (edge case in spec.md).
