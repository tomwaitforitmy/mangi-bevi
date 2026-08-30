# Feature Specification: Expo Router Migration

**Feature Branch**: `001-expo-router-migration`

**Created**: 2026-08-29

**Status**: Draft

**Input**: User description: "Migrate app navigation from React Navigation (imperative, single-file `navigation/MyNavigationContainer.js`) to Expo Router (file-based routing under `app/`)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Every existing flow keeps working (Priority: P1)

As an existing user, I can navigate the app after the migration exactly the way I could before: bottom tabs (Meals, Dev [dev builds only], Filters, Profile, New), meal detail → edit → images → add tag → links → report, profile → your Mangis / account / friends / settings, and the logged-out flow (browse → login/sign-up/password-reset), with the same headers, back buttons, and edit/logout icons appearing exactly when they do today.

**Why this priority**: This is a pure infrastructure migration — any regression is a regression for every user of the app. Nothing else matters if this breaks.

**Independent Test**: Walk every route listed in the Functional Requirements below, on both authenticated and logged-out state, and confirm the destination screen, header title, header-left/header-right icons, and back-navigation match current behavior.

**Acceptance Scenarios**:

1. **Given** the user is authenticated, **When** they open the app, **Then** they land on the Meals tab, and can reach every screen currently reachable via `MealsStackContainer`, `FiltersStackContainer`, `ProfileStackContainer`, and `NewMealStackContainer`.
2. **Given** the user is not authenticated, **When** they open the app, **Then** they land on the logged-out Meals list and can reach Login, Sign Up, and Password Reset, but not any authenticated-only screen.
3. **Given** the user is viewing a meal they (or a friend) authored, **When** they open the meal detail or images screen, **Then** the edit icon appears in the header and navigates to the edit screen with the correct `mealId`.
4. **Given** the user is viewing a meal they have no edit permission for, **When** they open the meal detail or images screen, **Then** no edit icon is shown (current `HasEditPermission`/`showEditIcon` behavior).
5. **Given** `EXPO_PUBLIC_DEBUG_MODE` is set, **When** the app starts, **Then** it shows only the Debug screen and nothing else is reachable (current root-level `DEBUG_MODE` branch).

---

### User Story 2 - Meals are deep-linkable (Priority: P2)

As a user, I can open a link (from a push notification, a shared link, or typed into the device) that takes me directly to a specific meal's detail screen, instead of always landing on the tab root.

**Why this priority**: This is the concrete capability Expo Router adds over the current setup (file-based routes get URL-based deep linking for free); it directly benefits the existing push-notification flows in `notifications/`.

**Independent Test**: Construct a deep link to a meal detail route and confirm it opens the app directly on that meal's detail screen (authenticated) or the not-authenticated equivalent (logged out), rather than requiring manual navigation.

**Acceptance Scenarios**:

1. **Given** the app is closed, **When** the user opens a deep link to a specific meal, **Then** the app launches directly into that meal's detail screen (or the logged-out detail screen if not authenticated).
2. **Given** the app is already running in the background, **When** the user opens a deep link to a specific meal, **Then** the app foregrounds and navigates to that meal's detail screen.

---

### User Story 3 - Adding a screen no longer touches a shared file (Priority: P3)

As the developer, I can add a new screen to any stack by adding one file under `app/`, without editing `navigation/MyNavigationContainer.js` (currently a single 440-line file every screen addition/header change touches, and the source of the two `EditMangiIcon`/`LogoutIcon` "called as a function instead of JSX" bugs fixed earlier).

**Why this priority**: Developer-experience/maintainability win — real but lower priority than not breaking the app or gaining deep links.

**Independent Test**: Add a throwaway screen as a single new file under `app/` and confirm it's reachable without any change outside that file.

**Acceptance Scenarios**:

1. **Given** a new file is added under the appropriate `app/` subdirectory, **When** the app reloads, **Then** the new route is reachable without editing any other file.

---

### Edge Cases

- Auth-state flips (login/logout) mid-session: the root layout must switch between the authenticated tab group and the logged-out stack the same way `isAuthenticated` does today (via `onAuthStateChanged`), including redirecting away from now-inaccessible screens.
- Splash screen must stay visible until both the credential-based auto-login attempt (`LoadCredentials`/`authActions.login`) and the router are ready — matching today's `appIsReady` gate — to avoid a flash of the wrong root.
- `EXPO_PUBLIC_DEV_MODE`-gated Dev tab must remain absent from the tab bar (not just hidden/disabled) when the flag is off, exactly as `{DEV_MODE && <Tab.Screen .../>}` does today.
- A deep link to an authenticated-only route (e.g. edit screen) while logged out must redirect to login rather than crash or render a broken screen.
- Screens that read `route.params` today (`mealId`, `mealTitle`, `currentTabViewed`) must receive equivalent typed params via Expo Router's `useLocalSearchParams`.
- Per-route header customization (title, `headerLeft`/`headerRight`, `gestureEnabled: false` on the edit screen, hidden headers on tab roots) must be preservable per-route, not just globally.
- Android hardware back button and iOS swipe-back gesture behavior must remain unchanged for every stack.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST preserve every current route as an equivalent Expo Router route: the 5 tabs (Meals, Dev [dev-mode only], Filters, Profile, New) and, within them, Meals→{Details, Edit, Images, AddTag, EditLinks, SendReport}, Profile→{UserMeals, ManageAccount, EditFriends, Settings}, plus the logged-out stack {Meals, Details, Images, Login, SignUp, PasswordReset} and the standalone Debug screen.
- **FR-002**: The app MUST gate the authenticated tab group vs. the logged-out stack on Firebase auth state (`onAuthStateChanged`), matching current behavior, using Expo Router's route-protection mechanism rather than a top-level conditional render.
- **FR-003**: The app MUST keep the `EXPO_PUBLIC_DEBUG_MODE` root override (Debug screen only, nothing else reachable) and the `EXPO_PUBLIC_DEV_MODE` conditional Dev tab.
- **FR-004**: The app MUST reproduce all current per-route header customizations: static/dynamic titles (e.g. meal title from params), the global back button, the conditional edit icon (`HasEditPermission`-gated), the logout icon, the save icon (New/AddTag screens), and `gestureEnabled: false` on the edit screen.
- **FR-005**: The app MUST pass equivalent typed route params to each screen currently reading `route.params` (`mealId`, `mealTitle`, `currentTabViewed`) — no screen component's data-fetching logic should need to change.
- **FR-006**: The app MUST support deep linking into at minimum the meal detail route (authenticated and not-authenticated variants), resolving to the correct screen with the correct `mealId` whether the app is cold-started or resumed from background.
- **FR-007**: The app MUST keep the splash screen visible until both the credential auto-login attempt and router readiness are resolved, with no flash of an intermediate/wrong screen.
- **FR-008**: The migration MUST NOT require rewriting screen components' internal logic (data fetching, Redux usage, business logic) — only how they receive navigation/params and how they're registered as routes.
- **FR-009**: Existing unit/component tests (`tests/unit-tests/`, `tests/component-tests/`) MUST continue to pass without modification, except where they directly exercise navigation wiring being replaced.

### Key Entities

- **Route**: A screen + its static config (title, header icons, gesture behavior) + the params it expects, currently defined as a `<Stack.Screen>`/`<Tab.Screen>` entry in `navigation/MyNavigationContainer.js`, to become one file under `app/`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every route reachable today is reachable after migration, verified by manually walking all flows listed in FR-001 with zero navigation-related crashes or dead ends.
- **SC-002**: A shared/deep link to a meal opens that meal's detail screen directly, both cold-start and warm-start, without manual navigation.
- **SC-003**: Adding a new screen to an existing stack requires touching exactly one new file, not the former shared navigation config file.
- **SC-004**: App cold-start time to first interactive screen does not regress by more than 5% versus pre-migration.
- **SC-005**: The full existing Jest suite (`npm test`) passes with the same or higher pass count as before migration.

## Assumptions

- Expo Router is compatible with the currently installed Expo SDK 57 / React Native 0.86.3 / React Navigation 7 stack (Expo Router builds on React Navigation under the hood, it does not replace it) — confirming the exact `expo-router` version to install is a `/speckit-plan` concern, not a spec concern.
- Screen components under `screens/` are reused as-is and only *relocated/wrapped* under `app/`; deep internal rewrites are out of scope for this migration.
- Deep-link URL scheme/domain (custom scheme vs. universal links) is a technical decision deferred to `/speckit-plan`; this spec only requires that *some* working deep-link mechanism exists for meal detail.
- Out of scope: visual/design changes, changing which screens exist, web-specific routing behavior, changing Redux state shape.
- Out of scope: migrating `notifications/` push-notification *sending* logic — only that its existing deep-link targets keep resolving correctly after the routing change.
- Out of scope: iOS 26 Liquid Glass tab bar (`expo-router/unstable-native-tabs`). Confirmed alpha as of SDK 57 ("API subject to change" per Expo docs) — deliberately not coupled to this migration so an unstable API can't put the P1 no-regression requirement at risk. `(app)/_layout.js` uses the stable `Tabs` API here; swapping to `NativeTabs` later is isolated to that one file, so nothing here needs rework. Tracked as a follow-up feature.
- Out of scope: dark mode. Unrelated to routing; deferred as a separate feature (constitution Principle VI, minimal footprint).
