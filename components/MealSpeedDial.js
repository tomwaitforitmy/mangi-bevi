import React, { useReducer } from "react";
import { StyleSheet, Share } from "react-native";
import Colors from "../constants/Colors";
import { SpeedDial } from "react-native-elements";
import { GetMealSummary } from "../common_functions/GetMealSummary";
import { useDispatch, useSelector } from "react-redux";
import * as mealActions from "../store/actions/mealsAction";
import mealSpeedDialReducer from "../store/reducers/mealSpeedDialReducer";
import {
  ADD_TAG,
  ADD_RATING,
  CLOSE,
  OPEN,
  REMOVE_TAG,
} from "../store/reducers/mealSpeedDialReducer";
import Meal from "../models/Meal";

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
          formState.meal.title,
          formState.meal.ingredients,
          formState.meal.steps
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

  const addTag = async () => {
    try {
      formDispatch({ type: ADD_TAG, value: "tag x" });
      const editedMeal = new Meal(
        formState.meal.title,
        formState.meal.id,
        formState.meal.primaryImageUrl,
        formState.meal.ingredients,
        formState.meal.steps,
        formState.meal.imageUrls,
        formState.tags,
        formState.rating
      );
      console.log("before props.onAddTag");
      console.log(editedMeal);
      props.onAddTag(editedMeal);
    } catch (error) {
      console.log(error.message);
    }
    formDispatch({ type: CLOSE });
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
        title="Tag"
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
        onPress={() => console.log("Delete Something")}
      />
    </SpeedDial>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default MealSpeedDial;
