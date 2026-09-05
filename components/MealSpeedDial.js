import React, { useReducer } from "react";
import { Share, StyleSheet } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";
import { SpeedDial } from "@rneui/themed";
import { GetMealSummary } from "../common_functions/GetMealSummary";
import { useSelector } from "react-redux";
import mealSpeedDialReducer, {
  CLOSE,
  OPEN,
} from "../store/formReducers/mealSpeedDialReducer";
import IconTypes from "../constants/IconTypes";
import { GetAuthorNameByMealId } from "../common_functions/GetAuthorName";
import { useRouter } from "expo-router";

const MealSpeedDial = (props) => {
  const theme = useAppTheme();
  const styles = getStyles(theme);
  const { mealId } = props;
  const router = useRouter();

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
    router.push({
      pathname: "/meals/meal/[mealId]/add-tag",
      params: { mealId },
    });
  };

  const navigateToEditLinks = () => {
    formDispatch({ type: CLOSE });
    router.push({
      pathname: "/meals/meal/[mealId]/edit-links",
      params: { mealId },
    });
  };

  const navigateToReport = () => {
    formDispatch({ type: CLOSE });
    router.push({
      pathname: "/meals/meal/[mealId]/report",
      params: { mealId, mealTitle: selectedMeal.title },
    });
  };

  const onPressReact = () => {
    formDispatch({ type: CLOSE });
    props.onPressReact();
  };

  const onPressFavorite = () => {
    formDispatch({ type: CLOSE });
    props.onPressFavorite();
  };

  const onPressMarkCooked = () => {
    formDispatch({ type: CLOSE });
    props.onPressMarkCooked();
  };

  const defaultIconType = IconTypes.ionicon;

  return (
    <SpeedDial
      placement="right"
      color={theme.colors.speedDialBackground}
      isOpen={formState.isOpen}
      icon={{
        name: "add",
        color: theme.colors.speedDialIcon,
        type: defaultIconType,
      }}
      openIcon={{
        name: "close",
        color: theme.colors.speedDialIcon,
        type: defaultIconType,
      }}
      onOpen={() => formDispatch({ type: OPEN })}
      onClose={() => formDispatch({ type: CLOSE })}>
      {props.isFavorite && (
        <SpeedDial.Action
          icon={{
            name: "star-off",
            color: theme.colors.speedDialIcon,
            type: IconTypes.materialDesign,
          }}
          title="Remove Favorite"
          titleStyle={styles.actionTitle}
          color={theme.colors.speedDialBackground}
          onPress={onPressFavorite}
        />
      )}
      {!props.isFavorite && (
        <SpeedDial.Action
          icon={{
            name: "star",
            color: theme.colors.speedDialIcon,
            type: IconTypes.materialDesign,
          }}
          title="Favorite"
          titleStyle={styles.actionTitle}
          color={theme.colors.speedDialBackground}
          onPress={onPressFavorite}
        />
      )}
      <SpeedDial.Action
        icon={{
          name: "pricetags",
          color: theme.colors.speedDialIcon,
          type: defaultIconType,
        }}
        title="Tags"
        titleStyle={styles.actionTitle}
        color={theme.colors.speedDialBackground}
        onPress={navigateToAddTag}
      />
      <SpeedDial.Action
        icon={{
          name: "share-social",
          color: theme.colors.speedDialIcon,
          type: defaultIconType,
        }}
        title="Share"
        titleStyle={styles.actionTitle}
        color={theme.colors.speedDialBackground}
        onPress={shareMeal}
      />
      <SpeedDial.Action
        icon={{
          name: "link",
          color: theme.colors.speedDialIcon,
          type: IconTypes.feather,
        }}
        title="Links"
        titleStyle={styles.actionTitle}
        color={theme.colors.speedDialBackground}
        onPress={navigateToEditLinks}
      />
      <SpeedDial.Action
        icon={{
          name: "report",
          color: theme.colors.speedDialIcon,
          type: IconTypes.material,
        }}
        title="Report"
        titleStyle={styles.actionTitle}
        color={theme.colors.speedDialBackground}
        onPress={navigateToReport}
      />
      <SpeedDial.Action
        icon={{
          name: "heart",
          color: theme.colors.speedDialIcon,
          type: IconTypes.fontAwesome,
        }}
        title="React"
        titleStyle={styles.actionTitle}
        color={theme.colors.speedDialBackground}
        onPress={onPressReact}
      />
      {props.enableMarkCooked && (
        <SpeedDial.Action
          icon={{
            name: "chef-hat",
            color: theme.colors.speedDialIcon,
            type: IconTypes.materialDesign,
          }}
          title="Mark as cooked"
          titleStyle={styles.actionTitle}
          color={theme.colors.speedDialBackground}
          onPress={onPressMarkCooked}
        />
      )}
    </SpeedDial>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    actionTitle: {
      color: theme.colors.speedDialActionText,
      fontWeight: "600",
      backgroundColor: theme.colors.speedDialActionBackground,
    },
  });

export default MealSpeedDial;
