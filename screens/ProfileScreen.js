import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import MyButton from "../components/MyButton";
import MyLevelViewContainer from "../components/MyLevelViewContainer";
import Constants from "expo-constants";
import { NAVIGATION_TITLES } from "../constants/NavigationTitles";

function ProfileScreen({ navigation }) {
  const user = useSelector((state) => state.users.user);
  const userStats = useSelector((state) => state.users.userStats);
  const userMealsData = useSelector((state) => state.users.userMealsData);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.bene}>
          <MyLevelViewContainer
            numberOfRecipes={userMealsData.length}
            numberOfTags={userStats.countTags}
            numberOfIngredients={userStats.countIngredients}
          />
          <MyButton
            onPress={() => {
              navigation.navigate(NAVIGATION_TITLES.STACK_USER_MEALS);
            }}>
            {"View your Mangis"}
          </MyButton>
          <Text style={styles.bene}>Name: {user.name} </Text>
          <Text style={styles.bene}>Email: {user.email}</Text>
          <MyButton
            onPress={() =>
              navigation.navigate(NAVIGATION_TITLES.STACK_MANAGE_ACCOUNT)
            }>
            {"Manage Account"}
          </MyButton>
          <MyButton
            onPress={() =>
              navigation.navigate(NAVIGATION_TITLES.STACK_EDIT_FRIENDS)
            }>
            {"Friends"}
          </MyButton>
          <MyButton
            onPress={() =>
              navigation.navigate(NAVIGATION_TITLES.STACK_SETTINGS)
            }>
            {"Settings"}
          </MyButton>
          <Text style={styles.bene}>
            Mangi & Bevi version: {Constants.expoConfig.version}
          </Text>
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
});

export default ProfileScreen;
