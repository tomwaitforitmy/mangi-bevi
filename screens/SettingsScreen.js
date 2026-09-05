import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AppearancePicker from "../components/AppearancePicker";
import NotificationsSwitch from "../components/Switches/NotificationsSwitch";
import NotificationsForNewMealsSwitch from "../components/Switches/NotificationsForNewMealsSwitch";
import NotificationsForNewMealsForFriendsOnlySwitch from "../components/Switches/NotificationsForNewMealsForFriendsOnlySwitch";
import NotificationsForReactionsSwitch from "../components/Switches/NotificationsForReactionsSwitch";
import { useSelector } from "react-redux";
import { enableNotifications } from "../data/AvailableSettings";

function SettingsScreen() {
  const user = useSelector((state) => state.users.user);
  let initialShowNotificationSettings = true;
  const foundSetting = user.settings.find(
    (s) => s.name === enableNotifications,
  );
  if (foundSetting) {
    initialShowNotificationSettings = foundSetting.value;
  }

  const [showNotificationSettings, setShowNotificationSettings] = useState(
    initialShowNotificationSettings,
  );
  const onValueChanged = (v) => {
    setShowNotificationSettings(v);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headline}>Appearance</Text>
      <AppearancePicker />
      <Text style={styles.headline}>Push notifications</Text>
      <NotificationsSwitch onValueChanged={(v) => onValueChanged(v)} />
      {showNotificationSettings && (
        <>
          <NotificationsForNewMealsSwitch />
          <NotificationsForNewMealsForFriendsOnlySwitch />
          <NotificationsForReactionsSwitch />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  headline: {
    fontSize: 16,
    lineHeight: 30,
    margin: 5,
  },
});

export default SettingsScreen;
