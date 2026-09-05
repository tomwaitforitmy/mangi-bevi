import { Stack, useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import MealDetailScreenNotAuthenticated from "../../../screens/MealDetailScreenNotAuthenticated";
import GlobalBackIcon from "../../../components/HeaderIcons/GlobalBackIcon";

const GlobalBackButtonComponent = () => <GlobalBackIcon />;

export default function AuthMealDetailRoute() {
  const { mealId, mealTitle } = useLocalSearchParams();
  const availableMeals = useSelector((state) => state.meals.meals);
  const selectedMeal = availableMeals.find((meal) => meal.id === mealId);
  const title = mealTitle ?? selectedMeal?.title;

  return (
    <>
      <Stack.Screen
        options={{
          title,
          // See app/(app)/meals/meal/[mealId].js for why this is forced off,
          // and why the option name here differs from react-native-screens'
          // own native prop name.
          fullScreenGestureEnabled: false,
          headerLeft: GlobalBackButtonComponent,
        }}
      />
      <MealDetailScreenNotAuthenticated />
    </>
  );
}
