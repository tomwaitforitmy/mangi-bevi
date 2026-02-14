import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NAVIGATION_TITLES } from "../../constants/NavigationTitles";
import { Pressable } from "react-native";

const onHeaderIconPress = (navigation, mealId, selectedTabEdit) => {
  navigation.navigate(NAVIGATION_TITLES.TAB_MEALS, {
    screen: NAVIGATION_TITLES.STACK_EDIT_MEAL,
    params: {
      mealId: mealId,
      selectedTabEdit: selectedTabEdit,
    },
  });
};

const EditMangiIcon = (navigation, mealId, selectedTabEdit) => {
  return (
    <Pressable
      hitSlop={20}
      style={{
        //somehow this size works nice for centering
        width: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
      }}>
      <Ionicons
        name="create-outline"
        size={25}
        onPress={() => onHeaderIconPress(navigation, mealId, selectedTabEdit)}
      />
    </Pressable>
  );
};

export default EditMangiIcon;
