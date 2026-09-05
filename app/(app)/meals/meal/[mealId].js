import { Stack, useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import MealDetailScreen from "../../../../screens/MealDetailScreen";
import EditIconOrNull from "../../../../components/HeaderIcons/EditIconOrNull";
import GlobalBackIcon from "../../../../components/HeaderIcons/GlobalBackIcon";

const GlobalBackButtonComponent = () => <GlobalBackIcon />;

export default function MealDetailRoute() {
  const { mealId, mealTitle, currentTabViewed } = useLocalSearchParams();
  const availableMeals = useSelector((state) => state.meals.meals);
  const selectedMeal = availableMeals.find((meal) => meal.id === mealId);
  const title = mealTitle ?? selectedMeal?.title;

  return (
    <>
      <Stack.Screen
        options={{
          title,
          // iOS 26 defaults native-stack's back-swipe recognizer to the
          // whole screen (react-native-screens' fullScreenSwipeEnabled
          // default flips true there), which swallows the previous-tab
          // swipe gesture (MealDetailScreen's TrySelectLeftTab) since it's
          // the same finger motion. Forcing this back to edge-only restores
          // the pre-iOS-26 split between the two gestures. Must be named
          // fullScreenGestureEnabled here — that's expo-router/react-navigation's
          // option name, which maps internally to react-native-screens'
          // fullScreenSwipeEnabled native prop; the native prop name itself
          // isn't a recognized Stack.Screen option and is silently dropped.
          fullScreenGestureEnabled: false,
          headerLeft: GlobalBackButtonComponent,
          headerRight: () => (
            // Keyed by mealId so the native header fully remounts this icon
            // on navigation instead of reconciling in place — guards against
            // a stale header button surviving a permission change.
            <EditIconOrNull
              key={mealId}
              mealId={mealId}
              currentTab={currentTabViewed}
            />
          ),
        }}
      />
      <MealDetailScreen />
    </>
  );
}
