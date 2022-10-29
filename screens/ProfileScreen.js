import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Divider } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import MyButton from "../components/MyButton";
import { fetchAll } from "../firebase/fetchAll";
import { GetReward, GetNextReward } from "../common_functions/GetReward";
import Reward from "../models/Reward";
import { STEP_REWARDS } from "../data/StepRewards";
import { INGREDIENT_REWARDS } from "../data/IngredientRewards";
import { TAG_REWARDS } from "../data/TagRewards";
import { RECIPE_REWARDS } from "../data/RecipeRewards";

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

  console.log("Rewards for");
  console.log(
    "Recipes " +
      user.meals.length +
      " " +
      GetNextReward(user.meals.length, RECIPE_REWARDS).title,
  );
  console.log(
    "Tags " + countTags + " " + GetNextReward(countTags, TAG_REWARDS).title,
  );
  console.log(
    "Ingredients " +
      countIngredients +
      " " +
      GetNextReward(countIngredients, INGREDIENT_REWARDS).title,
  );
  console.log(
    "Steps " + countSteps + " " + GetNextReward(countSteps, STEP_REWARDS).title,
  );

  return (
    <View style={styles.container}>
      <Text style={styles.beneCenter}>Ciao, {user.name}! Va bene?</Text>
      {experiencedUser ? (
        <View style={styles.bene}>
          <Text style={styles.bene}>
            You added {userMeals.length} Mangis. Molto bene!
          </Text>
          <Divider />
          <Text style={styles.bene}>{countIngredients} ingredients.</Text>
          <Divider />
          <Text style={styles.bene}>{countSteps} steps.</Text>
          <Divider />
          <Text style={styles.bene}>{countTags} tags</Text>
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
    fontSize: 18,
    lineHeight: 30,
    margin: 10,
  },
  beneCenter: {
    textAlign: "center",
    fontSize: 18,
    lineHeight: 30,
  },
});

export default ProfileScreen;
