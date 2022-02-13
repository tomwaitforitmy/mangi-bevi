import React, { useLayoutEffect, useReducer } from "react";
import { StyleSheet, ScrollView, Text, View, Button } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as mealActions from "../store/actions/mealsAction";
import LoadingIndicator from "../components/LoadingIndicator";
import TagList from "../components/TagList";
import { TAGS } from "../data/DummyTags";
import tagFormReducer, {
  ADD_TAG,
  LOADING,
  REMOVE_TAG,
  SUBMITTED,
} from "../store/reducers/tagFormReducer";
import Colors from "../constants/Colors";
import { Icon } from "react-native-elements";

function AddTagScreen({ route, navigation }) {
  const { mealId } = route.params;

  const availableMeals = useSelector((state) => state.meals.meals);
  const selectedMeal = availableMeals.find((meal) => meal.id === mealId);

  const dispatch = useDispatch();

  const initialState = {
    addedTags: mealId ? selectedMeal.tags : [],
    availableTags: TAGS,
    isLoading: false,
  };

  const [formState, formDispatch] = useReducer(tagFormReducer, initialState);

  const saveTagsHandler = async () => {
    await saveTags(selectedMeal, formState.addedTags);
    navigation.navigate({
      name: "Details",
      params: {
        mealId: selectedMeal.id,
        mealTitle: selectedMeal.title,
      },
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Icon
          name={"save"}
          onPress={saveTagsHandler}
          color={Colors.navigationIcon}
          type={"ionicon"}
        />
      ),
    });
  }, [navigation, formState]);

  const addTagHandler = (tag) => {
    formDispatch({ type: ADD_TAG, value: tag });
  };

  const removeTagHandler = (tag) => {
    formDispatch({ type: REMOVE_TAG, value: tag });
  };

  const deleteTagHandler = (tag) => {
    console.log("deleting " + tag);
  };

  const saveTags = async (meal, tags) => {
    formDispatch({ type: LOADING });
    meal.tags = tags;

    try {
      await dispatch(mealActions.editMeal(meal));
    } catch (error) {
      console.log(error.message);
    } finally {
      formDispatch({ type: SUBMITTED });
    }
  };

  if (formState.isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Tags of {selectedMeal.title}</Text>
      <TagList
        tags={formState.addedTags}
        onPressTag={removeTagHandler}
      ></TagList>
      <Text style={styles.subtitle}>Available Tags</Text>
      <TagList
        tags={formState.availableTags}
        onPressTag={addTagHandler}
        onIconPress={deleteTagHandler}
      ></TagList>
      <Button title="Create new tag"></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  subtitle: {
    fontSize: 22,
    textAlign: "center",
  },
});

export default AddTagScreen;
