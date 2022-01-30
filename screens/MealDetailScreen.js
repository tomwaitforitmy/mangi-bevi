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
  const [isLoading, setIsLoading] = useState(false);

  const availableMeals = useSelector((state) => state.meals.meals);
  const selectedMeal = availableMeals.find((meal) => meal.id === mealId);

  const dispatch = useDispatch();

  const addTag = async (meal) => {
    setIsLoading(true);
    try {
      console.log(meal);
      await dispatch(mealActions.editMeal(meal));
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

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
        <TagList tags={selectedMeal.tags}></TagList>
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
        onAddTag={(meal) => addTag(meal)}
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
