# Contract: Deep Link URLs

This migration is what makes the app's routes externally addressable at all (today, nothing
outside the app can target a specific screen). This is the URL surface it exposes going forward,
consumed by `notifications/` (push notification targets) and any future share-link feature.

## Scheme

`app.json`'s `expo.scheme` is currently unset — this migration sets it. Proposed: `mangibevi`
(derived from the existing bundle identifier `com.tomwaitforitmy.mangibevi`) — open to a different
value, it's a one-line config change either way, not load-bearing on anything else in this plan.

## Addressable routes (FR-006 minimum: meal detail)

| URL | Resolves to | Auth-dependent? |
|---|---|---|
| `mangibevi://meal/{mealId}` | `app/meal/[mealId].js` — a small unconditional redirector, always present in the route tree, that immediately `router.replace()`s to `app/(app)/meals/meal/[mealId].js` if authenticated or `app/(auth)/detail/[mealId].js` if not | Yes, resolved by the redirector rather than by the URL itself — Expo's own shared-routes docs warn against giving `(app)`/`(auth)` the identical path directly, since the router's static route table can't disambiguate on auth state alone (see research.md Decision 3's revision) |

## Addressable routes (rest of the route table, for completeness — not required by spec FR-006, but free once the routes exist as files)

| URL | Resolves to |
|---|---|
| `mangibevi://` | Meals list (authenticated or not) |
| `mangibevi://meal/{mealId}/images` | Images screen |
| `mangibevi://meal/{mealId}/edit` | Edit screen (authenticated only — no `(auth)` equivalent, matches current app: editing always requires login) |
| `mangibevi://login`, `mangibevi://sign-up`, `mangibevi://password-reset` | Auth screens |

Routes with no sensible external target (`add-tag`, `edit-links`, `report`, `profile/*`, `dev`,
`filters`, `new`, `debug`) are reachable only via in-app navigation, same as today — nothing
requires them to be deep-link entry points.

## Consumers

- `notifications/` — push notifications for new meal / marked-as-cooked / reaction-given
  currently open the app without targeting a screen. Wiring a specific notification's payload to
  `mangibevi://meal/{mealId}` is enabled by this migration but is **out of scope** for this
  feature (spec Assumptions) — a natural, separate follow-up.
