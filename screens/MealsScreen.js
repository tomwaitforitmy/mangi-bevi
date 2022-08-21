import React, { useEffect, useState } from "react";
import MealList from "../components/MealList";
import { View, StyleSheet, RefreshControl } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import { Chip } from "react-native-elements";
import Colors from "../constants/Colors";
import { fetchAll } from "../firebase/fetchAll";
import IconTypes from "../constants/IconTypes";

function MealsScreen({ navigation }) {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onPressTagsActiveHandler = () => {
    navigation.navigate("Filters");
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchAll(dispatch).then(setRefreshing(false));
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchAll(dispatch).then(setIsLoading(false));
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
      {filteredMeals.length > 0 && (
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
