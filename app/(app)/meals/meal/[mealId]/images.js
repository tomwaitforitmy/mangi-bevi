import { Stack, useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import ImagesScreen from "../../../../../screens/ImagesScreen";
import EditIconOrNull from "../../../../../components/HeaderIcons/EditIconOrNull";
import GlobalBackIcon from "../../../../../components/HeaderIcons/GlobalBackIcon";

const GlobalBackButtonComponent = () => <GlobalBackIcon />;

export default function MealImagesRoute() {
  const { mealId, mealTitle, currentTabViewed } = useLocalSearchParams();
  const availableMeals = useSelector((state) => state.meals.meals);
  const selectedMeal = availableMeals.find((meal) => meal.id === mealId);
  const title = mealTitle ?? selectedMeal?.title;

  return (
    <>
      <Stack.Screen
        options={{
          title,
          // See app/(app)/meals/meal/[mealId].js for why this is forced
          // off: iOS 26 defaults the edge-swipe-back gesture to the whole
          // screen, swallowing this screen's own left/right swipe between
          // images (the same finger motion).
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
      <ImagesScreen />
    </>
  );
}
