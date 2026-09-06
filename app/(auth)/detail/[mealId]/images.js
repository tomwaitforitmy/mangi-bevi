import { Stack, useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import ImagesScreen from "../../../../screens/ImagesScreen";
import GlobalBackIcon from "../../../../components/HeaderIcons/GlobalBackIcon";

const GlobalBackButtonComponent = () => <GlobalBackIcon />;

export default function AuthMealImagesRoute() {
  const { mealId, mealTitle } = useLocalSearchParams();
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
        }}
      />
      <ImagesScreen />
    </>
  );
}
