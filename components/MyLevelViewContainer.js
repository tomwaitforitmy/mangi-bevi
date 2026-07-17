import React from "react";
import { View, StyleSheet } from "react-native";
import LevelView from "../components/LevelView";
import { RECIPE_REWARDS } from "../data/RecipeRewards";
import { TAG_REWARDS } from "../data/TagRewards";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import FontAwesome5 from "@react-native-vector-icons/fontawesome5";
import Ionicons from "@react-native-vector-icons/ionicons";
import { INGREDIENT_REWARDS } from "../data/IngredientRewards";
import Colors from "../constants/Colors";

const MyLevelViewContainer = (props) => {
  const iconSize = 50;

  const myChefIcon = () => {
    return (
      <MaterialDesignIcons name="chef-hat" size={iconSize} color="black" />
    );
  };

  const myTagIcon = () => {
    return <Ionicons name="pricetags" size={iconSize} color={Colors.primary} />;
  };

  const myCarrotIcon = () => {
    return (
      <FontAwesome5
        name="carrot"
        iconStyle="solid" //carrot only exists in solid style
        size={iconSize}
        color="orange"
      />
    );
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
        value={props.numberOfIngredients}
        rewards={INGREDIENT_REWARDS}
        icon={myCarrotIcon}
        rewardCategory={"Ingredients"}
      />
      <LevelView
        value={props.numberOfTags}
        rewards={TAG_REWARDS}
        icon={myTagIcon}
        rewardCategory={"Tags"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default MyLevelViewContainer;
