import React from "react";
import Colors from "../../constants/Colors";
import * as authActions from "../../store/actions/authAction";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Alert } from "react-native";

const onHeaderIconPress = (dispatch, devMode, navigation) => {
  devMode
    ? navigation.navigate("EditScreen", {
        //my hack to quickly go somewhere in dev mode
        mealId: "-N93DNXIQFETNW8zh5iV",
      })
    : Alert.alert("Logout", "Do you really want to logout?", [
        {
          text: "Yes",
          onPress: () => {
            dispatch(authActions.logout());
          },
        },
        {
          text: "No",
          style: "cancel",
        },
      ]);
};

const LogoutIcon = (dispatch, devMode, navigation) => {
  return (
    <Ionicons
      name={devMode ? "cafe" : "exit-outline"}
      size={25}
      color={Colors.navigationIcon}
      onPress={() => onHeaderIconPress(dispatch, devMode, navigation)}
    />
  );
};

export default LogoutIcon;
