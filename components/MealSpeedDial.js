import React, { useReducer } from "react";
import { Share } from "react-native";
import Colors from "../constants/Colors";
import { SpeedDial } from "react-native-elements";
import { GetMealSummary } from "../common_functions/GetMealSummary";
import { useSelector } from "react-redux";
import mealSpeedDialReducer, {
  CLOSE,
  OPEN,
} from "../store/formReducers/mealSpeedDialReducer";
import IconTypes from "../constants/IconTypes";
import { GetAuthorNameByMealId } from "../common_functions/GetAuthorName";

const MealSpeedDial = (props) => {
  const { mealId } = props;

  const availableMeals = useSelector((state) => state.meals.meals);
  const selectedMeal = availableMeals.find((meal) => meal.id === mealId);
  const users = useSelector((state) => state.users.users);
  const authorName = GetAuthorNameByMealId(mealId, users);

  const initialState = {
    meal: selectedMeal,
    tags: selectedMeal.tags,
    isOpen: false,
  };
  const [formState, formDispatch] = useReducer(
    mealSpeedDialReducer,
    initialState,
  );

  const shareMeal = async () => {
    try {
      const result = await Share.share({
        message: GetMealSummary(
          selectedMeal.title,
          selectedMeal.ingredients,
          selectedMeal.steps,
          authorName,
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

  const navigateToEditLinks = () => {
    formDispatch({ type: CLOSE });
    props.navigation.navigate("EditLinksScreen", {
      mealId: mealId,
    });
  };

  const navigateToReport = () => {
    formDispatch({ type: CLOSE });
    props.navigation.navigate("SendReportScreen", {
      mealId: mealId,
      mealTitle: selectedMeal.title,
    });
  };

  const onPressReact = () => {
    formDispatch({ type: CLOSE });
    props.onPressReact();
  };

  const iconType = IconTypes.ionicon;

  return (
    <SpeedDial
      color={Colors.primary}
      isOpen={formState.isOpen}
      icon={{
        name: "add",
        color: Colors.speedDialIcon,
        type: iconType,
      }}
      openIcon={{
        name: "close",
        color: Colors.speedDialIcon,
        type: iconType,
      }}
      onOpen={() => formDispatch({ type: OPEN })}
      onClose={() => formDispatch({ type: CLOSE })}>
      <SpeedDial.Action
        icon={{
          name: "pricetags",
          color: Colors.speedDialIcon,
          type: iconType,
        }}
        title="Tags"
        color={Colors.primary}
        onPress={navigateToAddTag}
      />
      <SpeedDial.Action
        icon={{
          name: "share-social",
          color: Colors.speedDialIcon,
          type: iconType,
        }}
        title="Share"
        color={Colors.primary}
        onPress={shareMeal}
      />
      <SpeedDial.Action
        icon={{
          name: "link",
          color: Colors.speedDialIcon,
          type: IconTypes.feather,
        }}
        title="Links"
        color={Colors.primary}
        onPress={navigateToEditLinks}
      />
      <SpeedDial.Action
        icon={{
          name: "report",
          color: Colors.speedDialIcon,
          type: IconTypes.material,
        }}
        title="Report"
        color={Colors.primary}
        onPress={navigateToReport}
      />
      <SpeedDial.Action
        icon={{
          name: "heart",
          color: Colors.speedDialIcon,
          type: IconTypes.fontAwesome,
        }}
        title="React"
        color={Colors.primary}
        onPress={onPressReact}
      />
    </SpeedDial>
  );
};

export default MealSpeedDial;
