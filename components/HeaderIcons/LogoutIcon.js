import React from "react";
import Colors from "../../constants/Colors";
import * as authActions from "../../store/actions/authAction";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Alert } from "react-native";

const onHeaderIconPress = (dispatch) => {
  Alert.alert("Logout", "Do you really want to logout?", [
    {
      text: "Yes",
      onPress: async () => {
        await dispatch(authActions.logout());
      },
    },
    {
      text: "No",
      style: "cancel",
    },
  ]);
};

const LogoutIcon = (dispatch) => {
  return (
    <Ionicons
      name={"exit-outline"}
      size={25}
      color={Colors.navigationIcon}
      onPress={() => onHeaderIconPress(dispatch)}
    />
  );
};

export default LogoutIcon;
