import React from "react";
import { View, StyleSheet, Text } from "react-native";

function NewScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text> New mangi & bevi not implemented, yet. Push Tommy :)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  homeScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default NewScreen;
