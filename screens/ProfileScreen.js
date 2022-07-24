import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Divider } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import MyButton from "../components/MyButton";
import { fetchAll } from "../firebase/fetchAll";

function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.users.user);
  const allMeals = useSelector((state) => state.meals.meals);

  let userMeals = [];
  let countTags = 0;
  let countIngredients = 0;
  let countSteps = 0;
  let counter = 0;
  let experiencedUser = false;

  user.meals.map((id) => {
    const found = allMeals.find((meal) => meal.id === id);
    if (found) {
      userMeals.push(found);
      countTags += found.tags.length;
      countSteps += found.steps.length;
      countIngredients += found.ingredients.length;
      counter++;
    }
  });
  experiencedUser = userMeals.length > 1;

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
            }}
          >
            {"View"}
          </MyButton>
        </View>
      ) : (
        <View style={styles.bene}>
          <Text style={styles.bene}>
            You added {userMeals.length} Mangis. How about adding one?
          </Text>
          <MyButton onPress={() => {}}>{"Add"}</MyButton>
        </View>
      )}

      <View style={styles.bene}>
        <Text style={styles.bene}>Name: {user.name} </Text>
        <Divider />
        <Text style={styles.bene}>Email: {user.email}</Text>
        <MyButton
          onPress={async () => {
            await fetchAll(dispatch);
          }}
        >
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
