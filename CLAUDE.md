# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Style

Be extremely concise. Sacrifice grammar for the sake of concision.

## What this is

**mangi-bevi** is a React Native (Expo) recipe app. Recipes are called "Mangis" in the UI
(Italian "mangi" = eat), but the internal model/collection name is `Meal` (see `models/Meal.js`,
Firebase path `meals/`). A Mangi has a title, `ingredients`, `steps`, `tags` (for filtering),
`authorId`/`editorId`, timestamps, `links` (to related meals), `reactions`, and images:
`imageUrls[]` plus one `primaryImageUrl` used for previews.

There is **no server-side/backend code**. The client talks directly to:
- **Firebase Realtime Database** via its REST API (not SDK realtime listeners) for all data:
  meals, users, tags, reports, mealCookedByUser, features. Endpoint builders in `firebase/urls.js`,
  config in `firebase/firebase.js`. Firebase Auth handles login/signup/user management.
- **Appwrite** (`appwrite/`) for image storage — the primary image backend.
- **Supabase** (`supabase/`) is a leftover comparison experiment, only wired into
  `screens/DevScreen.js`. Not used in production; not currently planned to be adopted, though a
  future switch away from Appwrite is possible.

## Commands

```bash
npm start                  # expo start
npm run dev                # dev-client build, APP_VARIANT=development
npm run android             # expo run:android
npm run ios                 # expo run:ios
npm test                    # jest (all tests)
npx jest tests/unit-tests/HasEditPermission.test.js   # single test file
npx jest -t "test name"     # single test by name
npm run lint                 # eslint .
npm run prerelease           # fish scripts/prerelease.fish (bumps version etc.)
```

Test layout: `tests/unit-tests/`, `tests/component-tests/`, `tests/integration/`. Jest preset is
`jest-expo`.

Release flow (see `newRelease.md`): `npm run prerelease` → `git push --tags` → wait for the EAS
workflow → manually promote the build in App Store Connect and Google Play Console (no auto-
publish to stores).

## Architecture

### State: Redux Toolkit

`store/actions/*.js` + `store/reducers/*.js`, one pair per domain (meals, users, tags, search,
features, reports, mealCookedByUser). Actions are plain constants; reducers do immutable
switch-case updates. `store/formReducers/` holds reducers backing multi-step forms (new meal,
account, tag, meal speed-dial).

### Concurrency-safe meal writes (read before touching `mealsAction.js`)

Meal edits used to be blind full-object `PATCH` requests, which caused lost updates when two
clients edited the same meal concurrently (a stale patch could silently overwrite a more recent
`links` change). The fix, now in place:

- `firebase/optimisticTransaction.js` exports `runOptimisticTransaction(resourceUrl, mergeFn, options)`:
  reads current server state, calls `mergeFn(current)` for the new payload, and writes
  conditionally (ETag/If-Match where supported, else read-merge-retry) with jittered backoff on
  conflict.
- `store/actions/mealsAction.js` implements a real **three-way merge** (`threeWayMerge`,
  `buildMealUpdatePayloadThreeWay`) for array fields (`ingredients`, `steps`, `imageUrls`, `tags`,
  `links`, `reactions`): primitive arrays are aligned via LCS to distinguish "removed" vs "edited
  in place" vs "inserted" even when unrelated edits shift positions; object arrays (e.g.
  reactions) are matched by `id`/`authorId` key instead of position.
- `editMeal`, `editLinks`, `editReactions`, `deleteMeal` all route through
  `runOptimisticTransaction` — never write a meal with a blind PATCH/PUT.

Background/design rationale: `docs/optimistic-transaction-design.md`. Tests:
`tests/unit-tests/optimisticTransaction.test.js`, `tests/unit-tests/mealsAction.threeWayMerge.test.js`.

Any new write path touching `meal` (or another multi-client-edited resource) should follow this
same pattern rather than reintroducing a full-object PATCH.

### Friends & edit permissions

Users can add other users as friends (`User.friends`, managed in
`screens/EditFriendsScreen.js`). Friendship is a **one-directional grant**: adding someone as a
friend gives *them* edit rights on *your* meals; it's two independent one-way grants, not a single
mutual relationship, unless both sides add each other.
`common_functions/HasEditPermission.js` — `HasEditPermission(user, authorId, authorFriends)` —
returns true if `authorId === user.id` or `authorFriends.includes(user.id)`. Use this for any
"can this user mutate this meal" check rather than comparing `authorId` directly.

### Gamification (levels/rewards)

Users earn rewards based on cumulative counts of recipes/ingredients/steps/tags they've
contributed. Threshold tables: `data/RecipeRewards.js`, `data/IngredientRewards.js`,
`data/StepRewards.js`, `data/TagRewards.js` (ascending `{ threshold, ... }` arrays). Lookups:
`common_functions/GetReward.js` (`GetReward`/`GetNextReward`), `common_functions/GetLevelPercent.js`,
`common_functions/GetUserStats.js`. Models: `models/UserStats.js`, `models/Level.js`,
`models/Reward.js`.

### Dev/test data convention

`data/Environment.js` exposes `DEV_MODE`/`DEBUG_MODE` from `EXPO_PUBLIC_DEV_MODE` /
`EXPO_PUBLIC_DEBUG_MODE`. When `DEV_MODE` is true, `createMeal` flags new meals
`isTestMangi: true`; `firebase/deleteTestMangis.js` cleans these up. Prefer DEV_MODE on when
exercising create/edit flows so test data stays identifiable and disposable.

### Navigation & permissions gating

File-based routing via **Expo Router**, under `app/`. `app/_layout.js` is the root: global setup
(Redux `Provider`, splash hold, etc., moved from the old `App.js`) plus a `Stack.Protected` split
between `app/(app)/` (authenticated, `Tabs`: Meals/Dev/Filters/Profile/New) and `app/(auth)/`
(not authenticated, plain `Stack` — `MealsScreenNotAuthenticated`/`MealDetailScreenNotAuthenticated`
are real, separate implementations, not a login wall). `app/debug.js` is the `EXPO_PUBLIC_DEBUG_MODE`
override, gated in `app/_layout.js` ahead of the auth split. `app/meal/[mealId].js` is a small
unconditional redirector owning the public `mangibevi://meal/{mealId}` deep link — it forwards to
`(app)/meals/meal/[mealId]` or `(auth)/detail/[mealId]` depending on auth state; the two groups
deliberately do **not** share that path (Expo Router can't disambiguate an identical path across
two `Stack.Protected` groups from a URL alone). Screen components (`screens/*.js`) read params via
`useLocalSearchParams()` and navigate via `useRouter()`, not the React Navigation `route`/`navigation`
props (Expo Router never passes those). Anything from `@react-navigation/*` must be imported from
`expo-router/react-navigation` instead — Expo Router SDK 56+ rejects direct `@react-navigation/*`
imports in application code. See `specs/001-expo-router-migration/` for the full route table and
the reasoning behind the auth-split design.

`app/(app)/_layout.js` is a **`NativeTabs`** (`expo-router/unstable-native-tabs`), a real native
tab bar (UITabBarController on iOS — picks up iOS 26 Liquid Glass automatically; BottomNavigationView
on Android), not a JS-drawn one. A native tab controller has no per-tab header of its own, so every
one of the 5 tabs is its own folder with a single-screen `Stack` (`_layout.js` + `index.js`),
mirroring what `meals/`/`profile/` already needed — headers are exclusively a `Stack` concern here.
Tab icons use `NativeTabs.Trigger.Icon` + `NativeTabs.Trigger.VectorIcon`
(`family={Ionicons|MaterialDesignIcons}`, not the old `tabBarIcon` render-prop), with separate
`default`/`selected` icon names where the old code had outline/filled variants.
`hidden={!DEV_MODE}` replaces the old `href: DEV_MODE ? undefined : null` trick for hiding the Dev
tab in production. Don't set an iOS `backgroundColor` on `NativeTabs` — Apple's HIG says not to
paint over the native Liquid Glass material; Android has no glass material and keeps an explicit
brand background.

Native-stack headers (all `Stack.Screen`-based headers, not just tabs) have a known open upstream
bug on iOS 26 in `react-native-screens`: a `headerRight`/`headerLeft` element can visually persist
after the JS logic that rendered it has already re-rendered it away (confirmed via device logs —
not an app bug). Tracked at software-mansion/react-native-screens#2990, #3226, discussion #4021.
No app-code fix is known; where a stale header icon would be misleading (e.g. an edit action a
user shouldn't have), prefer always rendering *something* in that slot (see
`components/HeaderIcons/EditMangiIconDisabled.js`) over toggling between an element and `null`.

### Image pipeline

`image_processing/` (compress, resize, get-images-to-upload, delete) feeds into
`common_functions/Integration/UploadImagesAndCreateMeal.js` /
`UploadImagesAndEditMeal.js`, which upload to Appwrite (`appwrite/uploadImageToAppwrite.js`) and
then write the resulting URLs onto the meal.

### Directory map

- `app/` — Expo Router file-based routes (see "Navigation & permissions gating" above); each file
  is a thin wrapper (header config via `<Stack.Screen options={{...}}/>`) around a `screens/`
  component.
- `screens/` — full-page components, connect to Redux directly.
- `components/` — reusable UI, generally prop-driven rather than Redux-connected.
- `common_functions/` — pure utility functions (filters, validators, getters); one function per
  file, matching test per file in `tests/unit-tests/`.
- `models/` — plain object constructor functions (`Meal`, `User`, `Tag`, `Reaction`, `Report`,
  `Reward`, `Level`, `Setting`, `MealCookedByUser`, `MovableData`, `UserStats`).
- `firebase/`, `appwrite/`, `supabase/` — backend integrations (see above).
- `notifications/` — Expo push notification triggers (new meal, marked as cooked, reaction given)
  and registration.
- `data/` — static config/constants: allowed reactions, sorting options, settings, reward
  thresholds, dummy data for tests/stories.

## Notes

- No TypeScript in practice: `tsconfig.json` exists but the codebase is 100% `.js`.
- `App.js` has a `LogBox.ignoreLogs([...])` allowlist for known/expected warnings — check there
  before assuming a new warning needs fixing.
- Tag colors are not stored per-tag; tag chip styling comes from fixed `tagBackground`/`tagText`/
  `tagBorderColor` entries in `constants/Colors.js`.
