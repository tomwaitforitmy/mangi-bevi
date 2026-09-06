import React, { useEffect, useState } from "react";
import MealList from "../components/MealList";
import { View, StyleSheet, RefreshControl } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import { fetchAllUnauthenticated } from "../firebase/fetchAll";
import LoadingIndicator from "../components/LoadingIndicator";
import { FastFilterMeals } from "../common_functions/FastFilterMeals";
import SearchInput from "../components/SearchInput";
import * as searchAction from "../store/actions/searchAction";
import MyButton from "../components/MyButton";
import { useRouter } from "expo-router";
import { useAppTheme } from "../theme/useAppTheme";

function MealsScreenNotAuthenticated() {
  const theme = useAppTheme();
  const router = useRouter();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const allMeals = useSelector((state) => state.meals.meals);
  const searchTerm = useSelector((state) => state.search.searchTerm);

  const onChangeText = async (text) => {
    await dispatch(searchAction.setSearchTerm(text));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchAllUnauthenticated(dispatch).then(() => setRefreshing(false));
  }, [dispatch]);

  //Todo: Could this be placed somewhere else without useEffect?
  useEffect(() => {
    setIsLoading(true);
    fetchAllUnauthenticated(dispatch).then(() => setIsLoading(false));
  }, [dispatch]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  let filteredMeals = [];

  filteredMeals = FastFilterMeals(allMeals, searchTerm);

  return (
    <View style={styles.container}>
      <SearchInput
        onChangeText={onChangeText}
        numberOfLabels={filteredMeals.length}
        label={"Mangis"}
      />
      <View style={styles.mealsScreen}>
        <MealList
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
              colors={[theme.colors.primary]}
              progressBackgroundColor={theme.colors.surface}
            />
          }
          mealsList={filteredMeals}
          searchTerm={searchTerm}
          isAuthenticated={false}
        />

        <MyButton
          style={styles.loginButton}
          onPress={() => {
            router.push("/login");
          }}>
          {"Login or sign up"}
        </MyButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loginButton: {
    borderRadius: 0,
    height: "10%",
  },
  mealsScreen: {
    flex: 1,
    alignItems: "stretch",
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

export default MealsScreenNotAuthenticated;
