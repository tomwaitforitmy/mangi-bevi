import React from "react";
import Colors from "../../constants/Colors";
import * as authActions from "../../store/actions/authAction";
import Ionicons from "@expo/vector-icons/Ionicons";

const onHeaderIconPress = (dispatch, devMode, navigation) => {
  devMode
    ? navigation.navigate("EditScreen", {
        mealId: "-N93DNXIQFETNW8zh5iV",
      })
    : dispatch(authActions.logout());
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
