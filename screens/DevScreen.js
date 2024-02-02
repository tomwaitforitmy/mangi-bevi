import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-native-elements";
import { deleteTestMangis } from "../firebase/deleteTestMangis";

function DevScreen({ navigation }) {
  const allMeals = useSelector((state) => state.meals.meals);
  const user = useSelector((state) => state.users.user);
  const dispatch = useDispatch();

  async function navToMeal() {
    navigation.navigate("Mangi & Bevi", {
      screen: "Details",
      params: {
        mealId: "-Mqf8oW0jKxIx5SIjz3F",
        mealTitle: "Gebackene rote Zwiebeln mit Walnuss-Salsa",
        isAuthenticated: true,
        updateRenderCounter: 0,
      },
    });
  }

  return (
    <View style={styles.container}>
      <Button
        title="Navigate to meal"
        onPress={async () => {
          await navToMeal();
        }}
      />
      <Button
        title="Delete all test mangis"
        onPress={async () => {
          await deleteTestMangis(dispatch, allMeals, user);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
});

export default DevScreen;
