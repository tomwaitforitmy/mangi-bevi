# Research: Meal Detail Swipe Gesture Coexistence

## 1. Root cause of the regression

**Decision**: The regression is caused by `react-native-screens`' native-stack `fullScreenSwipeEnabled`
option changing its **default value** on iOS 26, not by any change in this app's own code.

**Rationale**: The installed `react-native-screens` package (`node_modules/react-native-screens/lib/typescript/types.d.ts`,
v4.26.2, already in `package.json`) documents this directly on the option itself:

> Boolean indicating whether the swipe gesture should work on whole screen. The behavior depends on
> iOS version. For iOS 26 and up, native `interactiveContentPopGestureRecognizer` is used, and this
> prop controls whether it should be enabled or not. **When not set, it defaults to `false` on iOS
> < 26 and `true` for iOS >= 26.**

Neither of the app's meal detail routes (`app/(app)/meals/meal/[mealId].js`,
`app/(auth)/detail/[mealId].js`) sets `fullScreenSwipeEnabled` today, so on a device running iOS 26
the native back-swipe recognizer now claims drags starting **anywhere on the screen**, not just the
left edge. The previous-tab gesture (`TrySelectLeftTab`, triggered by the same rightward drag
motion the OS back gesture uses) gets swallowed as a result — matching the reported symptom
exactly ("swipe left [i.e. the previous-tab gesture] is being overwritten by the back gesture").
The next-tab gesture (`TrySelectRightTab`) is the opposite finger motion, which the back-gesture
recognizer never claims, so it was never affected — also matching the report. Independent
confirmation via web search: `react-navigation/react-navigation` issue #12759 ("[iOS 26] Enable
native full screen swipe back gesture") and #12760 (fullscreen gesture conflicting with scrollable
content) describe the same iOS 26 default-behavior change in the same library.

This also explains why the user attributed the timing to an "Expo SDK upgrade around SDK 55" —
the SDK bump and the move to a device/simulator running iOS 26 likely happened together, but the
trigger is the **iOS version**, not the Expo SDK version; `fullScreenSwipeEnabled`'s default is
keyed off iOS version in the library's own logic, not off any Expo or React Native version.

**Alternatives considered**:
- *A change in this app's touch-handling code* — ruled out; `MealDetailScreen.js`'s
  `onTouchStart`/`onTouchEnd` swipe detection is unchanged since it last worked (confirmed via the
  spec's own Assumptions, consistent with there being no other explanation once the library's
  documented default-flip was found).
- *A React Native new-architecture (Fabric) touch-responder change* — plausible in the abstract,
  but unnecessary as an explanation once the `fullScreenSwipeEnabled` default was found directly
  documented as iOS-version-gated.

## 2. Fix mechanism

**Decision**: Explicitly set `fullScreenGestureEnabled: false` in the `Stack.Screen` options for both
meal detail routes. Do **not** use `gestureResponseDistance`, and do **not** migrate the existing
`onTouchStart`/`onTouchEnd` tab-swipe detection to `react-native-gesture-handler`.

**Correction (found during implementation)**: `fullScreenSwipeEnabled` (used above and elsewhere in
this document) is `react-native-screens`' own native `ScreenStackItem` prop name — it is **not** a
recognized `Stack.Screen` option in expo-router's vendored react-navigation native-stack layer.
That layer exposes the option as `fullScreenGestureEnabled` and maps it internally
(`fullScreenSwipeEnabled: fullScreenGestureEnabled` in `expo-router/build/react-navigation/native-stack/views/NativeStackView.native.js`).
Setting `fullScreenSwipeEnabled` directly on `Stack.Screen options` is silently ignored (unrecognized
key) — confirmed on-device: the first implementation attempt using that name made no observable
difference. `fullScreenGestureEnabled` is the correct app-code option name; every other reference to
`fullScreenSwipeEnabled` in this document describes the underlying native-screens default/prop this
option controls, not what app code should write.

**Rationale**: Setting `fullScreenSwipeEnabled: false` restores native-stack's pre-iOS-26 default —
the back gesture reverts to edge-only recognition (the platform's own built-in edge width, which is
exactly what FR-001's clarified answer asked for: use the library's default rather than a custom
value). Since the previous-tab/back conflict is entirely a *recognizer-claims-the-whole-screen*
problem, undoing that directly resolves it; no additional customization (`gestureResponseDistance`,
which the type declarations describe as "to be used alongside `fullScreenSwipeEnabled`" for tuning
a still-expanded gesture area) is needed once the option is simply turned off. This keeps the fix
to two declarative one-line option additions, consistent with Constitution Principle VI (Minimal
Footprint) and avoids introducing `react-native-gesture-handler` machinery (`GestureDetector`,
`Gesture.Pan()`) to a screen that doesn't otherwise need it — the existing raw touch-event tab-swipe
logic was never the broken part and doesn't need to change.

**Alternatives considered**:
- *Set `gestureResponseDistance` to a fixed edge width, keeping `fullScreenSwipeEnabled: true`* —
  rejected; this is `@platform ios`-only, requires picking and maintaining an app-specific pixel
  value (contrary to the clarified FR-001 answer), and is solving a problem
  (`fullScreenSwipeEnabled` defaulting on) that has a simpler direct fix.
- *Migrate the tab-swipe to `react-native-gesture-handler`'s `Gesture.Pan()` with a `Gesture.Race()`/`Gesture.Exclusive()`
  against the native back gesture, or `.blocksExternalGesture()`* — this is the kind of complex,
  hand-rolled gesture-arbitration approach the original bug report anticipated might be necessary.
  Rejected as unnecessary complexity once the root cause turned out to be a simple option default;
  worth revisiting only if manual verification (Android, or an edge case) shows the declarative fix
  is insufficient.

## 3. Android scope

**Decision**: Android needs hands-on device/emulator verification during implementation, not a
code change presumed up front. No change is planned for Android unless verification finds a
regression there.

**Rationale**: `fullScreenSwipeEnabled` and `gestureResponseDistance` are both documented
`@platform ios` only in `react-native-screens`. Android's back navigation is not mediated by an
`interactiveContentPopGestureRecognizer`-style native gesture competing with app touch responders
the same way — it's the system-level back gesture/button (Android's predictive-back on API 33+ is
OS-owned and edge-scoped by the system, not by an app-configurable native-stack option). This
suggests Android was never affected by the iOS-26-specific default flip in the first place,
matching that the user only reported this on iOS. FR-006 (both platforms in scope going forward)
is satisfied by explicit verification rather than a speculative Android-specific code change with
no known problem to fix.

**Alternatives considered**:
- *Proactively add an Android-specific gesture workaround* — rejected; no evidence of an Android
  problem, and Constitution Principle VI (Minimal Footprint) argues against unrequested/unproven
  changes. If verification finds a real Android issue, that becomes a follow-up task, not a
  guess baked into this plan.

## 4. Upstream bug report

**Decision**: No upstream bug report is warranted for *this* app's regression — it is caused by an
intentional, documented library behavior change (the iOS 26 default), not a library bug. File a
report only if manual verification during implementation surfaces an actual defect (e.g. the
`false` override not working as documented, or an Android regression with no corresponding option
to fix it).

**Rationale**: The spec's Assumptions section pre-authorized filing a bug report if this turned out
to be an upstream regression rather than something fixable in app code. Research found the opposite
of a library bug: `react-native-screens` behaves exactly as its own documentation says, and exposes
the exact option (`fullScreenSwipeEnabled`) needed to opt back out. There is nothing to report
upstream at this stage.

**Alternatives considered**: N/A — this is a status determination, not a design choice.
