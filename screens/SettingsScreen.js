import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AppearancePicker from "../components/AppearancePicker";
import NotificationsSwitch from "../components/Switches/NotificationsSwitch";
import NotificationsForNewMealsSwitch from "../components/Switches/NotificationsForNewMealsSwitch";
import NotificationsForNewMealsForFriendsOnlySwitch from "../components/Switches/NotificationsForNewMealsForFriendsOnlySwitch";
import NotificationsForReactionsSwitch from "../components/Switches/NotificationsForReactionsSwitch";
import { useSelector } from "react-redux";
import { enableNotifications } from "../data/AvailableSettings";
import { DEV_MODE } from "../data/Environment";

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
      {DEV_MODE && (
        <>
          {/* Hidden outside DEV_MODE: iOS 26's NativeTabs bar has a known
              upstream bug where the tab bar doesn't reliably follow
              dark/light switches (see CLAUDE.md's Theming section). Keeping
              this dev-only avoids exposing that breakage to real users. */}
          <Text style={styles.headline}>Appearance</Text>
          <AppearancePicker />
        </>
      )}
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
