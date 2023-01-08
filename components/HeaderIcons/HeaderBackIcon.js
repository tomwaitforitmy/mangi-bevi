import React from "react";
import Colors from "../../constants/Colors";
import { HeaderBackButton } from "@react-navigation/elements";

const HeaderBackIcon = (backAction) => {
  return (
    <HeaderBackButton onPress={backAction} tintColor={Colors.navigationIcon} />
  );
};

export default HeaderBackIcon;
