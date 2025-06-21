import React from "react";
import Colors from "../../constants/Colors";
import { Icon } from "react-native-elements";
import IconTypes from "../../constants/IconTypes";
import { NAVIGATION_TITLES } from "../../constants/NavigationTitles";

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
    <Icon
      name={"create-outline"}
      onPress={() =>
        onHeaderIconPress(
          navigation,
          mealId,
          selectedTabEdit,
          updateRenderCounter,
        )
      }
      type={IconTypes.ionicon}
      color={Colors.navigationIcon}
    />
  );
};

export default EditMangiIcon;
