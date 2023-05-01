import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import BulkEditMeal from "../components/BulkEditMeal";
import { FastFilterMeals } from "../common_functions/FastFilterMeals";
import TinyMealList from "../components/TinyMealList";
import SearchInput from "../components/SearchInput";

function DevScreen({ navigation }) {
  const allMeals = useSelector((state) => state.meals.meals);
  const [searchTerm, setSearchTerm] = useState("");

  const lessMeals = FastFilterMeals(allMeals, searchTerm);

  console.log(lessMeals.length);

  const onChangeText = async (text) => {
    setSearchTerm(text);
  };

  return (
    <View style={styles.container}>
      <SearchInput onChangeText={onChangeText} />
      <TinyMealList
        meals={lessMeals}
        onPressMeal={(m) => console.log(m.title)}
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

export default DevScreen;
