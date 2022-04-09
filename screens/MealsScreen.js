import React, { useEffect, useState } from "react";
import MealList from "../components/MealList";
import { View, StyleSheet, RefreshControl } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as mealsActions from "../store/actions/mealsAction";
import * as tagActions from "../store/actions/tagsAction";

function MealsScreen({ navigation }) {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    fetchAll().then(setIsLoading(false));
  }, [dispatch]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  const allMeals = useSelector((state) => state.meals.meals);
  const filterTags = useSelector((state) => state.tags.filterTags);
  const filteredMeals = [];

  if (filterTags.length > 0) {
    const validIds = filterTags.map((t) => t.id);

    allMeals.map((meal) => {
      if (validIds.some((e) => meal.tags.includes(e))) {
        filteredMeals.push(meal);
      }
    });
  }

  return (
    <View style={styles.mealsScreen}>
      <MealList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        mealsList={filteredMeals.length > 0 ? filteredMeals : allMeals}
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
