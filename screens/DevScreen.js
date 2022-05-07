import React from "react";
import { StyleSheet, View } from "react-native";
import MovableElementContainer from "../components/MovableElementContainer";

function DevScreen({ navigation }) {
  return (
    // <View style={styles.container}>
    <MovableElementContainer></MovableElementContainer>
    // </View>
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
