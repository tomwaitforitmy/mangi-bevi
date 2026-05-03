import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NAVIGATION_TITLES } from "../../constants/NavigationTitles";
import { Pressable } from "react-native";
import Colors from "../../constants/Colors";
import { useDispatch } from "react-redux";
import { setCurrentTabViewed } from "../../store/actions/uiAction";
import {
  HEADER_ICON_CONTAINER_STYLE,
  HEADER_ICON_HIT_SLOP,
  HEADER_ICON_SIZE,
} from "./HeaderIconConfig";

const onHeaderIconPress = (navigation, mealId, currentTab, dispatch) => {
  // Dispatch to Redux when transitioning to edit mode (only then)
  dispatch(setCurrentTabViewed(currentTab));
  navigation.navigate(NAVIGATION_TITLES.TAB_MEALS, {
    screen: NAVIGATION_TITLES.STACK_EDIT_MEAL,
    params: {
      mealId: mealId,
    },
  });
};

const EditMangiIcon = (navigation, mealId, currentTab) => {
  const dispatch = useDispatch();

  return (
    <Pressable
      onPress={() =>
        onHeaderIconPress(navigation, mealId, currentTab, dispatch)
      }
      hitSlop={HEADER_ICON_HIT_SLOP}
      style={HEADER_ICON_CONTAINER_STYLE}>
      <Ionicons
        name="create-outline"
        size={HEADER_ICON_SIZE}
        color={Colors.headerIconColor}
      />
    </Pressable>
  );
};

export default EditMangiIcon;
