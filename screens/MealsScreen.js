import React, { useEffect, useState } from "react";
import MealList from "../components/MealList";
import { View, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as mealsActions from "../store/actions/mealsAction";
import * as authActions from "../store/actions/authAction";

function MealsScreen({ navigation }) {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      console.log("not logged in!");
      authHandler().then(setIsLoggedIn(true));
    } else {
      console.log("logged in as tommy");
    }
    setIsLoading(true);
    dispatch(mealsActions.fetchMeals()).then(setIsLoading(false));
  }, [dispatch]);

  const authHandler = async () => {
    let action = authActions.login("tommy@test.com", "123456");

    setIsLoading(true);
    try {
      await dispatch(action);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  const availableMeals = useSelector((state) => state.meals.meals);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <MealList mealsList={availableMeals} navigation={navigation}></MealList>
    </View>
  );
}

const styles = StyleSheet.create({
  homeScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MealsScreen;
