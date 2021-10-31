import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { View, StyleSheet, Text, ScrollView, Button } from "react-native";
import LoadingIndicator from "../components/LoadingIndicator";
import * as mealActions from "../store/actions/mealsAction";
import Meal from "../models/Meal";
import { Input } from "react-native-elements";
import MyListItem from "../components/MyListItem";

function NewScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState();
  const [ingredient, setIngredient] = useState();
  const [ingredients, setIngredients] = useState([]);
  const [step, setStep] = useState();
  const [steps, setSteps] = useState([]);
  const dispatch = useDispatch();

  const createMealHandler = useCallback(async () => {
    const newMeal = new Meal(
      title,
      "error",
      "https://dummyimage.com/300x200&text=No+image+yet!",
      ingredients,
      steps
    );

    console.log(newMeal);

    try {
      setIsLoading(true);
      await dispatch(mealActions.createMeal(newMeal));
    } catch (err) {
      throw err;
    }
    setIsLoading(false);
    setSteps([]);
    setStep();
    setIngredients([]);
    setIngredient();
    setTitle();
  }, [dispatch, title, ingredients, steps]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  const inputStep = React.createRef();
  const inputIngrident = React.createRef();

  return (
    <View style={styles.screenContainer}>
      <ScrollView style={styles.list}>
        <Input
          placeholder="Titel"
          onChangeText={(value) => setTitle(value)}
        ></Input>
        <View style={styles.container}>
          <Text style={styles.subtitle}>Ingredients</Text>
          {ingredients.length > 0 &&
            ingredients.map((step) => (
              <MyListItem key={step} title={step}></MyListItem>
            ))}
          <Input
            ref={inputIngrident}
            onChangeText={(value) => setIngredient(value)}
            onBlur={() => {
              setIngredients((prevState) => [...prevState, ingredient]);
              inputIngrident.current.clear();
            }}
          ></Input>
        </View>
        <View style={styles.container}>
          <Text style={styles.subtitle}>Steps</Text>
          {steps.length > 0 &&
            steps.map((step) => (
              <MyListItem key={step} title={step}></MyListItem>
            ))}
          <Input
            ref={inputStep}
            onChangeText={(value) => setStep(value)}
            onBlur={() => {
              setSteps((prevState) => [...prevState, step]);
              inputStep.current.clear();
            }}
          ></Input>
        </View>
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
  subtitle: {
    fontSize: 22,
    textAlign: "center",
  },
  container: {
    paddingVertical: 20,
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
