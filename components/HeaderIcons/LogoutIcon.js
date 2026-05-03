import React from "react";
import Colors from "../../constants/Colors";
import * as authActions from "../../store/actions/authAction";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Alert, Pressable } from "react-native";
import { ResetSecureStorage } from "../../common_functions/CredentialStorage";
import {
  HEADER_ICON_CONTAINER_STYLE,
  HEADER_ICON_HIT_SLOP,
  HEADER_ICON_SIZE,
} from "./HeaderIconConfig";

const onHeaderIconPress = () => {
  Alert.alert("Logout", "Do you really want to logout?", [
    {
      text: "Yes",
      onPress: async () => {
        await authActions.logout();
        await ResetSecureStorage();
      },
    },
    {
      text: "No",
      style: "cancel",
    },
  ]);
};

const LogoutIcon = () => {
  return (
    <Pressable
      onPress={() => onHeaderIconPress()}
      hitSlop={HEADER_ICON_HIT_SLOP}
      android_ripple={null}
      style={HEADER_ICON_CONTAINER_STYLE}>
      <Ionicons
        name={"exit-outline"}
        size={HEADER_ICON_SIZE}
        color={Colors.headerIconColor}
      />
    </Pressable>
  );
};

export default LogoutIcon;
