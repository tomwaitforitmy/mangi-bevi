# Feature Specification: About Page

**Feature Branch**: `[004-about-page]`

**Created**: 2026-09-18

**Status**: Draft

**Input**: User description: "About page (replacing the inline version text currently on the
Profile screen) with two sub-pages: an auto-generated, auto-updated Open Source Licenses page
(only licenses that require attribution), and a Costs & Transparency page showing real monetary
costs plus an estimated developer-time cost derived from git history at a conservative €25/hour,
with an explanation of the methodology and a statement that Mangi & Bevi stays free and ad-free."

## Clarifications

### Session 2026-09-18

- Q: Sollen die Lizenztexte vollständig in der App angezeigt werden, oder reicht ein Link/Verweis pro Paket? → A: Volltext jeder Lizenz direkt eingebettet in der App anzeigen (negligible storage cost, ~1.1MB raw / ~358 unique texts across current dependencies).
- Q: Welcher Filter entscheidet, ob ein Paket auf der Lizenzseite auftaucht? → A: Jedes Paket mit einer Lizenz, die eine Copyright-/Notice-Erhaltungsklausel enthält (MIT, BSD-2/3, Apache-2.0, ISC, etc. — praktisch alle gängigen permissiven Lizenzen), einschließen; nur echte Public-Domain-Lizenzen (Unlicense, CC0, WTFPL) ausschließen.
- Q: Werden die realen Geldbeträge (Apple/Google/Claude) automatisch vom Prerelease-Skript neu generiert, wie Lizenzen und Stunden-Schätzung? → A: Nein — Geldbeträge liegen in einer manuell gepflegten Datendatei; nur die Lizenzliste und die Stunden-Schätzung werden vom Prerelease-Skript automatisch neu berechnet.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View app version (Priority: P1)

A user wants to know which version of the app they're running.

**Why this priority**: Core ask; replaces the version line that currently
lives directly on the Profile screen.

**Independent Test**: Navigate Profile → About, verify app name and version
are displayed.

**Acceptance Scenarios**:

1. **Given** the user is on the Profile screen, **When** they tap "About",
   **Then** an About screen opens showing the app name and current version
   number.
2. **Given** the user is on the About screen, **When** they tap back,
   **Then** they return to the Profile screen.

---

### User Story 2 - View Open Source License notices (Priority: P2)

A user (or the developer, for compliance reasons) wants to see which
open-source licenses require attribution/notice for the packages the app is
built with.

**Why this priority**: Legal/compliance-adjacent — real value, but
independent of the base About content.

**Independent Test**: From the About screen, open "Open Source Licenses" and
verify a list of package licenses is shown, sourced from the app's actual
dependencies at the time of the most recent release.

**Acceptance Scenarios**:

1. **Given** the user is on the About screen, **When** they tap "Open Source
   Licenses", **Then** a screen opens listing the third-party packages whose
   license requires the notice to be shown, each with its license type and
   full license text embedded directly in the app (no external link-out
   required).
2. **Given** a new release adds, removes, or updates a dependency, **When**
   the existing prerelease process runs, **Then** the license list is
   regenerated automatically with no manual edits required.
3. **Given** a dependency's license does not require attribution, **When**
   the license list is generated, **Then** that dependency is excluded from
   the list.

---

### User Story 3 - View cost transparency (Priority: P2)

A user is curious what it actually costs to build and run the app, and wants
reassurance the app will stay free and ad-free.

**Why this priority**: Trust/transparency value; independent content from
the other two pages.

**Independent Test**: From the About screen, open "Costs & Transparency" and
verify real monetary costs, an estimated developer-time cost, an explanation
of how it was derived, and the free/ad-free statement are all present.

**Acceptance Scenarios**:

1. **Given** the user opens "Costs & Transparency", **When** the screen
   renders, **Then** it shows the real out-of-pocket monetary costs paid to
   build and publish the app (developer program fees, store registration,
   tooling), each labeled with what it's for.
2. **Given** the same screen, **When** the user reads further, **Then** it
   also shows an estimated cost of developer time — derived from the
   project's commit history at a fixed, clearly-stated conservative hourly
   rate — with a short explanation of how that estimate was produced.
3. **Given** the same screen, **When** the user reads to the end, **Then** it
   states plainly that Mangi & Bevi will always remain free of charge and
   free of advertising.

---

### Edge Cases

- About/Licenses/Costs screens must render legibly in all three app themes
  (Light, Dark, Colorful).
- Version number must stay in sync with the actual shipped build
  automatically (sourced from existing app version config, never a
  hand-typed string).
- If license extraction finds zero attribution-required packages, the
  Licenses page must say so explicitly rather than rendering an
  unexplained empty screen.
- If the automated hour-estimate step can't read full commit history at
  release time (e.g. a shallow clone), the prerelease process must fail
  loudly rather than publish a wrong or zero estimate.
- Cost figures are a periodic snapshot, not live data — the Costs page must
  show an "as of" date so it isn't read as continuously up to date.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide an About screen reachable from the Profile
  screen, replacing the existing inline "Mangi & Bevi version: …" text.
- **FR-002**: About screen MUST display the app name and current app version
  (sourced from existing app version config). No app-description or contact
  content is included — considered self-explanatory / out of scope.
- **FR-003**: System MUST provide an "Open Source Licenses" sub-page,
  reachable from the About screen, listing third-party package licenses with
  the full license text embedded directly in the app (no external link-out).
- **FR-004**: The license list MUST include every dependency whose license
  contains a copyright/notice-preservation clause (e.g. MIT, BSD-2/3,
  Apache-2.0, ISC, and equivalent permissive licenses); only dependencies
  under true public-domain-style licenses with no such clause (e.g.
  Unlicense, CC0, WTFPL) MUST be excluded.
- **FR-005**: The license list MUST be generated automatically from the
  project's actual dependencies and MUST be regenerated as part of the
  existing prerelease process (`npm run prerelease` / `scripts/prerelease.fish`),
  so it can never manually drift from what's actually shipped.
- **FR-006**: System MUST provide a "Costs & Transparency" sub-page,
  reachable from the About screen, showing the real monetary costs incurred
  to build and publish the app (developer program fees, store registration
  fees, development tooling), each labeled with what it paid for and an "as
  of" date. These figures MUST be maintained in a data file the developer
  edits manually when a real cost changes — unlike the license list and
  time estimate, they cannot be derived automatically from any in-repo
  source.
- **FR-007**: Costs page MUST show an estimated cost of developer time,
  computed from the project's commit history at a fixed, clearly labeled
  conservative hourly rate, presented as an estimate (not as precise
  bookkeeping).
- **FR-008**: Costs page MUST include a short explanatory text describing
  how the time estimate is derived, so the number reads as transparent
  rather than an unexplained figure.
- **FR-009**: Costs page MUST state that Mangi & Bevi will always remain
  free of charge and free of advertising.
- **FR-010**: About/Licenses/Costs screens MUST follow the app's existing
  screen conventions: themed via `theme/useAppTheme()` (no hardcoded
  colors), standard header with back navigation matching sibling Profile
  sub-screens.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can reach the About, Licenses, and Costs screens from
  the Profile screen in 3 taps or fewer.
- **SC-002**: After every release, 100% of dependencies whose license
  requires attribution appear on the Licenses page, with zero manual edits
  to that page's content.
- **SC-003**: The Costs page's time-estimate figure updates automatically on
  each release without any code change to the screen itself; its monetary
  figures update by editing a data file (not the screen's code) whenever a
  real cost changes.
- **SC-004**: Users can read the cost estimate, its explanation, and the
  free/ad-free statement, and come away understanding roughly what the app
  costs and that it will never cost them anything, without needing outside
  context.
- **SC-005**: About/Licenses/Costs screens meet WCAG AA contrast in all
  three themes (Light, Dark, Colorful).

## Assumptions

- Real monetary costs, confirmed by the developer (as of 2026-09-18):
  Apple Developer Program €396 total (~4 years), Google Play Console €25
  (one-time registration), Claude Code €44 (2 months at €22/month). Total
  real monetary cost: **€465**. These are the figures the Costs page
  displays — not list prices, actual amounts paid.
- The developer-hour estimate uses a commit-history session heuristic
  (group commits into work sessions bounded by a time-gap threshold,
  crediting a fixed amount for each session's first commit) — a standard,
  intentionally conservative approximation, not a precise time tracker. A
  preview run of this method over the current history (1264 commits, ~4.9
  years) produced ≈423 hours / 329 sessions.
- Hourly rate for the time estimate is a fixed, conservative €25/hour.
- No privacy policy / terms-of-use content is included; the only
  legal-adjacent content is open-source license attribution.
- About/Licenses/Costs are reached only via the authenticated Profile area
  (Profile screen → About → Licenses / Costs sub-pages), not added to the
  unauthenticated `(auth)` flow.
- License list and hour-estimate are generated data, regenerated
  automatically by the prerelease script. Monetary cost figures live in a
  separate, manually-maintained data file (edited by the developer when a
  real cost changes) — none of these are hardcoded directly into screen
  components.
