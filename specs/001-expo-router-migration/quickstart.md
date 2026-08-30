# Quickstart: Validating the Expo Router Migration

Run after `/speckit-implement` finishes the tasks from `tasks.md`, to prove the migration actually
meets spec.md's success criteria before calling it done.

## Prerequisites

- `npm install` run since the migration added `expo-router` + `expo-linking`.
- A dev build or Expo Go session (`npx expo start`), on both iOS and Android if possible — header/
  gesture behavior (SC-001) is platform-sensitive.
- Two accounts or one account + a logged-out session, to exercise both `(app)` and `(auth)` groups.
- `EXPO_PUBLIC_DEV_MODE=true` in `.env` for one pass (to check the Dev tab appears), unset for
  another (to check it's absent) — both cover FR-003.

## SC-001 — every route still reachable, nothing regressed

1. `npx expo start`, open the app authenticated.
2. Walk every row of `data-model.md`'s `(app)/` table by hand: tap through Meals → a meal →
   Images → Add Tag / Edit Links / Report, Meals → a meal you authored → Edit, Profile → Your
   Mangis / Account / Friends / Settings, New tab, Filters tab, and (with `DEV_MODE` on) the Dev
   tab.
3. For a meal you did **not** author and aren't friends with the author of: confirm no edit icon
   appears on its Detail or Images screen (FR-004, the `HasEditPermission` check).
4. Log out, repeat for `(auth)/` table: Meals list → a meal's Detail → Images, Login, Sign Up,
   Password Reset. Confirm none of the authenticated-only screens are reachable.
5. Set `EXPO_PUBLIC_DEBUG_MODE=true`, restart: confirm only the Debug screen renders, nothing else
   reachable (FR-003).
6. On every screen visited: confirm the header title, back button, and swipe-back/hardware-back
   gesture match what's on `main` today.

Pass condition: no crash, no wrong screen, no missing/extra header icon, anywhere in the walk.

## SC-002 — deep link works

1. With the app installed and **closed**, run (adjust for platform):
   - iOS simulator: `xcrun simctl openurl booted mangibevi://meal/<a-real-mealId>`
   - Android emulator: `adb shell am start -W -a android.intent.action.VIEW -d "mangibevi://meal/<a-real-mealId>"`
2. Confirm the app cold-starts directly into that meal's detail screen (authenticated variant if
   logged in, not-authenticated variant if not) — not the tab root.
3. With the app already running in the background, repeat the same command; confirm it
   foregrounds directly onto the meal detail screen.

Pass condition: both cold-start and warm-start land on the correct meal, correct variant for the
current auth state.

## SC-003 — one file per new screen

Add one throwaway route file (e.g. `app/(app)/scratch.js` exporting a bare `<Text>hi</Text>`),
reload, confirm it's reachable with no other file touched. Delete it afterward — this step is
just proof, not a real screen.

## SC-004 — cold-start time

Compare `main` (pre-migration) vs. the migration branch: time from app icon tap to first
interactive frame, a few runs each, same device. Regression budget: 5%.

## SC-005 — existing tests still pass

```bash
npm test
```

Expect 205/205 passing (the count on `main` as of this plan) or higher — no navigation tests
exist today (confirmed by grep), so nothing here should need updating, only the app code the
tests exercise.
