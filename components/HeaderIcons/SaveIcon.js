import React from "react";
import Colors from "../../constants/Colors";
import { Icon } from "react-native-elements";
import IconTypes from "../../constants/IconTypes";

const SaveIcon = (onPress) => {
  return (
    <Icon
      name={"save"}
      onPress={onPress}
      color={Colors.navigationIcon}
      type={IconTypes.ionicon}
    />
  );
};

export default SaveIcon;
