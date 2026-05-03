import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NAVIGATION_TITLES } from "../../constants/NavigationTitles";
import { Pressable } from "react-native";
import Colors from "../../constants/Colors";
import { useDispatch } from "react-redux";
import { setCurrentTabViewed } from "../../store/actions/uiAction";

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
      hitSlop={20}
      style={{
        //somehow this size works nice for centering
        width: 30,
        height: 30,
        alignItems: "center",
        justifyContent: "center",
      }}>
      <Ionicons
        name="create-outline"
        size={30}
        color={Colors.headerIconColor}
      />
    </Pressable>
  );
};

export default EditMangiIcon;
