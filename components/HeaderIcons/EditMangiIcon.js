import React from "react";
import Colors from "../../constants/Colors";
import { Icon } from "react-native-elements";
import IconTypes from "../../constants/IconTypes";

const onHeaderIconPress = (
  navigation,
  mealId,
  selectedTabEdit,
  updateRenderCounter,
) => {
  navigation.navigate("Mangi & Bevi", {
    screen: "EditScreen",
    params: {
      mealId: mealId,
      selectedTabEdit: selectedTabEdit,
      updateRenderCounter: updateRenderCounter,
    },
  });
};

const EditMangiIcon = (
  navigation,
  mealId,
  selectedTabEdit,
  updateRenderCounter,
) => {
  return (
    <Icon
      name={"create-outline"}
      onPress={() =>
        onHeaderIconPress(
          navigation,
          mealId,
          selectedTabEdit,
          updateRenderCounter,
        )
      }
      type={IconTypes.ionicon}
      color={Colors.navigationIcon}
    />
  );
};

export default EditMangiIcon;
