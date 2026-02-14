import React from "react";
import { Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "../../constants/Colors";

const SaveIcon = (onPress) => {
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
        name="save"
        size={25}
        color={Colors.headerIconColor}
        onPress={onPress}
      />
    </Pressable>
  );
};

export default SaveIcon;
