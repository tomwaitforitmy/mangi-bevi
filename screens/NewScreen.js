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
  Image,
} from "react-native";
import LoadingIndicator from "../components/LoadingIndicator";
import * as mealActions from "../store/actions/mealsAction";
import Meal from "../models/Meal";
import { Icon, Input } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import uploadImageToBucket from "../firebase/uploadImageToBucket";
import MyListItem from "../components/MyListItem";

const FORM_UPDATE = "UPDATE";
const CHANGE_TITLE = "CHANGE_TITLE";
const CHANGE_IMAGE = "CHANGE_IMAGE";
const SUBMITTED = "SUBMITTED";
const LOADING = "LOADING";
const ADD_INGREDIENT = "ADD_INGREDIENT";
const ADD_STEP = "ADD_STEP";
const SET_INGREDIENT_VALUE = "SET_INGREDIENT_VALUE";
const SET_STEP_VALUE = "SET_STEP_VALUE";
const REMOVE_INGREDIENT = "REMOVE_INGREDIENT";
const REMOVE_STEP = "REMOVE_STEP";

const formReducer = (state, action) => {
  if (action.type === CHANGE_TITLE) {
    return {
      ...state,
      title: action.value,
    };
  }

  if (action.type === CHANGE_IMAGE) {
    return {
      ...state,
      imageUrl: action.value,
    };
  }

  if (action.type === ADD_INGREDIENT) {
    if (state.ingredients.includes(action.value)) {
      return state;
    } else {
      return {
        ...state,
        ingredients: [...state.ingredients, action.value],
        ingredientValue: "",
      };
    }
  }

  if (action.type === ADD_STEP) {
    if (state.steps.includes(action.value)) {
      return state;
    } else {
      return {
        ...state,
        steps: [...state.steps, action.value],
        stepValue: "",
      };
    }
  }

  if (action.type === SET_STEP_VALUE) {
    return {
      ...state,
      stepValue: action.value,
    };
  }

  if (action.type === SET_INGREDIENT_VALUE) {
    return {
      ...state,
      ingredientValue: action.value,
    };
  }

  if (action.type === REMOVE_STEP) {
    return {
      ...state,
      steps: state.steps.filter((e) => e !== action.key),
    };
  }

  if (action.type === REMOVE_INGREDIENT) {
    return {
      ...state,
      ingredients: state.ingredients.filter((e) => e !== action.key),
    };
  }

  if (action.type === LOADING) {
    return {
      ...state,
      isLoading: true,
    };
  }

  if (action.type === SUBMITTED) {
    return {
      ...state,
      isLoading: false,
    };
  }

  return state;
};

function NewScreen({ route, navigation }) {
  const { mealId } = route.params;

  let inputMeal;
  if (mealId) {
    inputMeal = useSelector((state) =>
      state.meals.meals.find((m) => m.id === mealId)
    );
  }

  const initialState = {
    title: inputMeal.title,
    imageUrl: inputMeal.imageUrl,
    ingredients: inputMeal.ingredients,
    steps: inputMeal.steps,
    ingredientValue: "",
    stepValue: "",
    isLoading: false,
  };

  const [formState, formDispatch] = useReducer(formReducer, initialState);

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
      aspect: [16, 9],
      quality: 0.3,
    });

    if (!result.cancelled) {
      formDispatch({ type: CHANGE_IMAGE, value: result.uri });
    }
  };

  const createNewMeal = async (url) => {
    return await uploadImageToBucket(url)
      .then((url) => {
        console.log("image uploaded successfuly " + url);
        return new Meal(title, "error", url, ingredients, steps);
      })
      .catch((err) => {
        console.log("error uploading image: " + url + " error: " + err);
        return new Meal(
          title,
          "error",
          "https://dummyimage.com/300x200&text=No+image+reinhold+messner",
          ingredients,
          steps
        );
      });
  };

  const isFormValid = () => {
    return (
      !formState.title ||
      formState.ingredients.length < 1 ||
      formState.steps.length < 1
    );
  };

  const createMealHandler = useCallback(async () => {
    if (isFormValid()) {
      alert("We need a title and at least one ingredient and one step!");
      return;
    }

    try {
      formDispatch({ type: LOADING });

      if (mealId) {
        const editedMeal = new Meal(
          formState.title,
          mealId,
          formState.imageUrl,
          formState.ingredients,
          formState.steps
        );

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
        const newMeal = await createNewMeal(imageUrl);
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
      <ScrollView style={styles.list}>
        <Button title="Select image" onPress={pickImage}></Button>
        {formState.imageUrl && (
          <Image source={{ uri: formState.imageUrl }} style={styles.image} />
        )}
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
              });
              inputIngrident.current.clear();
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
              });
              inputStep.current.clear();
            }}
          ></Input>
        </View>
      </ScrollView>
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
