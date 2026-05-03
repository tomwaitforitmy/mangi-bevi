import React from "react";
import Colors from "../../constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { Pressable } from "react-native";
import {
  HEADER_ICON_CONTAINER_STYLE,
  HEADER_ICON_HIT_SLOP,
  HEADER_ICON_SIZE,
} from "./HeaderIconConfig";

const GlobalBackIcon = () => {
  const navigation = useNavigation();

  if (!navigation.canGoBack()) {
    return null;
  }

  const handlePress = () => {
    navigation.goBack();
  };

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={HEADER_ICON_HIT_SLOP}
      style={HEADER_ICON_CONTAINER_STYLE}>
      <Ionicons
        name="chevron-back"
        size={HEADER_ICON_SIZE}
        style={{ color: Colors.headerIconColor }}
      />
    </Pressable>
  );
};

export default GlobalBackIcon;
