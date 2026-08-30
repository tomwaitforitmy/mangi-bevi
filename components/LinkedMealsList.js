import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import TinyMealItem from "./TinyMealItem";

const LinkedMealsList = (props) => {
  const router = useRouter();

  const navigateToMeal = (meal) => {
    router.push({
      pathname: "/meals/meal/[mealId]",
      params: { mealId: meal.id, mealTitle: meal.title },
    });
  };

  return (
    <View style={{ ...styles.container, ...props.style }}>
      <Text style={styles.subtitle}>{"Linked Mangis"}</Text>
      {props.meals.map((meal, index) => (
        <TinyMealItem
          key={meal.id}
          meal={meal}
          onPressMeal={() => navigateToMeal(meal)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width: "100%", marginTop: 10 },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
  },
});

export default LinkedMealsList;
