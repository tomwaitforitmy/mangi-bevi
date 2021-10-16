import React from "react";
import { View, StyleSheet, Text } from "react-native";

function NewScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <Text> New mangi & bevi not implemented, yet. Push Tommy :)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default NewScreen;
