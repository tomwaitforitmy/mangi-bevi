import React from "react";
import MealList from "../components/MealList";
import { View, Text, StyleSheet, Button } from "react-native";
import { MEALS } from "../data/DummyMeals";

function HomeScreen({ navigation }) {
  const displayedMeals = MEALS;

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <MealList mealsList={displayedMeals} navigation={navigation}></MealList>
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

export default HomeScreen;
