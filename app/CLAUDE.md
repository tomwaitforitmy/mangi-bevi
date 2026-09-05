Routing structure and `NativeTabs` conventions for this directory. See root `CLAUDE.md` for the
`@react-navigation/*` import ban and the `react-native-screens` header-bug workaround, which apply
project-wide, not just here.

File-based routing via **Expo Router**, under `app/`. `app/_layout.js` is the root: global setup
(Redux `Provider`, splash hold, etc., moved from the old `App.js`) plus a `Stack.Protected` split
between `app/(app)/` (authenticated, `Tabs`: Meals/Dev/Filters/Profile/New) and `app/(auth)/`
(not authenticated, plain `Stack` — `MealsScreenNotAuthenticated`/`MealDetailScreenNotAuthenticated`
are real, separate implementations, not a login wall). `app/debug.js` is the `EXPO_PUBLIC_DEBUG_MODE`
override, gated in `app/_layout.js` ahead of the auth split. `app/meal/[mealId].js` is a small
unconditional redirector owning the public `mangibevi://meal/{mealId}` deep link — it forwards to
`(app)/meals/meal/[mealId]` or `(auth)/detail/[mealId]` depending on auth state; the two groups
deliberately do **not** share that path (Expo Router can't disambiguate an identical path across
two `Stack.Protected` groups from a URL alone). See `specs/001-expo-router-migration/` for the full
route table and the reasoning behind the auth-split design.

`app/(app)/_layout.js` is a **`NativeTabs`** (`expo-router/unstable-native-tabs`), a real native
tab bar (UITabBarController on iOS — picks up iOS 26 Liquid Glass automatically; BottomNavigationView
on Android), not a JS-drawn one. A native tab controller has no per-tab header of its own, so every
one of the 5 tabs is its own folder with a single-screen `Stack` (`_layout.js` + `index.js`),
mirroring what `meals/`/`profile/` already needed — headers are exclusively a `Stack` concern here.
Tab icons use `NativeTabs.Trigger.Icon` + `NativeTabs.Trigger.VectorIcon`
(`family={Ionicons|MaterialDesignIcons}`, not the old `tabBarIcon` render-prop), with separate
`default`/`selected` icon names where the old code had outline/filled variants.
`hidden={!DEV_MODE}` replaces the old `href: DEV_MODE ? undefined : null` trick for hiding the Dev
tab in production. Don't set an iOS `backgroundColor` on `NativeTabs` — Apple's HIG says not to
paint over the native Liquid Glass material; Android has no glass material and keeps an explicit
brand background.
