import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Divider } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import MyButton from "../components/MyButton";
import { fetchAll } from "../firebase/fetchAll";
import MyLevelViewContainer from "../components/MyLevelViewContainer";
import { GetUserMeals } from "../common_functions/GetUserMeals";
import { GetUserStats } from "../common_functions/GetUserStats";

function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.users.user);
  const allMeals = useSelector((state) => state.meals.meals);

  //Bug here: This isn't updated when "allMeals" changes after createMeal or editMeal
  //When I log user.meals here, the log is only called once.
  //It seems that the whole screen is cached. It get's updated after the second meal
  //is created (with the data of the created first meal) which is weird. So this view
  //is always one meal behind ...
  //The refresh button helps, but is ideally not needed.
  const userMeals = GetUserMeals(allMeals, user.meals);
  const userStats = GetUserStats(userMeals, user.id);

  return (
    <View style={styles.container}>
      <ScrollView>
        {userStats.experiencedUser ? (
          <View style={styles.bene}>
            <MyLevelViewContainer
              numberOfRecipes={userMeals.length}
              numberOfTags={userStats.countTags}
              numberOfIngredients={userStats.countIngredients}
            />
            <MyButton
              onPress={() => {
                navigation.navigate("UserMealsScreen", {
                  userMeals: userMeals,
                });
              }}>
              {"View your Mangis"}
            </MyButton>
          </View>
        ) : (
          <View style={styles.bene}>
            <Text style={styles.bene}>
              You added {userMeals.length} Mangis. How about adding one?
            </Text>
            <MyButton
              onPress={() => {
                navigation.jumpTo("New");
              }}>
              {"Add"}
            </MyButton>
          </View>
        )}

        <View style={styles.bene}>
          <Text style={styles.bene}>Name: {user.name} </Text>
          <Divider />
          <Text style={styles.bene}>Email: {user.email}</Text>
          <MyButton
            onPress={async () => {
              await fetchAll(dispatch);
            }}>
            {"Refresh"}
          </MyButton>
          <Divider />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "stretch",
  },
  bene: {
    fontSize: 14,
    lineHeight: 30,
    margin: 5,
  },
  beneCenter: {
    textAlign: "center",
    fontSize: 14,
    lineHeight: 30,
  },
});

export default ProfileScreen;
