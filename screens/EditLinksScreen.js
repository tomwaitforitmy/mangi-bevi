import React from "react";
import { View, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import MultiSelectMealsList from "../components/MultiSelectMealsList";
import * as mealActions from "../store/actions/mealsAction";

function EditLinksScreen({ navigation, route }) {
  const { mealId } = route.params;

  const allMeals = useSelector((state) => state.meals.meals);
  const selectedMeal = allMeals.find((meal) => meal.id === mealId);

  const availableMeals = allMeals.filter((m) => m.id !== mealId);
  const dispatch = useDispatch();

  //   Todo
  // * Close the view
  // * Navigate to new screen (reset view)
  // * Check other meals
  // * Set existing links as selected values

  const onEndSelection = async (meals) => {
    const selectedMeals = meals.filter((m) => m.isSelected);
    // console.log("onEndSelection", selectedMeal);
    selectedMeal.links = [];
    await Promise.all(
      selectedMeals.map(async (m) => {
        selectedMeal.links.push(m.id);
        if (!m.links.includes(selectedMeal.id)) {
          m.links.push(selectedMeal.id);
        }
        // await dispatch(mealActions.editMeal(m));
        console.log(m.links);
      }),
    );
    //await dispatch(mealActions.editMeal(selectedMeal));

    console.log(selectedMeal.links);
  };

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
