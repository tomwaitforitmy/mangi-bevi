import React, { useState } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import LevelView from "../components/LevelView";
import { RECIPE_REWARDS } from "../data/RecipeRewards";
import { TAG_REWARDS } from "../data/TagRewards";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Icon } from "react-native-elements";
import IconTypes from "../constants/IconTypes";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { INGREDIENT_REWARDS } from "../data/IngredientRewards";
import Colors from "../constants/Colors";

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function DevScreen({ navigation }) {
  const [firstValue, setFirstValue] = useState(32);

  const myChefIcon = () => {
    return <MaterialCommunityIcons name="chef-hat" size={60} color="black" />;
  };

  const myTagIcon = () => {
    return (
      <Icon
        name="pricetags"
        color={Colors.primary}
        type={IconTypes.ionicon}
        size={60}
      />
    );
  };

  const myCarrotIcon = () => {
    return <FontAwesome5 name="carrot" size={60} color="orange" />;
  };

  return (
    <View style={styles.container}>
      <LevelView
        value={firstValue}
        rewards={RECIPE_REWARDS}
        icon={myChefIcon}
      />
      <LevelView value={firstValue} rewards={TAG_REWARDS} icon={myTagIcon} />
      <LevelView
        value={firstValue}
        rewards={INGREDIENT_REWARDS}
        icon={myCarrotIcon}
      />
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
