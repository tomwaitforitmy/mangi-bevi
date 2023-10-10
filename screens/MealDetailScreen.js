import React from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import { useSelector } from "react-redux";
import MyListItem from "../components/MyListItem";
import { Image } from "react-native-elements";
import MealSpeedDial from "../components/MealSpeedDial";
import TagList from "../components/TagList";
import Colors from "../constants/Colors";
import { GetAuthorName } from "../common_functions/GetAuthorName";
import moment from "moment";
import LinkedMealsList from "../components/LinkedMealsList";
import { GetLinkedMeals } from "../common_functions/GetLinkedMeals";
import MyButton from "../components/MyButton";

function MealDetailScreen({ route, navigation }) {
  const { mealId, isAuthenticated } = route.params;

  const availableMeals = useSelector((state) => state.meals.meals);
  const users = useSelector((state) => state.users.users);
  const searchTerm = useSelector((state) => state.search.searchTerm);
  const selectedMeal = availableMeals.find((meal) => meal.id === mealId);
  const authorName = GetAuthorName(selectedMeal.authorId, users);
  const editorName = GetAuthorName(selectedMeal.editorId, users);

  const creationDateString = moment(selectedMeal.creationDate).format("LLL");
  const editDateString = moment(selectedMeal.editDate).format("LLL");

  const allTags = useSelector((state) => state.tags.tags);
  const tagList = [];

  selectedMeal.tags.map((tagId) => {
    const found = allTags.find((tag) => tag.id === tagId);
    if (found) {
      tagList.push(found);
    }
  });

  const linkedMeals = GetLinkedMeals(availableMeals, selectedMeal.links);

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
          <MyListItem
            key={ingredient}
            title={ingredient}
            searchTerm={searchTerm}
          />
        ))}
        <Text style={styles.subtitle}>Steps</Text>
        {selectedMeal.steps.map((step) => (
          <MyListItem key={step} title={step} searchTerm={searchTerm} />
        ))}
        {linkedMeals.length > 0 && (
          <LinkedMealsList
            meals={linkedMeals}
            navigation={navigation}
            isAuthenticated={isAuthenticated}
          />
        )}

        {isAuthenticated && (
          <Text style={styles.authorBox}>
            Created by
            <Text style={styles.authorHighlighted}> {authorName}</Text> on{" "}
            {creationDateString}
            {"\n"}
            {editDateString !== creationDateString ? (
              <Text>
                Last edited by
                <Text style={styles.authorHighlighted}>
                  {" "}
                  {editorName}
                </Text> on {editDateString}{" "}
              </Text>
            ) : (
              <Text />
            )}
          </Text>
        )}
      </ScrollView>
      {isAuthenticated && (
        <MealSpeedDial mealId={selectedMeal.id} navigation={navigation} />
      )}
      {!isAuthenticated && (
        <MyButton
          style={styles.loginButton}
          onPress={() => {
            navigation.navigate("LoginScreen");
          }}>
          {"Login or sign up"}
        </MyButton>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loginButton: {
    borderRadius: 0,
    height: "10%",
  },
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
