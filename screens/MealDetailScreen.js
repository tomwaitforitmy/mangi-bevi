import React from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import { useSelector } from "react-redux";
import MyListItem from "../components/MyListItem";
import { Image } from "react-native-elements";
import MealSpeedDial from "../components/MealSpeedDial";
import TagList from "../components/TagList";
import Colors from "../constants/Colors";
import { GetAuthorNameByMealId } from "../common_functions/GetAuthorName";

function MealDetailScreen({ route, navigation }) {
  const { mealId } = route.params;

  const availableMeals = useSelector((state) => state.meals.meals);
  const users = useSelector((state) => state.users.users);
  const selectedMeal = availableMeals.find((meal) => meal.id === mealId);
  const authorName = GetAuthorNameByMealId(mealId, users);

  const allTags = useSelector((state) => state.tags.tags);
  const tagList = [];

  selectedMeal.tags.map((tagId) => {
    const found = allTags.find((tag) => tag.id === tagId);
    if (found) {
      tagList.push(found);
    }
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
        />
        <TagList tags={tagList} />
        <Text style={styles.subtitle}>Ingredients</Text>
        {selectedMeal.ingredients.map((ingredient) => (
          <MyListItem key={ingredient} title={ingredient} />
        ))}
        <Text style={styles.subtitle}>Steps</Text>
        {selectedMeal.steps.map((step) => (
          <MyListItem key={step} title={step} />
        ))}
        <Text style={styles.authorBox}>
          Created by
          <Text style={styles.authorHighlighted}> {authorName}</Text> {"\n"}
          Last edited by
          <Text style={styles.authorHighlighted}> {authorName}</Text>
        </Text>
      </ScrollView>
      <MealSpeedDial mealId={selectedMeal.id} navigation={navigation} />
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
  authorBox: {
    textAlign: "left",
    fontSize: 12,
    paddingLeft: 12,
    paddingBottom: 10,
    paddingTop: 10,
  },
  authorHighlighted: {
    fontWeight: "bold",
    color: Colors.primary,
  },
});

export default MealDetailScreen;
