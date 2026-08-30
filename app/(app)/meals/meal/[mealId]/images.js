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
          headerLeft: GlobalBackButtonComponent,
          headerRight: () => (
            <EditIconOrNull mealId={mealId} currentTab={currentTabViewed} />
          ),
        }}
      />
      <ImagesScreen />
    </>
  );
}
