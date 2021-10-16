import React from "react";
import MealList from "../components/MealList";
import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

function MealsScreen({ navigation }) {
  const availableMeals = useSelector((state) => state.meals.filteredMeals);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <MealList mealsList={availableMeals} navigation={navigation}></MealList>
    </View>
  );
}

const styles = StyleSheet.create({
  homeScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MealsScreen;
