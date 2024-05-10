import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-native-elements";
import { deleteTestMangis } from "../firebase/deleteTestMangis";
import {
  addMealCookedByUser,
  fetchCookedByUsers,
} from "../store/actions/mealCookedByUserAction";
import MealCookedByUser from "../models/MealCookedByUser";
import CookedByUserList from "../components/CookedByUserList";

function DevScreen({ navigation }) {
  const allMeals = useSelector((state) => state.meals.meals);
  const user = useSelector((state) => state.users.user);
  const users = useSelector((state) => state.users.users);
  const mealsCookedByUser = useSelector(
    (state) => state.mealsCookedByUser.mealsCookedByUser,
  );
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

  async function cooked() {
    dispatch(fetchCookedByUsers("-NxBZLQp3PLRUYxygc7C"));
  }

  return (
    <View style={styles.container}>
      <CookedByUserList
        cookedByUser={mealsCookedByUser.filter(
          (e) => e.mealId === "-NxBZLQp3PLRUYxygc7C",
        )}
        users={users}
      />
      <Button
        title="I cooked this!"
        onPress={async () => {
          await cooked();
        }}
      />
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
