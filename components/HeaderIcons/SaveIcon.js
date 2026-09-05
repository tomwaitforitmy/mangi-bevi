import React from "react";
import { Pressable } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useAppTheme } from "../../theme/useAppTheme";
import {
  HEADER_ICON_CONTAINER_STYLE,
  HEADER_ICON_HIT_SLOP,
  HEADER_ICON_SIZE,
} from "./HeaderIconConfig";

const SaveIcon = ({ onPress }) => {
  const theme = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      hitSlop={HEADER_ICON_HIT_SLOP}
      style={HEADER_ICON_CONTAINER_STYLE}>
      <Ionicons
        name="save"
        size={HEADER_ICON_SIZE}
        color={theme.colors.headerIconColor}
      />
    </Pressable>
  );
};

export default SaveIcon;
