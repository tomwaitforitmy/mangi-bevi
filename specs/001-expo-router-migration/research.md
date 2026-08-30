# Phase 0 Research: Expo Router Migration

## Decision 1: Packages & entry point

**Decision**: Add `expo-router` and `expo-linking` via `npx expo install` (resolves the SDK-57-compatible versions automatically, no version pinned by hand). Everything else Expo Router needs (`react-native-safe-area-context`, `react-native-screens`, `expo-constants`, `expo-status-bar`, `react-native-gesture-handler`) is **already installed** at compatible versions — confirmed by reading `package.json` directly, not assumed. `babel.config.js` already uses `babel-preset-expo` — no change needed there. Change `package.json`'s `"main"` from `"node_modules/expo/AppEntry.js"` to `"expo-router/entry"`.

**Rationale**: Matches Expo's own "add to existing app" install path; minimizes new dependencies to exactly the two the repo doesn't already have.

**Alternatives considered**: Pinning an exact `expo-router` version by hand — rejected, `npx expo install` is the project's existing convention (see `npm run` scripts) for SDK-compatible versions and avoids drift.

## Decision 2: Where App.js's global setup goes

**Decision**: `expo-router/entry` becomes the real entry point, so `App.js` is no longer mounted. Everything currently in `App.js` — the Redux `store`/`<Provider>`, `<GestureHandlerRootView>`, `LogBox.ignoreLogs([...])`, `Notifications.setNotificationHandler(...)` — moves into `app/_layout.js`, which becomes the new top of the component tree. `App.js` is deleted once nothing references it.

**Rationale**: This is a hard requirement of adopting Expo Router, not a style choice — confirmed against Expo's own installation docs (root layout replaces the custom entry component).

**Alternatives considered**: Keeping a custom entry that renders `<App>` wrapping `ExpoRoot` — possible but fights the framework and isn't how Expo documents/supports the integration; rejected as unnecessary complexity for no benefit (constitution Principle VI).

## Decision 3: Auth gating — two parallel route groups, not one guarded tree

**Decision**: Root layout defines two top-level route groups: `(app)/` (authenticated, wraps a `Tabs` navigator) and `(auth)/` (not authenticated, plain `Stack`, no tab bar), switched with `Stack.Protected guard={...}` on Firebase's `onAuthStateChanged` state — directly replacing today's `{!isAuthenticated && <LoginStackContainer/>} {isAuthenticated && <AuthenticatedTabNavigator/>}` conditional render. `EXPO_PUBLIC_DEBUG_MODE` keeps its current highest-priority override (rendered before the auth check, matching today's `if (DEBUG_MODE) return <DebugStackContainer/>` short-circuit).

Critically: the app's current logged-out experience isn't a locked door, it's a **second, real implementation** of meals-browsing (`MealsScreenNotAuthenticated`, `MealDetailScreenNotAuthenticated` are separate components, not a login wall) — mirrored as `(auth)/index.js` + `(auth)/detail/[mealId].js` alongside `(app)/meals/index.js` + `(app)/meals/meal/[mealId].js`.

**Revised sub-decision (superseding the original "same relative path" idea)**: the two groups' meal-detail routes do **not** share a URL. Expo's own docs on Shared Routes explicitly warn against this exact shape — *"Do not use shared routes to give different user roles a different version of a screen. The URL does not carry the user's role, so a cold link cannot select the correct group, and protected routes do not change that."* Even though our guards are mutually exclusive (never both mounted) and gated behind the existing splash/`appIsReady` hold, the router's static route table is still built from the file tree, not from runtime auth state, so relying on `Stack.Protected` to disambiguate an identical path across two groups is exactly the anti-pattern being warned about — not worth the risk on a P1 no-regression migration. Instead:
- `(app)`'s meal detail stays nested under its tab's own stack: `/meals/meal/[mealId]` (unique, no collision).
- `(auth)`'s meal detail moves to `/detail/[mealId]` (renamed from the original `/meal/[mealId]` idea, unique, no collision).
- A **third, unconditional route** `app/meal/[mealId].js` — outside both groups, always present in the tree, so there is exactly one static match for `/meal/[mealId]` — is the sole owner of the public deep-link URL from contracts/deep-links.md. It reads current auth state (via a small shared `useAuthState()` hook, see below) and immediately `router.replace()`s to whichever internal path is correct, forwarding `mealId`/`mealTitle`. In-app navigation (pressing a meal in a list, etc.) never goes through this redirector — each call site already knows its own auth context and pushes directly to the correct internal path, exactly matching today's behavior of choosing `MealsStackContainer` vs `LoginStackContainer`'s screen based on `props.isAuthenticated`.
- `isAuthenticated` becomes a small shared hook, `common_functions/useAuthState.js` (wraps `onAuthStateChanged`), used by both `app/_layout.js` (for the `Stack.Protected` guard) and `app/meal/[mealId].js` (for the redirect target) — there was previously no single reusable source for this (it lived only as local state inside `MyNavigationContainer`).

**Rationale**: Preserves the actual current behavior (browsing meals requires no account) instead of naively applying Expo's tutorial pattern, where "protected" routes redirect straight to login — that would be a regression here, not a migration. The revised sub-decision follows Expo's own written guidance instead of a plausible-but-unverified assumption about `Stack.Protected` timing, trading one small extra file for certainty on a P1 requirement.

**Alternatives considered**: A single route tree with per-screen `Stack.Protected` guards and a login redirect — rejected, it changes real behavior (logged-out users can view meals today; a login-redirect pattern would break that). The original identical-path-in-both-groups idea — rejected per the revision above, once Expo's shared-routes docs were checked directly rather than assumed compatible.

## Decision 4: DEV_MODE tab

**Decision**: The Dev tab route file always exists (`(app)/dev.js`), but `(app)/_layout.js` passes `options={{ href: DEV_MODE ? undefined : null }}` on its `Tabs.Screen`, hiding it from the tab bar when off — same visual result as today's `{DEV_MODE && <Tab.Screen .../>}`.

**Rationale**: `href: null` is Expo Router's documented mechanism for "route exists, not shown as a tab."

**Alternatives considered**: Conditionally rendering the `<Tabs.Screen>` element (closer to current code) — works too, but `href: null` is idiomatic for the file-based model and avoids conditional JSX inside the layout. Either is acceptable; picked `href: null` since it's the pattern the framework's own docs lead with.

## Decision 5: Params and navigation calls

**Decision**: Screens currently reading `route.params.X` (see Decision 5 note below) switch to `useLocalSearchParams()`; calls to `navigation.navigate(...)` (e.g. `EditMangiIcon`'s `onHeaderIconPress`) switch to `useRouter()` + `router.push({ pathname, params })`. Per-route header customization (dynamic title, `headerRight`/`headerLeft`, `gestureEnabled: false`) moves from the centralized `options={({route}) => ({...})}` callbacks in `MyNavigationContainer.js` into a `<Stack.Screen options={{...}} />` element rendered inside each route file itself, reading params via the same `useLocalSearchParams()` call.

Screens confirmed (by grep, not assumption) to read `route.params`: `MealDetailScreen` (`mealId`, `selectedTabMealDetail`), `MealDetailScreenNotAuthenticated` (`mealId`, `selectedTabMealDetail`), `ImagesScreen` (`mealId`), `NewScreen` (`mealId`, optional), `AddTagScreen` (`mealId`), `EditLinksScreen` (`mealId`), `SendReportScreen` (`mealId`, `mealTitle`).

**Correction found during implementation-level research (not caught by the plan-phase grep, which only searched for `route.params` reads)**: Expo Router confirms screen components **never** receive `{ navigation, route }` as props — *"React Navigation v6 and lower will pass the props `{ navigation, route }` to every screen... we never introduced it to the Expo Router."* This is a materially bigger surface than Decision 5 originally scoped. A full grep for `.navigate(` across `screens/` and `components/` (excluding the old `navigation/` dir) found **10 files / 15 call sites**, all using the old nested `navigation.navigate(TAB_NAME, { screen: STACK_NAME, params })` or bare `navigation.navigate(STACK_NAME)` form, which cannot resolve under file-based routing (those screen-name strings no longer exist in any route table) — every one of these must become `router.push({ pathname, params })` (or `router.replace(...)`/`router.dismissTo(...)`/`router.back()` per the specific case):

| File | Call site(s) | New target |
|---|---|---|
| `components/MealList.js` | 2 (auth + not-auth branch) | `/meals/meal/[mealId]` or `/detail/[mealId]` |
| `components/LinkedMealsList.js` | 1 | `/meals/meal/[mealId]` (authenticated-only component) |
| `components/HeaderIcons/EditMangiIcon.js` | 1 | `/meals/meal/[mealId]/edit` |
| `components/MealSpeedDial.js` | 3 (add-tag, edit-links, report) | `/meals/meal/[mealId]/add-tag`, `/edit-links`, `/report` |
| `screens/MealDetailScreen.js` | 1 (→ Images) | `router.push('/meals/meal/[mealId]/images', {...})` |
| `screens/MealDetailScreenNotAuthenticated.js` | 2 (→ Images, → Login) | `/detail/[mealId]/images`, `/login` |
| `screens/MealsScreen.js` | 2 (→ Filters tab, → notification-tap handler) | `/filters`; the second call's params are already commented out (pre-existing dead/TODO code) — preserve as a no-op-equivalent `router.push('/meals')` |
| `screens/MealsScreenNotAuthenticated.js` | 1 | `/login` |
| `screens/ProfileScreen.js` | 4 | `/profile/meals`, `/profile/account`, `/profile/friends`, `/profile/settings` |
| `screens/NewScreen.js` | 2 (create-mode modal close, edit-mode save) | create: `router.push('/meals/meal/[mealId]', {...})`; edit: `router.pop()` stays via `useNavigation()`, then `router.replace('/meals/meal/[mealId]', {...})` (was `navigation.replace(STACK_MEAL_DETAILS, ...)`) |

Additionally: `AddTagScreen.js` and `EditLinksScreen.js` call `navigation.popTo(STACK_MEAL_DETAILS, {...})` on save — the Expo Router equivalent is `router.dismissTo({ pathname: '/meals/meal/[mealId]', params })` (added in Expo Router 4.0.8 specifically to replace `popTo`: dismisses stack screens until the target `Href` is reached, matching "pop back to the already-open meal detail with updated params" instead of pushing a new instance). `navigation.setOptions(...)` (used by `AddTagScreen`, `NewScreen` for a dynamic `SaveIcon`/`HeaderBackIcon`) and `navigation.goBack()`/`canGoBack()` (used by `GlobalBackIcon`, `SendReportScreen`, `NewScreen`) are left as-is via `useNavigation()` — those don't target a screen by name, so they aren't affected by the file-based routing change.

`MealDetailScreen`'s header title was **not** "fetched in-screen" as first assumed — the old `options={({route}) => ({title: route.params.mealTitle, ...})}` callback reads `mealTitle` as a param passed by the caller (`MealList.js`, `LinkedMealsList.js`, `NewScreen.js` all pass it alongside `mealId`). The new route file reads `mealTitle` the same way via `useLocalSearchParams()`, with a fallback to the Redux-fetched meal's own `title` for the one path that can't supply it up front: a cold deep link via `app/meal/[mealId].js`, which only has `mealId`.

**Rationale**: This is the mechanical, unavoidable part of the migration — matches constitution FR-008 (spec) boundary: navigation plumbing changes, business logic inside each screen does not. The scope is larger than first scoped, but still squarely navigation plumbing, not business logic — no data-fetching/Redux/validation code changes in any of the files above, only how they navigate.

**Alternatives considered**: A compatibility shim that fabricates a `route` object so screens don't need touching — rejected as needless indirection (constitution Principle VI) for a one-line change per screen.

## Decision 6: Language

**Decision**: All new files under `app/` are `.js`, matching constitution Principle IV, even though Expo Router's own starter templates default to `.tsx`.

**Rationale**: Explicit constitutional constraint, confirmed with the user during `/speckit-constitution`.
