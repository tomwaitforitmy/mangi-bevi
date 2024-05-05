import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import MultiSelectMealsList from "../components/MultiSelectMealsList";
import { editLinks } from "../firebase/editLinks";
import LoadingIndicator from "../components/LoadingIndicator";
import { PrepareSelectedLinks } from "../common_functions/PrepareSelectedLinks";
import SearchInput from "../components/SearchInput";
import { FastFilterMeals } from "../common_functions/FastFilterMeals";

function EditLinksScreen({ navigation, route }) {
  const { mealId } = route.params;

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

    navigation.navigate({
      name: "Details",
      params: {
        mealId: selectedMeal.id,
        mealTitle: selectedMeal.title,
        isAuthenticated: true,
      },
    });
  };

  if (searchTerm) {
    visibleMeals = FastFilterMeals(localAvailableMeals, searchTerm);
  }

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
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
