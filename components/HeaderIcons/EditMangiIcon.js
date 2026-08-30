import React from "react";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import Colors from "../../constants/Colors";
import { useDispatch } from "react-redux";
import { setCurrentTabViewed } from "../../store/actions/uiAction";
import {
  HEADER_ICON_CONTAINER_STYLE,
  HEADER_ICON_HIT_SLOP,
  HEADER_ICON_SIZE,
} from "./HeaderIconConfig";

const onHeaderIconPress = (router, mealId, currentTab, dispatch) => {
  // Dispatch to Redux when transitioning to edit mode (only then)
  dispatch(setCurrentTabViewed(currentTab));
  router.push({
    pathname: "/meals/meal/[mealId]/edit",
    params: { mealId },
  });
};

// Now a proper component: props in, JSX out
const EditMangiIcon = ({ mealId, currentTab }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <Pressable
      testID="edit-meal-icon"
      onPress={() => onHeaderIconPress(router, mealId, currentTab, dispatch)}
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
