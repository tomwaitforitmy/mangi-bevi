import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";

const DebugScreen = () => {
  const theme = useAppTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Debug screen</Text>
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.white,
      justifyContent: "center",
      alignItems: "center",
    },
    text: {
      fontSize: 18,
      color: theme.colors.onSurface,
    },
  });

export default DebugScreen;
