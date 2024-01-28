import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-native-elements";
import { deleteTestMangis } from "../firebase/deleteTestMangis";
import Reaction from "../models/Reaction";
import ReactionsBox from "../components/ReactionsBox";
import SelectReactionBox from "../components/SelectReactionBox";

function DevScreen({ navigation }) {
  const allMeals = useSelector((state) => state.meals.meals);
  const user = useSelector((state) => state.users.user);
  const dispatch = useDispatch();
  const [selectedReaction, setSelectedReaction] = useState("❤");

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

  const reactions = [
    new Reaction("a", "🥰"),
    new Reaction("b", "🥰"),
    new Reaction("c", "🥰"),
    new Reaction("d", "👌"),
    new Reaction("e", "🥰"),
    new Reaction("f", "🥰"),
    new Reaction("g", "🥰"),
    new Reaction("h", "🥰"),
    new Reaction("i", "🥰"),
    new Reaction("j", "❤"),
    new Reaction("k", "😋"),
    new Reaction("l", "😋"),
    new Reaction("m", "😋"),
    new Reaction("n", "😋"),
    new Reaction("o", "😋"),
    new Reaction("p", "😋"),
    new Reaction("q", "😋"),
    new Reaction("r", "😋"),
    new Reaction("s", "😋"),
    new Reaction("t", "😋"),
    new Reaction("u", "😋"),
    new Reaction("v", "😋"),
    new Reaction("w", "😋"),
    new Reaction("x", "🤤"),
    new Reaction("y", "🥰"),
    new Reaction("z", "🤤"),
  ];

  return (
    <View style={styles.container}>
      <ReactionsBox reactions={reactions} />
      <SelectReactionBox
        selectedReaction={selectedReaction}
        onReactionSelected={(r) => setSelectedReaction(r)}
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
