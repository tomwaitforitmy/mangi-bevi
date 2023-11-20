import React from "react";
import Colors from "../../constants/Colors";
import { Icon } from "react-native-elements";
import IconTypes from "../../constants/IconTypes";

const onHeaderIconPress = (navigation, mealId, selectedTabEdit) => {
  navigation.navigate("EditScreen", {
    mealId: mealId,
    selectedTabEdit: selectedTabEdit,
  });
};

const EditMangiIcon = (navigation, mealId, selectedTabEdit) => {
  return (
    <Icon
      name={"create-outline"}
      onPress={() => onHeaderIconPress(navigation, mealId, selectedTabEdit)}
      type={IconTypes.ionicon}
      color={Colors.navigationIcon}
    />
  );
};

export default EditMangiIcon;
