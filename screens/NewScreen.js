import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
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
import { Input } from "react-native-elements";
import MyListItem from "../components/MyListItem";
import * as ImagePicker from "expo-image-picker";
import { storage } from "../firebase";
import uuid from "uuid";
import getPictureBlob from "../firebase/getPictureBlob";

function NewScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState();
  const [ingredient, setIngredient] = useState();
  const [ingredients, setIngredients] = useState([]);
  const [step, setStep] = useState();
  const [imageUri, setImageUri] = useState();
  const [steps, setSteps] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    getPermission();
  }, []);

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
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      uploadImageToBucket(result.uri).then((uri) => setImageUri(uri));
    }
  };

  const uploadImageToBucket = async (uri) => {
    let blob;
    try {
      setIsLoading(true);
      blob = await getPictureBlob(uri);

      const ref = await storage.ref().child(uuid.v4());
      const snapshot = await ref.put(blob);

      return await snapshot.ref.getDownloadURL();
    } catch (e) {
      alert(e.message);
    } finally {
      blob.close();
      setIsLoading(false);
    }
  };

  const getMeal = (uri) => {
    if (uri) {
      return new Meal(title, "error", uri, ingredients, steps);
    } else {
      return new Meal(
        title,
        "error",
        "https://dummyimage.com/300x200&text=No+image+reinhold+messner",
        ingredients,
        steps
      );
    }
  };

  const createMealHandler = useCallback(async () => {
    if (!title || ingredients.length < 1 || steps.length < 1) {
      return;
    }

    const newMeal = getMeal(imageUri);

    console.log(newMeal);

    try {
      setIsLoading(true);

      await dispatch(mealActions.createMeal(newMeal));
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
      setSteps([]);
      setStep();
      setIngredients([]);
      setIngredient();
      setTitle();
      setImageUri();
    }
  }, [dispatch, title, ingredients, steps]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  const inputStep = React.createRef();
  const inputIngrident = React.createRef();

  const deleteIngredientHandler = (key) => {
    var newIngredients = ingredients.filter((e) => e !== key);
    setIngredients(newIngredients);
  };

  const deleteStepHandler = (key) => {
    var newSteps = steps.filter((e) => e !== key);
    setSteps(newSteps);
  };

  return (
    <View style={styles.screenContainer}>
      <ScrollView style={styles.list}>
        <Input
          label="Titel"
          placeholder="Enter title"
          labelStyle={styles.title}
          onChangeText={(value) => setTitle(value)}
        ></Input>
        <View style={styles.container}>
          <Text style={styles.subtitle}>Ingredients</Text>
          {ingredients.map((ingredient) => (
            <MyListItem
              key={ingredient}
              title={ingredient}
              IconName={"delete"}
              onPressIcon={deleteIngredientHandler.bind(this, ingredient)}
            ></MyListItem>
          ))}
          <Input
            placeholder="Enter ingredient"
            ref={inputIngrident}
            onChangeText={(value) => setIngredient(value)}
            onBlur={() => {
              if (ingredient) {
                setIngredients((prevState) => [...prevState, ingredient]);
                inputIngrident.current.clear();
                setIngredient();
              }
            }}
          ></Input>
        </View>
        <View style={styles.container}>
          <Text style={styles.subtitle}>Steps</Text>
          {steps.map((step) => (
            <MyListItem
              key={step}
              title={step}
              IconName={"delete"}
              onPressIcon={deleteStepHandler.bind(this, step)}
            ></MyListItem>
          ))}
          <Input
            placeholder="Enter step"
            ref={inputStep}
            onChangeText={(value) => setStep(value)}
            onBlur={() => {
              if (step) {
                setSteps((prevState) => [...prevState, step]);
                inputStep.current.clear();
                setStep();
              }
            }}
          ></Input>
        </View>
        <Button title="Select image" onPress={pickImage}></Button>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
        <Button title="Create" onPress={createMealHandler}></Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
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
