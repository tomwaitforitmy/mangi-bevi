import React, { useState } from "react";
import { View, StyleSheet, Button } from "react-native";
import { useSelector } from "react-redux";
import BulkEditMeal from "../components/BulkEditMeal";
import LevelsViewModal from "../components/LevelsViewModal";
import MultiSelectMealsList from "../components/MultiSelectMealsList";

function DevScreen({ navigation }) {
  const allMeals = useSelector((state) => state.meals.meals);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const onMealPress = (meal) => {
    setSelectedMeals(() => selectedMeals.push(meal.id));
    console.log("Pressed" + meal.id);
  };

  return (
    <View style={styles.container}>
      <MultiSelectMealsList
        meals={allMeals}
        onMealPress={onMealPress}
        selectedMeals={selectedMeals}
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

export default DevScreen;
