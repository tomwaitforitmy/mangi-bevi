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

Release flow (see `newRelease.md`): `npm run prerelease` → `git push --tags` → wait for the EAS
workflow → manually promote the build in App Store Connect and Google Play Console (no auto-
publish to stores).

## Architecture

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

File-based routing via **Expo Router**, under `app/` — see `app/CLAUDE.md` for the route/tab
structure. Two rules apply project-wide, not just under `app/`:

Screen components (`screens/*.js`) read params via `useLocalSearchParams()` and navigate via
`useRouter()`, not the React Navigation `route`/`navigation` props (Expo Router never passes
those). Anything from `@react-navigation/*` must be imported from `expo-router/react-navigation`
instead — Expo Router SDK 56+ rejects direct `@react-navigation/*` imports in application code.
`expo-router/react-navigation` resolves entirely to react-navigation source code vendored *inside*
`expo-router` itself (`expo-router/build/react-navigation/`), not to the `@react-navigation/*` npm
packages — so those packages are not project dependencies; don't re-add them.

Native-stack headers (all `Stack.Screen`-based headers, not just tabs) have a known open upstream
bug on iOS 26 in `react-native-screens`: a `headerRight`/`headerLeft` element can visually persist
after the JS logic that rendered it has already re-rendered it away (confirmed via device logs —
not an app bug). Tracked at software-mansion/react-native-screens#2990, #3226, discussion #4021.
No app-code fix is known; where a stale header icon would be misleading (e.g. an edit action a
user shouldn't have), prefer always rendering *something* in that slot (see
`components/HeaderIcons/EditMangiIconDisabled.js`) over toggling between an element and `null`.

### Theming

`theme/` holds the central, per-appearance style source (Light, Dark, Colorful — see
`theme/lightTheme.js`/`darkTheme.js`/`colorfulTheme.js`), built on **React Native Paper**'s MD3
theme shape. `theme/ThemeProvider.js` (wrapped around the app root in `app/_layout.js`) resolves
the active theme from the user's `theme/AppearanceOptions.js` selection (Light/Dark/Colorful/
Automatic, persisted locally via AsyncStorage — device-only, not synced to the user's account) and
also feeds it into `expo-router`'s navigation `ThemeProvider` so native-stack chrome matches.
Screens/components consume colors via `theme/useAppTheme()` (`theme.colors.*`), never via a
hard-coded literal or the old `constants/Colors.js` (removed) — `common_functions/
ResolveAppearance.js` and `common_functions/GetContrastRatio.js` back the resolution and WCAG AA
contrast checks respectively. See `specs/003-app-theming-system/` for the full design.

### Image pipeline

`image_processing/` (compress, resize, get-images-to-upload, delete) feeds into
`common_functions/Integration/UploadImagesAndCreateMeal.js` /
`UploadImagesAndEditMeal.js`, which upload to Appwrite (`appwrite/uploadImageToAppwrite.js`) and
then write the resulting URLs onto the meal.

## Notes

- No TypeScript in practice: `tsconfig.json` exists but the codebase is 100% `.js`.
- `App.js` has a `LogBox.ignoreLogs([...])` allowlist for known/expected warnings — check there
  before assuming a new warning needs fixing.
- Tag colors are not stored per-tag; tag chip styling comes from fixed `tagBackground`/`tagText`/
  `tagBorderColor` entries in `constants/Colors.js`.
