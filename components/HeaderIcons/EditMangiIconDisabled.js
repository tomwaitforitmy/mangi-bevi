import React from "react";
import { View } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useAppTheme } from "../../theme/useAppTheme";
import {
  HEADER_ICON_CONTAINER_STYLE,
  HEADER_ICON_SIZE,
} from "./HeaderIconConfig";

// Shown in place of EditMangiIcon when the current user has no edit rights
// on this meal — communicates the "can't edit" state explicitly instead of
// leaving the header's top-right corner ambiguous. Plain View, not
// Pressable: there is nothing to press, on purpose.
const EditMangiIconDisabled = () => {
  const theme = useAppTheme();

  return (
    <View testID="edit-meal-icon-disabled" style={HEADER_ICON_CONTAINER_STYLE}>
      <Ionicons
        name="lock-closed-outline"
        size={HEADER_ICON_SIZE}
        color={theme.colors.headerIconColor}
      />
    </View>
  );
};

export default EditMangiIconDisabled;
