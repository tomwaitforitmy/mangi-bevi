# Quickstart: Validate App Theming System

Prerequisites: repo installed (`npm install`), `react-native-paper` already present in
`package.json` (no new install needed).

## 1. Run unit tests for the new pure logic

```bash
npx jest tests/unit-tests/ResolveAppearance.test.js tests/unit-tests/GetContrastRatio.test.js
```

Expected: all pass, including the WCAG AA assertions for every Light/Dark/Colorful token pair
(FR-010, SC-006).

## 2. Run the theme-provider component test

```bash
npx jest tests/component-tests/ThemeProvider.spec.js
```

Expected: switching `AppearanceSelection` re-renders consumers with the new theme's colors, with
no unmount/remount of the tree.

## 3. Manual end-to-end pass (device/simulator)

1. `npx expo start` (or `npm run ios` / `npm run android`), `EXPO_PUBLIC_DEV_MODE=true` per
   project convention.
2. On first launch (no prior selection), confirm the app renders in Light or Dark matching the
   device's current OS setting (Automatic default, FR-008).
3. Open Settings → Appearance. Confirm four options: Light, Dark, Colorful, Automatic.
4. Select **Dark**. Confirm every reachable screen (tab bar, meal list, meal detail, edit flows,
   friends, profile, dev screen, auth screens, modals) reflects Dark immediately, no restart
   (SC-001).
5. Select **Colorful**. Repeat the same full-app sweep (SC-001, FR-009).
6. Select **Automatic**, then toggle the device's OS light/dark setting from outside the app.
   Confirm the app updates live without reopening it.
7. Force-quit and reopen the app. Confirm the last explicit selection (not device state) is
   restored (SC-003) — except when Automatic was selected, which should keep following the OS.
8. Spot-check tag chips in the meal list/detail under each theme: colors differ per theme but
   remain mutually distinguishable per tag (SC-005, FR-006).
9. Confirm no screen shows the old fixed palette regardless of appearance (SC-001) — cross-check
   against the file list in `research.md`/`plan.md` Scope note (103 screen/component files, 36
   pre-existing `Colors.js` importers).

## 4. Static audit for stray literals (SC-002)

```bash
grep -rEn "#[0-9a-fA-F]{3,6}\b|rgba?\(" --include="*.js" screens components app \
  | grep -v -f <(git -C . ls-files -- 'theme/*.js')
```

Expected: no results outside documented, intentional one-offs (debug-only UI) — see spec.md
Assumptions.
