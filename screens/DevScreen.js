import React, { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { useSelector } from "react-redux";
import BulkEditMeal from "../components/BulkEditMeal";
import LevelsViewModal from "../components/LevelsViewModal";
import MultiSelectMealsList from "../components/MultiSelectMealsList";
import { FastFilterMeals } from "../common_functions/FastFilterMeals";
import { Input } from "react-native-elements";
import Colors from "../constants/Colors";

function DevScreen({ navigation }) {
  const allMeals = useSelector((state) => state.meals.meals);
  const [searchTerm, setSearchTerm] = useState("");

  const lessMeals = FastFilterMeals(allMeals, searchTerm);

  console.log(lessMeals.length);

  const onEndSelection = (meals) => {
    const selectedMeals = meals.filter((m) => m.isSelected);
    selectedMeals.map((m) => console.log(m.title));
  };

  const onChangeText = (text) => {
    setSearchTerm(text.toLowerCase());
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <TextInput
          placeholder="Enter text"
          onChangeText={(value) => onChangeText(value)}
          style={styles.searchTerm}
        />
      </View>
      <MultiSelectMealsList meals={lessMeals} onEndSelection={onEndSelection} />
    </View>
  );
}

const styles = StyleSheet.create({
  searchTerm: {
    backgroundColor: Colors.screenBackGround,
    fontSize: 14,
    margin: 5,
    paddingLeft: 10,
    borderRadius: 25,
    color: "black",
  },
  textContainer: {
    backgroundColor: Colors.primary,
  },
  container: {
    flex: 1,
    width: "100%",
  },
});

export default DevScreen;
