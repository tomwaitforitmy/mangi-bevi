import React from "react";
import Colors from "../../constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NAVIGATION_TITLES } from "../../constants/NavigationTitles";
import { Pressable } from "react-native";

const onHeaderIconPress = (
  navigation,
  mealId,
  selectedTabEdit,
  updateRenderCounter,
) => {
  navigation.navigate(NAVIGATION_TITLES.TAB_MEALS, {
    screen: NAVIGATION_TITLES.STACK_EDIT_MEAL,
    params: {
      mealId: mealId,
      selectedTabEdit: selectedTabEdit,
      updateRenderCounter: updateRenderCounter,
    },
  });
};

const EditMangiIcon = (
  navigation,
  mealId,
  selectedTabEdit,
  updateRenderCounter,
) => {
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
        onPress={() =>
          onHeaderIconPress(
            navigation,
            mealId,
            selectedTabEdit,
            updateRenderCounter,
          )
        }
        color={Colors.primary}
      />
    </Pressable>
  );
};

export default EditMangiIcon;
