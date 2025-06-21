import React from "react";
import { StyleSheet, Text, View } from "react-native";
import TinyMealItem from "./TinyMealItem";
import { NAVIGATION_TITLES } from "../constants/NavigationTitles";

const LinkedMealsList = (props) => {
  const navigateToMeal = (meal) => {
    props.navigation.navigate(NAVIGATION_TITLES.TAB_MEALS, {
      screen: NAVIGATION_TITLES.STACK_MEAL_DETAILS,
      params: {
        mealId: meal.id,
        mealTitle: meal.title,
        isAuthenticated: props.isAuthenticated,
      },
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
