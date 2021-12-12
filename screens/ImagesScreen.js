import React from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import { useSelector } from "react-redux";
import ImageSwipe from "../components/ImageSwipe";

function ImagesScreen({ route, navigation }) {
  const { mealId } = route.params;

  const availableMeals = useSelector((state) => state.meals.meals);
  const selectedMeal = availableMeals.find((meal) => meal.id === mealId);

  const { width } = Dimensions.get("window");

  const images = [
    {
      url: selectedMeal.imageUrl,
    },
    {
      url: "https://images.pexels.com/photos/9413/animal-cute-kitten-cat.jpg?cs=srgb&dl=adorable-animal-cat-9413.jpg&fm=jpg",
    },
    {
      url: "https://i.pinimg.com/236x/c6/6b/11/c66b111bf4df809e87a1208f75d2788b.jpg",
    },
    {
      url: "https://images.pexels.com/photos/1382734/pexels-photo-1382734.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    },
  ];

  return (
    <View style={styles.container}>
      <ImageSwipe
        images={images}
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
