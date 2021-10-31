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
  }, [dispatch, title, ingredients, steps]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <ScrollView style={styles.screen}>
      <Input
        placeholder="Titel"
        onChangeText={(value) => setTitle(value)}
      ></Input>
      <Text>Ingredients</Text>
      {ingredients.length > 0 &&
        ingredients.map((step) => (
          <MyListItem key={step} title={step}></MyListItem>
        ))}
      <Input onChangeText={(value) => setIngredient(value)}></Input>
      <Button
        title="Add ingredient"
        onPress={() =>
          setIngredients((prevState) => [...prevState, ingredient])
        }
      ></Button>
      <Text>Steps</Text>
      {steps.length > 0 &&
        steps.map((step) => <MyListItem key={step} title={step}></MyListItem>)}
      <Input onChangeText={(value) => setStep(value)}></Input>
      <Button
        title="Add step"
        onPress={() => setSteps((prevState) => [...prevState, step])}
      ></Button>
      <Button title="Create" onPress={createMealHandler}></Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

export default NewScreen;
