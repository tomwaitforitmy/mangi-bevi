import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, StyleSheet, Text, Button } from "react-native";
import LoadingIndicator from "../components/LoadingIndicator";
import * as mealActions from "../store/actions/mealsAction";

function NewScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const newMeal = useSelector((state) =>
    state.meals.meals.find((m) => m.id === "m3")
  );

  const createMealHandler = useCallback(async () => {
    try {
      setIsLoading(true);
      await dispatch(mealActions.createMeal(newMeal));
    } catch (err) {
      throw err;
    }
    setIsLoading(false);
  }, [dispatch]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.screen}>
      <Text> New mangi & bevi not implemented, yet. Push Tommy :)</Text>
      <Button title="Create" onPress={createMealHandler}></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default NewScreen;
