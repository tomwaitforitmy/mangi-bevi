import React, { useReducer } from "react";
import { StyleSheet, Share } from "react-native";
import Colors from "../constants/Colors";
import { SpeedDial } from "react-native-elements";
import { GetMealSummary } from "../common_functions/GetMealSummary";
import { useSelector } from "react-redux";
import mealSpeedDialReducer from "../store/reducers/mealSpeedDialReducer";
import { CLOSE, OPEN } from "../store/reducers/mealSpeedDialReducer";

const MealSpeedDial = (props) => {
  const { mealId } = props;

  const availableMeals = useSelector((state) => state.meals.meals);
  const selectedMeal = availableMeals.find((meal) => meal.id === mealId);

  const initialState = {
    meal: selectedMeal,
    tags: selectedMeal.tags,
    isOpen: false,
  };
  const [formState, formDispatch] = useReducer(
    mealSpeedDialReducer,
    initialState
  );

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
      formDispatch({ type: CLOSE });
    }
  };

  const navigateToAddTag = () => {
    formDispatch({ type: CLOSE });
    props.navigation.navigate("AddTagScreen", {
      mealId: mealId,
    });
  };

  const iconType = "ionicon";

  return (
    <SpeedDial
      color={Colors.primary}
      isOpen={formState.isOpen}
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
      onOpen={() => formDispatch({ type: OPEN })}
      onClose={() => formDispatch({ type: CLOSE })}
    >
      <SpeedDial.Action
        icon={{
          name: "pricetags",
          color: Colors.speedDiealIcon,
          type: iconType,
        }}
        title="Tags"
        color={Colors.primary}
        onPress={navigateToAddTag}
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
        onPress={() => console.log("rate meal not implmenented")}
      />
    </SpeedDial>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default MealSpeedDial;
