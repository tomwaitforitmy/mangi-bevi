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
        options={{ title, headerLeft: GlobalBackButtonComponent }}
      />
      <ImagesScreen />
    </>
  );
}
