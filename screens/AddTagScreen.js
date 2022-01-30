import React, { useState } from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as mealActions from "../store/actions/mealsAction";
import LoadingIndicator from "../components/LoadingIndicator";
import TagList from "../components/TagList";
import { TAGS } from "../data/DummyTags";

function AddTagScreen({ route, navigation }) {
  const { mealId } = route.params;
  const [isLoading, setIsLoading] = useState(false);

  const availableMeals = useSelector((state) => state.meals.meals);
  const selectedMeal = availableMeals.find((meal) => meal.id === mealId);

  const dispatch = useDispatch();

  const addTag = async (meal) => {
    setIsLoading(true);
    try {
      console.log(meal);
      await dispatch(mealActions.editMeal(meal));
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Tags of {selectedMeal.title}</Text>
      <TagList tags={selectedMeal.tags}></TagList>
      <Text style={styles.subtitle}>Available Tags</Text>
      <TagList tags={TAGS}></TagList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  subtitle: {
    fontSize: 22,
    textAlign: "center",
  },
});

export default AddTagScreen;
