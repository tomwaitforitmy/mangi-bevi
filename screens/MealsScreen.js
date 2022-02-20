import React, { useEffect, useState } from "react";
import MealList from "../components/MealList";
import { View, StyleSheet, RefreshControl } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as mealsActions from "../store/actions/mealsAction";
import * as authActions from "../store/actions/authAction";
import * as tagActions from "../store/actions/tagsAction";

function MealsScreen({ navigation }) {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = async () => {
    dispatch(mealsActions.fetchMeals()).then(() => {
      return dispatch(tagActions.fetchTags());
    });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchAll().then(setRefreshing(false));
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      console.log("not logged in!");
      authHandler().then(setIsLoggedIn(true));
    } else {
      console.log("logged in as tommy");
    }
    setIsLoading(true);
    fetchAll().then(setIsLoading(false));
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
    <View style={styles.mealsScreen}>
      <MealList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        mealsList={availableMeals}
        navigation={navigation}
      ></MealList>
    </View>
  );
}

const styles = StyleSheet.create({
  mealsScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MealsScreen;
