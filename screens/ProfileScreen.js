import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import MealList from "../components/MealList";

function ProfileScreen({ navigation }) {
  const allMeals = useSelector((state) => state.meals.meals);
  const user = useSelector((state) => state.users.user);

  const userMeals = allMeals.filter((m) => user.meals.includes(m.id));

  return (
    <View style={styles.container}>
      <Text style={styles.bene}>
        You added {userMeals.length} Mangis. Molto bene!
      </Text>
      <MealList mealsList={userMeals} navigation={navigation}></MealList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  bene: {
    marginTop: 15,
    fontSize: 18,
  },
});

export default ProfileScreen;
