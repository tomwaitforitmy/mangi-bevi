import React from "react";
import Colors from "../../constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { Pressable } from "react-native";

const GlobalBackIcon = () => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  if (!handlePress) {
    return null;
  }

  return (
    <Pressable
      onPress={handlePress}
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

export default GlobalBackIcon;
