import React from "react";
import { View, Text, StyleSheet } from "react-native";

const MealDeatailScreen = (props) => {
  return (
    <View style={styles.mealDetailScreen}>
      <Text>Meal Detail Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  mealDetailScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MealDeatailScreen;
