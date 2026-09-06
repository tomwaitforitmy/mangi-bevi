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
import * as mealsAction from "../store/actions/mealsAction";
import * as tagActions from "../store/actions/tagsAction";
import LoadingIndicator from "../components/LoadingIndicator";
import TagList from "../components/TagList";
import tagFormReducer, {
  LOADING,
  SUBMITTED,
  EDIT_TAG_TITLE,
} from "../store/formReducers/tagFormReducer";
import { useAppTheme } from "../theme/useAppTheme";
import { getTextInputStyles } from "../constants/TextInputStyles";
import Tag from "../models/Tag";
import MyKeyboardAvoidingView from "../components/MyKeyboardAvoidingView";
import MyButton from "../components/MyButton";
import SaveIcon from "../components/HeaderIcons/SaveIcon";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useNavigation } from "expo-router/react-navigation";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function AddTagScreen() {
  const theme = useAppTheme();
  const textInputStyles = getTextInputStyles(theme);
  const { mealId } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
        await dispatch(mealsAction.editMeal(editedMeal, meal));
      } catch (error) {
        console.log(error.message);
      } finally {
        formDispatch({ type: SUBMITTED });
      }
    };

    await saveTags(selectedMeal, addedTags);
    router.dismissTo({
      pathname: "/meals/meal/[mealId]",
      params: { mealId: selectedMeal.id, mealTitle: selectedMeal.title },
    });
  }, [addedTags, dispatch, router, selectedMeal]);

  //Todo: Is this maybe a derived state?
  useEffect(() => {
    dispatch(tagActions.setAddedTags(selectedMeal.tags));
  }, [dispatch, mealId, selectedMeal.tags]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <SaveIcon onPress={saveTagsHandler} />,
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
          //Create a copy to avoid state corruption
          const editedMeal = { ...meal };
          editedMeal.tags = editedMeal.tags.filter((e) => e !== tag.id);
          await dispatch(mealsAction.editMeal(editedMeal, meal));
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
      {/* NativeTabs' native tab bar overlaps content (edge-to-edge) instead
          of reserving space for itself like the old JS bottom tabs did, so
          the "Create new tag" input/button would otherwise render (and be
          touchable) underneath the tab bar. */}
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <ScrollView
          style={styles.tagLists}
          // iOS gives the first scroll view under a NativeTabs screen
          // automatic content-inset adjustment, which also reacts to the
          // keyboard — stacking with MyKeyboardAvoidingView's own manual
          // shift and roughly doubling it. We already handle both the
          // tab-bar-safe-area and keyboard spacing ourselves, so opt out.
          contentInsetAdjustmentBehavior="never"
          automaticallyAdjustKeyboardInsets={false}>
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
            style={textInputStyles.input}
            placeholderTextColor={textInputStyles.placeholderTextColor}
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
    alignItems: "stretch",
    padding: 5,
    width: "100%",
  },
  // Was undefined (typo'd unused key) before, leaving the ScrollView
  // unstyled: combined with the container's old justifyContent: "center",
  // it wasn't tall enough to force the input row to the bottom, so
  // shrinking the container (e.g. when the keyboard opens) centered the
  // whole tag-list-plus-input block, leaving a matching empty gap below it.
  tagLists: {
    flex: 1,
  },
  subtitle: {
    fontSize: 22,
    textAlign: "center",
    color: "grey",
  },
});

export default AddTagScreen;
