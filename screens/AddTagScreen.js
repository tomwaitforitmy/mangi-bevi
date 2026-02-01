import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ScrollView,
  TextInput,
} from "react-native";
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
import Tag from "../models/Tag";
import MyKeyboardAvoidingView from "../components/MyKeyboardAvoidingView";
import MyButton from "../components/MyButton";
import SaveIcon from "../components/HeaderIcons/SaveIcon";
import { NAVIGATION_TITLES } from "../constants/NavigationTitles";

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

  const saveTagsHandler = useCallback(async () => {
    const saveTags = async (meal, tags) => {
      formDispatch({ type: LOADING });
      //Create a copy to avoid state corruption
      const editedMeal = { ...meal };
      editedMeal.tags = tags.map((t) => t.id);
      try {
        await dispatch(mealActions.editMeal(editedMeal));
      } catch (error) {
        console.log(error.message);
      } finally {
        formDispatch({ type: SUBMITTED });
      }
    };

    await saveTags(selectedMeal, addedTags);
    navigation.popTo(NAVIGATION_TITLES.STACK_MEAL_DETAILS, {
      mealId: selectedMeal.id,
      mealTitle: selectedMeal.title,
      isAuthenticated: true,
    });
  }, [addedTags, dispatch, navigation, selectedMeal]);

  //Todo: Is this maybe a derived state?
  useEffect(() => {
    dispatch(tagActions.setAddedTags(selectedMeal.tags));
  }, [dispatch, mealId, selectedMeal.tags]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => SaveIcon(saveTagsHandler),
    });
  }, [navigation, formState, dispatch, addedTags, saveTagsHandler]);

  const addTagHandler = (tag) => {
    dispatch(tagActions.addTag(tag));
  };

  const removeTagHandler = (tag) => {
    dispatch(tagActions.removeTag(tag));
  };

  const deleteTagHandler = (tag) => {
    const mealsWithTag = availableMeals.filter((m) =>
      m.tags.some((t) => t === tag.id),
    );

    Alert.alert(
      "Warning!",
      "Are you sure you want to delete tag '" +
        tag.title +
        "'. It is used in " +
        mealsWithTag.length +
        " mangis. This action cannot be undone!",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "OK", onPress: () => deleteTag(tag, mealsWithTag) },
      ],
    );
  };

  const deleteTag = async (tag, mealsWithTag) => {
    formDispatch({ type: LOADING });

    try {
      await dispatch(tagActions.deleteTag(tag.id));

      await Promise.all(
        mealsWithTag.map(async (meal) => {
          meal.tags = meal.tags.filter((e) => e !== tag.id);
          await dispatch(mealActions.editMeal(meal));
        }),
      );
    } catch (error) {
      console.log(error.message);
    } finally {
      formDispatch({ type: SUBMITTED });
    }
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
    const newTag = Tag(formState.newTagTitle, "not used");

    try {
      await dispatch(tagActions.createTag(newTag));
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
    <MyKeyboardAvoidingView extraOffset={0} style={{ width: "100%" }}>
      <View style={styles.container}>
        <ScrollView style={styles.tagLists}>
          <Text style={styles.subtitle}>Added Tags</Text>
          <TagList
            tags={addedTags}
            onPressTag={removeTagHandler}
            onLongPressTag={deleteTagHandler}
          />
          <Text style={styles.subtitle}>Available Tags</Text>
          <TagList
            tags={availableTags}
            onPressTag={addTagHandler}
            onLongPressTag={deleteTagHandler}
          />
        </ScrollView>
        <View>
          <TextInput
            style={styles.input}
            placeholderTextColor={Colors.textInputPlaceholderColor}
            placeholder="Enter tag"
            onChangeText={(value) =>
              formDispatch({ type: EDIT_TAG_TITLE, value })
            }
          />
          <MyButton onPress={createTagHandler}>{"Create new tag"}</MyButton>
        </View>
      </View>
    </MyKeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch",
    padding: 5,
    width: "100%",
  },
  subtitle: {
    fontSize: 22,
    textAlign: "center",
    color: "grey",
  },
  input: {
    color: Colors.black,
    backgroundColor: Colors.white,
    width: "100%",
    minHeight: 40,
    fontSize: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
});

export default AddTagScreen;
