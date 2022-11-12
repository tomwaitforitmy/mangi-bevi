import React, { useState } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import LevelView from "../components/LevelView";
import { RECIPE_REWARDS } from "../data/RecipeRewards";
import { TAG_REWARDS } from "../data/TagRewards";

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function DevScreen({ navigation }) {
  const [firstValue, setFirstValue] = useState(32);

  return (
    <View style={styles.container}>
      <LevelView value={firstValue} rewards={RECIPE_REWARDS} />
      <LevelView value={12} rewards={TAG_REWARDS} />
      <LevelView value={0} rewards={RECIPE_REWARDS} />
      <Button
        title="random"
        onPress={() => {
          setFirstValue(getRandomInt(100));
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default DevScreen;
