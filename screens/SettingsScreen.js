import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import NotificationsSwitch from "../components/Switches/NotificationsSwitch";
import NotificationsForNewMealsSwitch from "../components/Switches/NotificationsForNewMealsSwitch";
import NotificationsForNewMealsForFriendsOnlySwitch from "../components/Switches/NotificationsForNewMealsForFriendsOnlySwitch";
import NotificationsForReactionsSwitch from "../components/Switches/NotificationsForReactionsSwitch";

function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.headline}>Push notifications</Text>
      <NotificationsSwitch />
      <NotificationsForNewMealsSwitch />
      <NotificationsForNewMealsForFriendsOnlySwitch />
      <NotificationsForReactionsSwitch />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 250,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  headline: {
    fontSize: 14,
    lineHeight: 30,
    margin: 5,
  },
});

export default SettingsScreen;
