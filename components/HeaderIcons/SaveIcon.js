import React from "react";
import { Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "../../constants/Colors";

const SaveIcon = (onPress) => {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={20}
      style={{
        //somehow this size works nice for centering
        width: 30,
        height: 30,
        alignItems: "center",
        justifyContent: "center",
      }}>
      <Ionicons name="save" size={30} color={Colors.headerIconColor} />
    </Pressable>
  );
};

export default SaveIcon;
