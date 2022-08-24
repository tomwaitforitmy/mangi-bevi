import React from "react";
import Colors from "../../constants/Colors";
import { Icon } from "react-native-elements";
import IconTypes from "../../constants/IconTypes";

const onHeaderIconPress = (navigation, mealId) => {
  navigation.navigate("EditScreen", {
    mealId: mealId,
  });
};

const EditMangiIcon = (navigation, mealId) => {
  return (
    <Icon
      name={"create-outline"}
      onPress={() => onHeaderIconPress(navigation, mealId)}
      type={IconTypes.ionicon}
      color={Colors.navigationIcon}
    />
  );
};

export default EditMangiIcon;
