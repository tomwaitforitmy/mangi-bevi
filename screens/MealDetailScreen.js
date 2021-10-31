import React from "react";
import { StyleSheet, ScrollView, Image, Text } from "react-native";
import { useSelector } from "react-redux";
import MyListItem from "../components/MyListItem";

function MealDetailScreen({ route, navigation }) {
  const { mealId } = route.params;

  const availableMeals = useSelector((state) => state.meals.meals);
  const selectedMeal = availableMeals.find((meal) => meal.id === mealId);

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: selectedMeal.imageUrl }}
        style={styles.image}
      ></Image>
      <Text style={styles.subtitle}>Ingredients</Text>
      {selectedMeal.ingredients.map((ingredient) => (
        <MyListItem key={ingredient} title={ingredient}></MyListItem>
      ))}
      <Text style={styles.subtitle}>Steps</Text>
      {selectedMeal.steps.map((step) => (
        <MyListItem key={step} title={step}></MyListItem>
      ))}
    </ScrollView>
  );
}

MealDetailScreen.navigationOptions = (props) => {
  const { mealTitle } = props.route.params;

  return {
    headerTitle: mealTitle,
  };
};

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 22,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 200,
  },
  container: {
    flex: 1,
  },
});

export default MealDetailScreen;
