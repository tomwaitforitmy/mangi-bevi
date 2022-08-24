import React from "react";
import Colors from "../../constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const onHeaderIconPress = () => {
  console.log("Mangi & Bevi");
};

const NoodlesIcon = () => {
  return (
    <MaterialCommunityIcons
      name={"noodles"}
      size={25}
      color={Colors.navigationIcon}
      onPress={() => onHeaderIconPress()}
    />
  );
};

export default NoodlesIcon;
