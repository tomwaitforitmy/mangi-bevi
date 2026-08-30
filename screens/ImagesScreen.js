import React from "react";
import { useSelector } from "react-redux";
import { useLocalSearchParams } from "expo-router";
import ImageSwipe from "../components/ImageSwipe";

function ImagesScreen() {
  const { mealId } = useLocalSearchParams();

  const availableMeals = useSelector((state) => state.meals.meals);
  const selectedMeal = availableMeals.find((meal) => meal.id === mealId);

  return <ImageSwipe images={selectedMeal.imageUrls} />;
}

export default ImagesScreen;
