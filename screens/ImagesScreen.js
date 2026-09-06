import React from "react";
import { Platform } from "react-native";
import { useSelector } from "react-redux";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ImageSwipe from "../components/ImageSwipe";

function ImagesScreen() {
  const { mealId } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const availableMeals = useSelector((state) => state.meals.meals);
  const selectedMeal = availableMeals.find((meal) => meal.id === mealId);

  return (
    <ImageSwipe
      images={selectedMeal.imageUrls}
      // Unlike NewScreen's inline preview, this screen sits under a real
      // native-stack header (title/back/edit icons). Android already
      // reserves space for its header so the library's own default (38)
      // clears it; iOS content extends behind the header here, so clear
      // the status bar plus the standard compact nav bar height explicitly
      // rather than trusting useHeaderHeight() in this nested route (see
      // AddTagScreen's keyboard-offset history for why that's not assumed
      // reliable here).
      indicatorTopOffset={Platform.OS === "ios" ? insets.top + 52 : 38}
    />
  );
}

export default ImagesScreen;
