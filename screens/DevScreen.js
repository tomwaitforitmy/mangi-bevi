import React from "react";
import { Button, Image, StyleSheet, View } from "react-native";
import MovableElementContainer from "../components/MovableElementContainer";
import BulkEditMeal from "../components/BulkEditMeal";

function DevScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <BulkEditMeal></BulkEditMeal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
  },
});

export default DevScreen;
