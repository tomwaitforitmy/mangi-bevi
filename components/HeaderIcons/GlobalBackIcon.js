import React from "react";
import Colors from "../../constants/Colors";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useNavigation } from "expo-router/react-navigation";
import { Pressable } from "react-native";
import {
  HEADER_ICON_CONTAINER_STYLE,
  HEADER_ICON_HIT_SLOP,
  HEADER_ICON_SIZE,
} from "./HeaderIconConfig";

const GlobalBackIcon = () => {
  const navigation = useNavigation();

  //Android gestures somehow need this to
  //prevent error messages where sometimes
  //navigation can't go back, yet.
  const handlePress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
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
