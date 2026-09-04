import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import MultiSelectMealsList from "../components/MultiSelectMealsList";
import { editLinks } from "../firebase/editLinks";
import LoadingIndicator from "../components/LoadingIndicator";
import { PrepareSelectedLinks } from "../common_functions/PrepareSelectedLinks";
import SearchInput from "../components/SearchInput";
import { FastFilterMeals } from "../common_functions/FastFilterMeals";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function EditLinksScreen() {
  const { mealId } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const allMeals = useSelector((state) => state.meals.meals);
  const selectedMeal = allMeals.find((meal) => meal.id === mealId);
  const availableMeals = allMeals.filter((m) => m.id !== mealId);
  let visibleMeals = null;

  const [searchTerm, setSearchTerm] = useState();

  const dispatch = useDispatch();

  const onChangeText = async (text) => {
    setSearchTerm(text);
  };

  const localAvailableMeals = PrepareSelectedLinks(
    availableMeals,
    selectedMeal.links,
  );

  const [isLoading, setIsLoading] = useState(false);

  //   Todo
  // * Navigate to new screen (reset view)

  const onEndSelection = async (meals) => {
    setIsLoading(true);
    const mealsToLink = meals.filter((m) => m.isSelected);
    await editLinks(dispatch, selectedMeal, mealsToLink, localAvailableMeals);
    setIsLoading(false);

    router.dismissTo({
      pathname: "/meals/meal/[mealId]",
      params: { mealId: selectedMeal.id, mealTitle: selectedMeal.title },
    });
  };

  if (searchTerm) {
    visibleMeals = FastFilterMeals(localAvailableMeals, searchTerm);
  }

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    // NativeTabs' native tab bar overlaps content (edge-to-edge) instead of
    // reserving space for itself like the old JS bottom tabs did, so the
    // "Done selecting" button would otherwise render underneath the tab bar.
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <SearchInput
        onChangeText={onChangeText}
        numberOfLabels={
          visibleMeals ? visibleMeals.length : localAvailableMeals.length
        }
        label={"Mangis"}
      />
      <MultiSelectMealsList
        meals={localAvailableMeals}
        visibleMeals={visibleMeals ? visibleMeals : localAvailableMeals}
        onEndSelection={onEndSelection}
        searchTerm={searchTerm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
});

export default EditLinksScreen;
