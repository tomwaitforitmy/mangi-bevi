import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../constants/Colors";

const DebugScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Debug screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: Colors.text,
  },
});

export default DebugScreen;
