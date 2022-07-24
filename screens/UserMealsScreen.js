import React, { useState } from "react";
import MealList from "../components/MealList";
import { View, StyleSheet, RefreshControl } from "react-native";
import { useDispatch } from "react-redux";

import { fetchAll } from "../firebase/fetchAll";

function UserMealsScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const { userMeals } = route.params;

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchAll(dispatch).then(setRefreshing(false));
  }, []);

  return (
    <View style={styles.mealsScreen}>
      <MealList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        mealsList={userMeals}
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

export default UserMealsScreen;
