# Feature Specification: Meal Detail Swipe Gesture Coexistence

**Feature Branch**: `002-meal-detail-swipe-gestures`

**Created**: 2026-09-05

**Status**: Draft

**Input**: User description: "Restore the left-edge-vs-anywhere-else distinction for horizontal swipe gestures on the meal detail screen (MealDetailScreen.js / MealDetailScreenNotAuthenticated.js). Before an Expo SDK upgrade (around SDK 55), swiping from the very left edge triggered back navigation, while swiping left anywhere else on the screen moved to the previous (more left) tab in the meal detail's tab menu (Info/Ingredients/Steps). After the upgrade, the back gesture now claims all leftward swipes, so left-tab-swipe no longer fires — only the right-swipe (to a more right tab) still works."

## User Scenarios & Testing _(mandatory)_

<!--
  Terminology note: the two conflicting gestures below are the SAME physical
  finger motion (drag from left toward right) — they are distinguished only
  by where on screen the gesture starts, which is exactly the conflict this
  feature resolves. The always-working gesture is the opposite finger motion
  and never conflicts with anything. User stories name gestures by effect
  (previous tab / back / next tab), not by "swipe left"/"swipe right", to
  avoid implying they are opposite finger directions.
-->

### User Story 1 - Navigate to the previous tab via swipe (Priority: P1)

A user viewing a meal (Ingredients or Steps tab) performs the previous-tab swipe gesture, starting from within the screen's content area rather than the very left edge, to return to the previous tab (e.g. Steps → Ingredients → Info) — the same gesture that, started at the edge, triggers back navigation (User Story 2).

**Why this priority**: This is the regression the user explicitly reported — the swipe currently does nothing (it's swallowed by the back gesture) instead of switching tabs, breaking a previously-working interaction. It's the sole reason this feature exists.

**Independent Test**: On the Steps or Ingredients tab, perform the previous-tab gesture starting away from the left edge of the screen; verify the tab menu moves one tab toward Info and the corresponding content is shown, without leaving the meal detail screen.

**Acceptance Scenarios**:

1. **Given** the meal detail screen with the Steps tab selected, **When** the user performs the previous-tab gesture starting away from the left edge, **Then** the Ingredients tab becomes selected and its content is shown.
2. **Given** the meal detail screen with the Ingredients tab selected, **When** the user performs the previous-tab gesture starting away from the left edge, **Then** the Info tab becomes selected and its content is shown.
3. **Given** the meal detail screen with the Info tab selected (the leftmost tab), **When** the user performs the previous-tab gesture starting away from the left edge, **Then** the tab selection does not change (already the leftmost tab).

---

### User Story 2 - Navigate back via the edge swipe (Priority: P1)

A user viewing any meal detail tab performs the same gesture as User Story 1, but starting from the very left edge of the screen, to navigate back to the previous screen (the meal list or wherever they came from) — exactly as the existing back gesture already works today.

**Why this priority**: Equally critical — the fix for User Story 1 must not break this already-working, frequently-used gesture. Users rely on edge-swipe-back throughout the app; regressing it to fix the tab swipe would just trade one broken gesture for another.

**Independent Test**: On any tab, perform the gesture starting at the very left edge of the screen; verify the app navigates back to the previous screen regardless of which tab was selected.

**Acceptance Scenarios**:

1. **Given** the meal detail screen on any tab, **When** the user performs the gesture starting at the very left edge of the screen, **Then** the app navigates back to the previous screen.
2. **Given** the meal detail screen with the Info tab selected (the leftmost tab, where the same gesture started elsewhere is already a no-op per US1), **When** the user performs the gesture starting at the very left edge, **Then** the app still navigates back (edge-originated gestures are never mistaken for tab navigation).

---

### User Story 3 - Next-tab swipe keeps working (Priority: P1)

A user performs the next-tab swipe gesture (the opposite finger motion from User Stories 1/2, already unaffected by the back gesture) anywhere on the screen to move to the next tab (Info → Ingredients → Steps), exactly as it already works today.

**Why this priority**: Included at the same priority as US1/US2, not because it's broken, but because it's the same feature area and must be verified not to regress while US1/US2 are fixed.

**Independent Test**: On the Info or Ingredients tab, perform the next-tab gesture from within the content area; verify the tab menu moves one tab toward Steps.

**Acceptance Scenarios**:

1. **Given** the meal detail screen with the Info tab selected, **When** the user performs the next-tab gesture, **Then** the Ingredients tab becomes selected.
2. **Given** the meal detail screen with the Steps tab selected (the rightmost tab), **When** the user performs the next-tab gesture, **Then** the tab selection does not change.

---

### Edge Cases

- What happens when the previous-tab/back gesture starts exactly at the boundary between the edge zone and the content area? → Defaults to back navigation (the safer, OS-standard interpretation); see Assumptions.
- What happens when the user is on the Info tab (leftmost) and performs an edge-originated gesture? → Back navigation still takes priority over tab navigation (US2, Acceptance Scenario 2) — the leftmost tab's swipe being a no-op does not change edge-swipe-back behavior.
- What happens if the user starts the gesture from the edge but reverses direction mid-gesture before releasing? → Out of scope for this spec; governed by the existing native back-gesture cancellation behavior, which this feature must not alter.
- What happens on a screen where there is nothing to go back to (should not normally occur for a pushed meal detail screen, but mirrors the tab-root/pushed-screen distinction already handled elsewhere in the app)? → Edge-originated gestures with no back target must be a no-op, not a crash.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST let a user move to the previous (more left) tab on the meal detail screen via the previous-tab gesture, when that gesture starts outside the reserved back-gesture edge zone. The edge zone's width is defined by the platform/navigation library's own default edge-gesture recognition area, not a custom app-specific value.
- **FR-002**: The system MUST continue to let a user navigate back to the previous screen when the same gesture (the one covered by FR-001) starts within the reserved back-gesture edge zone, on the left side of the screen, regardless of which tab is currently selected.
- **FR-003**: The system MUST continue to let a user move to the next (more right) tab via the next-tab gesture — the opposite finger motion from FR-001/FR-002, which never enters the back-gesture edge zone and so needs no zone-based distinction (existing, already-working behavior — must not regress).
- **FR-004**: The system MUST NOT change tab selection when the currently selected tab has no tab further in the gestured direction (Info has no tab to its left; Steps has no tab to its right).
- **FR-005**: The system MUST apply this same edge-zone-vs-content-area distinction on both the authenticated meal detail screen and the non-authenticated meal detail screen.
- **FR-006**: The distinction between an edge-originated swipe and a content-area swipe MUST behave consistently on both iOS and Android. The regression being fixed was observed on iOS only (Android's back gesture was not reported broken), but the requirement going forward covers both platforms, so Android MUST be explicitly verified (and fixed if needed), not merely assumed to already work.
- **FR-007**: The system MUST NOT change any other existing meal detail screen interaction (tapping a tab directly, viewing images, opening the reactions modal, etc.) as a result of this fix.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: A user performing the previous-tab gesture from within the meal detail screen's content area reaches the previous tab, restoring the behavior reported as broken.
- **SC-002**: A user performing the same gesture from the screen's left edge reaches the previous screen from every tab of the meal detail screen, with no observed loss of reliability compared to the app's other edge-swipe-back screens.
- **SC-003**: Manual verification across both supported platforms confirms the two gestures are consistently and correctly distinguished (no unintended back navigation while attempting a tab swipe, and no unintended tab change while attempting to go back).
- **SC-004**: All existing automated tests continue to pass, and no other meal detail screen interaction (tab taps, images, reactions) shows a regression during manual review.

## Assumptions

- When a swipe's starting point falls exactly on the boundary between the back-gesture edge zone and the content area, it is treated as a back-gesture attempt (favors the platform-standard interpretation over the app-specific tab swipe).
- The regression is triggered by a change in how the underlying navigation library recognizes/prioritizes edge gestures after the Expo SDK upgrade, not by a change in the app's own tab-swipe detection code, which has not been modified since it last worked correctly.
- No user-facing settings or preferences are needed to control this behavior — the edge-zone/content-area split is fixed for all users.
- If investigation during planning confirms this is a regression in an upstream library (e.g. `react-native-screens`) rather than something fixable purely in app code, filing an upstream bug report is in scope for this feature's work, not just a workaround in app code.
