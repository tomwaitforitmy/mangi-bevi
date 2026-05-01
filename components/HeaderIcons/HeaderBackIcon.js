import React from "react";
import { HeaderBackButton } from "@react-navigation/elements";
import Colors from "../../constants/Colors";

const HeaderBackIcon = (backAction) => {
  return (
    <HeaderBackButton onPress={backAction} tintColor={Colors.headerIconColor} />
  );
};

export default HeaderBackIcon;
