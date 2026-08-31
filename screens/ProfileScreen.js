import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import MyButton from "../components/MyButton";
import MyLevelViewContainer from "../components/MyLevelViewContainer";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import LoadingIndicator from "../components/LoadingIndicator";

function ProfileScreen() {
  const router = useRouter();
  const user = useSelector((state) => state.users.user);
  const userStats = useSelector((state) => state.users.userStats);
  const userMealsData = useSelector((state) => state.users.userMealsData);

  // NativeTabs mounts every tab immediately (unlike the old lazy JS Tabs), so
  // this can render before MealsScreen's fetchAll() has populated the user.
  if (!user || !userStats || !userMealsData) {
    return <LoadingIndicator />;
  }

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
              router.push("/profile/meals");
            }}>
            {"View your Mangis"}
          </MyButton>
          <Text style={styles.bene}>Name: {user.name} </Text>
          <Text style={styles.bene}>Email: {user.email}</Text>
          <MyButton onPress={() => router.push("/profile/account")}>
            {"Manage Account"}
          </MyButton>
          <MyButton onPress={() => router.push("/profile/friends")}>
            {"Friends"}
          </MyButton>
          <MyButton onPress={() => router.push("/profile/settings")}>
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
