# Phase 0 Research: App Theming System

## Decision 1: Styling engine — React Native Paper (theming layer only)

**Decision**: Adopt `react-native-paper` (already listed in `package.json` at `^5.15.3`, but
imported nowhere in the codebase today) as the app's theming engine: wrap the root layout in
Paper's `PaperProvider` with a custom MD3-shaped theme object per appearance (Light, Dark,
Colorful). Existing screens/components keep their current native RN primitives (`View`, `Text`,
`TouchableOpacity`, …) and `StyleSheet.create` calls — they consume theme colors through a new
`theme/useAppTheme.js` hook rather than being rewritten to Paper's own components
(`<Paper.Button>`, `<Paper.Card>`, etc.).

**Rationale**:
- Explicitly requested by the user this session ("Let's go with react-native paper — the obvious
  choice"), and it's already an installed dependency — zero new install cost.
- Paper's MD3 theme object is a ready-made "single source of truth" shape (`theme.colors.*`)
  that directly satisfies FR-003 (one source of truth per appearance) and is trivially extensible
  with app-specific tokens (tag colors, speed-dial colors) beyond the stock MD3 palette.
  React Native Paper is a well established Material UI Design library.
- Keeping screens on plain RN + StyleSheet, only swapping *where colors come from*, matches
  constitution Principle VI (Minimal Footprint): today 36 of 103 screen/component files already
  import `constants/Colors.js` — swapping that import for `theme/useAppTheme.js` is the same
  shape of change they already do, not a rewrite. Converting individual screens to Paper's actual
  UI components is exactly the incremental "future migration" FR-007 asks this feature to prepare
  for — deliberately not done now.

**Alternatives considered**:
- **NativeWind** (Tailwind classes for RN) — bigger conceptual shift away from the project's
  existing StyleSheet convention; no dependency currently installed.
- **Tamagui / react-native-unistyles** — compiler-based theming, heavier build-tooling lift than
  warranted for a solo-maintained app; nothing currently installed.
- **Hand-rolled Context + `useColorScheme`-only** (the pattern Expo's own docs demonstrate — see
  Decision 2) — would still leave the "advanced style concept" / component-library groundwork
  undone, requiring a second migration later. Rejected since Paper is already present and
  explicitly requested.

## Decision 2: Relationship to Expo's own dark-mode sample approach

**Question investigated** (user asked directly): does the default Expo Router template /
Expo's official dark-mode guidance use React Native Paper?

**Finding**: No. Expo's color-themes documentation (`docs.expo.dev/develop/user-interface/
color-themes`) and the default Expo Router "tabs" template implement dark mode with React
Native's own built-in APIs only: the `useColorScheme()` hook and `Appearance` module for
detecting/observing the OS scheme, paired with manual `StyleSheet.create()` variants and (for
navigation chrome) React Navigation's `DarkTheme`/`DefaultTheme` `ThemeProvider`. No third-party
theming or component library is involved in Expo's own sample.

**Implication for this plan**: `useColorScheme`/`Appearance` are still the right tool for one
specific job — detecting the OS scheme to drive **Automatic** mode (`theme/ResolveAppearance`
input) — but the *palette itself* (what colors Light/Dark/Colorful actually use, and how
components look them up) is Paper's MD3 theme object, not React Navigation's `DarkTheme`/
`DefaultTheme`. Native-stack header/tab-bar chrome still goes through
`expo-router/react-navigation`'s `ThemeProvider` per this repo's CLAUDE.md rule (never import
`@react-navigation/*` directly) — Paper's resolved theme values are fed into that provider's theme
object rather than bypassing it.

## Decision 3: Appearance persistence mechanism

**Decision**: Store the user's appearance selection (`light` | `dark` | `colorful` | `automatic`)
in `@react-native-async-storage/async-storage` under one fixed key, read once at startup before
first paint (default to `automatic` while unread, per FR-008), written on every user change.

**Rationale**: Matches the `/speckit-clarify` decision that the preference is per-device, not
account-synced (so no Firebase field/write path, no `runOptimisticTransaction` involvement).
AsyncStorage is already a project dependency, used elsewhere for credentials — no new package.

**Alternatives considered**: `expo-secure-store` (already a dependency, used for credentials) —
rejected as overkill; the appearance choice isn't sensitive, and AsyncStorage is the conventional
choice for non-sensitive UI preferences.

## Decision 4: Verifying WCAG AA contrast (FR-010 / SC-006)

**Decision**: Add a small pure `common_functions/GetContrastRatio.js` utility (standard relative
luminance / contrast ratio formula) with its own unit test, then a second unit test that iterates
each theme's defined text/background and icon/background token pairs and asserts the WCAG AA
thresholds (4.5:1 normal text, 3:1 large text/icons) from `common_functions/GetContrastRatio.js`.

**Rationale**: Makes FR-010/SC-006 an automated, repeatable check per constitution Principle I
(Test-First) rather than a one-time manual/visual judgment call that can silently regress when a
theme color changes later.

**Alternatives considered**: Manual/visual contrast check during design — rejected, not
repeatable and doesn't satisfy the constitution's TDD principle for planned work.
