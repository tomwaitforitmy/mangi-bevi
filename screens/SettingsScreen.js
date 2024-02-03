import React, { useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { useSelector } from "react-redux";
import NotificationsSwitch from "../components/Switches/NotificationsSwitch";

function SettingsScreen({ navigation }) {
  const user = useSelector((state) => state.users.user);

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <View style={styles.container}>
      <NotificationsSwitch />
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

export default SettingsScreen;
