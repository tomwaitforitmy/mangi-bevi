import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  StyleSheet,
  Platform,
  Alert,
  StatusBar,
  BackHandler,
  useWindowDimensions,
  Keyboard,
  TextInput,
} from "react-native";
import LoadingIndicator from "../components/LoadingIndicator";
import * as mealsAction from "../store/actions/mealsAction";
import * as usersAction from "../store/actions/usersAction";
import Meal from "../models/Meal";
import Colors from "../constants/Colors";
import { textInputStyles } from "../constants/TextInputStyles";
import newMealFormReducer, {
  CHANGE_PAGE_TITLE,
  CHANGE_TITLE,
  CHANGE_PRIMARY_IMAGE,
  EDIT_INGREDIENT,
  EDIT_STEP,
  ADD_INGREDIENT,
  ADD_STEP,
  ADD_IMAGE,
  SET_STEP_VALUE,
  SET_INGREDIENT_VALUE,
  SET_FIELD,
  PREPARE_EDIT_INGREDIENT,
  PREPARE_EDIT_STEP,
  REMOVE_IMAGE,
  LOADING,
  SUBMITTED,
  SHOW_MODAL,
  INGREDIENT_SORT,
  STEP_SORT,
  GetInitialState,
  ABORT_LOADING,
} from "../store/formReducers/newMealFormReducer";
import ImageSwipe from "../components/ImageSwipe";
import MyButton from "../components/MyButton";
import MyKeyboardAvoidingView from "../components/MyKeyboardAvoidingView";
import { MealEquals } from "../common_functions/MealEquals";
import { GetImagesToUpload } from "../image_processing/GetImagesToUpload";
import SortingListViewContainer from "../components/SortingListViewContainer";
import InputListViewContainer from "../components/InputListViewContainer";
import SaveIcon from "../components/HeaderIcons/SaveIcon";
import { UploadImagesAndCreateMeal } from "../common_functions/Integration/UploadImagesAndCreateMeal";
import { UploadImagesAndEditMeal } from "../common_functions/Integration/UploadImagesAndEditMeal";
import { IsFormInvalid } from "../common_functions/IsMealInvalid";
import HeaderBackIcon from "../components/HeaderIcons/HeaderBackIcon";
import LevelsViewModal from "../components/LevelsViewModal";
import deleteImages from "../image_processing/deleteImages";
import MyTabMenu from "../components/MyTabMenu";
import { TITLES, mealTabMenuTitleArray } from "../constants/TabMenuTitles";
import { newMealCreated } from "../notifications/NewMealCreated";
import { getPermission, pickImage } from "../common_functions/PickImage";
import { NAVIGATION_TITLES } from "../constants/NavigationTitles";

function NewScreen({ route, navigation }) {
  const mealId = route.params?.mealId;
  //I was not able to use route.params.updateRenderCounter directly as dependency for
  //useCallback of createMealHandler. Therefore, this variable.
  let updateRenderCounter = route.params?.updateRenderCounter;
  const user = useSelector((state) => state.users.user);
  const users = useSelector((state) => state.users.users);
  const meals = useSelector((state) => state.meals.meals);
  const userStats = useSelector((state) => state.users.userStats);
  const userMealsData = useSelector((state) => state.users.userMealsData);
  const imageUploadTarget = useSelector(
    (state) => state.features.features.imageUpload,
  );

  let inputMeal = null;
  let initiallySelectedTab = TITLES.INFO;
  if (mealId) {
    inputMeal = meals.find((m) => m.id === mealId);
    initiallySelectedTab = route.params.selectedTabEdit ?? TITLES.INFO;
  }

  const initialState = GetInitialState(inputMeal, initiallySelectedTab);

  //this callback is needed, because else MyTabMenu is re-rendered on every key stroke,
  //because react native memo does a shallow comparison between the inputs of MyTabMenu.
  //The newly created function "changePage" would cause a re-render, even though
  //it is technically always the same function. This interferes with the keyboard
  //on Android.
  const handleTabPress = useCallback((inputTitle) => {
    const changePage = (title) => {
      formDispatch({ type: CHANGE_PAGE_TITLE, value: title });
    };
    changePage(inputTitle);
  }, []);

  const windowWidth = useWindowDimensions().width;

  const [formState, formDispatch] = useReducer(
    newMealFormReducer,
    initialState,
  );

  const dispatch = useDispatch();

  const backAction = useCallback(() => {
    let anyImageToUpload = false,
      changesMade = false,
      anyImageToDelete = false;
    if (mealId) {
      const imagesToUpload = GetImagesToUpload(formState.imageUrls);

      anyImageToUpload = imagesToUpload.length > 0;
      anyImageToDelete = formState.imageUrlsToDelete.length > 0;

      const editedMeal = Meal(
        formState.title,
        mealId,
        formState.primaryImageUrl,
        formState.ingredients,
        formState.steps,
        formState.imageUrls,
        inputMeal.tags,
        inputMeal.rating,
        inputMeal.authorId,
        inputMeal.creationDate,
        inputMeal.editorId,
        inputMeal.editDate,
        inputMeal.links,
      );

      changesMade = !MealEquals(inputMeal, editedMeal);
    }

    if (anyImageToUpload || changesMade || anyImageToDelete) {
      Alert.alert("Hold on!", "Do you want to discard your changes?", [
        {
          text: "Discard",
          onPress: () => navigation.goBack(),
          style: "cancel",
        },
        {
          text: "Save changes",
          onPress: saveMealHandler,
        },
      ]);
    } else {
      navigation.goBack();
    }

    return true;
  }, [formState, mealId, inputMeal, saveMealHandler, navigation]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => backHandler.remove();
  }, [formState, backAction]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => HeaderBackIcon(backAction),
      headerRight: () => SaveIcon(saveMealHandler),
    });
  }, [navigation, formState, backAction, saveMealHandler]);

  // Ask for permissions only when the component is mounted
  // This interferes with keyboard input if called too often on Android
  useEffect(() => {
    getPermission();
  }, []);

  const handlePickImage = async () => {
    await pickImage((uri) => formDispatch({ type: ADD_IMAGE, value: uri }));
  };

  const onConfirmDeleteImage = async (url) => {
    formDispatch({
      type: REMOVE_IMAGE,
      value: url,
    });
  };

  const finishStepInput = useCallback(() => {
    finishInput(
      formState.stepIndex,
      formState.stepValue,
      inputStep,
      EDIT_STEP,
      ADD_STEP,
    );
  }, [finishInput, formState.stepIndex, formState.stepValue, inputStep]);

  const finishIngredientInput = useCallback(() => {
    finishInput(
      formState.ingredientIndex,
      formState.ingredientValue,
      inputIngredient,
      EDIT_INGREDIENT,
      ADD_INGREDIENT,
    );
  }, [
    finishInput,
    formState.ingredientIndex,
    formState.ingredientValue,
    inputIngredient,
  ]);

  const finishInput = useCallback(
    (index, value, refInput, editType, addType) => {
      if (index !== null) {
        formDispatch({
          type: editType,
          value: value,
          ref: refInput,
        });
      } else {
        if (!value) {
          return;
        }
        formDispatch({
          type: addType,
          value: value,
          ref: refInput,
        });
      }
    },
    [],
  );

  const saveMealHandler = useCallback(async () => {
    const editMealHandler = async () => {
      await deleteImages(formState.imageUrlsToDelete, imageUploadTarget);
      const editedMeal = await UploadImagesAndEditMeal(
        formState.imageUrls,
        formState.primaryImageUrl,
        formState.title,
        mealId,
        formState.ingredients,
        formState.steps,
        inputMeal.tags,
        inputMeal.rating,
        inputMeal.authorId,
        inputMeal.creationDate,
        user.id,
        new Date().toISOString(),
        inputMeal.links,
        inputMeal.isTestMangi,
        inputMeal.reactions,
        imageUploadTarget,
      );

      await dispatch(mealsAction.editMeal(editedMeal));
      formDispatch({ type: SUBMITTED });

      //First pop (delete) the current edit screen.
      //Otherwise it would be the target for the next back button.
      navigation.pop();

      //Second go back to the edit screen with updated params.
      //This is easily done with "replace".
      navigation.replace(NAVIGATION_TITLES.STACK_MEAL_DETAILS, {
        mealId: mealId,
        mealTitle: formState.title,
        isAuthenticated: true,
        selectedTabMealDetail: formState.selectedTab,
        updateRenderCounter: updateRenderCounter + 1,
      });
    };

    const createMealHandler = async () => {
      const newMeal = await UploadImagesAndCreateMeal(
        formState.imageUrls,
        formState.title,
        formState.ingredients,
        formState.steps,
        user,
        imageUploadTarget,
      );

      //first we have to update the meals to get the new id
      const id = await dispatch(mealsAction.createMeal(newMeal));

      //afterward, we can update the user and stats
      const editedUser = { ...user };
      editedUser.meals = [...user.meals, id];

      await dispatch(usersAction.editUser(editedUser));
      try {
        //Technically, we don't have to await here.
        //Not sure if this works.
        newMealCreated(users, newMeal.title, id, user);
      } catch (error) {
        console.error(error);
      }
      //now we can show the modal, with updated stats
      formDispatch({ type: SHOW_MODAL, value: id });
    };

    Keyboard.dismiss();
    finishIngredientInput();
    finishStepInput();

    if (
      IsFormInvalid(formState.title, formState.ingredients, formState.steps)
    ) {
      Alert.alert("We need a title and at least one ingredient and one step!");
      return;
    }

    try {
      formDispatch({ type: LOADING });

      if (mealId) {
        await editMealHandler();
      } else {
        await createMealHandler();
      }
    } catch (err) {
      console.error(err);
      Alert.alert(
        "Could not save your data.",
        "Maybe you don't have internet connection. Please try again in a few minutes. Error: " +
          err,
      );
      formDispatch({ type: ABORT_LOADING });
    }
  }, [
    dispatch,
    formState,
    mealId,
    navigation,
    user,
    inputMeal,
    finishIngredientInput,
    finishStepInput,
    updateRenderCounter,
    users,
    imageUploadTarget,
  ]);

  if (formState.isLoading) {
    return <LoadingIndicator />;
  }

  let showIngredientSort =
    formState.ingredientSort && formState.selectedTab === TITLES.INGREDIENTS;

  let showIngredients =
    !formState.ingredientSort && formState.selectedTab === TITLES.INGREDIENTS;

  let showStepSort =
    formState.stepSort && formState.selectedTab === TITLES.STEPS;

  let showSteps = !formState.stepSort && formState.selectedTab === TITLES.STEPS;

  let showImageSwipe =
    formState.selectedTab === TITLES.INFO &&
    formState.imageUrls &&
    formState.imageUrls.length > 0;

  let showInfo = formState.selectedTab === TITLES.INFO;

  const inputStep = React.createRef();
  const inputIngredient = React.createRef();

  const onRequestCloseModal = () => {
    formDispatch({ type: SUBMITTED });

    navigation.navigate(NAVIGATION_TITLES.TAB_MEALS, {
      screen: NAVIGATION_TITLES.STACK_MEAL_DETAILS,
      params: {
        mealId: formState.newCreatedId,
        mealTitle: formState.title,
        isAuthenticated: true,
      },
    });
  };

  const renderInfoTab = () => {
    return (
      <>
        <View style={styles.enterTitleInput}>
          <TextInput
            style={textInputStyles.input}
            placeholderTextColor={Colors.textInputPlaceholderColor}
            value={formState.title}
            placeholder="Enter title"
            onChangeText={(value) => {
              formDispatch({ type: CHANGE_TITLE, value: value });
            }}
          />
        </View>
        {showImageSwipe && (
          <ImageSwipe
            images={formState.imageUrls}
            onCheckCallback={(url) => {
              Alert.alert(
                "Make preview image?",
                "Do you want to show this image as preview?",
                [
                  {
                    text: "Yes",
                    onPress: () => {
                      formDispatch({
                        type: CHANGE_PRIMARY_IMAGE,
                        value: url,
                      });
                    },
                  },
                  {
                    text: "No",
                    style: "cancel",
                  },
                ],
              );
            }}
            onTrashCallback={(url) => {
              Alert.alert(
                "Remove image?",
                "Do you really want to delete this image? This action cannot be undone!",
                [
                  {
                    text: "Yes",
                    onPress: () => onConfirmDeleteImage(url),
                  },
                  {
                    text: "No",
                    style: "cancel",
                  },
                ],
              );
            }}
          />
        )}
        <View style={styles.addImageButton}>
          <MyButton onPress={handlePickImage}>{"Add image"}</MyButton>
        </View>
      </>
    );
  };

  const renderIngredientsInput = () => {
    return (
      <InputListViewContainer
        onLongPress={() => formDispatch({ type: INGREDIENT_SORT, value: true })}
        placeholder={"Ingredients"}
        data={formState.ingredients}
        inputRef={inputIngredient}
        onPressIcon={(ingredient) => {
          formDispatch({
            type: PREPARE_EDIT_INGREDIENT,
            key: ingredient,
            ref: inputIngredient,
          });
        }}
        onChangeText={(value) => {
          formDispatch({ type: SET_INGREDIENT_VALUE, value });
        }}
        onBlur={() => finishIngredientInput()}
      />
    );
  };

  const renderIngredientSort = () => {
    return (
      <SortingListViewContainer
        onPressDoneSorting={() =>
          formDispatch({ type: INGREDIENT_SORT, value: false })
        }
        data={formState.ingredients}
        onSortEnd={(sortedData) => {
          formDispatch({
            type: SET_FIELD,
            value: sortedData,
            field: "ingredients",
          });
        }}
      />
    );
  };

  const renderStepsInput = () => {
    return (
      <InputListViewContainer
        placeholder={"Steps"}
        data={formState.steps}
        onLongPress={() => formDispatch({ type: STEP_SORT, value: true })}
        inputRef={inputStep}
        onPressIcon={(step) => {
          formDispatch({
            type: PREPARE_EDIT_STEP,
            key: step,
            ref: inputStep,
          });
        }}
        onChangeText={(value) => {
          formDispatch({ type: SET_STEP_VALUE, value });
        }}
        onBlur={() => finishStepInput()}
      />
    );
  };

  const renderStepSort = () => {
    return (
      <SortingListViewContainer
        onPressDoneSorting={() =>
          formDispatch({ type: STEP_SORT, value: false })
        }
        data={formState.steps}
        onSortEnd={(sortedData) => {
          formDispatch({
            type: SET_FIELD,
            value: sortedData,
            field: "steps",
          });
        }}
      />
    );
  };

  const renderInputs = () => {
    return (
      <View style={styles.list}>
        {showInfo && renderInfoTab()}
        {showIngredients && renderIngredientsInput()}
        {showIngredientSort && renderIngredientSort()}
        {showSteps && renderStepsInput()}
        {showStepSort && renderStepSort()}
      </View>
    );
  };

  return (
    <View style={styles.screenContainer}>
      <LevelsViewModal
        countIngredients={userStats.countIngredients}
        countTags={userStats.countTags}
        countMeals={userMealsData.length}
        modalVisible={formState.showModal}
        onRequestClose={onRequestCloseModal}
      />
      <MyTabMenu
        initialIndex={mealTabMenuTitleArray.indexOf(initiallySelectedTab)}
        titles={mealTabMenuTitleArray}
        windowWidth={windowWidth}
        onTabPress={handleTabPress}
      />
      {Platform.OS === "android" ? (
        renderInputs()
      ) : (
        <MyKeyboardAvoidingView
          extraOffset={StatusBar.currentHeight}
          style={{ width: "100%" }}>
          {renderInputs()}
        </MyKeyboardAvoidingView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    width: "100%",
    flex: 1,
  },
  enterTitleInput: {
    width: "100%",
    padding: 5,
  },
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  addImageButton: { padding: 5, width: "100%" },
});

export default NewScreen;
