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
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
  StatusBar,
  BackHandler,
} from "react-native";
import LoadingIndicator from "../components/LoadingIndicator";
import * as mealActions from "../store/actions/mealsAction";
import Meal from "../models/Meal";
import { Icon, Input } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import uploadImages from "../firebase/uploadImages";
import MyListItem from "../components/MyListItem";
import newMealFormReducer from "../store/formReducers/newMealFormReducer";
import {
  CHANGE_TITLE,
  CHANGE_PRIMARY_IMAGE,
  EDIT_INGREDIENT,
  EDIT_STEP,
  ADD_INGREDIENT,
  ADD_STEP,
  ADD_IMAGE,
  SET_STEP_VALUE,
  SET_INGREDIENT_VALUE,
  REMOVE_STEP,
  PREPARE_EDIT_INGREDIENT,
  PREPARE_EDIT_STEP,
  REMOVE_IMAGE,
  LOADING,
  SUBMITTED,
} from "../store/formReducers/newMealFormReducer";
import ImageSwipe from "../components/ImageSwipe";
import Colors from "../constants/Colors";
import MyButton from "../components/MyButton";
import MyKeyboardAvoidingView from "../components/MyKeyboardAvoidingView";
import { HeaderBackButton } from "@react-navigation/elements";
import { MealEquals } from "../common_functions/MealEquals";

function NewScreen({ route, navigation }) {
  const mealId = route.params?.mealId;

  let inputMeal;
  if (mealId) {
    inputMeal = useSelector((state) =>
      state.meals.meals.find((m) => m.id === mealId)
    );
  }

  const initialState = {
    title: mealId ? inputMeal.title : "",
    primaryImageUrl: mealId ? inputMeal.primaryImageUrl : null,
    ingredients: mealId ? inputMeal.ingredients : [],
    steps: mealId ? inputMeal.steps : [],
    imageUrls: mealId ? inputMeal.imageUrls : [],
    ingredientValue: "",
    stepValue: "",
    isLoading: false,
    ingredientIndex: null,
    stepIndex: null,
  };

  const [formState, formDispatch] = useReducer(
    newMealFormReducer,
    initialState
  );

  const dispatch = useDispatch();

  const backAction = () => {
    let anyImageToUpload = false,
      changesMade = false;
    if (mealId) {
      const imagesToUpload = formState.imageUrls.filter(
        (url) => !url.startsWith("https://firebasestorage")
      );

      anyImageToUpload = imagesToUpload.length > 0;

      const editedMeal = new Meal(
        formState.title,
        mealId,
        formState.primaryImageUrl,
        formState.ingredients,
        formState.steps,
        formState.imageUrls,
        inputMeal.tags,
        inputMeal.rating
      );

      changesMade = !MealEquals(inputMeal, editedMeal);
    }

    if (anyImageToUpload || changesMade) {
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
  };

  useEffect(() => {
    getPermission();

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [formState]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderBackButton
          onPress={backAction}
          tintColor={Colors.navigationIcon}
        />
      ),
      headerRight: () => (
        <Icon
          name={"save"}
          onPress={createMealHandler}
          color={Colors.navigationIcon}
          type={"ionicon"}
        />
      ),
    });
  }, [navigation, formState]);

  const getPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
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

    if (!result.cancelled) {
      formDispatch({ type: ADD_IMAGE, value: result.uri });
    }
  };

  async function createMeal(urls) {
    let uploadedImages = await uploadImages(urls);
    return new Meal(
      formState.title,
      "error",
      uploadedImages[0],
      formState.ingredients,
      formState.steps,
      uploadedImages,
      [],
      0
    );
  }

  async function editMeal() {
    const imagesToUpload = formState.imageUrls.filter(
      (url) => !url.startsWith("https://firebasestorage")
    );
    const imagesAlreadyUploaded = formState.imageUrls.filter((url) =>
      url.startsWith("https://firebasestorage")
    );

    //Check if we upload the primary image
    let primarImageIndex = imagesToUpload.indexOf(formState.primaryImageUrl);

    let uploadedImages = await uploadImages(imagesToUpload);

    const editedMeal = new Meal(
      formState.title,
      mealId,
      //if the primary image is uploaded, take it from here
      primarImageIndex != -1
        ? uploadedImages[primarImageIndex]
        : formState.primaryImageUrl,
      formState.ingredients,
      formState.steps,
      imagesAlreadyUploaded.concat(uploadedImages),
      inputMeal.tags,
      inputMeal.rating
    );
    return editedMeal;
  }

  function isFormValid() {
    return (
      !formState.title ||
      formState.ingredients.length < 1 ||
      formState.steps.length < 1
    );
  }

  const createMealHandler = useCallback(async () => {
    if (isFormValid()) {
      alert("We need a title and at least one ingredient and one step!");
      return;
    }

    try {
      formDispatch({ type: LOADING });

      if (mealId) {
        const editedMeal = await editMeal();

        await dispatch(mealActions.editMeal(editedMeal));
        formDispatch({ type: SUBMITTED });
        navigation.navigate({
          name: "Details",
          params: {
            mealId: mealId,
            mealTitle: formState.title,
          },
        });
      } else {
        const newMeal = await createMeal(formState.imageUrls);
        await dispatch(mealActions.createMeal(newMeal));
        formDispatch({ type: SUBMITTED });
      }
    } catch (err) {
      throw err;
    }
  }, [dispatch, formState]);

  if (formState.isLoading) {
    return <LoadingIndicator />;
  }

  const inputStep = React.createRef();
  const inputIngrident = React.createRef();

  const { width } = Dimensions.get("window");

  const renderInputs = () => {
    return (
      <ScrollView style={styles.list}>
        {formState.imageUrls && formState.imageUrls.length > 0 && (
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
                ]
              );
            }}
            onTrashCallback={(url) => {
              Alert.alert(
                "Remove image?",
                "Do you really want to delete this image?",
                [
                  {
                    text: "Yes",
                    onPress: () => {
                      formDispatch({
                        type: REMOVE_IMAGE,
                        value: url,
                      });
                    },
                  },
                  {
                    text: "No",
                    style: "cancel",
                  },
                ]
              );
            }}
          />
        )}
        <MyButton onPress={pickImage}>{"Add image"}</MyButton>
        <View style={styles.container}>
          <Text style={styles.subtitle}>Ingredients</Text>
          {formState.ingredients.map((ingredient) => (
            <MyListItem
              key={ingredient}
              title={ingredient}
              IconName={"edit"}
              onPressIcon={() => {
                formDispatch({
                  type: PREPARE_EDIT_INGREDIENT,
                  key: ingredient,
                  ref: inputIngrident,
                });
              }}
            ></MyListItem>
          ))}
          <Input
            placeholder="Enter ingredient"
            ref={inputIngrident}
            onChangeText={(value) => {
              formDispatch({ type: SET_INGREDIENT_VALUE, value });
            }}
            onBlur={() => {
              if (formState.ingredientIndex !== null) {
                formDispatch({
                  type: EDIT_INGREDIENT,
                  value: formState.ingredientValue,
                  ref: inputIngrident,
                });
              } else {
                formDispatch({
                  type: ADD_INGREDIENT,
                  value: formState.ingredientValue,
                  ref: inputIngrident,
                });
              }
            }}
          ></Input>
        </View>
        <View style={styles.container}>
          <Text style={styles.subtitle}>Steps</Text>
          {formState.steps.map((step) => (
            <MyListItem
              key={step}
              title={step}
              IconName={"edit"}
              onPressIcon={() => {
                formDispatch({
                  type: PREPARE_EDIT_STEP,
                  key: step,
                  ref: inputStep,
                });
              }}
            ></MyListItem>
          ))}
          <Input
            placeholder="Enter step"
            ref={inputStep}
            onChangeText={(value) =>
              formDispatch({ type: SET_STEP_VALUE, value })
            }
            onBlur={() => {
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
            }}
          ></Input>
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.list}>
        <Input
          label="Titel"
          value={formState.title}
          placeholder="Enter title"
          labelStyle={styles.title}
          onChangeText={(value) => {
            formDispatch({ type: CHANGE_TITLE, value: value });
          }}
        ></Input>
      </View>
      {Platform.OS === "android" ? (
        renderInputs()
      ) : (
        <MyKeyboardAvoidingView extraOffset={StatusBar.currentHeight}>
          {renderInputs()}
        </MyKeyboardAvoidingView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    width: "100%",
  },
  title: {
    fontSize: 22,
    color: "black",
  },
  subtitle: {
    fontSize: 18,
    textAlign: "left",
  },
  container: {
    padding: 10,
  },
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    width: "100%",
  },
});

export default NewScreen;
