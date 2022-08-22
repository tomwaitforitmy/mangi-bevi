import React from "react";
import { useSelector } from "react-redux";
import ImageSwipe from "../components/ImageSwipe";

function ImagesScreen({ route }) {
  const { mealId } = route.params;

  const availableMeals = useSelector((state) => state.meals.meals);
  const selectedMeal = availableMeals.find((meal) => meal.id === mealId);

  return <ImageSwipe images={selectedMeal.imageUrls} />;
}

export default ImagesScreen;
