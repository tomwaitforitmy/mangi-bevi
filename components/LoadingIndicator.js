import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Colors from "../constants/Colors";

const LoadingIndicator = (props) => {
  return (
    <View style={{ ...styles.container, ...props.style }}>
      <ActivityIndicator
        size="large"
        color={Colors.primary}
      ></ActivityIndicator>
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
