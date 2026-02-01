import React from "react";
import Colors from "../../constants/Colors";
import * as authActions from "../../store/actions/authAction";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Alert, Pressable } from "react-native";
import { ResetSecureStorage } from "../../common_functions/CredentialStorage";

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
      hitSlop={20}
      android_ripple={null}
      style={{
        //somehow this size works nice for centering
        width: 30,
        height: 30,
        paddingLeft: 8,
        alignItems: "center",
        justifyContent: "center",
      }}>
      <Ionicons name={"exit-outline"} size={25} color={Colors.primary} />
    </Pressable>
  );
};

export default LogoutIcon;
