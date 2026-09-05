---

description: "Task list for App Theming System"
---

# Tasks: App Theming System

**Input**: Design documents from `/specs/003-app-theming-system/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/theme-api.md, quickstart.md

**Tests**: Included and MANDATORY, not optional — this project's constitution (Principle I,
Test-First, NON-NEGOTIABLE) requires a failing test before implementing code for spec-kit-planned
work. Every pure-logic task below has a test task that precedes it.

**Organization**: Grouped by user story from spec.md. Phase order follows priority
(P1 → P1 → P2): **Phase 3 = US1**, **Phase 4 = US3**, **Phase 5 = US2** — both P1 stories land
before the P2 "Colorful" story, even though spec.md lists US2 second.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: US1, US2, or US3 — maps to spec.md's user stories
- File paths are exact and repo-relative

---

## Phase 1: Setup

- [ ] T001 Create the `theme/` directory with empty placeholder files: `theme/lightTheme.js`,
      `theme/darkTheme.js`, `theme/colorfulTheme.js`, `theme/ThemeProvider.js`,
      `theme/useAppTheme.js`, `theme/useAppearanceSelection.js`, `theme/AppearanceOptions.js`
      (per plan.md Project Structure). No new dependency install — `react-native-paper` is
      already in `package.json`.
- [ ] T002 [P] Define the appearance enum and AsyncStorage key in `theme/AppearanceOptions.js`:
      `LIGHT`, `DARK`, `COLORFUL`, `AUTOMATIC` constants plus a `STORAGE_KEY` string, following
      the naming style already used for storage keys in `common_functions/CredentialStorage.js`.

**Checkpoint**: `theme/` module skeleton exists; nothing wired up yet.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The theming *mechanism* — provider, hooks, persistence, OS-scheme resolution — must
exist and be wired into the app root before any user story's themes can be switched to. Uses
React Native Paper's stock `MD3LightTheme`/`MD3DarkTheme` as placeholders; US1 replaces them with
the real brand palette.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

### Tests for Foundational phase

> Write these tests FIRST; confirm they FAIL before implementing the code below.

- [ ] T003 [P] Failing unit test for appearance resolution in
      `tests/unit-tests/ResolveAppearance.test.js` — covers: explicit selection passthrough,
      `automatic` + device `"dark"` → `"dark"`, `automatic` + device `"light"`/`null` → `"light"`,
      unrecognized selection → treated as `automatic` (per data-model.md).
- [ ] T004 [P] Failing unit test for contrast math in
      `tests/unit-tests/GetContrastRatio.test.js` — covers known WCAG reference pairs (e.g.
      black-on-white ≈ 21:1, same-color ≈ 1:1) plus a couple of representative mid-contrast pairs.
- [ ] T005 [P] Failing component test in `tests/component-tests/ThemeProvider.spec.js` — renders a
      consumer under `theme/ThemeProvider.js` with Paper's stock `MD3LightTheme`/`MD3DarkTheme`,
      changes the appearance selection, asserts the consumer re-renders with the new theme's
      colors without unmounting.

### Implementation for Foundational phase

- [ ] T006 [P] Implement `common_functions/ResolveAppearance.js` per contracts/theme-api.md
      (`ResolveAppearance(selection, deviceColorScheme)`) — makes T003 pass.
- [ ] T007 [P] Implement `common_functions/GetContrastRatio.js` (WCAG relative-luminance contrast
      ratio formula) — makes T004 pass.
- [ ] T008 Implement `theme/useAppearanceSelection.js`: reads/writes the persisted selection via
      `@react-native-async-storage/async-storage` under `AppearanceOptions.STORAGE_KEY`, defaults
      to `AUTOMATIC` before the stored value loads (FR-008). Depends on T002, T006.
- [ ] T009 Implement `theme/useAppTheme.js`: thin wrapper re-exporting React Native Paper's
      `useTheme()` for app call sites, per contracts/theme-api.md. Depends on T002.
- [ ] T010 Implement `theme/ThemeProvider.js`: wraps children in Paper's `PaperProvider` using
      the theme resolved from `useAppearanceSelection()` + `ResolveAppearance()` +
      `useColorScheme()`; bridges the resolved theme into `expo-router/react-navigation`'s
      `ThemeProvider` for native-stack chrome (per CLAUDE.md's mandatory import rule). Uses
      Paper's stock `MD3LightTheme`/`MD3DarkTheme` as the light/dark source for now. Depends on
      T008, T009 — makes T005 pass.
- [ ] T011 Wire `theme/ThemeProvider.js` into `app/_layout.js`, wrapping `RootNavigator` (inside
      the existing `Provider`/`GestureHandlerRootView` nesting). Depends on T010.

**Checkpoint**: App builds and runs, following the OS light/dark setting via Paper's stock theme.
No branded palette yet, no picker UI yet, no screens migrated yet — foundation only.

---

## Phase 3: User Story 1 (P1) 🎯 MVP — Switch between light and dark appearance

**Goal**: A user can explicitly pick Light, Dark, or Automatic; every screen in the app renders
fully themed and the choice survives an app restart.

**Independent Test**: Switch the appearance setting and navigate every existing screen — no
screen shows the old hard-coded palette.

### Tests for User Story 1

- [ ] T012 [P] [US1] Failing unit test `tests/unit-tests/ThemeContrast.test.js` — iterates
      `lightTheme` and `darkTheme`'s text/background and icon/background token pairs, asserts
      each meets WCAG AA via `GetContrastRatio` (FR-010, SC-006).
- [ ] T013 [P] [US1] Failing component test `tests/component-tests/AppearancePicker.spec.js` —
      selecting an option calls the persistence hook and the picker reflects a previously-stored
      selection on mount (SC-003).

### Implementation for User Story 1

- [ ] T014 [P] [US1] Build `theme/lightTheme.js`: extend Paper's `MD3LightTheme` with a genuinely
      refreshed brand palette (FR-005 — not a mechanical rename) plus app-specific tokens ported
      from `constants/Colors.js` (`tagBackground`, `tagText`, `tagBorderColor`,
      `speedDialBackground`, `speedDialIcon`, `speedDialActionBackground`,
      `speedDialActionText`, `headerIconColor`, `hyperlink`, `screenBackGround`,
      `myTabMenuBackground`, `textInputBackground`, `textInputPlaceholderColor`,
      `searchTextPlaceholder`, `searchTermHighlight`, `selectedMealBackground`,
      `selectedMealBorderColor`, `levelView*` keys — full list in `constants/Colors.js`).
- [ ] T015 [P] [US1] Build `theme/darkTheme.js`: same token shape as T014, genuinely restyled for
      dark (not an auto-inverted light theme), per FR-005/FR-001.
- [ ] T016 [US1] Create `components/AppearancePicker.js`: Light/Dark/Automatic selector UI using
      `theme/useAppearanceSelection.js` and `theme/useAppTheme.js`. Depends on T008, T009, T014,
      T015.
- [ ] T017 [US1] Wire `components/AppearancePicker.js` into `screens/SettingsScreen.js` (same
      pattern as the existing `NotificationsSwitch` composition already in that screen). Depends
      on T016.
- [ ] T018 [US1] Update `theme/ThemeProvider.js` to resolve `light`/`dark` from `theme/lightTheme.js`
      / `theme/darkTheme.js` instead of Paper's stock themes. Depends on T010, T014, T015 — makes
      T012 meaningful (was passing trivially against stock Paper themes before).

**Migrate every screen/component off `constants/Colors.js` onto `theme/useAppTheme.js`**
(36 files; all independent, no cross-file dependencies — safe to parallelize):

- [ ] T019 [P] [US1] Migrate `screens/DevScreen.js`
- [ ] T020 [P] [US1] Migrate `screens/ManageAccountScreen.js`
- [ ] T021 [P] [US1] Migrate `screens/AddTagScreen.js`
- [ ] T022 [P] [US1] Migrate `screens/SendReportScreen.js`
- [ ] T023 [P] [US1] Migrate `screens/NewScreen.js`
- [ ] T024 [P] [US1] Migrate `screens/DebugScreen.js`
- [ ] T025 [P] [US1] Migrate `screens/MealsScreen.js`
- [ ] T026 [P] [US1] Migrate `components/LoadingIndicator.js`
- [ ] T027 [P] [US1] Migrate `components/LevelView.js`
- [ ] T028 [P] [US1] Migrate `components/MealItem.js`
- [ ] T029 [P] [US1] Migrate `components/DraggableItemList.js`
- [ ] T030 [P] [US1] Migrate `components/MyTabMenu.js`
- [ ] T031 [P] [US1] Migrate `components/SearchInput.js`
- [ ] T032 [P] [US1] Migrate `components/SelectSortingModal.js`
- [ ] T033 [P] [US1] Migrate `components/AuthorBox.js`
- [ ] T034 [P] [US1] Migrate `components/MyListItem.js`
- [ ] T035 [P] [US1] Migrate `components/TinyUserItem.js`
- [ ] T036 [P] [US1] Migrate `components/TagList.js`
- [ ] T037 [P] [US1] Migrate `components/MealSpeedDial.js`
- [ ] T038 [P] [US1] Migrate `components/LevelsViewModal.js`
- [ ] T039 [P] [US1] Migrate `components/MealList.js`
- [ ] T040 [P] [US1] Migrate `components/MyLevelViewContainer.js`
- [ ] T041 [P] [US1] Migrate `components/InputListViewContainer.js`
- [ ] T042 [P] [US1] Migrate `components/SelectReactionModal.js`
- [ ] T043 [P] [US1] Migrate `components/HeaderIcons/GlobalBackIcon.js`
- [ ] T044 [P] [US1] Migrate `components/MyButton.js`
- [ ] T045 [P] [US1] Migrate `components/AuthenticationContent.js`
- [ ] T046 [P] [US1] Migrate `components/TinyMealItem.js`
- [ ] T047 [P] [US1] Migrate `components/HeaderIcons/SaveIcon.js`
- [ ] T048 [P] [US1] Migrate `components/HeaderIcons/HeaderBackIcon.js`
- [ ] T049 [P] [US1] Migrate `components/HeaderIcons/EditMangiIcon.js`
- [ ] T050 [P] [US1] Migrate `components/HeaderIcons/LogoutIcon.js`
- [ ] T051 [P] [US1] Migrate `components/HeaderIcons/EditMangiIconDisabled.js`
- [ ] T052 [P] [US1] Migrate `components/ImageSwipe.js`
- [ ] T053 [P] [US1] Migrate `components/Switches/MySwitch.js`
- [ ] T054 [P] [US1] Migrate `app/(app)/_layout.js`
- [ ] T055 [US1] Run quickstart.md steps 1–2 and 4–7 (Light/Dark/Automatic portions) against a
      running build; fix any screen still showing the old palette. Depends on T019-T054.

**Checkpoint**: User Story 1 fully functional and independently testable — Light/Dark/Automatic
work across the whole app and persist across restarts.

---

## Phase 4: User Story 3 (P1) — Codebase ready for a future styling-library migration

**Goal**: Turn "zero hard-coded colors, one central source" from a one-time sweep result (already
true after US1) into an enforced, testable invariant, and retire the superseded palette file.

**Independent Test**: A grep across `screens/`, `components/`, `app/` for hex/rgb literals
outside `theme/` returns none; `constants/Colors.js` no longer exists.

### Tests for User Story 3

- [ ] T056 [P] [US3] Failing test `tests/unit-tests/NoHardcodedColorLiterals.test.js` — greps
      `screens/`, `components/`, `app/` for hex/rgba color literals outside `theme/`, asserts the
      result is empty (excluding documented one-off exceptions, e.g. debug-only UI, listed
      inline in the test).
- [ ] T057 [P] [US3] Failing test `tests/unit-tests/ThemeTokenParity.test.js` — asserts
      `lightTheme.colors` and `darkTheme.colors` expose identical key sets (data-model.md
      validation rule).

### Implementation for User Story 3

- [ ] T058 [US3] Remove any stray literal colors T056 flags (expected: the ~2 files identified in
      plan.md's scope note) by sourcing them from `theme/useAppTheme.js` instead. Depends on T056.
- [ ] T059 [US3] Delete `constants/Colors.js` now that T019-T054 and T058 leave zero importers.
      Depends on all of Phase 3's migration tasks (T019-T054) and T058.
- [ ] T060 [US3] Confirm T057 passes (token parity between `theme/lightTheme.js` and
      `theme/darkTheme.js`). Depends on T014, T015, T057.

**Checkpoint**: No hard-coded colors remain anywhere in the app; the old palette file is gone;
regression tests guard both invariants going forward.

---

## Phase 5: User Story 2 (P2) — Try the more colorful third look

**Goal**: A third, vibrant "Colorful" appearance is selectable alongside Light/Dark, with the
same full-app coverage.

**Independent Test**: Colorful appears in the picker; selecting it themes every screen with no
fallback to the old palette.

### Tests for User Story 2

- [ ] T061 [P] [US2] Extend `tests/unit-tests/ThemeTokenParity.test.js` to also assert
      `colorfulTheme.colors` matches the same key set as light/dark.
- [ ] T062 [P] [US2] Extend `tests/unit-tests/ThemeContrast.test.js` to also assert
      `colorfulTheme`'s token pairs meet WCAG AA (FR-010, SC-006).

### Implementation for User Story 2

- [ ] T063 [US2] Build `theme/colorfulTheme.js`: vibrant MD3-shaped theme using the exact token
      keys established in `theme/lightTheme.js`/`theme/darkTheme.js` (T014, T015) so T061 passes.
- [ ] T064 [US2] Add the "Colorful" option to `components/AppearancePicker.js`. Depends on T016,
      T063.
- [ ] T065 [US2] Extend `theme/ThemeProvider.js`'s theme-name → theme-object lookup to include
      `colorful` → `theme/colorfulTheme.js`. Depends on T018, T063.

**Checkpoint**: All three appearances plus Automatic are fully functional across the whole app —
feature complete.

---

## Final Phase: Polish & Cross-Cutting Concerns

- [ ] T066 [P] Run the full `quickstart.md` validation end-to-end (all steps, all three
      appearances).
- [ ] T067 [P] Add a short "Theming" entry to the root `CLAUDE.md` Architecture section
      documenting the new `theme/` directory, mirroring how `firebase/`/`appwrite/` are already
      documented there.
- [ ] T068 Run `npm test` (full suite) and confirm no regressions outside this feature's new
      tests. (`npm run lint` remains a known pre-existing gap per the project constitution — not
      a gate for this feature.)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories.
- **US1 (Phase 3, P1)**: Depends on Foundational. No dependency on US2/US3.
- **US3 (Phase 4, P1)**: Depends on Foundational; its deletion/parity tasks (T058-T060) depend on
  US1's migration tasks (T019-T054, T014, T015) being done — so while independently *testable*,
  it is not independently *completable* before US1 in this codebase (there is nothing to retire
  or make parity-consistent until US1's themes and migration exist).
- **US2 (Phase 5, P2)**: Depends on Foundational and reuses US1's token shape (T014, T015) as the
  contract `colorfulTheme.js` must match — same "testable independently, not completable first"
  relationship as US3.

### Parallel Opportunities

- T002 (Setup) has nothing else to parallelize with in that tiny phase.
- T003, T004, T005 (Foundational tests) run in parallel.
- T006, T007 (Foundational implementation) run in parallel.
- T012, T013 (US1 tests) run in parallel.
- T014, T015 (US1 theme files) run in parallel.
- **T019 through T054 (36 migration tasks) are all parallelizable** — different files, no
  cross-dependencies. This is the biggest parallelization opportunity in the feature.
- T056, T057 (US3 tests) run in parallel.
- T061, T062 (US2 tests) run in parallel.
- T066, T067 (Polish) run in parallel.

---

## Parallel Example: User Story 1 migration sweep

```bash
# After T014/T015/T016/T017/T018 land, fire off the 36 migration tasks together, e.g.:
Task: "Migrate screens/DevScreen.js"
Task: "Migrate screens/MealsScreen.js"
Task: "Migrate components/MealItem.js"
Task: "Migrate components/MealList.js"
# ...and so on for T019-T054
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Phase 1: Setup
2. Phase 2: Foundational (CRITICAL — blocks everything)
3. Phase 3: User Story 1 — Light/Dark/Automatic, full app, persisted
4. **STOP and VALIDATE** via quickstart.md steps 1-2, 4-7
5. Ship — this alone resolves the "boring and old-fashioned" complaint and the persistence ask.

### Incremental Delivery

1. Setup + Foundational → app runs on Paper's stock light/dark theme, OS-driven, nothing branded
   or migrated yet (small, revertible checkpoint).
2. Add US1 → branded Light/Dark + Automatic + full-app migration → test → ship (MVP).
3. Add US3 → retire `constants/Colors.js`, lock in the invariant with regression tests → ship.
4. Add US2 → Colorful theme, same mechanism, no per-screen changes needed → ship.

Each step is independently shippable and matches the "small changes at a time" preference — no
step requires redoing a previous one.

---

## Notes

- [P] tasks touch different files with no dependency on incomplete work.
- Every task in Phases 2-5 that introduces new pure logic has a preceding failing test, per
  constitution Principle I (NON-NEGOTIABLE for spec-kit-planned work).
- T019-T054 are intentionally uniform ("Migrate `<file>`" = replace its `Colors.js` import/usages
  with `theme/useAppTheme.js`, keeping the file's existing `StyleSheet` structure) — mechanical by
  design, per plan.md's Minimal Footprint framing.
- Commit after each task or logical group (e.g., after each theme file, after each handful of
  migration tasks).
