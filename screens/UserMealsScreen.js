import React, { useState } from "react";
import MealList from "../components/MealList";
import { View, StyleSheet, RefreshControl } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchAll } from "../firebase/fetchAll";

function UserMealsScreen({ navigation }) {
  const dispatch = useDispatch();
  const userMealsData = useSelector((state) => state.users.userMealsData);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchAll(dispatch).then(setRefreshing(false));
  }, [dispatch]);

  return (
    <View style={styles.mealsScreen}>
      <MealList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        mealsList={userMealsData}
        navigation={navigation}
        isAuthenticated={true}
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
});

export default UserMealsScreen;
