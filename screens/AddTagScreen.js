import React, { useEffect, useLayoutEffect, useReducer } from "react";
import { StyleSheet, ScrollView, Text, View, Button } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as mealActions from "../store/actions/mealsAction";
import * as tagActions from "../store/actions/tagsAction";
import LoadingIndicator from "../components/LoadingIndicator";
import TagList from "../components/TagList";
import { TAGS } from "../data/DummyTags";
import tagFormReducer, {
  ADD_TAG,
  LOADING,
  REMOVE_TAG,
  SUBMITTED,
  CREATE_TAG,
} from "../store/formReducers/tagFormReducer";
import Colors from "../constants/Colors";
import { Icon, Input } from "react-native-elements";
import Tag from "../models/Tag";

function AddTagScreen({ route, navigation }) {
  const { mealId } = route.params;

  const availableMeals = useSelector((state) => state.meals.meals);
  const selectedMeal = availableMeals.find((meal) => meal.id === mealId);

  const dispatch = useDispatch();

  useEffect(() => {
    formDispatch({ type: LOADING });
    dispatch(tagActions.fetchTags()).then(formDispatch({ type: SUBMITTED }));
  }, [dispatch]);

  const tags = useSelector((state) => state.tags.tags);

  const initialState = {
    addedTags: mealId ? selectedMeal.tags : [],
    availableTags: tags,
    isLoading: false,
    newTagTitle: "",
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

  const createTagHandler = async () => {
    if (!formState.newTagTitle) {
      console.log("No title given");
      return;
    }
    if (tags.some((tag) => tag.title === formState.newTagTitle)) {
      console.log("Title already in exists: " + formState.newTagTitle);
      return;
    }

    formDispatch({ type: LOADING });

    try {
      const newTag = new Tag(formState.newTagTitle, "not used");
      console.log(formState.newTagTitle);
      console.log(formState.newTagTitle + "-");
      // await dispatch(tagActions.createTag(newTag));
    } catch (error) {
      console.log(error.message);
    } finally {
      formDispatch({ type: SUBMITTED });
    }
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
      <Input
        placeholder="Enter tag"
        onChangeText={(value) => formDispatch({ type: CREATE_TAG, value })}
      ></Input>
      <Button title="Create new tag" onPress={createTagHandler}></Button>
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
