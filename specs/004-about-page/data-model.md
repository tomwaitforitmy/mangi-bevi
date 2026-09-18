# Data Model: About Page

No new Firebase entities — this feature is entirely static/generated local
data, consumed read-only by three new screens. Nothing here is written back
to Firebase or any backend.

## OpenSourceLicense (generated)

Source: `data/generated/openSourceLicenses.json`, written by
`scripts/generate-license-data.js` (via `license-checker-rseidelsohn`,
`--production`), filtered by `scripts/lib/requiresAttribution.js`. Overwritten
every `npm run prerelease` run; never hand-edited.

| Field | Type | Notes |
|---|---|---|
| `packageName` | string | npm package name, e.g. `"react-native-paper"` |
| `version` | string | resolved version at generation time |
| `license` | string | SPDX identifier as reported by license-checker, e.g. `"MIT"` |
| `licenseText` | string | full license text, embedded verbatim |
| `repository` | string \| null | upstream repo URL if license-checker reports one |

Top-level JSON shape: `{ generatedAt: string (ISO date), packages: OpenSourceLicense[] }`.

**Validation / invariants**:
- `packages` is never empty in a shipped build unless the entire production
  dependency tree is public-domain-licensed (extremely unlikely) — the
  Licenses screen must handle the empty case per spec Edge Cases (explicit
  "no attribution-required packages" message, not a blank screen).
- `licenseText` is always non-empty for every entry (a package that
  requires attribution necessarily ships a license file).

## DevHoursEstimate (generated)

Source: `data/generated/devHoursEstimate.json`, written by
`scripts/generate-dev-hours-data.js` (via `scripts/lib/estimateDevHours.js`
over `git log` timestamps). Overwritten every prerelease run.

| Field | Type | Notes |
|---|---|---|
| `estimatedHours` | number | rounded to 1 decimal |
| `sessionCount` | number | number of detected work sessions |
| `commitCount` | number | total commits considered |
| `generatedAt` | string (ISO date) | when this run happened |
| `methodology` | string | short fixed description string, rendered as the FR-008 explanatory text (session-gap threshold + per-session credit, in plain language) |

**Validation / invariants**:
- `estimatedHours` and `sessionCount` are always > 0 for a non-trivial repo;
  the generation script MUST fail the prerelease run (non-zero exit) rather
  than write a zero/missing value, per spec Edge Cases (shallow-clone case).

## CostsConfig (hand-maintained)

Source: `data/CostsConfig.js`, a plain exported object — same convention as
other `data/*.js` static config files (e.g. `data/RecipeRewards.js`). Edited
directly by the developer when a real cost changes; never touched by any
script.

| Field | Type | Notes |
|---|---|---|
| `hourlyRateEur` | number | `25` — fixed conservative rate (FR-007) |
| `asOf` | string (ISO date) | last time the line items below were reviewed/updated |
| `monetaryCosts` | `{ label: string, amountEur: number, note?: string }[]` | real out-of-pocket costs: `[{label: "Apple Developer Program (4 years)", amountEur: 396}, {label: "Google Play Console (one-time)", amountEur: 25}, {label: "Claude Code (2 months)", amountEur: 44}]` |

**Validation / invariants**:
- `monetaryCosts` amounts are entered in EUR, matching what the developer
  actually paid — not list prices (see spec Assumptions).
- Total monetary cost shown on the Costs screen is `sum(monetaryCosts.amountEur)`
  (currently €465), computed at render time — never hand-duplicated as a
  separate stored total that could drift from the line items.

## Derived value: total estimated cost

Computed at render time in `screens/CostsScreen.js` (no new stored field):

```
totalEstimatedCost = sum(CostsConfig.monetaryCosts.amountEur)
                    + DevHoursEstimate.estimatedHours * CostsConfig.hourlyRateEur
```
