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
  Button,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import LoadingIndicator from "../components/LoadingIndicator";
import * as mealActions from "../store/actions/mealsAction";
import Meal from "../models/Meal";
import { Icon, Input } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import uploadImages from "../firebase/uploadImages";
import MyListItem from "../components/MyListItem";
import newMealFormReducer from "../store/reducers/newMealFormReducer";
import {
  CHANGE_TITLE,
  CHANGE_IMAGE,
  ADD_INGREDIENT,
  ADD_STEP,
  ADD_IMAGE,
  SET_STEP_VALUE,
  SET_INGREDIENT_VALUE,
  REMOVE_STEP,
  REMOVE_INGREDIENT,
  LOADING,
  SUBMITTED,
} from "../store/reducers/newMealFormReducer";
import ImageSwipe from "../components/ImageSwipe";

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
  };

  const [formState, formDispatch] = useReducer(
    newMealFormReducer,
    initialState
  );

  const dispatch = useDispatch();

  useEffect(() => {
    getPermission();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Icon name={"save"} onPress={createMealHandler} color="white" />
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
      uploadedImages
    );
  }

  async function editMeal() {
    const imagesToUpload = formState.imageUrls.filter(
      (url) => !url.startsWith("https://firebasestorage")
    );
    const imagesAlreadyUploaded = formState.imageUrls.filter((url) =>
      url.startsWith("https://firebasestorage")
    );

    let uploadedImages = await uploadImages(imagesToUpload);

    const editedMeal = new Meal(
      formState.title,
      mealId,
      formState.primaryImageUrl,
      formState.ingredients,
      formState.steps,
      imagesAlreadyUploaded.concat(uploadedImages)
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
        <ImageSwipe
          images={formState.imageUrls}
          width={width}
          style={styles.image}
        />
        <Button title="Add image" onPress={pickImage}></Button>
        <View style={styles.container}>
          <Text style={styles.subtitle}>Ingredients</Text>
          {formState.ingredients.map((ingredient) => (
            <MyListItem
              key={ingredient}
              title={ingredient}
              IconName={"delete"}
              onPressIcon={() => {
                formDispatch({ type: REMOVE_INGREDIENT, key: ingredient });
              }}
            ></MyListItem>
          ))}
          <Input
            placeholder="Enter ingredient"
            ref={inputIngrident}
            onChangeText={(value) =>
              formDispatch({ type: SET_INGREDIENT_VALUE, value })
            }
            onBlur={() => {
              formDispatch({
                type: ADD_INGREDIENT,
                value: formState.ingredientValue,
                ref: inputIngrident,
              });
            }}
          ></Input>
        </View>
        <View style={styles.container}>
          <Text style={styles.subtitle}>Steps</Text>
          {formState.steps.map((step) => (
            <MyListItem
              key={step}
              title={step}
              IconName={"delete"}
              onPressIcon={() => {
                formDispatch({ type: REMOVE_STEP, key: step });
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
              formDispatch({
                type: ADD_STEP,
                value: formState.stepValue,
                ref: inputStep,
              });
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
        <KeyboardAvoidingView
          style={styles.screenContainer}
          behavior={"padding"}
          keyboardVerticalOffset={100}
        >
          {renderInputs()}
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    width: "100%",
  },
  image: {
    width: "100%",
    height: 200,
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
