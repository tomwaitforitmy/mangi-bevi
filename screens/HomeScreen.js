import React from "react";
import { View, Text, StyleSheet } from "react-native";

const HomeScreen = (props) => {
  return (
    <View style={styles.homeScreen}>
      <Text>Tommy's Home Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  homeScreen: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },
});

export default HomeScreen;
