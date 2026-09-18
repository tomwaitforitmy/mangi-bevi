---

description: "Task list for About Page (specs/004-about-page)"
---

# Tasks: About Page

**Input**: Design documents from `/specs/004-about-page/` (plan.md, spec.md, research.md, data-model.md, quickstart.md)

**Tests**: Included — Constitution Principle I (Test-First, NON-NEGOTIABLE) mandates a failing test before the implementing code for all spec-kit-planned work in this project.

**Organization**: Tasks are grouped by user story (spec.md: US1 = P1, US2 = P2, US3 = P2) so each can be implemented, tested, and delivered independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: US1 / US2 / US3, per spec.md

## Phase 1: Setup

- [x] T001 Add `license-checker-rseidelsohn` as a devDependency (`npm install --save-dev license-checker-rseidelsohn`), updating `package.json` and `package-lock.json`

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Both US2 and US3's screens `require()` a generated JSON file directly — that file must exist (even as an empty placeholder) before those screens can be written or bundled, since neither the app nor Metro can run `git`/`license-checker` at import time.

- [x] T002 [P] Seed placeholder `data/generated/openSourceLicenses.json` with `{ "generatedAt": null, "packages": [] }` (matches data-model.md's `OpenSourceLicense` file shape; overwritten for real by T012's generator)
- [x] T003 [P] Seed placeholder `data/generated/devHoursEstimate.json` with `{ "estimatedHours": 0, "sessionCount": 0, "commitCount": 0, "generatedAt": null, "methodology": "" }` (matches data-model.md's `DevHoursEstimate` file shape; overwritten for real by T021's generator)

**Checkpoint**: Foundation ready — user story work can begin.

---

## Phase 3: User Story 1 - View app version (Priority: P1) 🎯 MVP

**Goal**: Replace the inline version text on the Profile screen with an About screen showing app name + version.

**Independent Test**: Navigate Profile → About, verify app name and version are displayed; tap back returns to Profile (spec.md US1 Acceptance Scenarios).

### Tests for User Story 1

- [x] T004 [P] [US1] Write failing component test in `tests/component-tests/AboutScreen.spec.js`: renders the app name and `Constants.expoConfig.version`

### Implementation for User Story 1

- [x] T005 [US1] Implement `screens/AboutScreen.js`: app name + version via `expo-constants` (`Constants.expoConfig.version`, same source `screens/ProfileScreen.js` currently uses), themed via `theme/useAppTheme()` — makes T004 pass
- [x] T006 [US1] Create `app/(app)/profile/about.js`: `Stack.Screen` wrapper (title `"About"`, `headerLeft` = `GlobalBackIcon`, matching `app/(app)/profile/settings.js`'s pattern) rendering `AboutScreen`
- [x] T007 [P] [US1] Edit `screens/ProfileScreen.js`: remove the inline `Mangi & Bevi version: …` `<Text>` (currently around line 51-53), add a `MyButton` labeled `"About"` that calls `router.push("/profile/about")`, placed alongside the existing Account/Friends/Settings buttons
- [x] T008 [US1] Manual validation: run `specs/004-about-page/quickstart.md`'s US1 steps

**Checkpoint**: US1 fully functional and independently testable — this is the MVP.

---

## Phase 4: User Story 2 - View Open Source License notices (Priority: P2)

**Goal**: An "Open Source Licenses" sub-page listing every production dependency whose license requires attribution, full text embedded, auto-regenerated every release.

**Independent Test**: From the About screen, open "Open Source Licenses"; verify a list of package licenses appears, sourced from `data/generated/openSourceLicenses.json` (spec.md US2 Acceptance Scenarios).

### Tests for User Story 2

- [x] T009 [P] [US2] Write failing unit test in `tests/unit-tests/requiresAttribution.test.js`: `"MIT"` → true, `"Apache-2.0"` → true, `"BSD-3-Clause"` → true, `"ISC"` → true, `"Unlicense"` → false, `"CC0-1.0"` → false, `"WTFPL"` → false, `"0BSD"` → false, an unrecognized/custom string → true (fail-safe default per research.md #2), `"MIT OR Apache-2.0"` → true, `"Unlicense OR CC0-1.0"` → false, `"Unlicense OR MIT"` → true (any component requiring attribution wins)
- [x] T010 [P] [US2] Write failing component test in `tests/component-tests/OpenSourceLicensesScreen.spec.js` using a small mock `packages` fixture: collapsed rows show package name + license type; tapping a row expands its full `licenseText`; an empty `packages` array renders an explicit "no packages require attribution" message, not a blank screen

### Implementation for User Story 2

- [x] T011 [US2] Implement `scripts/lib/requiresAttribution.js`: pure function, SPDX identifier (or simple `OR`/`AND` expression) → boolean, exclusion list `["Unlicense", "CC0-1.0", "WTFPL", "0BSD"]` (case-insensitive), unrecognized input defaults to `true` — makes T009 pass
- [x] T012 [US2] Implement `scripts/generate-license-data.js`: run `license-checker-rseidelsohn` with `--production`, read each package's license file text, filter via `scripts/lib/requiresAttribution.js`, write `data/generated/openSourceLicenses.json` per data-model.md's shape (`generatedAt`, `packages[]` with `packageName`/`version`/`license`/`licenseText`/`repository`); exit non-zero if the dependency scan fails or returns zero packages
- [x] T013 [US2] Implement `screens/OpenSourceLicensesScreen.js`: `FlatList` reading `data/generated/openSourceLicenses.json`, collapsible rows (name + license type visible, full text expands on tap), explicit empty-state message when `packages` is empty, themed via `theme/useAppTheme()` — makes T010 pass
- [x] T014 [US2] Create `app/(app)/profile/about-licenses.js`: `Stack.Screen` wrapper (title `"Open Source Licenses"`, `headerLeft` = `GlobalBackIcon`) rendering `OpenSourceLicensesScreen`
- [x] T015 [US2] Edit `screens/AboutScreen.js` (from US1): add a `MyButton` labeled `"Open Source Licenses"` that calls `router.push("/profile/about-licenses")`
- [x] T016 [US2] Edit `scripts/prerelease.fish`: run `node scripts/generate-license-data.js` before the existing `git add -A` step, aborting the release (matching the existing test/Appwrite-check abort pattern) on non-zero exit
- [x] T017 [US2] Manual validation: run `specs/004-about-page/quickstart.md`'s US2 steps, including the temporary excluded-license dependency check

**Checkpoint**: US1 + US2 both independently functional.

---

## Phase 5: User Story 3 - View cost transparency (Priority: P2)

**Goal**: A "Costs & Transparency" sub-page showing real monetary costs, an auto-generated developer-time estimate, the methodology explanation, and the free/ad-free statement.

**Independent Test**: From the About screen, open "Costs & Transparency"; verify monetary costs, the time-estimate, its explanation, and the free/ad-free statement are all present (spec.md US3 Acceptance Scenarios).

### Tests for User Story 3

- [x] T018 [P] [US3] Write failing unit test in `tests/unit-tests/estimateDevHours.test.js`: a tight cluster of timestamps (gaps under the session threshold) sums real elapsed time; a gap over the threshold adds only the fixed per-session credit; a single timestamp returns just the first-commit credit; an empty array returns `{ estimatedHours: 0, sessionCount: 0 }`
- [x] T019 [P] [US3] Write failing component test in `tests/component-tests/CostsScreen.spec.js` using mock `CostsConfig` + `devHoursEstimate` fixtures: each monetary line item renders, the monetary sum is correct, the hours-based estimate (`estimatedHours * hourlyRateEur`) is correct, the methodology text and the free/ad-free statement are both present, an "as of" date is shown

### Implementation for User Story 3

- [x] T020 [US3] Implement `scripts/lib/estimateDevHours.js`: pure function `estimateDevHours(commitTimestamps, { sessionGapSeconds = 7200, firstCommitCreditSeconds = 1800 } = {})` per research.md #3's heuristic — makes T018 pass
- [x] T021 [US3] Implement `scripts/generate-dev-hours-data.js`: read `git log --pretty=format:%at` for `HEAD`, call `estimateDevHours`, write `data/generated/devHoursEstimate.json` per data-model.md's shape (`estimatedHours`, `sessionCount`, `commitCount`, `generatedAt`, `methodology`); exit non-zero if `git log` returns no commits or errors (shallow-clone case)
- [x] T022 [P] [US3] Create `data/CostsConfig.js`: `hourlyRateEur: 25`, `asOf: "2026-09-18"`, `monetaryCosts: [{label: "Apple Developer Program (4 years)", amountEur: 396}, {label: "Google Play Console (one-time)", amountEur: 25}, {label: "Claude Code (2 months)", amountEur: 44}]`
- [x] T023 [US3] Implement `screens/CostsScreen.js`: renders `CostsConfig.monetaryCosts` line items + their sum, the hours-based estimate (`devHoursEstimate.estimatedHours * CostsConfig.hourlyRateEur`) per data-model.md's derived-value formula, the methodology explanation, the "as of" date, and the free/ad-free statement, themed via `theme/useAppTheme()` — makes T019 pass
- [x] T024 [US3] Create `app/(app)/profile/about-costs.js`: `Stack.Screen` wrapper (title `"Costs & Transparency"`, `headerLeft` = `GlobalBackIcon`) rendering `CostsScreen`
- [x] T025 [US3] Edit `screens/AboutScreen.js` (from US1; touches the same file as T015 — do sequentially if both stories are in flight): add a `MyButton` labeled `"Costs & Transparency"` that calls `router.push("/profile/about-costs")`
- [x] T026 [US3] Edit `scripts/prerelease.fish` (touches the same file as T016 — do sequentially if both stories are in flight): run `node scripts/generate-dev-hours-data.js` before `git add -A`, aborting the release on non-zero exit
- [x] T027 [US3] Manual validation: run `specs/004-about-page/quickstart.md`'s US3 steps

**Checkpoint**: All three user stories independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T028 [P] Verify `AboutScreen`, `OpenSourceLicensesScreen`, and `CostsScreen` meet WCAG AA contrast in Light, Dark, and Colorful themes (spec.md SC-005)
- [x] T029 [P] Run `npm test`; confirm `requiresAttribution.test.js`, `estimateDevHours.test.js`, and the three new component-tests pass alongside the existing suite
- [x] T030 Run `npm run lint` best-effort (pre-existing ESLint/RN-config breakage is a known gap, not a gate, per the constitution's Development Workflow section)
- [x] T031 [P] Add a short section to root `CLAUDE.md` documenting the About/Licenses/Costs generated-vs-manual data split and the two new `scripts/prerelease.fish` steps (matching the existing documentation style for other subsystems)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup — blocks US2 and US3 (their screens `require()` the placeholder JSON files). Does not block US1.
- **User Stories (Phase 3-5)**: US1 depends only on Foundational technically, but not on the placeholders. US2 and US3 depend on Foundational (T002/T003 respectively) and are otherwise independent of each other and of US1's screen logic.
- **Polish (Phase 6)**: Depends on whichever user stories were implemented.

### Cross-Story File Touches (sequence, don't parallelize across stories)

- `screens/AboutScreen.js`: created in US1 (T005), then edited once by US2 (T015) and once by US3 (T025) — do these two edits sequentially, not concurrently, to avoid clobbering each other's added button.
- `scripts/prerelease.fish`: edited once by US2 (T016) and once by US3 (T026) — same note.

### Within Each User Story

- Tests MUST be written and FAIL before their corresponding implementation task (Constitution Principle I).
- Pure logic (`scripts/lib/*.js`) before the generator script that calls it.
- Generator script / data file before the screen that reads its output.
- Screen before its route wrapper.
- Route before the About-screen nav button that links to it.

### Parallel Opportunities

- T002 and T003 (Foundational) — different files.
- T004 (US1 test) and T007 (US1 ProfileScreen edit) — different files, T007 doesn't need T004/T005/T006 to be code-complete, only the route path string.
- T009 and T010 (US2 tests) — different files (unit vs. component), fully independent.
- T018, T019, and T022 (US3 tests + CostsConfig data file) — three independent files.
- US2 (Phase 4) and US3 (Phase 5) can be implemented by different people in parallel once Foundational is done, up to the two shared-file touches noted above.

---

## Parallel Example: User Story 2

```bash
# Launch both US2 tests together:
Task: "Write failing unit test in tests/unit-tests/requiresAttribution.test.js"
Task: "Write failing component test in tests/component-tests/OpenSourceLicensesScreen.spec.js"
```

## Parallel Example: User Story 3

```bash
# Launch both US3 tests plus the independent data file together:
Task: "Write failing unit test in tests/unit-tests/estimateDevHours.test.js"
Task: "Write failing component test in tests/component-tests/CostsScreen.spec.js"
Task: "Create data/CostsConfig.js with the confirmed real cost figures"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1: Setup (T001)
2. Phase 2: Foundational (T002-T003) — technically only needed for US2/US3, but cheap to do upfront
3. Phase 3: User Story 1 (T004-T008)
4. **STOP and VALIDATE**: run quickstart.md's US1 steps — Profile screen now has a working About screen with the app version, MVP shippable on its own.

### Incremental Delivery

1. Setup + Foundational → foundation ready.
2. Add US1 → validate independently → About screen ships (MVP).
3. Add US2 → validate independently (including a `npm run prerelease` dry run to confirm license regeneration) → Licenses page ships.
4. Add US3 → validate independently → Costs page ships.
5. Polish (Phase 6) once all three are in.

### Parallel Team Strategy

After Foundational is done: one developer takes US1 (MVP path), and once US1's `screens/AboutScreen.js` exists, two more developers can take US2 and US3 concurrently — coordinating only on the two shared-file edits (`AboutScreen.js`, `prerelease.fish`) called out above.
