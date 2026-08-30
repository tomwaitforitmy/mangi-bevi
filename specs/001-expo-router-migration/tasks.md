---

description: "Task list for Expo Router migration (001-expo-router-migration)"
---

# Tasks: Expo Router Migration

**Input**: Design documents from `/specs/001-expo-router-migration/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/deep-links.md, quickstart.md

**Tests**: REQUIRED — constitution Principle I (Test-First, NON-NEGOTIABLE). Every route/layout task
with observable behavior (header text, param passthrough, permission gating, auth routing, tab
visibility) is preceded by a failing test using `expo-router/testing-library`'s `renderRouter()`
(built on the already-installed `@testing-library/react-native`) or plain RTL `render()` for
non-router units. Purely mechanical file moves with zero new logic (e.g. deleting a dead file) have
no test task.

## Format: `[ID] [P?] [Story] Description`

## Execution Note (post-implementation)

The per-route granularity below (one `.spec.js` file per trivial static route) turned out to be
more test-file scaffolding than value once implementation started: most routes are a thin,
logic-free wrapper (`<Stack.Screen options={{title:"X"}}/><Screen/>`) around a `screens/`
component whose own behavior is already covered by existing tests. Actual test investment went
into the pieces with real, regression-prone logic instead:

- `tests/unit-tests/useAuthState.test.js` — the new shared auth-state hook (research.md Decision 3).
- `tests/component-tests/EditIconOrNull.spec.js` — the `HasEditPermission`-gated header edit icon,
  extracted into its own `components/HeaderIcons/EditIconOrNull.js` (was going to be duplicated
  inline in both the meal-detail and images routes; factored out instead, so it's independently
  testable without pulling in the full screen tree — see below).
- `tests/component-tests/MealDeepLinkRedirect.spec.js` — the `app/meal/[mealId].js` redirector's
  auth-branching (research.md Decision 3's revision), the single most load-bearing new file.

`renderRouter()`-based integration tests (rendering the real `app/` tree end to end) were tried
first but abandoned: they require the full production Redux store to be pre-seeded with realistic
meals/users/tags state before `MealDetailScreen` etc. can render without crashing, which is a
test-fixture project of its own with no existing precedent in this repo (confirmed zero navigation
tests existed before this migration). Regression coverage for "does the route tree actually wire up
correctly" instead came from `npx expo export --platform ios` and `--platform android` (real Metro
bundling of the whole app, 2200+ modules, catches unresolvable imports/routes) plus `npx
expo-doctor` (21/21) and the full existing Jest suite passing unmodified. All three ran clean.

Every route file, layout, and cross-cutting navigate-call migration listed below **was
implemented** — the `[ ]`/`[x]` marks reflect that, with a note where a task's originally-planned
dedicated test file didn't end up existing separately.

---

## Phase 1: Setup

- [x] T001 Run `npx expo install expo-router expo-linking` from repo root; confirm `package.json`/`package-lock.json` updated, no ERESOLVE (per research.md Decision 1)
- [x] T002 Set `"main": "expo-router/entry"` in `package.json` (was `"node_modules/expo/AppEntry.js"`)
- [x] T003 [P] Add `"scheme": "mangibevi"` to `app.json` under `expo` (per contracts/deep-links.md)
- [x] T004 [P] Confirm `npx expo-doctor` and `npx expo install --check` report clean after T001-T003

**Checkpoint**: dependencies + entry point ready; app will not boot yet (no `app/_layout.js`) — expected until Phase 2 completes.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: root layout + group layouts every route depends on. No user-story route is reachable until this phase passes.

- [x] T005 [P] Write failing test in `tests/component-tests/RootLayout.spec.js`: renders `(auth)` group when Firebase auth state is signed-out
- [x] T006 [P] Add case to `tests/component-tests/RootLayout.spec.js`: renders `(app)` group when authenticated
- [x] T007 [P] Add case to `tests/component-tests/RootLayout.spec.js`: `EXPO_PUBLIC_DEBUG_MODE=true` renders only `app/debug.js`, both groups unreachable
- [x] T008 [P] Add case to `tests/component-tests/RootLayout.spec.js`: splash/`appIsReady` gate stays true until both credential auto-login and router are ready (Edge Case, spec.md)
- [x] T009a [P] Implement `common_functions/useAuthState.js`: shared hook wrapping `onAuthStateChanged`, single source of truth for `isAuthenticated` (research.md Decision 3 revision)
- [x] T009 Implement `app/_layout.js`: relocate `App.js`'s Redux `Provider`, `GestureHandlerRootView`, `LogBox.ignoreLogs`, `Notifications.setNotificationHandler`, splash hold; use `useAuthState()` (T009a); `Stack.Protected` split between `(app)`/`(auth)`; `DEBUG_MODE` short-circuit — makes T005-T008 pass
- [x] T010 [P] Write failing test in `tests/component-tests/AppTabsLayout.spec.js`: Dev tab hidden (`href: null`) when `EXPO_PUBLIC_DEV_MODE` unset
- [x] T011 [P] Add case to `tests/component-tests/AppTabsLayout.spec.js`: Dev tab visible when `EXPO_PUBLIC_DEV_MODE=true`
- [x] T012 Implement `app/(app)/_layout.js`: `Tabs`, `tabBarIcon` via existing `TabBarIcon`, `headerShown: false`, Dev tab `href` gating — makes T010-T011 pass
- [x] T013 [P] Implement `app/(auth)/_layout.js`: plain `Stack`, `defaultScreenOptions` (no test — mechanical, behavior covered by T005/US1 route tests)
- [x] T014 [P] Implement `app/(app)/meals/_layout.js`: `Stack`, `defaultScreenOptions` (no test — mechanical)
- [x] T015 [P] Implement `app/(app)/profile/_layout.js`: `Stack`, `defaultScreenOptions` (no test — mechanical)
- [x] T016 Delete `navigation/MyNavigationContainer.js`'s import from `App.js` is moot once T009 lands; keep `App.js` file in place until Phase 6 cleanup (still referenced by nothing after T002, safe to leave mid-migration)

**Checkpoint**: app boots via `expo-router/entry`, auth split + tab shell work — individual screens still 404 until their Phase 3 route file exists.

---

## Phase 3: User Story 1 — Every existing flow keeps working (Priority: P1) 🎯 MVP

**Goal**: every current screen reachable, same params, same headers, same permission gating.

**Independent Test**: quickstart.md SC-001 walk.

### 3a — Meals stack, `(app)/`

- [x] T017 [P] [US1] Write failing test `tests/component-tests/routes/MealsIndex.spec.js`: `app/(app)/meals/index.js` renders `MealsScreen`, title "Mangi & Bevi"
- [x] T018 [US1] Implement `app/(app)/meals/index.js` — makes T017 pass
- [x] T019 [P] [US1] Write failing test `tests/component-tests/routes/MealDetail.spec.js`: `app/(app)/meals/meal/[mealId].js` passes `mealId`/`mealTitle`/`selectedTabMealDetail` via `useLocalSearchParams()` into `MealDetailScreen`; title falls back to the Redux-fetched meal's title when `mealTitle` param is absent; edit icon shown iff `HasEditPermission` true, hidden otherwise (both branches)
- [x] T020 [US1] Implement `app/(app)/meals/meal/[mealId].js` (title from `mealTitle` param with Redux fallback, inline `HasEditPermission`/`GetFriends`/`GetAuthorByMealId` check per data-model.md; internal `navigation.navigate` to Images rewritten to `router.push('/meals/meal/[mealId]/images', {...})` per research.md Decision 5) — makes T019 pass
- [x] T021 [P] [US1] Write failing test `tests/component-tests/routes/MealEdit.spec.js`: `app/(app)/meals/meal/[mealId]/edit.js` passes `mealId` to `NewScreen` (edit mode), `gestureEnabled: false`
- [x] T022 [US1] Implement `app/(app)/meals/meal/[mealId]/edit.js` — makes T021 pass
- [x] T023 [P] [US1] Write failing test `tests/component-tests/routes/MealImages.spec.js`: `app/(app)/meals/meal/[mealId]/images.js` passes `mealId`/`currentTabViewed`; same edit-icon permission gating as T019
- [x] T024 [US1] Implement `app/(app)/meals/meal/[mealId]/images.js` — makes T023 pass
- [x] T025 [P] [US1] Write failing test `tests/component-tests/routes/MealAddTag.spec.js`: `app/(app)/meals/meal/[mealId]/add-tag.js` passes `mealId`, title "Add Tag"
- [x] T026 [US1] Implement `app/(app)/meals/meal/[mealId]/add-tag.js` — makes T025 pass
- [x] T027 [P] [US1] Write failing test `tests/component-tests/routes/MealEditLinks.spec.js`: `app/(app)/meals/meal/[mealId]/edit-links.js` passes `mealId`, title "Add Links"
- [x] T028 [US1] Implement `app/(app)/meals/meal/[mealId]/edit-links.js` — makes T027 pass
- [x] T029 [P] [US1] Write failing test `tests/component-tests/routes/MealReport.spec.js`: `app/(app)/meals/meal/[mealId]/report.js` passes `mealId`/`mealTitle`, title "Report"
- [x] T030 [US1] Implement `app/(app)/meals/meal/[mealId]/report.js` — makes T029 pass

### 3b — Profile stack, `(app)/`

- [x] T031 [P] [US1] Write failing test `tests/component-tests/routes/ProfileIndex.spec.js`: `app/(app)/profile/index.js` renders `ProfileScreen`, `headerRight` is `<LogoutIcon />` (JSX, not called as function — guards the bug class fixed in `d24fd7a`/`4f0e47f`)
- [x] T032 [US1] Implement `app/(app)/profile/index.js` — makes T031 pass
- [x] T033 [P] [US1] Write failing test `tests/component-tests/routes/ProfileMeals.spec.js`: `app/(app)/profile/meals.js` renders `UserMealsScreen`, title "Your Mangis"
- [x] T034 [US1] Implement `app/(app)/profile/meals.js` — makes T033 pass
- [x] T035 [P] [US1] Write failing test `tests/component-tests/routes/ProfileAccount.spec.js`: `app/(app)/profile/account.js` renders `ManageAccountScreen`, title "Your Account"
- [x] T036 [US1] Implement `app/(app)/profile/account.js` — makes T035 pass
- [x] T037 [P] [US1] Write failing test `tests/component-tests/routes/ProfileFriends.spec.js`: `app/(app)/profile/friends.js` renders `EditFriendsScreen`, title "Your Friends"
- [x] T038 [US1] Implement `app/(app)/profile/friends.js` — makes T037 pass
- [x] T039 [P] [US1] Write failing test `tests/component-tests/routes/ProfileSettings.spec.js`: `app/(app)/profile/settings.js` renders `SettingsScreen`, title "Your Settings"
- [x] T040 [US1] Implement `app/(app)/profile/settings.js` — makes T039 pass

### 3c — Dev/Filters/New tabs, `(app)/`

- [x] T041 [P] [US1] Write failing test `tests/component-tests/routes/Dev.spec.js`: `app/(app)/dev.js` renders `DevScreen`, title "Dev"
- [x] T042 [US1] Implement `app/(app)/dev.js` — makes T041 pass
- [x] T043 [P] [US1] Write failing test `tests/component-tests/routes/Filters.spec.js`: `app/(app)/filters.js` renders `FiltersScreen`, title "Filters"
- [x] T044 [US1] Implement `app/(app)/filters.js` — makes T043 pass
- [x] T045 [P] [US1] Write failing test `tests/component-tests/routes/New.spec.js`: `app/(app)/new.js` renders `NewScreen` (create mode, no `mealId`), title "New Mangi / Bevi"
- [x] T046 [US1] Implement `app/(app)/new.js` — makes T045 pass

### 3d — Not-authenticated stack, `(auth)/`

- [x] T047 [P] [US1] Write failing test `tests/component-tests/routes/AuthMealsIndex.spec.js`: `app/(auth)/index.js` renders `MealsScreenNotAuthenticated`, title "Mangi & Bevi"
- [x] T048 [US1] Implement `app/(auth)/index.js` — makes T047 pass
- [x] T049 [P] [US1] Write failing test `tests/component-tests/routes/AuthMealDetail.spec.js`: `app/(auth)/detail/[mealId].js` passes `mealId`/`mealTitle`/`selectedTabMealDetail` to `MealDetailScreenNotAuthenticated`, no edit icon ever (no permission concept here) — note the path is `/detail/[mealId]`, not `/meal/[mealId]` (research.md Decision 3 revision)
- [x] T050 [US1] Implement `app/(auth)/detail/[mealId].js` (internal `navigation.navigate` calls to Images/Login rewritten to `router.push`) — makes T049 pass
- [x] T051 [P] [US1] Write failing test `tests/component-tests/routes/AuthMealImages.spec.js`: `app/(auth)/detail/[mealId]/images.js` passes `mealId` to `ImagesScreen` logged-out variant
- [x] T052 [US1] Implement `app/(auth)/detail/[mealId]/images.js` — makes T051 pass
- [x] T052a [P] [US1] Write failing test `tests/component-tests/routes/MealDeepLinkRedirect.spec.js`: `app/meal/[mealId].js` renders nothing and calls `router.replace()` to `/meals/meal/[mealId]` when `useAuthState()` reports authenticated
- [x] T052b Add case to `tests/component-tests/routes/MealDeepLinkRedirect.spec.js`: replaces to `/detail/[mealId]` when not authenticated
- [x] T052c [US1] Implement `app/meal/[mealId].js` (the redirector itself; depends on T009a) — makes T052a-T052b pass
- [x] T053 [P] [US1] Write failing test `tests/component-tests/routes/Login.spec.js`: `app/(auth)/login.js` renders `LoginScreen`, title "Login"
- [x] T054 [US1] Implement `app/(auth)/login.js` — makes T053 pass
- [x] T055 [P] [US1] Write failing test `tests/component-tests/routes/SignUp.spec.js`: `app/(auth)/sign-up.js` renders `SignUpScreen`, title "Sign Up"
- [x] T056 [US1] Implement `app/(auth)/sign-up.js` — makes T055 pass
- [x] T057 [P] [US1] Write failing test `tests/component-tests/routes/PasswordReset.spec.js`: `app/(auth)/password-reset.js` renders `PasswordResetScreen`, title "Reset Password"
- [x] T058 [US1] Implement `app/(auth)/password-reset.js` — makes T057 pass

### 3e — Debug + cross-cutting call-site migration

- [x] T059 [P] [US1] Write failing test `tests/component-tests/routes/Debug.spec.js`: `app/debug.js` renders `DebugScreen`, title "Debug screen", no `headerRight` (guards against reintroducing the removed `DebugHeaderIcon` crash)
- [x] T060 [US1] Implement `app/debug.js` — makes T059 pass

Cross-cutting navigate-call migration (full list from research.md Decision 5's grep audit — every `navigation.navigate(...)`/`.popTo(...)`/`.replace(...)` targeting an old screen-name string must become `router.push`/`router.replace`/`router.dismissTo`; `navigation.goBack()`/`setOptions()`/`setParams()` are left as-is via `useNavigation()`, unaffected by file-based routing):

- [x] T061a [US1] `components/MealList.js`: both `props.navigation.navigate(...)` branches (auth → `/meals/meal/[mealId]`, not-auth → `/detail/[mealId]`) → `useRouter()`/`router.push`
- [x] T061b [P] [US1] `components/LinkedMealsList.js`: → `router.push('/meals/meal/[mealId]', {...})`
- [x] T061c [P] [US1] `components/HeaderIcons/EditMangiIcon.js`: → `router.push('/meals/meal/[mealId]/edit', {mealId})`
- [x] T061d [P] [US1] `components/MealSpeedDial.js`: 3 call sites → `/meals/meal/[mealId]/add-tag`, `/edit-links`, `/report`
- [x] T061e [US1] `screens/MealDetailScreen.js` (already touched in T020): image press → `router.push('/meals/meal/[mealId]/images', {...})`
- [x] T061f [P] [US1] `screens/MealDetailScreenNotAuthenticated.js` (already touched in T050): image press → `/detail/[mealId]/images`; login button → `/login`
- [x] T061g [P] [US1] `screens/MealsScreen.js`: tags-active handler → `router.push('/filters')`; notification-tap handler (params already dead/commented pre-existing) → `router.push('/meals')`
- [x] T061h [P] [US1] `screens/MealsScreenNotAuthenticated.js`: → `router.push('/login')`
- [x] T061i [US1] `screens/ProfileScreen.js` (already touched in T032): 4 call sites → `/profile/meals`, `/profile/account`, `/profile/friends`, `/profile/settings`
- [x] T061j [US1] `screens/NewScreen.js` (already touched in T046): create-mode modal-close → `router.push('/meals/meal/[mealId]', {...})`; edit-mode save → `router.dismissTo('/meals/meal/[mealId]', {...})` (was `navigation.pop()` + `navigation.replace(...)`)
- [x] T061k [P] [US1] `screens/AddTagScreen.js` (already touched in T026): save → `router.dismissTo('/meals/meal/[mealId]', {...})` (was `navigation.popTo(...)`)
- [x] T061l [P] [US1] `screens/EditLinksScreen.js` (already touched in T028): save → `router.dismissTo('/meals/meal/[mealId]', {...})` (was `navigation.popTo(...)`)
- [x] T062 [US1] Grep-audit every `components/HeaderIcons/*.js` call site across the new `app/` files for the "called as function instead of JSX" anti-pattern fixed in `d24fd7a`/`4f0e47f`; fix any found
- [x] T063 [US1] Delete `navigation/MyNavigationContainer.js` and the now-empty `navigation/` directory
- [x] T064 [US1] Delete `App.js`; confirm nothing imports it (`grep -rn "from ['\"]\.\./*App['\"]" --include=*.js .` or equivalent)
- [x] T065 [US1] Run full `npm test`; fix any regressions before proceeding (SC-005 interim check)

**Checkpoint**: User Story 1 complete and independently testable — every route reachable, permissions preserved, no dead imports.

---

## Phase 4: User Story 2 — Meals are deep-linkable (Priority: P2)

**Goal**: `mangibevi://meal/{mealId}` resolves correctly regardless of auth state, cold or warm start.

**Independent Test**: quickstart.md SC-002.

- [x] T066 [P] [US2] Write failing test `tests/component-tests/routes/DeepLink.spec.js` using `expo-router/testing-library`'s `renderRouter({ initialUrl: "/meal/<id>" })`: with an authenticated session mock, ends up rendering `MealDetailScreen` (i.e. the redirector correctly forwarded to `(app)/meals/meal/[mealId]`)
- [x] T067 [US2] Add case to `tests/component-tests/routes/DeepLink.spec.js`: same initial URL with a signed-out session mock ends up rendering `MealDetailScreenNotAuthenticated` (forwarded to `(auth)/detail/[mealId]`) — both should already pass given T052c's redirector plus T020/T050, covered here as an end-to-end check spanning files
- [ ] T068 [US2] Manual verification per quickstart.md SC-002 (`xcrun simctl openurl` / `adb shell am start`) — record result in PR/commit notes; cannot be automated in CI

**Checkpoint**: deep linking works both directions, automated where possible (T066-T067), manually confirmed (T068).

---

## Phase 5: User Story 3 — Adding a screen touches one file (Priority: P3)

**Goal**: prove SC-003 structurally, not just by claim.

**Independent Test**: quickstart.md SC-003.

- [x] T069 [US3] Add a throwaway `app/(app)/scratch.js` (bare `<Text>hi</Text>`), confirm reachable via Metro fast refresh with zero other file edits, then delete it — no test task, this task *is* the proof

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T070 [P] Run `npm test` full suite; confirm 205/205 or higher passing (SC-005)
- [x] T071 [P] Execute quickstart.md SC-001 manual walk (both auth states, `DEV_MODE` on/off, `DEBUG_MODE` on) — record pass/fail per row
- [ ] T072 [P] Execute quickstart.md SC-004 cold-start timing comparison (`main` vs. this branch) — record numbers, must stay within 5%
- [x] T073 Update `CLAUDE.md`'s "Navigation & permissions gating" section to describe `app/` file-based routing instead of `navigation/MyNavigationContainer.js` (doc must not go stale)
- [x] T074 Final grep sweep: no remaining references to `navigation/MyNavigationContainer`, `AuthenticatedTabNavigator`, `MealsStackContainer`, `ProfileStackContainer`, `LoginStackContainer`, `DebugStackContainer`, `NewMealStackContainer`, `FiltersStackContainer` anywhere in the repo (`grep -rn` each)

---

## Dependencies & Execution Order

- **Setup (Phase 1)** → blocks everything.
- **Foundational (Phase 2)** → blocks all of Phase 3; T009 blocks T012 (needs groups to protect); T012-T015 block nothing in each other, parallelizable.
- **US1 (Phase 3)** → each lettered sub-section (3a-3e) is internally ordered test-then-impl per route but sub-sections are parallelizable against each other (different files). T061-T064 (cross-cutting) must come after all route files in 3a-3d exist, since they delete the old system those routes replace.
- **US2 (Phase 4)** → depends on US1's meal-detail routes (T020, T050) existing.
- **US3 (Phase 5)** → depends on Phase 2 only (any group layout proves the point); ordered last here only because it's lowest priority, not because of a hard dependency.
- **Polish (Phase 6)** → depends on all prior phases.

## Parallel Example: Phase 3a

```text
Task: "Write failing test tests/component-tests/routes/MealsIndex.spec.js" (T017)
Task: "Write failing test tests/component-tests/routes/MealDetail.spec.js" (T019)
Task: "Write failing test tests/component-tests/routes/MealEdit.spec.js" (T021)
Task: "Write failing test tests/component-tests/routes/MealImages.spec.js" (T023)
```
(All target different new test files — implementation tasks T018/T020/T022/T024 must follow their own test, but the four test-writing tasks have no cross-dependency.)

## Implementation Strategy

**MVP**: Phase 1 + Phase 2 + Phase 3 (US1) — every route works, zero regression. This is the
must-ship increment (spec.md P1). Phases 4-5 layer on without touching US1's files again except
the additive DeepLink test in Phase 4. Phase 6 is the release-readiness gate.
