import React from "react";
import Colors from "../../constants/Colors";
import { Icon } from "react-native-elements";
import IconTypes from "../../constants/IconTypes";

const onHeaderIconPress = (navigation, mealId, selectedTabParam) => {
  navigation.navigate("EditScreen", {
    mealId: mealId,
    selectedTabParam: selectedTabParam,
  });
};

const EditMangiIcon = (navigation, mealId, selectedTabParam) => {
  return (
    <Icon
      name={"create-outline"}
      onPress={() => onHeaderIconPress(navigation, mealId, selectedTabParam)}
      type={IconTypes.ionicon}
      color={Colors.navigationIcon}
    />
  );
};

export default EditMangiIcon;
