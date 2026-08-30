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
          headerLeft: GlobalBackButtonComponent,
          headerRight: () => (
            <EditIconOrNull mealId={mealId} currentTab={currentTabViewed} />
          ),
        }}
      />
      <MealDetailScreen />
    </>
  );
}
