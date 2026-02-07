import React from "react";
import { HeaderBackButton } from "@react-navigation/elements";

const HeaderBackIcon = (backAction) => {
  return <HeaderBackButton onPress={backAction} />;
};

export default HeaderBackIcon;
