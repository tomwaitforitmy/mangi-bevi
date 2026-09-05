# Quickstart: Meal Detail Swipe Gesture Coexistence

Validates the fix from `plan.md` (`fullScreenGestureEnabled: false` on the meal detail
`Stack.Screen` options). Native gesture-recognizer behavior isn't exercisable by Jest — this is a
manual device/simulator walkthrough, run once per platform per FR-006/SC-003.

## Prerequisites

- A build with the change applied (Metro reload is sufficient — no native code or config-plugin
  change, so no dev-client rebuild is required; see `CLAUDE.md`'s "no rebuild needed" pattern).
- iOS: a device or simulator running **iOS 26+** (the regression is iOS-26-specific; verifying on
  an older iOS version won't exercise the bug this feature fixes, though it should still confirm
  no regression there).
- Android: any device/emulator on the app's supported range.
- At least one existing meal with content on all three tabs (Info, Ingredients, Steps) to navigate
  into — `EXPO_PUBLIC_DEV_MODE=true` recommended so any test meal created along the way is flagged
  `isTestMangi: true` and disposable.
- Run through both the authenticated meal detail screen (`app/(app)/meals/meal/[mealId].js`) and
  the non-authenticated one (`app/(auth)/detail/[mealId].js`, reachable while logged out) — the fix
  is applied to both routes independently.

## Scenarios

Run each on iOS 26+ first (where the regression reproduces pre-fix), then Android.

1. **Previous-tab gesture, content area** (US1 / SC-001)
   - Open a meal, navigate to the Steps tab.
   - Perform the previous-tab swipe gesture starting from the middle of the screen (not the edge).
   - Expect: Ingredients tab becomes selected. Repeat once more: Info tab becomes selected.
   - Repeat once more from Info: expect no change (already leftmost — FR-004).

2. **Edge swipe still goes back** (US2 / SC-002)
   - From any tab, perform the same gesture as scenario 1 but starting at the very left edge of
     the screen.
   - Expect: navigates back to the previous screen (meal list / wherever you came from), regardless
     of which tab was selected.
   - Repeat from the Info tab specifically (Acceptance Scenario 2 of US2) — expect back navigation
     still fires even though the same gesture from the content area would have been a no-op there.

3. **Next-tab gesture unaffected** (US3)
   - From the Info tab, perform the next-tab gesture (opposite finger motion from scenarios 1–2)
     from within the content area.
   - Expect: Ingredients, then Steps tab selected in turn; no change when already on Steps.

4. **No other regressions** (FR-007)
   - On each tab, tap a tab button directly (not swipe) — still switches tabs immediately.
   - Open an image, open the reactions modal (if applicable) — no change in behavior.
   - If editable, confirm the edit-icon header button still works.

## Expected Outcome

All four scenarios pass identically on iOS 26+, older iOS, and Android, on both routes. If Android
diverges (scenario 1 or 2 fails there), that's a new finding — capture it as a follow-up task
rather than assuming the iOS fix covers it (see `research.md` §3).
