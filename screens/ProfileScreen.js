import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Divider } from "react-native-elements";
import { useSelector } from "react-redux";
import MyButton from "../components/MyButton";
import MyLevelViewContainer from "../components/MyLevelViewContainer";
import Constants from "expo-constants";

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
              navigation.navigate("UserMealsScreen");
            }}>
            {"View your Mangis"}
          </MyButton>
          <Text style={styles.bene}>Name: {user.name} </Text>
          <Divider />
          <Text style={styles.bene}>Email: {user.email}</Text>
          <Divider />
          <MyButton onPress={() => navigation.navigate("ManageAccountScreen")}>
            {"Manage Account"}
          </MyButton>
          <MyButton onPress={() => navigation.navigate("EditFriendsScreen")}>
            {"Friends"}
          </MyButton>
          <MyButton onPress={() => navigation.navigate("SettingsScreen")}>
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
