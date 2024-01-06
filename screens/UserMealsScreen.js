import React, { useState } from "react";
import MealList from "../components/MealList";
import { View, StyleSheet, RefreshControl, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchAll } from "../firebase/fetchAll";
import MyButton from "../components/MyButton";

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
      {userMealsData.length === 0 && (
        <View style={styles.bene}>
          <Text style={styles.bene}>
            You added {userMealsData.length} Mangis. How about adding one?
          </Text>
          <MyButton
            onPress={() => {
              navigation.jumpTo("New");
            }}>
            {"Add"}
          </MyButton>
        </View>
      )}

      <MealList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => onRefresh()}
          />
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
  bene: {
    fontSize: 14,
    lineHeight: 30,
    margin: 5,
  },
});

export default UserMealsScreen;
