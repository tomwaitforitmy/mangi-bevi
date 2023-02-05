import React, { useState } from "react";
import { View, StyleSheet, Button } from "react-native";
import { useSelector } from "react-redux";
import BulkEditMeal from "../components/BulkEditMeal";
import LevelsViewModal from "../components/LevelsViewModal";
import MultiSelectMealsList from "../components/MultiSelectMealsList";

function DevScreen({ navigation }) {
  // const [modalVisible, setModalVisible] = useState(false);
  const allMeals = useSelector((state) => state.meals.meals);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const onMealPress = (meal) => {
    console.log("Pressed" + meal.title);
  };

  return (
    <View style={styles.container}>
      <MultiSelectMealsList
        meals={allMeals}
        onMealPress={onMealPress}
        selectedMeals={selectedMeals}
        setSelectedMeals={setSelectedMeals}
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
