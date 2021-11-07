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
    if (!title || ingredients.length < 1 || steps.length < 1) {
      return;
    }
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
