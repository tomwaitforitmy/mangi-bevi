import React from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import { useSelector } from "react-redux";
import ImageSwipe from "../components/ImageSwipe";

function ImagesScreen({ route }) {
  const { mealId } = route.params;

  const availableMeals = useSelector((state) => state.meals.meals);
  const selectedMeal = availableMeals.find((meal) => meal.id === mealId);

  const { width } = Dimensions.get("window");

  return (
    <View style={styles.container}>
      <ImageSwipe
        images={selectedMeal.imageUrls}
        width={width}
        style={styles.image}
      ></ImageSwipe>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
  },
});

export default ImagesScreen;
