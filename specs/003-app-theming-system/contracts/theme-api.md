# Internal Contract: Theme API

Not an external/network API — this is the internal JS contract every screen/component in the app
is migrated to consume, replacing direct `import Colors from "constants/Colors"` usage. This is
the contract implementation (`/speckit-tasks`) MUST honor so screens stay decoupled from *how*
the theme is implemented (constitution-aligned with FR-007).

## `theme/useAppTheme.js`

```js
const theme = useAppTheme();
// theme.colors.<token>          -> resolved color for the ACTIVE theme, e.g. theme.colors.primary
// theme.dark                    -> boolean, true for the dark theme instance
// theme.name                    -> "light" | "dark" | "colorful"
```

- MUST be called from within a component tree wrapped by `theme/ThemeProvider.js`.
- MUST re-render consuming components synchronously when the active theme changes (selection
  change, or device OS scheme change while `automatic` is selected) — no manual subscription
  needed by call sites.
- Token set available on `theme.colors` MUST be a strict superset of every key currently in
  `constants/Colors.js`, so each call site's migration is a mechanical rename
  (`Colors.primary` → `theme.colors.primary`), not a redesign of the call site.

## `theme/ThemeProvider.js`

```js
<ThemeProvider>{children}</ThemeProvider>
```

- Wraps children in Paper's `PaperProvider` using the theme resolved from the current
  `AppearanceSelection` (see data-model.md).
- Also supplies the equivalent theme to `expo-router/react-navigation`'s navigation `ThemeProvider`
  so native-stack header/tab-bar chrome matches (per CLAUDE.md's mandatory
  `expo-router/react-navigation` import rule — this component is the one place that boundary is
  crossed).
- Reads/writes the persisted `AppearanceSelection` (AsyncStorage) internally; exposes the setter
  via a hook (see below) rather than making call sites touch storage directly.

## `theme/useAppearanceSelection.js`

```js
const { selection, setSelection } = useAppearanceSelection();
// selection: "light" | "dark" | "colorful" | "automatic"
// setSelection(next): persists `next` and triggers the app-wide re-render
```

- Used by exactly one call site in this feature: the appearance picker UI (added to
  `screens/SettingsScreen.js` per FR-002) — everything else only needs `useAppTheme()`.

## `common_functions/ResolveAppearance.js`

```js
ResolveAppearance(selection, deviceColorScheme) // -> "light" | "dark" | "colorful"
```

- Pure function, no I/O. `deviceColorScheme` is whatever `useColorScheme()` currently reports
  (`"light" | "dark" | null`).
- `selection !== "automatic"` → returns `selection` unchanged.
- `selection === "automatic"` → `"dark"` if `deviceColorScheme === "dark"`, else `"light"`.
- Unrecognized `selection` → treated as `"automatic"`.

## `common_functions/GetContrastRatio.js`

```js
GetContrastRatio(colorA, colorB) // -> number (e.g. 4.52)
```

- Pure function, no I/O. Standard WCAG relative-luminance contrast ratio between two colors.
  Consumed by the theme contrast unit test (FR-010/SC-006), not by app UI at runtime.
