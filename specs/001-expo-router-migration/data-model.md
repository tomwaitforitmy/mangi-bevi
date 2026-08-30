# Phase 1 Data Model: Routes

Not a data-persistence model (no schema changes — this migration touches navigation only, per
spec Assumptions). The "entities" here are **Routes**: current React Navigation screen → new
Expo Router file, with the header/param/auth behavior that must carry over unchanged.

## Entity: Route

| Field | Meaning |
|---|---|
| `filePath` | New file under `app/` |
| `sourceScreen` | Current name (`NAVIGATION_TITLES` constant) and component, reused unchanged |
| `params` | Params the screen reads via `useLocalSearchParams()` (was `route.params`) |
| `auth` | `app` (authenticated only), `auth` (not-authenticated only), or `dual` (exists in both groups, same relative path) |
| `header` | Title / headerLeft / headerRight / gestureEnabled behavior to preserve |

## Route Table

### Root

| filePath | sourceScreen | auth | header |
|---|---|---|---|
| `app/_layout.js` | *(new — root layout)* | — | Hosts: Redux `Provider`, `GestureHandlerRootView`, `LogBox.ignoreLogs`, `Notifications.setNotificationHandler`, splash-screen hold, `useAuthState()` (new shared hook, see research.md Decision 3), `DEBUG_MODE` short-circuit to `app/debug.js`, `Stack.Protected` split between `(app)` and `(auth)`, plus the always-mounted `app/meal/[mealId].js` redirector below (outside both guards) |
| `app/debug.js` | `DebugScreen` (was `DebugStackContainer`) | — (`DEBUG_MODE` override, bypasses auth split entirely) | title "Debug screen", no header icon (the old `DebugHeaderIcon` rendering `EditMangiIcon` with no props crashed on press and was removed on main — don't reintroduce it here) |
| `app/meal/[mealId].js` | *(new — deep-link redirector, not a group member)* | `mealId`, `mealTitle` | No UI (`return null`) — reads `useAuthState()`, `router.replace()`s to `/meals/meal/[mealId]` (authenticated) or `/detail/[mealId]` (not), forwarding params. Only the public deep-link entry point (contracts/deep-links.md) uses this file; in-app navigation always pushes the internal path directly. Exists as its own file specifically so `/meal/[mealId]` has exactly one static match — see research.md Decision 3's revision. |
| `common_functions/useAuthState.js` | *(new — shared hook, not a route)* | — | Wraps `onAuthStateChanged`; single source of truth for `isAuthenticated`, used by `app/_layout.js` and `app/meal/[mealId].js` (previously this only existed as local state inside `MyNavigationContainer`) |

### `(app)/` — authenticated, wrapped in `Tabs`

| filePath | sourceScreen | params | header |
|---|---|---|---|
| `app/(app)/_layout.js` | *(new — was `AuthenticatedTabNavigator`)* | — | `Tabs`, `tabBarIcon` via existing `TabBarIcon(focused, color, routeName)`, `headerShown: false` on tab roots (stacks below own their headers) |
| `app/(app)/meals/_layout.js` | *(new — was `MealsStackContainer`)* | — | `Stack`, `defaultScreenOptions` |
| `app/(app)/meals/index.js` | `MealsScreen` | — | title "Mangi & Bevi" |
| `app/(app)/meals/meal/[mealId].js` | `MealDetailScreen` | `mealId`, `mealTitle`, `selectedTabMealDetail` | title = `mealTitle` param (falls back to the Redux-fetched meal's own title if absent, e.g. reached via the deep-link redirector); `headerRight` = edit icon **iff** `HasEditPermission(user, author.id, GetFriends(author.id, users))` (current `showEditIcon` logic, preserved as-is); `headerLeft` = global back |
| `app/(app)/meals/meal/[mealId]/edit.js` | `NewScreen` (edit mode) | `mealId` | title "Edit Mangi / Bevi", `gestureEnabled: false`, `headerLeft` = global back |
| `app/(app)/meals/meal/[mealId]/images.js` | `ImagesScreen` | `mealId`, `currentTabViewed` | title = meal title; `headerRight` = edit icon (same permission check as detail); `headerLeft` = global back |
| `app/(app)/meals/meal/[mealId]/add-tag.js` | `AddTagScreen` | `mealId` | title "Add Tag", `headerLeft` = global back |
| `app/(app)/meals/meal/[mealId]/edit-links.js` | `EditLinksScreen` | `mealId` | title "Add Links", `headerLeft` = global back |
| `app/(app)/meals/meal/[mealId]/report.js` | `SendReportScreen` | `mealId`, `mealTitle` | title "Report", `headerLeft` = global back |
| `app/(app)/dev.js` | `DevScreen` (was `DevStackContainer`) | — | title "Dev"; tab hidden via `href: null` unless `EXPO_PUBLIC_DEV_MODE` |
| `app/(app)/filters.js` | `FiltersScreen` (was `FiltersStackContainer`) | — | title "Filters" |
| `app/(app)/profile/_layout.js` | *(new — was `ProfileStackContainer`)* | — | `Stack`, `defaultScreenOptions` |
| `app/(app)/profile/index.js` | `ProfileScreen` | — | title "Your Data", `headerRight` = `<LogoutIcon />` |
| `app/(app)/profile/meals.js` | `UserMealsScreen` | — | title "Your Mangis", `headerLeft` = global back |
| `app/(app)/profile/account.js` | `ManageAccountScreen` | — | title "Your Account", `headerLeft` = global back |
| `app/(app)/profile/friends.js` | `EditFriendsScreen` | — | title "Your Friends", `headerLeft` = global back |
| `app/(app)/profile/settings.js` | `SettingsScreen` | — | title "Your Settings", `headerLeft` = global back |
| `app/(app)/new.js` | `NewScreen` (create mode, was `NewMealStackContainer`) | — | title "New Mangi / Bevi" |

### `(auth)/` — not authenticated, plain `Stack`, no tab bar

| filePath | sourceScreen | params | header |
|---|---|---|---|
| `app/(auth)/_layout.js` | *(new — was `LoginStackContainer`)* | — | `Stack`, `defaultScreenOptions` |
| `app/(auth)/index.js` | `MealsScreenNotAuthenticated` | — | title "Mangi & Bevi" |
| `app/(auth)/detail/[mealId].js` | `MealDetailScreenNotAuthenticated` | `mealId`, `mealTitle`, `selectedTabMealDetail` | title = `mealTitle` param; `headerLeft` = global back — deliberately **not** at `/meal/[mealId]` (that path is reserved for the unconditional redirector, see research.md Decision 3's revision) |
| `app/(auth)/detail/[mealId]/images.js` | `ImagesScreen` (logged-out variant) | `mealId` | title = meal title; `headerLeft` = global back |
| `app/(auth)/login.js` | `LoginScreen` | — | title "Login", `headerLeft` = global back |
| `app/(auth)/sign-up.js` | `SignUpScreen` | — | title "Sign Up", `headerLeft` = global back |
| `app/(auth)/password-reset.js` | `PasswordResetScreen` | — | title "Reset Password", `headerLeft` = global back |

## Notes

- 25 route files total (+ 4 `_layout.js`), vs. the current single 440-line `MyNavigationContainer.js` — this is the size FR-008/SC-003 and constitution Principle III/VI care about: each file is small and single-purpose, the *count* isn't the concern.
- `HasEditPermission`/`GetFriends`/`GetAuthorByMealId` (`common_functions/`) are reused unchanged — only *where* the check happens moves (from `showEditIcon` in the old central file, to inline in `meal/[mealId].js` and `meal/[mealId]/images.js`).
- `EditMangiIcon`, `LogoutIcon`, `GlobalBackIcon`, `SaveIcon`, `TabBarIcon` (`components/HeaderIcons/`) are reused unchanged as components — this migration is a good forcing function to confirm every remaining call site uses them as JSX, not as plain functions (the exact bug class fixed on `main` this week — `d24fd7a`, `4f0e47f`).
