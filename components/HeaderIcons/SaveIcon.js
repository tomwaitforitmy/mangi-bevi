import React from "react";
import { Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "../../constants/Colors";
import {
  HEADER_ICON_CONTAINER_STYLE,
  HEADER_ICON_HIT_SLOP,
  HEADER_ICON_SIZE,
} from "./HeaderIconConfig";

const SaveIcon = (onPress) => {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={HEADER_ICON_HIT_SLOP}
      style={HEADER_ICON_CONTAINER_STYLE}>
      <Ionicons
        name="save"
        size={HEADER_ICON_SIZE}
        color={Colors.headerIconColor}
      />
    </Pressable>
  );
};

export default SaveIcon;
