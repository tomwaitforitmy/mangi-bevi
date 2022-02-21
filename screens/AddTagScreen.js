import React, { useEffect, useLayoutEffect, useReducer } from "react";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as mealActions from "../store/actions/mealsAction";
import * as tagActions from "../store/actions/tagsAction";
import LoadingIndicator from "../components/LoadingIndicator";
import TagList from "../components/TagList";
import tagFormReducer, {
  LOADING,
  SUBMITTED,
  EDIT_TAG_TITLE,
} from "../store/formReducers/tagFormReducer";
import Colors from "../constants/Colors";
import { Icon, Input } from "react-native-elements";
import Tag from "../models/Tag";

function AddTagScreen({ route, navigation }) {
  const { mealId } = route.params;

  const availableMeals = useSelector((state) => state.meals.meals);
  const selectedMeal = availableMeals.find((meal) => meal.id === mealId);

  const dispatch = useDispatch();

  const allTags = useSelector((state) => state.tags.tags);
  const addedTags = useSelector((state) => state.tags.addedTags);
  const availableTags = useSelector((state) => state.tags.availableTags);

  const initialState = {
    isLoading: false,
    newTagTitle: "",
  };

  const [formState, formDispatch] = useReducer(tagFormReducer, initialState);

  const saveTagsHandler = async () => {
    console.log(addedTags);

    await saveTags(selectedMeal, addedTags);
    navigation.navigate({
      name: "Details",
      params: {
        mealId: selectedMeal.id,
        mealTitle: selectedMeal.title,
      },
    });
  };

  useEffect(() => {
    dispatch(tagActions.setAddedTags(selectedMeal.tags));
  }, [dispatch, mealId]);

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
  }, [navigation, formState, dispatch, addedTags]);

  const addTagHandler = (tag) => {
    dispatch(tagActions.addTag(tag));
  };

  const removeTagHandler = (tag) => {
    dispatch(tagActions.removeTag(tag));
  };

  const deleteTagHandler = (tag) => {
    console.log("deleting " + tag);
  };

  const createTagHandler = async () => {
    if (!formState.newTagTitle) {
      Alert.alert("Please choose a title for your tag!");
      return;
    }
    if (allTags.some((tag) => tag.title === formState.newTagTitle)) {
      Alert.alert("Tag title already exists!");
      return;
    }

    formDispatch({ type: LOADING });
    const newTag = new Tag(formState.newTagTitle, "not used");

    try {
      await dispatch(tagActions.createTag(newTag));
    } catch (error) {
      console.log(error.message);
    } finally {
      formDispatch({ type: SUBMITTED });
    }
  };

  const saveTags = async (meal, tags) => {
    formDispatch({ type: LOADING });

    meal.tags = tags.map((t) => t.id);

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
      <TagList tags={addedTags} onPressTag={removeTagHandler}></TagList>
      <Text style={styles.subtitle}>Available Tags</Text>
      <TagList
        tags={availableTags}
        onPressTag={addTagHandler}
        onIconPress={deleteTagHandler}
      ></TagList>
      <Input
        placeholder="Enter tag"
        onChangeText={(value) => formDispatch({ type: EDIT_TAG_TITLE, value })}
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
    margin: 5,
  },
  subtitle: {
    fontSize: 22,
    textAlign: "center",
  },
});

export default AddTagScreen;
