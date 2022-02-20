import React, { useState } from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import MyListItem from "../components/MyListItem";
import { Image, Chip, Icon } from "react-native-elements";
import MealSpeedDial from "../components/MealSpeedDial";
import * as mealActions from "../store/actions/mealsAction";
import LoadingIndicator from "../components/LoadingIndicator";
import TagList from "../components/TagList";

function MealDetailScreen({ route, navigation }) {
  const { mealId } = route.params;

  const availableMeals = useSelector((state) => state.meals.meals);
  const selectedMeal = availableMeals.find((meal) => meal.id === mealId);

  const allTags = useSelector((state) => state.tags.tags);
  const tagList = [];

  selectedMeal.tags.map((tagId) => {
    const found = allTags.find((tag) => tag.id === tagId);
    tagList.push(found);
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <Image
          source={{
            uri: selectedMeal.primaryImageUrl
              ? selectedMeal.primaryImageUrl
              : "https://dummyimage.com/300x200&text=No+image+yet",
          }}
          style={styles.image}
          onPress={() => {
            navigation.navigate("ImagesScreen", {
              mealId: selectedMeal.id,
              mealTitle: selectedMeal.title,
            });
          }}
        ></Image>
        <TagList tags={tagList}></TagList>
        <Text style={styles.subtitle}>Ingredients</Text>
        {selectedMeal.ingredients.map((ingredient) => (
          <MyListItem key={ingredient} title={ingredient}></MyListItem>
        ))}
        <Text style={styles.subtitle}>Steps</Text>
        {selectedMeal.steps.map((step) => (
          <MyListItem key={step} title={step}></MyListItem>
        ))}
      </ScrollView>
      <MealSpeedDial
        mealId={selectedMeal.id}
        navigation={navigation}
      ></MealSpeedDial>
    </View>
  );
}

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
