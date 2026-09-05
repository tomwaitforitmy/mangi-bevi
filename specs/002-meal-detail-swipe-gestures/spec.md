# Feature Specification: Meal Detail Swipe Gesture Coexistence

**Feature Branch**: `002-meal-detail-swipe-gestures`

**Created**: 2026-09-05

**Status**: Draft

**Input**: User description: "Restore the left-edge-vs-anywhere-else distinction for horizontal swipe gestures on the meal detail screen (MealDetailScreen.js / MealDetailScreenNotAuthenticated.js). Before an Expo SDK upgrade (around SDK 55), swiping from the very left edge triggered back navigation, while swiping left anywhere else on the screen moved to the previous (more left) tab in the meal detail's tab menu (Info/Ingredients/Steps). After the upgrade, the back gesture now claims all leftward swipes, so left-tab-swipe no longer fires — only the right-swipe (to a more right tab) still works."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Swipe left to a previous tab (Priority: P1)

A user viewing a meal (Ingredients or Steps tab) swipes left, starting from within the screen's content area, to return to the previous tab (e.g. Steps → Ingredients → Info), the same way swiping right already moves them to the next tab.

**Why this priority**: This is the regression the user explicitly reported — the swipe currently does nothing (it's swallowed by the back gesture) instead of switching tabs, breaking a previously-working interaction. It's the sole reason this feature exists.

**Independent Test**: On the Steps or Ingredients tab, perform a leftward swipe starting away from the left edge of the screen; verify the tab menu moves one tab to the left and the corresponding content is shown, without leaving the meal detail screen.

**Acceptance Scenarios**:

1. **Given** the meal detail screen with the Steps tab selected, **When** the user swipes left starting away from the left edge, **Then** the Ingredients tab becomes selected and its content is shown.
2. **Given** the meal detail screen with the Ingredients tab selected, **When** the user swipes left starting away from the left edge, **Then** the Info tab becomes selected and its content is shown.
3. **Given** the meal detail screen with the Info tab selected (the leftmost tab), **When** the user swipes left starting away from the left edge, **Then** the tab selection does not change (already the leftmost tab).

---

### User Story 2 - Swipe back from the screen edge (Priority: P1)

A user viewing any meal detail tab swipes right starting from the very left edge of the screen to navigate back to the previous screen (the meal list or wherever they came from), exactly as the existing back gesture already works.

**Why this priority**: Equally critical — the fix for User Story 1 must not break this already-working, frequently-used gesture. Users rely on edge-swipe-back throughout the app; regressing it to fix the tab swipe would just trade one broken gesture for another.

**Independent Test**: On any tab, perform a rightward swipe starting at the very left edge of the screen; verify the app navigates back to the previous screen regardless of which tab was selected.

**Acceptance Scenarios**:

1. **Given** the meal detail screen on any tab, **When** the user swipes right starting at the very left edge of the screen, **Then** the app navigates back to the previous screen.
2. **Given** the meal detail screen with the Info tab selected (the leftmost tab, where a content-area left-swipe is already a no-op per US1), **When** the user swipes right starting at the very left edge, **Then** the app still navigates back (edge-originated swipes are never mistaken for tab navigation).

---

### User Story 3 - Existing right-swipe tab navigation keeps working (Priority: P1)

A user swipes right anywhere on the screen to move to the next tab (Info → Ingredients → Steps), exactly as it already works today.

**Why this priority**: Lower priority only because it isn't broken today — it's included so the fix for US1/US2 is verified not to regress it.

**Independent Test**: On the Info or Ingredients tab, swipe right from within the content area; verify the tab menu moves one tab to the right.

**Acceptance Scenarios**:

1. **Given** the meal detail screen with the Info tab selected, **When** the user swipes right, **Then** the Ingredients tab becomes selected.
2. **Given** the meal detail screen with the Steps tab selected (the rightmost tab), **When** the user swipes right, **Then** the tab selection does not change.

---

### Edge Cases

- What happens when a swipe starts exactly at the boundary between the "edge back-gesture zone" and the "tab-swipe content area"? → Defaults to back navigation (the safer, OS-standard interpretation); see Assumptions.
- What happens when the user is on the Info tab (leftmost) and performs an edge-originated swipe? → Back navigation still takes priority over tab navigation (US2, Acceptance Scenario 2) — leftmost-tab-swipe being a no-op does not change edge-swipe-back behavior.
- What happens if the user starts a swipe from the edge but reverses direction mid-gesture (e.g. starts a back-swipe then moves the finger the other way) before releasing? → Out of scope for this spec; governed by the existing native back-gesture cancellation behavior, which this feature must not alter.
- What happens on a screen where there is nothing to go back to (should not normally occur for a pushed meal detail screen, but mirrors the tab-root/pushed-screen distinction already handled elsewhere in the app)? → Edge-originated swipes with no back target must be a no-op, not a crash.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST let a user move to the previous (more left) tab on the meal detail screen by swiping left, when the swipe starts outside the reserved back-gesture edge zone. The edge zone's width is defined by the platform/navigation library's own default edge-gesture recognition area, not a custom app-specific value.
- **FR-002**: The system MUST continue to let a user navigate back to the previous screen by swiping right starting within the reserved back-gesture edge zone, on the left side of the screen, regardless of which tab is currently selected.
- **FR-003**: The system MUST continue to let a user move to the next (more right) tab by swiping right starting outside the reserved back-gesture edge zone (existing, already-working behavior — must not regress).
- **FR-004**: The system MUST NOT change tab selection when the currently selected tab has no tab further in the swiped direction (Info has no tab to its left; Steps has no tab to its right).
- **FR-005**: The system MUST apply this same edge-zone-vs-content-area distinction on both the authenticated meal detail screen and the non-authenticated meal detail screen.
- **FR-006**: The distinction between an edge-originated swipe and a content-area swipe MUST behave consistently on both iOS and Android. The regression being fixed was observed on iOS only (Android's back gesture was not reported broken), but the requirement going forward covers both platforms, so Android MUST be explicitly verified (and fixed if needed), not merely assumed to already work.
- **FR-007**: The system MUST NOT change any other existing meal detail screen interaction (tapping a tab directly, viewing images, opening the reactions modal, etc.) as a result of this fix.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: A user swiping left from within the meal detail screen's content area reaches the previous tab, restoring the behavior reported as broken.
- **SC-002**: A user swiping right from the screen's left edge reaches the previous screen from every tab of the meal detail screen, with no observed loss of reliability compared to the app's other edge-swipe-back screens.
- **SC-003**: Manual verification across both supported platforms confirms the two gestures are consistently and correctly distinguished (no unintended back navigation while attempting a tab swipe, and no unintended tab change while attempting to go back).
- **SC-004**: All existing automated tests continue to pass, and no other meal detail screen interaction (tab taps, images, reactions) shows a regression during manual review.

## Assumptions

- When a swipe's starting point falls exactly on the boundary between the back-gesture edge zone and the content area, it is treated as a back-gesture attempt (favors the platform-standard interpretation over the app-specific tab swipe).
- The regression is triggered by a change in how the underlying navigation library recognizes/prioritizes edge gestures after the Expo SDK upgrade, not by a change in the app's own tab-swipe detection code, which has not been modified since it last worked correctly.
- No user-facing settings or preferences are needed to control this behavior — the edge-zone/content-area split is fixed for all users.
- If investigation during planning confirms this is a regression in an upstream library (e.g. `react-native-screens`) rather than something fixable purely in app code, filing an upstream bug report is in scope for this feature's work, not just a workaround in app code.
