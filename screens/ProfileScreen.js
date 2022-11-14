import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Divider } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import MyButton from "../components/MyButton";
import { fetchAll } from "../firebase/fetchAll";
import MyLevelViewContainer from "../components/MyLevelViewContainer";

function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.users.user);
  const allMeals = useSelector((state) => state.meals.meals);

  let userMeals = [];
  let countTags = 0;
  let countIngredients = 0;
  let countSteps = 0;
  let experiencedUser = false;

  //Bug here: This get's updated when "allMeals" changes after createMeal
  //That is correct, but it does not get updated directly after editUser
  //I suppose that's due updating user.meals which might not (?) change state.users.user
  //hence this is not updated a second time. The refresh button helps, but is not needed.
  ({ countTags, countSteps, countIngredients, experiencedUser, userMeals } =
    updateValues(
      user,
      allMeals,
      userMeals,
      countTags,
      countSteps,
      countIngredients,
      experiencedUser,
    ));

  return (
    <View style={styles.container}>
      <ScrollView>
        {experiencedUser ? (
          <View style={styles.bene}>
            <MyLevelViewContainer
              numberOfRecipes={userMeals.length}
              numberOfTags={countTags}
              numberOfIngredients={countIngredients}
            />
            <MyButton
              onPress={() => {
                navigation.navigate("UserMealsScreen", {
                  userMeals: userMeals,
                });
              }}>
              {"View"}
            </MyButton>
          </View>
        ) : (
          <View style={styles.bene}>
            <Text style={styles.bene}>
              You added {userMeals.length} Mangis. How about adding one?
            </Text>
            <MyButton
              onPress={() => {
                navigation.jumpTo("New");
              }}>
              {"Add"}
            </MyButton>
          </View>
        )}

        <View style={styles.bene}>
          <Text style={styles.bene}>Name: {user.name} </Text>
          <Divider />
          <Text style={styles.bene}>Email: {user.email}</Text>
          <MyButton
            onPress={async () => {
              await fetchAll(dispatch);
            }}>
            {"Refresh"}
          </MyButton>
          <Divider />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "stretch",
  },
  bene: {
    fontSize: 14,
    lineHeight: 30,
    margin: 5,
  },
  beneCenter: {
    textAlign: "center",
    fontSize: 14,
    lineHeight: 30,
  },
});

export default ProfileScreen;
function updateValues(
  user,
  allMeals,
  userMeals,
  countTags,
  countSteps,
  countIngredients,
  experiencedUser,
) {
  userMeals = [];
  countTags = 0;
  countIngredients = 0;
  countSteps = 0;
  experiencedUser = false;

  if (user.meals.length > 0) {
    user.meals.map((id) => {
      const found = allMeals.find((meal) => meal.id === id);
      if (found) {
        userMeals.push(found);
        countTags += found.tags.length;
        countSteps += found.steps.length;
        countIngredients += found.ingredients.length;
      }
    });
    experiencedUser = userMeals.length > 1;
  }
  return {
    countTags,
    countSteps,
    countIngredients,
    experiencedUser,
    userMeals,
  };
}
