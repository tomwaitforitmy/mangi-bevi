# Feature Specification: App Theming System

**Feature Branch**: `003-app-theming-system`

**Created**: 2026-09-05

**Status**: Draft

**Input**: User description: "I want to fully revise the style design of the app. I want to add dark-mode, light-mode and maybe a third more colorful mode. Mostly, the code should be prepared for a migration to a more advanced style concept. StyleSheets are used for all components, a central Colors.js defines consistent colors for most components/classes. However, the current design is a bit boring and old fashioned. The code is not perfect: not all colors are defined in the central Colors.js. Let's migrate to a more sophisticated approach to style such as react-native paper."

## Clarifications

### Session 2026-09-05

- Q: Should the appearance preference sync across a user's devices via their account, or stay local to each device? → A: Local to each device — switching on one device doesn't affect others.
- Q: Should "follow the device's light/dark setting" be a persistent, selectable mode, or just the one-time default before a user ever picks anything? → A: Persistent "Automatic" mode — a 4th option users can pick anytime; the app keeps following OS changes while it's selected.
- Q: Should the three appearances meet a specific accessibility contrast standard, or is subjective readability good enough? → A: WCAG AA text contrast (4.5:1 normal text, 3:1 large text/icons) as a hard requirement for all three appearances.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Switch between light and dark appearance (Priority: P1)

A user opens the app and wants it to look right in their current environment — light and readable during the day, dark and low-glare at night. They can choose a light or dark appearance for the app, and every screen, not just some, reflects that choice consistently.

**Why this priority**: Dark/light mode is the explicit, primary ask and the most common "boring/old-fashioned" complaint fix. It also forces the color-centralization cleanup that unblocks everything else.

**Independent Test**: Switch the app's appearance setting and navigate through every existing screen (meal list, meal detail, edit screens, profile, dev screen, tab bar, headers, modals). All screens must render fully themed — no screen still shows only the old hard-coded palette regardless of the selected appearance.

**Acceptance Scenarios**:

1. **Given** the user is on any screen in the app, **When** they switch the appearance setting from light to dark (or vice versa), **Then** all visible text, backgrounds, icons, borders, and interactive controls on that screen update to the new appearance without requiring an app restart.
2. **Given** the user has selected an appearance, **When** they close and reopen the app, **Then** the app opens in the previously selected appearance.
3. **Given** a screen renders content that is not yet covered by the central theme (e.g. a hard-coded color left over from before this feature), **When** that screen is audited during implementation, **Then** the color is moved into the central theme rather than left as a one-off exception.

---

### User Story 2 - Try the more colorful third look (Priority: P2)

A user who finds plain light/dark modes uninteresting wants a third, more vibrant/colorful appearance option to personalize the app.

**Why this priority**: Explicitly requested but described by the user as tentative ("maybe"), and depends on the P1 theming foundation existing first — it is an additional theme built on the same mechanism, not a separate system.

**Independent Test**: With the light/dark theming mechanism from User Story 1 in place, add a third selectable appearance and confirm a user can select it from the same setting used for light/dark and see the app render in that distinct, more colorful palette across all screens.

**Acceptance Scenarios**:

1. **Given** the user opens the appearance setting, **When** they view the available options, **Then** a third, visually distinct "colorful" option is listed alongside light and dark.
2. **Given** the user selects the colorful appearance, **When** they navigate the app, **Then** all screens render using the colorful palette with the same completeness as light/dark (no screen falls back to the old hard-coded colors).

---

### User Story 3 - Codebase ready for a future styling-library migration (Priority: P1)

As the app's maintainer, when a future decision is made to adopt a more capable styling/component approach (e.g. a themed component library), that migration should be a localized, mechanical swap rather than another pass through every screen — because color and style values are already centralized and consistently referenced instead of scattered and hand-rolled per component.

**Why this priority**: Stated as the main point of doing this now ("mostly, the code should be prepared for a migration") — this is the structural payoff that outlasts whichever specific visual redesign ships in this feature, and it's a precondition for User Stories 1 and 2 being maintainable rather than three parallel copy-pasted palettes.

**Independent Test**: Pick any screen or component at random and confirm its colors and reusable style values are sourced from the central theme definitions, not inlined as literal color codes in the component's own StyleSheet. A grep across `screens/`, `components/`, and `constants/` for hex/rgb color literals outside the central theme module returns none (excluding intentionally one-off, non-brand cases such as debug-only UI).

**Acceptance Scenarios**:

1. **Given** any component or screen file in the app, **When** its styles reference a color, **Then** that color is looked up from the central theme rather than written as a literal value in the file.
2. **Given** a new screen is added after this feature ships, **When** a developer follows the established pattern, **Then** they naturally pull colors from the central theme because that is the only path StyleSheets are written to support.

---

### Edge Cases

- What happens on a device where the OS reports an appearance/theme the app doesn't have an explicit choice for (e.g. an OS "auto"/unknown state) — the app must still resolve to one of its defined appearances rather than rendering unstyled or mixed.
- How does the app handle a component that receives no explicit theme context (e.g. rendered very early during app startup, before preferences load) — it must still render with a defined default appearance, not unstyled or with undefined colors.
- Images, icons, and tag-chip colors (`constants/Colors.js` tag entries) that carry meaning (e.g. category color-coding) must remain distinguishable and consistent in every appearance, not just visually "restyled" without regard to their functional meaning.
- What happens to a user's previously selected appearance if that option is later removed or renamed — the app must fall back to a defined default rather than erroring.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST provide a light appearance and a dark appearance, each a complete, internally consistent color/style palette covering every screen and component in the app.
- **FR-002**: Users MUST be able to select their preferred appearance from a persistent set of options — Light, Dark, Colorful, and Automatic (follows the device's own light/dark setting, updating live if the device setting changes while Automatic is selected) — and that selection MUST persist across app restarts.
- **FR-003**: The app MUST have one single source of truth for style values (colors, and any other tokens the theme introduces such as spacing or elevation) per appearance, replacing today's partial `constants/Colors.js` coverage; no component may define its own hard-coded color that duplicates or bypasses this source.
- **FR-004**: Every existing screen and component MUST be migrated to read its colors from the central theme for the selected appearance — this feature is not considered complete while any screen still shows the old, unthemed hard-coded palette under a non-default appearance.
- **FR-005**: The app's visual design (colors, and the overall look or "personality" of the UI) MUST be refreshed as part of this work — this is not a mechanical find-and-replace of the current palette into a dark variant, but a genuine restyling per the "boring and old-fashioned" complaint, expressed consistently across all appearances.
- **FR-006**: Tag chip colors and any other functionally-meaningful color coding (see `constants/Colors.js` `tagBackground`/`tagText`/`tagBorderColor`) MUST remain distinguishable and consistent in meaning across every appearance.
- **FR-007**: The theming mechanism MUST be structured so that a future migration to a different underlying styling implementation only requires changing how the central theme's values are defined/consumed, not re-touching every individual screen's styling code.
- **FR-008**: The app MUST resolve to a defined default appearance in any situation where no explicit user preference is yet known (first launch, preference not yet loaded, or an unrecognized stored value).
- **FR-009**: A third, more colorful appearance MUST be available as a selectable option alongside light and dark, meeting the same full-app coverage bar as FR-001/FR-004.
- **FR-010**: Every text/background and icon/background color pairing in every appearance MUST meet WCAG AA contrast (4.5:1 for normal text, 3:1 for large text and icons).

### Key Entities

- **Appearance/Theme**: A named, complete set of style values (at minimum colors; the specific set of tokens is an implementation decision) applied consistently across the whole app. Three theme instances exist: light, dark, and colorful. Each screen/component consumes values from whichever theme is currently active rather than owning its own values.
- **User's appearance selection**: The user's chosen option — Light, Dark, Colorful, or Automatic — stored locally on the device only (not synced via the user's account) so it persists across app restarts and is available before the rest of the app's data has loaded. Automatic is not a fourth theme; it resolves to the light or dark theme based on the device's current setting and re-resolves live if that setting changes. Selecting an appearance on one device has no effect on the user's other devices.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can switch the app's appearance and see 100% of screens (every screen reachable in normal navigation) reflect the new appearance, with zero screens still showing the old fixed palette.
- **SC-002**: An audit of the component/screen source finds zero hard-coded color literals outside the central theme definitions (excluding documented, intentional one-offs).
- **SC-003**: The app's selected appearance survives an app restart 100% of the time.
- **SC-004**: Adding a new screen after this feature ships requires zero new color literals — all needed colors already exist in, or can be reasonably composed from, the central theme.
- **SC-005**: Users can distinguish tag/category color-coding correctly in every appearance (no functional color meaning is lost when switching appearance).
- **SC-006**: Every text/background and icon/background color pairing in every appearance meets WCAG AA contrast (4.5:1 for normal text, 3:1 for large text and icons).

## Assumptions

- "Prepared for a migration to a more advanced style concept" is interpreted as: consolidate all styling into one central, per-appearance theme source with full app-wide coverage, so that a later swap of *how* that theme is implemented (e.g. adopting a themed component library) is a contained change — not as this feature itself adopting a specific third-party UI/component library. Which library (if any) to adopt is a separate future decision.
- The existing `constants/Colors.js` tag-color conventions (fixed background/text/border per tag) continue to exist conceptually in the new theme; they are restyled for visual consistency with the new look but keep their category-distinguishing purpose.
- "Every screen" means every screen currently reachable in the shipped app (all tabs, meal detail/edit flows, auth, friends, settings, dev screen), not just the most-visited ones.
- Non-visual behavior (navigation structure, data flow, permissions) is out of scope; this feature only changes how things look, not what the app does.
- On first launch (no stored preference), the app starts in Automatic mode, following the device's light/dark setting. If the device reports a state the app has no direct equivalent for, Automatic resolves to light (there is no OS counterpart to the Colorful appearance — reaching it always requires an explicit user selection).
