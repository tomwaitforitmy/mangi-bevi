import React, { useState } from "react";
import { StyleSheet, Share } from "react-native";
import Colors from "../constants/Colors";
import { SpeedDial } from "react-native-elements";
import { GetMealSummary } from "../common_functions/GetMealSummary";
import { useDispatch, useSelector } from "react-redux";
import * as mealActions from "../store/actions/mealsAction";

const MealSpeedDial = (props) => {
  const [open, setOpen] = useState(false);

  const { mealId } = props;

  const availableMeals = useSelector((state) => state.meals.meals);
  const selectedMeal = availableMeals.find((meal) => meal.id === mealId);

  const shareMeal = async () => {
    try {
      const result = await Share.share({
        message: GetMealSummary(
          selectedMeal.title,
          selectedMeal.ingredients,
          selectedMeal.steps
        ),
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setOpen(false);
    }
  };

  const iconType = "ionicon";

  const dispatch = useDispatch();

  return (
    <SpeedDial
      color={Colors.primary}
      isOpen={open}
      icon={{
        name: "add",
        color: Colors.speedDiealIcon,
        type: iconType,
      }}
      openIcon={{
        name: "close",
        color: Colors.speedDiealIcon,
        type: iconType,
      }}
      onOpen={() => setOpen(!open)}
      onClose={() => setOpen(!open)}
    >
      <SpeedDial.Action
        icon={{
          name: "pricetags",
          color: Colors.speedDiealIcon,
          type: iconType,
        }}
        title="Tag"
        color={Colors.primary}
        onPress={async () => {
          selectedMeal.tags = selectedMeal.tags.concat("myTag");
          console.log(selectedMeal);
          await dispatch(mealActions.editMeal(selectedMeal));
        }}
      />
      <SpeedDial.Action
        icon={{
          name: "share-social",
          color: Colors.speedDiealIcon,
          type: iconType,
        }}
        title="Share"
        color={Colors.primary}
        onPress={shareMeal}
      />
      <SpeedDial.Action
        icon={{
          name: "star",
          color: Colors.speedDiealIcon,
          type: iconType,
        }}
        title="Rate"
        color={Colors.primary}
        onPress={() => console.log("Delete Something")}
      />
    </SpeedDial>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default MealSpeedDial;
