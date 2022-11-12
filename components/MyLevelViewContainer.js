import React from "react";
import { View, StyleSheet } from "react-native";
import LevelView from "../components/LevelView";
import { RECIPE_REWARDS } from "../data/RecipeRewards";
import { TAG_REWARDS } from "../data/TagRewards";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Icon } from "react-native-elements";
import IconTypes from "../constants/IconTypes";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { INGREDIENT_REWARDS } from "../data/IngredientRewards";
import Colors from "../constants/Colors";

const MyLevelViewContainer = (props) => {
  const iconSize = 50;

  const myChefIcon = () => {
    return (
      <MaterialCommunityIcons name="chef-hat" size={iconSize} color="black" />
    );
  };

  const myTagIcon = () => {
    return (
      <Icon
        name="pricetags"
        color={Colors.primary}
        type={IconTypes.ionicon}
        size={iconSize}
      />
    );
  };

  const myCarrotIcon = () => {
    return <FontAwesome5 name="carrot" size={iconSize} color="orange" />;
  };

  return (
    <View style={styles.container}>
      <LevelView
        value={props.numberOfRecipes}
        rewards={RECIPE_REWARDS}
        icon={myChefIcon}
        rewardCategory={"Recipes"}
      />
      <LevelView
        value={props.numberOfTags}
        rewards={TAG_REWARDS}
        icon={myTagIcon}
        rewardCategory={"Tags"}
      />
      <LevelView
        value={props.numberOfIngredients}
        rewards={INGREDIENT_REWARDS}
        icon={myCarrotIcon}
        rewardCategory={"Ingredients"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default MyLevelViewContainer;
