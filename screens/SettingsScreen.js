import React, { useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import AppearancePicker from "../components/AppearancePicker";
import NotificationsSwitch from "../components/Switches/NotificationsSwitch";
import NotificationsForNewMealsSwitch from "../components/Switches/NotificationsForNewMealsSwitch";
import NotificationsForNewMealsForFriendsOnlySwitch from "../components/Switches/NotificationsForNewMealsForFriendsOnlySwitch";
import NotificationsForReactionsSwitch from "../components/Switches/NotificationsForReactionsSwitch";
import { useSelector } from "react-redux";
import { enableNotifications } from "../data/AvailableSettings";
import { DEV_MODE } from "../data/Environment";
import { useAppTheme } from "../theme/useAppTheme";

function SettingsScreen() {
  const theme = useAppTheme();
  const styles = getStyles(theme);
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
      {(DEV_MODE || Platform.OS === "android") && (
        <>
          {/* Hidden on iOS outside DEV_MODE: iOS 26's NativeTabs bar has a
              known upstream bug where the tab bar doesn't reliably follow
              dark/light switches (see CLAUDE.md's Theming section). Android
              doesn't have that bug, so it's always shown there. */}
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

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      alignItems: "flex-start",
      justifyContent: "flex-start",
    },
    headline: {
      fontSize: 16,
      lineHeight: 30,
      margin: 5,
      color: theme.colors.onBackground,
    },
  });

export default SettingsScreen;
