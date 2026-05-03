import React from "react";
import Colors from "../../constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable } from "react-native";

const HeaderBackIcon = ({ backAction }) => {
  return (
    <Pressable
      onPress={backAction}
      hitSlop={20}
      style={{
        width: 30,
        height: 30,
        alignItems: "center",
        justifyContent: "center",
      }}>
      <Ionicons
        name="chevron-back"
        size={30}
        style={{ color: Colors.headerIconColor }}
      />
    </Pressable>
  );
};

export default HeaderBackIcon;
