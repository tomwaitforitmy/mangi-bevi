import React from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import MealList from "../components/MealList";

function UserProfileScreen({ navigation }) {
  const allMeals = useSelector((state) => state.meals.meals);
  const user = useSelector((state) => state.users.user);

  const userMeals = allMeals.filter((m) => user.meals.includes(m.id));

  return (
    <View style={styles.container}>
      <MealList mealsList={userMeals} navigation={navigation}></MealList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default UserProfileScreen;
