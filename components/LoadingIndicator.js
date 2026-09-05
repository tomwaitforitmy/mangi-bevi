import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";

const LoadingIndicator = (props) => {
  const theme = useAppTheme();

  return (
    <View style={{ ...styles.container, ...props.style }}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
});

export default LoadingIndicator;
