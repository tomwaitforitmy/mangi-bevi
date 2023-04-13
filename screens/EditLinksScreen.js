import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import MultiSelectMealsList from "../components/MultiSelectMealsList";
import { editLinks } from "../firebase/editLinks";
import LoadingIndicator from "../components/LoadingIndicator";
import { PrepareSelectedLinks } from "../common_functions/PrepareSelectedLinks";

function EditLinksScreen({ navigation, route }) {
  const { mealId } = route.params;

  const allMeals = useSelector((state) => state.meals.meals);
  const selectedMeal = allMeals.find((meal) => meal.id === mealId);

  const availableMeals = allMeals.filter((m) => m.id !== mealId);

  PrepareSelectedLinks(availableMeals, selectedMeal.links);

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  //   Todo
  // * Navigate to new screen (reset view)
  // * Delete selectedMeal.id in other meals that are no selected as links anymore

  const onEndSelection = async (meals) => {
    const selectedMeals = meals.filter((m) => m.isSelected);

    setIsLoading(true);

    await editLinks(dispatch, selectedMeal, selectedMeals);
    setIsLoading(false);

    navigation.navigate({
      name: "Details",
      params: {
        mealId: selectedMeal.id,
        mealTitle: selectedMeal.title,
      },
    });
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      <MultiSelectMealsList
        meals={availableMeals}
        onEndSelection={onEndSelection}
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
