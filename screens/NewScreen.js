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
  Dimensions,
} from "react-native";
import LoadingIndicator from "../components/LoadingIndicator";
import * as mealsAction from "../store/actions/mealsAction";
import * as usersAction from "../store/actions/usersAction";
import Meal from "../models/Meal";
import { Input } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
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
} from "../store/formReducers/newMealFormReducer";
import ImageSwipe from "../components/ImageSwipe";
import MyButton from "../components/MyButton";
import MyKeyboardAvoidingView from "../components/MyKeyboardAvoidingView";
import { MealEquals } from "../common_functions/MealEquals";
import { GetImagesToUpload } from "../common_functions/GetImagesToUpload";
import SortingListViewContainer from "../components/SortingListViewContainer";
import InputListViewContainer from "../components/InputListViewContainer";
import SaveIcon from "../components/HeaderIcons/SaveIcon";
import { UploadImagesAndCreateMeal } from "../common_functions/Integration/UploadImagesAndCreateMeal";
import { UploadImagesAndEditMeal } from "../common_functions/Integration/UploadImagesAndEditMeal";
import { IsFormInvalid } from "../common_functions/IsMealInvalid";
import HeaderBackIcon from "../components/HeaderIcons/HeaderBackIcon";
import LevelsViewModal from "../components/LevelsViewModal";
import deleteImages from "../firebase/deleteImages";
import MyTabMenu from "../components/MyTabMenu";
import { TITLES, mealTabMenuTitleArray } from "../constants/TabMenuTitles";

function NewScreen({ route, navigation }) {
  const mealId = route.params?.mealId;
  const user = useSelector((state) => state.users.user);
  const meals = useSelector((state) => state.meals.meals);
  const userStats = useSelector((state) => state.users.userStats);
  const userMealsData = useSelector((state) => state.users.userMealsData);

  let inputMeal;
  let initiallySelectedTab = TITLES.INFO;
  if (mealId) {
    inputMeal = meals.find((m) => m.id === mealId);
    initiallySelectedTab = route.params.selectedTabEdit ?? TITLES.INFO;
  }

  const initialState = {
    title: mealId ? inputMeal.title : "",
    primaryImageUrl: mealId ? inputMeal.primaryImageUrl : null,
    ingredients: mealId ? inputMeal.ingredients : [],
    steps: mealId ? inputMeal.steps : [],
    imageUrls: mealId ? inputMeal.imageUrls : [],
    imageUrlsToDelete: [],
    ingredientValue: "",
    stepValue: "",
    isLoading: false,
    ingredientIndex: null,
    stepIndex: null,
    showModal: false,
    newCreatedId: "id-was-not-defined-yet",
    selectedTab: initiallySelectedTab,
    ingredientSort: false,
    stepSort: false,
  };

  const [formState, formDispatch] = useReducer(
    newMealFormReducer,
    initialState,
  );

  const dispatch = useDispatch();

  const changePage = (title) => {
    formDispatch({ type: CHANGE_PAGE_TITLE, value: title });
  };

  const backAction = useCallback(() => {
    let anyImageToUpload = false,
      changesMade = false,
      anyImageToDelete = false;
    if (mealId) {
      const imagesToUpload = GetImagesToUpload(formState.imageUrls);

      anyImageToUpload = imagesToUpload.length > 0;
      anyImageToDelete = formState.imageUrlsToDelete.length > 0;

      const editedMeal = new Meal(
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
          onPress: createMealHandler,
        },
      ]);
    } else {
      navigation.goBack();
    }

    return true;
  }, [formState, mealId, inputMeal, createMealHandler, navigation]);

  useEffect(() => {
    getPermission();

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => backHandler.remove();
  }, [formState, backAction]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => HeaderBackIcon(backAction),
      headerRight: () => SaveIcon(createMealHandler),
    });
  }, [navigation, formState, backAction, createMealHandler]);

  const getPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Sorry, we need camera roll permissions to make this work!",
        );
      }
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      // aspect: [16, 9],
      quality: 0.3,
    });

    if (!result.canceled) {
      formDispatch({ type: ADD_IMAGE, value: result.assets[0].uri });
    }
  };

  const onConfirmDeleteImage = async (url) => {
    formDispatch({
      type: REMOVE_IMAGE,
      value: url,
    });
  };

  const finishIngredientInput = useCallback(() => {
    if (!formState.ingredientValue) {
      return;
    }
    if (formState.ingredientIndex !== null) {
      formDispatch({
        type: EDIT_INGREDIENT,
        value: formState.ingredientValue,
        ref: inputIngredient,
      });
    } else {
      formDispatch({
        type: ADD_INGREDIENT,
        value: formState.ingredientValue,
        ref: inputIngredient,
      });
    }
  }, [formState.ingredientIndex, formState.ingredientValue, inputIngredient]);

  const finishStepInput = useCallback(() => {
    if (!formState.stepValue) {
      return;
    }
    if (formState.stepIndex !== null) {
      formDispatch({
        type: EDIT_STEP,
        value: formState.stepValue,
        ref: inputStep,
      });
    } else {
      formDispatch({
        type: ADD_STEP,
        value: formState.stepValue,
        ref: inputStep,
      });
    }
  }, [formState.stepIndex, formState.stepValue, inputStep]);

  const createMealHandler = useCallback(async () => {
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
        await deleteImages(formState.imageUrlsToDelete);
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
          new Date(),
          inputMeal.links,
        );

        await dispatch(mealsAction.editMeal(editedMeal));
        formDispatch({ type: SUBMITTED });
        navigation.navigate({
          name: "Details",
          params: {
            mealId: mealId,
            mealTitle: formState.title,
            isAuthenticated: true,
            selectedTabMealDetail: formState.selectedTab,
          },
        });
      } else {
        const newMeal = await UploadImagesAndCreateMeal(
          formState.imageUrls,
          formState.title,
          formState.ingredients,
          formState.steps,
          user,
        );

        //first we have to update the meals to get the new id
        const id = await dispatch(mealsAction.createMeal(newMeal));
        //afterward, we can update the user and stats
        user.meals.push(id);
        await dispatch(usersAction.editUser(user));
        //now we can show the modal, with updated stats
        formDispatch({ type: SHOW_MODAL, value: id });
      }
    } catch (err) {
      throw err;
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
  ]);

  if (formState.isLoading) {
    return <LoadingIndicator />;
  }

  const windowWidth = Dimensions.get("window").width;

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

    navigation.navigate({
      name: "Details",
      params: {
        mealId: formState.newCreatedId,
        mealTitle: formState.title,
        isAuthenticated: true,
      },
    });
  };

  const renderInputs = () => {
    return (
      <View style={styles.list}>
        <LevelsViewModal
          countIngredients={userStats.countIngredients}
          countTags={userStats.countTags}
          countMeals={userMealsData.length}
          modalVisible={formState.showModal}
          onRequestClose={onRequestCloseModal}
        />
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
        {showInfo && (
          <View style={styles.addImageButton}>
            <MyButton onPress={pickImage}>{"Add image"}</MyButton>
          </View>
        )}

        {showIngredientSort && (
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
        )}
        {showStepSort && (
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
        )}

        {showIngredients && (
          <InputListViewContainer
            onLongPress={() =>
              formDispatch({ type: INGREDIENT_SORT, value: true })
            }
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
        )}
        {showSteps && (
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
        )}
      </View>
    );
  };

  return (
    <View style={styles.screenContainer}>
      <MyTabMenu
        initialIndex={mealTabMenuTitleArray.indexOf(initiallySelectedTab)}
        titles={mealTabMenuTitleArray}
        windowWidth={windowWidth}
        onTabPress={(title) => changePage(title)}
      />
      {showInfo && (
        <View style={styles.title}>
          <Input
            value={formState.title}
            placeholder="Enter title"
            labelStyle={styles.title}
            onChangeText={(value) => {
              formDispatch({ type: CHANGE_TITLE, value: value });
            }}
          />
        </View>
      )}
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
  title: {
    fontSize: 22,
    color: "black",
    width: "100%",
  },
  subtitle: {
    fontSize: 18,
    textAlign: "left",
  },
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  addImageButton: { padding: 5 },
});

export default NewScreen;
