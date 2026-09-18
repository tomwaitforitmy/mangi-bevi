# Quickstart: About Page

## Prerequisites

- `npm install` already run (adds `license-checker-rseidelsohn` devDependency
  once it lands in `package.json`).
- Local clone with full git history (not shallow) — the dev-hours generator
  reads `git log`.

## Generate the static data (what prerelease will run automatically)

```bash
node scripts/generate-license-data.js   # writes data/generated/openSourceLicenses.json
node scripts/generate-dev-hours-data.js # writes data/generated/devHoursEstimate.json
```

Expected: both commands exit 0 and print how many entries/hours they wrote.
A non-zero exit (e.g. shallow clone, no commits) must abort
`scripts/prerelease.fish` per the spec's edge-case requirement — verify by
running `git clone --depth 1` into a scratch dir and confirming
`generate-dev-hours-data.js` fails loudly there.

## Validate each user story end-to-end

**US1 — App version** (`npm run ios` / `npm run android` / Expo Go):
1. Sign in, go to Profile tab.
2. Confirm the old inline "Mangi & Bevi version: …" text is gone, replaced by
   an "About" button alongside Account/Friends/Settings.
3. Tap "About" → app name + current version shown (matches `app.json`'s
   `expo.version`). Tap back → returns to Profile.

**US2 — Open Source Licenses**:
1. From About, tap "Open Source Licenses".
2. Confirm a scrollable list of packages appears, each collapsed to
   name + license type.
3. Tap one row → full license text expands inline (no external browser/link
   opens).
4. Cross-check count: compare the list length against
   `data/generated/openSourceLicenses.json`'s `packages.length`.
5. Temporarily add a dependency under an excluded license (e.g. a scratch
   package under `Unlicense`) and re-run `generate-license-data.js` — confirm
   it does NOT appear in the regenerated file, then revert.

**US3 — Costs & Transparency**:
1. From About, tap "Costs & Transparency".
2. Confirm the real monetary line items from `data/CostsConfig.js` are shown
   individually and summed.
3. Confirm the estimated developer-hours cost is shown, computed as
   `devHoursEstimate.json`'s `estimatedHours * CostsConfig.hourlyRateEur`.
4. Confirm the explanatory methodology text (session-gap heuristic) and the
   "Mangi & Bevi is always free and ad-free" statement are both present.
5. Confirm an "as of" date is visible for the monetary figures.

## Regression checks

- Toggle theme (Light/Dark/Colorful) on all three new screens — no
  hardcoded colors, WCAG AA contrast holds (spec SC-005).
- Run `npm test` — new unit tests for `scripts/lib/requiresAttribution.js`
  and `scripts/lib/estimateDevHours.js` pass.
