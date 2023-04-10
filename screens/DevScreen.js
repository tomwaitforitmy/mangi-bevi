import React from "react";
import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import BulkEditMeal from "../components/BulkEditMeal";
import LevelsViewModal from "../components/LevelsViewModal";
import MultiSelectMealsList from "../components/MultiSelectMealsList";

function DevScreen({ navigation }) {
  const allMeals = useSelector((state) => state.meals.meals);
  const lessMeals = allMeals.slice(0, 100);

  console.log(lessMeals.length);

  const onEndSelection = (meals) => {
    const selectedMeals = meals.filter((m) => m.isSelected);
    selectedMeals.map((m) => console.log(m.title));
  };

  return (
    <View style={styles.container}>
      <MultiSelectMealsList meals={lessMeals} onEndSelection={onEndSelection} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
});

export default DevScreen;
