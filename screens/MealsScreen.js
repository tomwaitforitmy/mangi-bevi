import React, { useEffect, useState } from "react";
import MealList from "../components/MealList";
import { View, StyleSheet, RefreshControl } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import { Chip } from "react-native-elements";
import Colors from "../constants/Colors";
import { fetchAll } from "../firebase/fetchAll";
import IconTypes from "../constants/IconTypes";
import LoadingIndicator from "../components/LoadingIndicator";
import { FILTER_MODE_AND, FILTER_MODE_OR } from "../store/actions/tagsAction";

function MealsScreen({ navigation }) {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const allMeals = useSelector((state) => state.meals.meals);
  const filterTags = useSelector((state) => state.tags.filterTags);
  const filterMode = useSelector((state) => state.tags.filterMode);
  const filtersActive = filterTags.length > 0;

  const onPressTagsActiveHandler = () => {
    navigation.navigate("Filters");
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchAll(dispatch).then(() => setRefreshing(false));
  }, [dispatch]);

  useEffect(() => {
    setIsLoading(true);
    fetchAll(dispatch).then(() => setIsLoading(false));
  }, [dispatch]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  const filteredMeals = [];

  if (filtersActive) {
    const tagIdsToFilter = filterTags.map((t) => t.id);
    console.log(filterMode);

    switch (filterMode) {
      case FILTER_MODE_AND: {
        allMeals.map((meal) => {
          if (!tagIdsToFilter.some((id) => !meal.tags.includes(id))) {
            filteredMeals.push(meal);
          }
        });
        break;
      }
      case FILTER_MODE_OR: {
        allMeals.map((meal) => {
          if (tagIdsToFilter.some((e) => meal.tags.includes(e))) {
            filteredMeals.push(meal);
          }
        });
        break;
      }

      default:
        throw new Error("Invalid filter mode for tags! Mode is " + filterMode);
    }
  }

  return (
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        mealsList={filtersActive ? filteredMeals : allMeals}
        navigation={navigation}
      />
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
