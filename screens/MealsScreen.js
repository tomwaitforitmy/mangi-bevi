import React, { useEffect, useState } from "react";
import MealList from "../components/MealList";
import { View, StyleSheet, RefreshControl } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import { Chip } from "react-native-elements";
import Colors from "../constants/Colors";
import { fetchAll } from "../firebase/fetchAll";
import IconTypes from "../constants/IconTypes";
import LoadingIndicator from "../components/LoadingIndicator";
import { FastFilterMeals } from "../common_functions/FastFilterMeals";
import SearchInput from "../components/SearchInput";
import * as searchAction from "../store/actions/searchAction";
import { TagFilterMeals } from "../common_functions/TagFilterMeals";
import { GetMealSummary } from "../common_functions/GetMealSummary";
import { ContainsArray } from "../common_functions/ContainsArray";
import { DEV_MODE } from "../data/Environment";

function MealsScreen({ navigation }) {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const allMeals = useSelector((state) => state.meals.meals);
  const filterTags = useSelector((state) => state.tags.filterTags);
  const filterMode = useSelector((state) => state.tags.filterMode);
  const searchTerm = useSelector((state) => state.search.searchTerm);

  const filtersActive = filterTags.length > 0;

  const onPressTagsActiveHandler = () => {
    navigation.navigate("Filters");
  };

  const onChangeText = async (text) => {
    await dispatch(searchAction.setSearchTerm(text));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchAll(dispatch).then(() => setRefreshing(false));
  }, [dispatch]);

  //Todo: Could this be placed somewhere else without useEffect?
  useEffect(() => {
    setIsLoading(true);
    fetchAll(dispatch).then(() => setIsLoading(false));
  }, [dispatch]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  let filteredMeals = [];

  const tagIdsToFilter = filterTags.map((t) => t.id);

  filteredMeals = TagFilterMeals(allMeals, tagIdsToFilter, filterMode);
  filteredMeals = FastFilterMeals(filteredMeals, searchTerm);

  //To find new corrupt data
  if (DEV_MODE) {
    //To find corrupt data
    filteredMeals.map((m) => {
      if (ContainsArray(m.ingredients)) {
        console.error("⚡⚡⚡ Found corrupt INGREDIENTS");
        console.error(
          GetMealSummary(m.title, m.ingredients, m.steps, m.authorId),
        );
        console.error(m);
      }
      if (ContainsArray(m.steps)) {
        console.error("⚡⚡⚡ Found corrupt STEPS");
        console.error(
          GetMealSummary(m.title, m.ingredients, m.steps, m.authorId),
        );
        console.error(m);
      }
    });
  }

  return (
    <View style={styles.container}>
      <SearchInput onChangeText={onChangeText} />
      <View style={styles.mealsScreen}>
        {filtersActive && (
          <View style={styles.overlay}>
            <Chip
              title={"Active filters"}
              icon={{
                name: "ios-filter",
                type: IconTypes.ionicon,
                size: 20,
                color: Colors.navigationIcon,
              }}
              onPress={() => onPressTagsActiveHandler()}
              buttonStyle={{ backgroundColor: Colors.second }}
            />
          </View>
        )}
        <MealList
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => onRefresh()}
            />
          }
          mealsList={filteredMeals}
          navigation={navigation}
          searchTerm={searchTerm}
          isAuthenticated={true}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mealsScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    position: "absolute",
    left: 0,
    top: 0,
    marginTop: 5,
    marginLeft: 5,
    zIndex: 1,
    opacity: 0.95,
  },
});

export default MealsScreen;
